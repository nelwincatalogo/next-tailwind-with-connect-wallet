import { createContext, useContext, useEffect } from 'react';
import { useAlert } from 'react-alert';

import { configureChains, mainnet } from '@wagmi/core';
import { publicProvider } from '@wagmi/core/providers/public';
import { createClient, useAccount, WagmiConfig } from 'wagmi';
import { ConnectKitProvider } from 'connectkit';
import { InjectedConnector } from '@wagmi/core/connectors/injected';
import { MetaMaskConnector } from '@wagmi/core/connectors/metaMask';
import { WalletConnectConnector } from '@wagmi/core/connectors/walletConnect';
import { disconnect, watchAccount } from '@wagmi/core';

import axios, { BLOCKCHAIN } from '@/app/api';
import config from '../config';
import { useGlobalState } from '../store';

const { chains, provider, webSocketProvider } = configureChains(
  config.setting.supported_chains,
  [publicProvider()]
);

const client = createClient({
  autoConnect: false,
  connectors: [
    new InjectedConnector({ chains }),
    new MetaMaskConnector({
      chains,
    }),
    new WalletConnectConnector({
      chains,
      options: {
        qrcode: false,
        // version: '2',
        // projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
      },
    }),
  ],
  provider,
  webSocketProvider,
});

export const WalletContext = createContext<any>({});
export const useWalletContext = () => useContext(WalletContext);

export function WalletProvider({ children }) {
  const alert = useAlert();
  const gState = useGlobalState();
  const { address, isConnected, isConnecting, isDisconnected, status } =
    useAccount();

  // Disconnect
  const Disconnect = async () => {
    await disconnect();
    gState['wallet'].set({});
  };

  // onAccountChange
  const onAccountChange = (account) => {
    if (gState['wallet']['address'].value) {
      if (gState['wallet']['address'].value !== account.address) {
        // account has changed
        console.log('onChangeAccount: ', account);
        Disconnect();
      }
    } else {
      gState['wallet'].set({
        address: account.address,
        isConnected: account.isConnected,
        isConnecting: account.isConnecting,
        isDisconnected: account.isDisconnected,
        status: account.status,
      });
    }
  };

  // onLoad
  useEffect(() => {
    const unwatch = watchAccount(onAccountChange);

    return () => {
      unwatch();
    };
  }, []);

  return (
    <WalletContext.Provider
      value={{
        alert,
        address,
        isConnected,
        isConnecting,
        isDisconnected,
        status,
        Disconnect,
      }}
    >
      <WagmiConfig client={client}>
        <ConnectKitProvider>{children}</ConnectKitProvider>
      </WagmiConfig>
    </WalletContext.Provider>
  );
}
