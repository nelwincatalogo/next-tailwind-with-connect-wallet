/* eslint-disable import/no-anonymous-default-export */
export const currentNetwork = process.env.NEXT_PUBLIC_NETWORK;
export const blockchainNetwork = ['BSC - Testnet', 'BSC - Mainnet'];
export const config = [
  {
    url: '',
    api_url: '',
    metamask: {
      network_name: 'Smart Chain - Testnet',
      rpc_url: 'https://rpc.ankr.com/bsc_testnet_chapel',
      chain_id: 97,
      chain_hex: '0x61',
      symbol: 'tBNB',
      explorer: 'https://testnet.bscscan.com/',
    },
  },
  {
    url: '',
    api_url: '',
    metamask: {
      network_name: 'Smart Chain - Mainnet',
      rpc_url: 'https://bsc-dataseed.binance.org/',
      chain_id: 56,
      chain_hex: '0x38',
      symbol: 'BNB',
      explorer: 'https://bscscan.com',
    },
  },
];

export default {
  name: blockchainNetwork[currentNetwork],
  setting: config[currentNetwork],
  isTestnet: Number(currentNetwork) === 0,
};
