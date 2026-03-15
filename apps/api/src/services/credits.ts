import {
  type AgentResponse,
  err,
  ok,
  type Result,
} from "@clawmarket/contracts";
import { creditBalances, creditTransactions } from "@clawmarket/db";
import { and, eq } from "drizzle-orm";
import type { Database } from "../lib/db.js";
import { generateId } from "../lib/id.js";

export async function getBalance(
  db: Database,
  agentId: string,
  chainId: string,
): Promise<AgentResponse<{ agentId: string; balance: number; chainId: string }>> {
  const rows = await db
    .select()
    .from(creditBalances)
    .where(and(eq(creditBalances.agentId, agentId), eq(creditBalances.chainId, chainId)))
    .limit(1);

  const balance = rows[0]?.balance ?? 0;
  return {
    data: { agentId, balance, chainId },
    display: { markdown: `**Credit Balance**: $${balance.toFixed(2)} (chain ${chainId})` },
  };
}

export async function topUp(
  db: Database,
  agentId: string,
  amount: number,
  chainId: string,
  txHash?: string,
): Promise<Result<AgentResponse<{ balance: number; transactionId: string }>, "INVALID_AMOUNT">> {
  if (amount <= 0) return err("INVALID_AMOUNT", "Amount must be positive");

  const now = new Date().toISOString();
  const txId = generateId("ctx");

  // Upsert balance
  const existing = await db
    .select()
    .from(creditBalances)
    .where(and(eq(creditBalances.agentId, agentId), eq(creditBalances.chainId, chainId)))
    .limit(1);

  let newBalance: number;
  if (existing[0]) {
    newBalance = existing[0].balance + amount;
    await db
      .update(creditBalances)
      .set({ balance: newBalance, updatedAt: now })
      .where(eq(creditBalances.id, existing[0].id));
  } else {
    newBalance = amount;
    await db.insert(creditBalances).values({
      id: generateId("cbal"),
      agentId,
      balance: newBalance,
      chainId,
      updatedAt: now,
    });
  }

  await db.insert(creditTransactions).values({
    id: txId,
    agentId,
    type: "topup",
    amount,
    reference: txHash ?? null,
    chainId,
    createdAt: now,
  });

  return ok({
    data: { balance: newBalance, transactionId: txId },
    display: { markdown: `Topped up $${amount.toFixed(2)}. New balance: $${newBalance.toFixed(2)}` },
  });
}

export async function deductCredit(
  db: Database,
  agentId: string,
  amount: number,
  chainId: string,
  reference: string,
): Promise<Result<{ balance: number }, "INSUFFICIENT_BALANCE">> {
  const existing = await db
    .select()
    .from(creditBalances)
    .where(and(eq(creditBalances.agentId, agentId), eq(creditBalances.chainId, chainId)))
    .limit(1);

  const currentBalance = existing[0]?.balance ?? 0;
  if (currentBalance < amount) {
    return err("INSUFFICIENT_BALANCE", `Balance $${currentBalance.toFixed(2)} < $${amount.toFixed(2)}`);
  }

  const newBalance = currentBalance - amount;
  const now = new Date().toISOString();

  await db
    .update(creditBalances)
    .set({ balance: newBalance, updatedAt: now })
    .where(eq(creditBalances.id, existing[0].id));

  await db.insert(creditTransactions).values({
    id: generateId("ctx"),
    agentId,
    type: "purchase",
    amount: -amount,
    reference,
    chainId,
    createdAt: now,
  });

  return ok({ balance: newBalance });
}
