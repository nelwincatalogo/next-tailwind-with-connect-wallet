import type { AppProps } from 'next/app';
import { transitions, positions, Provider as AlertProvider } from 'react-alert';

import { WagmiConfig, createClient, configureChains, mainnet } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { ConnectKitProvider } from 'connectkit';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { bscTestnet } from 'wagmi/chains';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet';
import { LedgerConnector } from 'wagmi/connectors/ledger';

import AlertTemplate from '@/components/layout/AlertTemplate';
import '@/styles/globals.css';

const options = {
  // you can also just use 'bottom center'
  position: positions.BOTTOM_RIGHT,
  timeout: 2500,
  offset: '20px',
  // you can also just use 'scale'
  transition: transitions.SCALE,
};

const { chains, provider, webSocketProvider } = configureChains(
  [bscTestnet],
  [publicProvider()]
);

const client = createClient({
  connectors: [
    new InjectedConnector({
      chains,
    }),
    new MetaMaskConnector({
      chains,
    }),
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: 'wagmi.sh',
      },
    }),
    new LedgerConnector({
      chains,
    }),
    new WalletConnectConnector({
      chains,
      options: {
        qrcode: false,
      },
    }),
  ],
  provider,
  webSocketProvider,
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig client={client}>
      <ConnectKitProvider>
        <AlertProvider template={AlertTemplate} {...options}>
          <Component {...pageProps} />
        </AlertProvider>
      </ConnectKitProvider>
    </WagmiConfig>
  );
}

export default MyApp;
