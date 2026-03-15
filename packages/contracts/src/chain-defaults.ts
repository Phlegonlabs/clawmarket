import type { ChainConfig } from "./chain-registry.js";
import { KNOWN_CHAIN_IDS } from "./chain-registry.js";

/** X Layer (chain ID 196) — V1 default and only enabled chain */
export const X_LAYER_CONFIG: ChainConfig = {
  chainId: KNOWN_CHAIN_IDS.X_LAYER,
  name: "X Layer",
  shortName: "xlayer",
  enabled: true,
  isDefault: true,
  rpcUrl: "https://rpc.xlayer.tech",
  blockExplorerUrl: "https://www.okx.com/web3/explorer/xlayer",
  paymentTokens: [
    {
      symbol: "USDT0",
      address: "0x779Ded0c9e1022225f8E0630b35a9b54bE713736",
      decimals: 6,
      signingMethod: "self",
    },
    {
      symbol: "USDC",
      address: "0x74b7f16337b8972027f6196a17a631ac6de26d22",
      decimals: 6,
      signingMethod: "facilitated",
    },
  ],
  defaultPaymentToken: "USDT0",
  x402: {
    facilitatorAddress: "0x0000000000000000000000000000000000000000",
    eip712DomainName: "ClawMarket",
    eip712DomainVersion: "1",
  },
  okxGateway: {
    supported: true,
    baseUrl: "https://web3.okx.com",
  },
  nativeCurrency: {
    name: "OKB",
    symbol: "OKB",
    decimals: 18,
  },
};

/** Default chain registry — V1 includes only X Layer */
export const DEFAULT_CHAIN_REGISTRY: ReadonlyArray<ChainConfig> = [X_LAYER_CONFIG];
