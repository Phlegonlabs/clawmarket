import type { ChainConfig, ChainId, Result } from "@clawmarket/contracts";
import { err, ok } from "@clawmarket/contracts";
import { resolveChain } from "./chain-resolver.js";

export interface EIP712Domain {
  name: string;
  version: string;
  chainId: number;
  verifyingContract: string;
}

export interface PaymentChallenge {
  payTo: string;
  amount: string;
  token: string;
  tokenAddress: string;
  chainId: number;
  eip712Domain: EIP712Domain;
  facilitatorAddress: string;
  expiresAt: string;
}

export interface ChainPaymentAdapter {
  chainConfig: ChainConfig;
  getEIP712Domain(): EIP712Domain;
  getPaymentToken(symbol?: string): Result<{ address: string; decimals: number }, string>;
  getFacilitatorAddress(): string;
  buildChallenge(params: {
    payTo: string;
    amountUsd: number;
    tokenSymbol?: string;
    expiresAt: string;
  }): Result<PaymentChallenge, string>;
}

function createAdapter(config: ChainConfig): ChainPaymentAdapter {
  return {
    chainConfig: config,

    getEIP712Domain(): EIP712Domain {
      return {
        name: config.x402.eip712DomainName,
        version: config.x402.eip712DomainVersion,
        chainId: config.chainId,
        verifyingContract: config.x402.facilitatorAddress,
      };
    },

    getPaymentToken(symbol?: string) {
      const tokenSymbol = symbol ?? config.defaultPaymentToken;
      const token = config.paymentTokens.find((t) => t.symbol === tokenSymbol);
      if (!token) {
        return err(
          `Token ${tokenSymbol} not available on ${config.name}. Available: ${config.paymentTokens.map((t) => t.symbol).join(", ")}`,
        );
      }
      return ok({ address: token.address, decimals: token.decimals });
    },

    getFacilitatorAddress(): string {
      return config.x402.facilitatorAddress;
    },

    buildChallenge({ payTo, amountUsd, tokenSymbol, expiresAt }) {
      const tokenResult = this.getPaymentToken(tokenSymbol);
      if (!tokenResult.ok) return err(tokenResult.error);
      const token = tokenResult.value;
      const resolvedSymbol = tokenSymbol ?? config.defaultPaymentToken;

      const rawAmount = BigInt(Math.round(amountUsd * 10 ** token.decimals)).toString();

      return ok({
        payTo,
        amount: rawAmount,
        token: resolvedSymbol,
        tokenAddress: token.address,
        chainId: config.chainId,
        eip712Domain: this.getEIP712Domain(),
        facilitatorAddress: this.getFacilitatorAddress(),
        expiresAt,
      });
    },
  };
}

export function getPaymentAdapter(
  chainId: ChainId,
): Result<ChainPaymentAdapter, "CHAIN_NOT_FOUND" | "CHAIN_DISABLED"> {
  const result = resolveChain(chainId);
  if (!result.ok) return result;
  return ok(createAdapter(result.value));
}
