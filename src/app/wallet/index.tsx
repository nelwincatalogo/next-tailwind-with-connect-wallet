/* eslint-disable react-hooks/exhaustive-deps */
import { createContext, useContext, useEffect, useState } from 'react';
import { useAlert } from 'react-alert';

import { configureChains, mainnet } from '@wagmi/core';
import { publicProvider } from '@wagmi/core/providers/public';
import { createClient, useAccount, WagmiConfig } from 'wagmi';
import { ConnectKitProvider } from 'connectkit';
import { InjectedConnector } from '@wagmi/core/connectors/injected';
import { MetaMaskConnector } from '@wagmi/core/connectors/metaMask';
import { WalletConnectConnector } from '@wagmi/core/connectors/walletConnect';
import {
  disconnect,
  watchAccount,
  signMessage,
  getContract,
  getProvider,
  fetchSigner,
} from '@wagmi/core';

import axios, { BLOCKCHAIN } from '@/app/api';
import config from '../config';
import { useGlobalState } from '../store';

const { chains, provider, webSocketProvider } = configureChains(
  config.setting.supported_chains,
  config.setting.providers
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
  const [ctxContract, setCtxContract] = useState(null);

  // onLoad
  const onLoad = async () => {
    await fetchBlockchain();
    await loadContract();
  };

  // onWalletConnected Listener
  const onWalletConnected = async () => {
    if (!gState['wallet']['address'].value) {
      console.warn('Wallet not Connected!');
      return;
    }

    await grecaptcha();
  };

  // onVerified Listener
  const onVerified = async () => {
    await loadContract();
  };

  // Disconnect OR onDisconnect Listener
  const Disconnect = async () => {
    await disconnect();
    gState['wallet'].set({});
    gState['verify'].set(null);
  };

  // fetchBlockchain
  const fetchBlockchain = async () => {
    try {
      const blockchainData = await axios
        .get(BLOCKCHAIN)
        .then((res) => res.data.data);
      gState['blockchain'].set(blockchainData);

      const nft = {
        address: blockchainData.config.nft_address,
        abi: blockchainData.config.nft_abi,
      };
      const busd = {
        address: blockchainData.config.busd_address,
        abi: blockchainData.config.busd_abi,
      };

      gState['contracts'].set({ nft, busd });
    } catch (error) {
      console.error('fetchBlockchain: ', error);
    }
  };

  // loadContract
  const loadContract = async () => {
    try {
      const provider = getProvider();
      const signer = await fetchSigner();

      const nft = getContract({
        ...gState.contracts['nft'].value,
        signerOrProvider: signer || provider,
      });
      const busd = getContract({
        ...gState.contracts['busd'].value,
        signerOrProvider: signer || provider,
      });

      setCtxContract({
        nft,
        busd,
      });
    } catch (error) {
      console.error('loadContract: ', error);
    }
  };

  /**
   * WARNING: Don't mess with what's below unless you know what you are doing!
   */

  const grecaptcha = async () => {
    if (window.grecaptcha) {
      try {
        window.grecaptcha.ready((_) => executeGrecapcha('crypto_sheesh_login'));
      } catch (error) {
        console.error('grecaptcha: ', error);
      }
    }
  };

  const executeGrecapcha = async (action) => {
    try {
      // execute grecapcha
      const _gToken = await window.grecaptcha.execute(
        process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
        { action }
      );

      // request metamask for signing
      const _metamaskReq = await axios
        .post('/metamask/request', {
          address: gState['wallet']['address'].value,
          'g-recaptcha-response': _gToken,
        })
        .then((res) => res.data);

      alert.info(_metamaskReq.message);
      const signature = await signMessage({
        message: _metamaskReq.data,
      });

      // verify signed token
      const verify = await axios
        .post('/metamask/verify', {
          address: gState['wallet']['address'].value,
          signature,
        })
        .then((res) => res.data);

      alert.success(verify.message);
      localStorage.setItem('token', verify.token);
      gState['verify'].set(verify);
    } catch (error) {
      console.warn('executeGrecapcha: ', error);
    }
  };

  // onAccountChange
  const onAccountChange = async (account) => {
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
      await onWalletConnected();
    }
  };

  useEffect(() => {
    onLoad();
    const unwatch = watchAccount(onAccountChange);

    return () => {
      unwatch();
    };
  }, []);

  useEffect(() => {
    if (gState['verify'].value) {
      onVerified();
    }
  }, [gState['verify']]);

  return (
    <WalletContext.Provider
      value={{
        alert,
        address,
        isConnected,
        isConnecting,
        isDisconnected,
        status,
        ctxContract,
        onLoad,
        onWalletConnected,
        Disconnect,
      }}
    >
      <WagmiConfig client={client}>
        <ConnectKitProvider>{children}</ConnectKitProvider>
      </WagmiConfig>
    </WalletContext.Provider>
  );
}
