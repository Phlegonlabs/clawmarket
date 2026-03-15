import type { Result } from "@clawmarket/contracts";
import { err, ok } from "@clawmarket/contracts";

const SESSION_TTL_MS = 30 * 60 * 1000; // 30 minutes

export interface WalletSession {
  sessionId: string;
  walletAddress: string;
  chainId: number;
  createdAt: string;
  expiresAt: string;
}

/** In-memory session store (V2 production would use KV or D1) */
const sessions = new Map<string, WalletSession>();

function generateSessionId(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return `sess_${Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("")}`;
}

export function createSession(
  walletAddress: string,
  chainId: number,
): Result<WalletSession, never> {
  const now = new Date();
  const session: WalletSession = {
    sessionId: generateSessionId(),
    walletAddress,
    chainId,
    createdAt: now.toISOString(),
    expiresAt: new Date(now.getTime() + SESSION_TTL_MS).toISOString(),
  };
  sessions.set(session.sessionId, session);
  return ok(session);
}

export function getSession(
  sessionId: string,
): Result<WalletSession, "NOT_FOUND" | "EXPIRED"> {
  const session = sessions.get(sessionId);
  if (!session) return err("NOT_FOUND", "Session not found");
  if (new Date(session.expiresAt) < new Date()) {
    sessions.delete(sessionId);
    return err("EXPIRED", "Session expired");
  }
  return ok(session);
}

export function renewSession(
  sessionId: string,
): Result<WalletSession, "NOT_FOUND" | "EXPIRED"> {
  const result = getSession(sessionId);
  if (!result.ok) return result;

  const session = result.value;
  session.expiresAt = new Date(Date.now() + SESSION_TTL_MS).toISOString();
  sessions.set(sessionId, session);
  return ok(session);
}

export function destroySession(sessionId: string): void {
  sessions.delete(sessionId);
}
