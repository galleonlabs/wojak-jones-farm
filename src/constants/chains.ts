export type ChainData = {
  name: string;
  alias?: string;
  chainId: number;
  chainId0x: string;
  rpcUrl: string;
  icon: string;
  coingeckoId: string;
  blockExplorerUrl: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
};

export const MAINNET: ChainData = {
  name: "Ethereum",
  alias: "Mainnet",
  chainId: 1,
  chainId0x: "0x1",
  rpcUrl: "https://mainnet.eth.aragon.network/",
  icon: "https://raw.githubusercontent.com/sushiswap/icons/master/network/mainnet.jpg",
  coingeckoId: "ethereum",
  blockExplorerUrl: "https://etherscan.io/",
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
};

export const SUPPORTED_CHAINS = [MAINNET];
