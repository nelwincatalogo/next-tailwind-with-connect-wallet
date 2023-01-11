/* eslint-disable import/no-anonymous-default-export */
import { bscTestnet, bsc } from 'wagmi/chains';

export const currentNetwork = process.env.NEXT_PUBLIC_NETWORK;
export const blockchainNetwork = ['BSC - Testnet', 'BSC - Mainnet'];
export const config = [
  {
    api_url: 'https://sheesh-api.dvcode.tech',
    supported_chains: [bscTestnet],
    provider: 'https://rpc.ankr.com/bsc_testnet_chapel',
  },
  {
    api_url: 'https://sheesh-api.dvcode.tech',
    supported_chains: [bsc],
    provider: 'https://bsc-dataseed.binance.org',
  },
];

export default {
  name: blockchainNetwork[currentNetwork],
  setting: config[currentNetwork],
  isTestnet: Number(currentNetwork) === 0,
};
