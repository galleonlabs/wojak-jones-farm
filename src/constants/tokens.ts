export interface Token {
  name: string;
  symbol: string;
  addresses: Addresses;
  decimals: number;
  image: string;
  coingeckoId: string;
}

export interface Addresses {
  mainnet: string,
  polygon: string,
  optimism: string,
  arbitrum: string
}

export const Token: Token = {
  name: "",
  symbol: "",
  addresses: {
    mainnet: "",
    polygon: '',
    optimism: '',
    arbitrum: '',
  },
  decimals: 18,
  image: "",
  coingeckoId: "",
};

export const tokens = [Token];
