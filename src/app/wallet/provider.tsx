import { WagmiConfig, createClient, configureChains } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { ConnectKitProvider } from 'connectkit';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet';
import { LedgerConnector } from 'wagmi/connectors/ledger';
import config from '@/app/config';

const { chains, provider, webSocketProvider } = configureChains(
  config.setting.supported_chains,
  [publicProvider()]
);

const client = createClient({
  connectors: [
    new InjectedConnector({
      chains,
    }),
    new MetaMaskConnector({
      chains,
      options: {
        shimDisconnect: true,
      },
    }),
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: 'next-tailwind',
      },
    }),
    new LedgerConnector({
      chains,
    }),
    new WalletConnectConnector({
      chains,
      options: {
        qrcode: true,
        version: '2',
        projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
      },
    }),
  ],
  provider,
  webSocketProvider,
});

export function Provider({ children }) {
  return (
    <WagmiConfig client={client}>
      <ConnectKitProvider>{children}</ConnectKitProvider>
    </WagmiConfig>
  );
}
