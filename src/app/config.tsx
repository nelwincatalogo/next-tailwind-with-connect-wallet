/* eslint-disable import/no-anonymous-default-export */
import { bscTestnet, bsc } from 'wagmi/chains';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import { publicProvider } from '@wagmi/core/providers/public';

export const currentNetwork = process.env.NEXT_PUBLIC_NETWORK;
export const blockchainNetwork = ['BSC - Testnet', 'BSC - Mainnet'];
export const config = [
  {
    api_url: 'https://sheesh-api.dvcode.tech',
    supported_chains: [bscTestnet],
    providers: [
      jsonRpcProvider({
        rpc: (chain) => ({
          http: `https://rpc.ankr.com/bsc_testnet_chapel`,
        }),
      }),
    ],
  },
  {
    api_url: 'https://sheesh-api.dvcode.tech',
    supported_chains: [bsc],
    providers: [publicProvider()],
  },
];

export default {
  name: blockchainNetwork[currentNetwork],
  setting: config[currentNetwork],
  isTestnet: Number(currentNetwork) === 0,
};
