import { createPublicClient, createWalletClient, custom, formatUnits, http, parseUnits, type Address, type Hash } from "viem";
import { robinhoodTestnet } from "viem/chains";

export const CONTRACTS = {
  token: "0x8645df7d4dAb620beED56Cc55467909D088E66ae" as Address,
  nft: "0x9c7C969876D279C019BAeD5ceB49cb0e11e25fE0" as Address,
  staking: "0x516264438C3fF88e657578faDD1322235Ef81914" as Address,
  redemption: "0xC7Fe1b638B593A824f0510B2A0e5103200f1C497" as Address,
};

export const ROBINHOOD_TESTNET = {
  id: 46630,
  name: "Robinhood Chain Testnet",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: { default: { http: ["https://rpc.testnet.chain.robinhood.com"] } },
  blockExplorers: { default: { name: "Robinhood Explorer", url: "https://explorer.testnet.chain.robinhood.com" } },
} as const;

export const publicClient = createPublicClient({ chain: ROBINHOOD_TESTNET, transport: http() });

export const erc20Abi = [
  { type: "function", name: "balanceOf", stateMutability: "view", inputs: [{ name: "account", type: "address" }], outputs: [{ type: "uint256" }] },
  { type: "function", name: "allowance", stateMutability: "view", inputs: [{ name: "owner", type: "address" }, { name: "spender", type: "address" }], outputs: [{ type: "uint256" }] },
  { type: "function", name: "approve", stateMutability: "nonpayable", inputs: [{ name: "spender", type: "address" }, { name: "amount", type: "uint256" }], outputs: [{ type: "bool" }] },
  { type: "function", name: "decimals", stateMutability: "view", inputs: [], outputs: [{ type: "uint8" }] },
] as const;

export const nftAbi = [
  { type: "function", name: "mintPrice", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] },
  { type: "function", name: "paymentToken", stateMutability: "view", inputs: [], outputs: [{ type: "address" }] },
  { type: "function", name: "publicMintEnabled", stateMutability: "view", inputs: [], outputs: [{ type: "bool" }] },
  { type: "function", name: "revealed", stateMutability: "view", inputs: [], outputs: [{ type: "bool" }] },
  { type: "function", name: "unrevealedURI", stateMutability: "view", inputs: [], outputs: [{ type: "string" }] },
  { type: "function", name: "tokenURI", stateMutability: "view", inputs: [{ name: "tokenId", type: "uint256" }], outputs: [{ type: "string" }] },
  { type: "function", name: "totalSupply", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] },
  { type: "function", name: "ownerOf", stateMutability: "view", inputs: [{ name: "tokenId", type: "uint256" }], outputs: [{ type: "address" }] },
  { type: "function", name: "approve", stateMutability: "nonpayable", inputs: [{ name: "to", type: "address" }, { name: "tokenId", type: "uint256" }], outputs: [] },
  { type: "function", name: "setApprovalForAll", stateMutability: "nonpayable", inputs: [{ name: "operator", type: "address" }, { name: "approved", type: "bool" }], outputs: [] },
  { type: "function", name: "isApprovedForAll", stateMutability: "view", inputs: [{ name: "owner", type: "address" }, { name: "operator", type: "address" }], outputs: [{ type: "bool" }] },
] as const;

export const stakingAbi = [
  { type: "function", name: "stakedTokensOf", stateMutability: "view", inputs: [{ name: "staker", type: "address" }], outputs: [{ type: "uint256[]" }] },
  { type: "function", name: "pendingRewardsOf", stateMutability: "view", inputs: [{ name: "staker", type: "address" }], outputs: [{ type: "uint256" }] },
  { type: "function", name: "stakeBatch", stateMutability: "nonpayable", inputs: [{ name: "tokenIds", type: "uint256[]" }], outputs: [] },
  { type: "function", name: "unstakeBatch", stateMutability: "nonpayable", inputs: [{ name: "tokenIds", type: "uint256[]" }], outputs: [] },
  { type: "function", name: "claimAll", stateMutability: "nonpayable", inputs: [], outputs: [] },
] as const;

export const shorten = (address?: string) => address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "Not connected";
export const mini = (value: bigint, decimals = 18) => Number(formatUnits(value, decimals));
export const toMini = (value: bigint | number) => typeof value === "bigint" ? value : parseUnits(String(value), 18);

export function walletClient() {
  if (!(window as any).ethereum) throw new Error("Install MetaMask, Rabby, or another injected wallet.");
  return createWalletClient({ chain: ROBINHOOD_TESTNET, transport: custom((window as any).ethereum) });
}

export async function sendContract(address: Address, abi: any, functionName: string, args: readonly unknown[] = []): Promise<Hash> {
  const client = walletClient();
  const [account] = await client.getAddresses();
  return client.writeContract({ address, abi, functionName, args, account, chain: ROBINHOOD_TESTNET });
}
