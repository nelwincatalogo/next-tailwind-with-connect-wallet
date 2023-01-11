import { createContext, useContext, useEffect } from 'react';
import { useAlert } from 'react-alert';
import { useHookstate } from '@hookstate/core';
import axios from '@/app/api';
import { Provider } from './provider';
import { useAccount, useDisconnect, useSignMessage } from 'wagmi';

export const WalletContext = createContext<any>({});
export const useWalletContext = () => useContext(WalletContext);

export default function WalletProvider({ children }) {
  const alert = useAlert();
  const { address, status, isConnected, isConnecting, isDisconnected } =
    useAccount();

  const messageToSign = useHookstate('');
  const { signMessage } = useSignMessage({
    message: messageToSign.value,
    onSuccess(data) {
      console.log('Success', data);
    },
  });

  const { disconnect } = useDisconnect();

  const onConnected = () => {
    if (window.grecaptcha && isConnected) {
      window.grecaptcha.ready((_) => {
        window.grecaptcha
          .execute(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY, {
            action: 'cryptosheesh_login',
          })
          .then((token) => {
            axios
              .post(`/metamask/request`, {
                address: address,
                'g-recaptcha-response': token,
              })
              .then((response) => {
                if (response && response.data) {
                  alert.info(response.data.message);

                  messageToSign.set(response.data.data);
                  signMessage();
                }
              })
              .catch((error) => {
                if (error.response && error.response.data) {
                  let error_response = error.response.data;
                  if (
                    Object.prototype.toString.call(error_response.errors) ===
                    '[object Object]'
                  ) {
                    for (let key in error_response.errors) {
                      for (let error_messages in error_response.errors[key]) {
                        alert.error(error_response.errors[key][error_messages]);
                      }
                    }
                  } else {
                    if (error.response.data.message)
                      alert.error(error.response.data.message);
                  }
                } else {
                  alert.error('Application error. Please reload the page.');
                }
              });
          });
      });
    }
  };

  const Disconnect = () => {
    disconnect();
  };

  useEffect(() => {
    if (isConnected) {
      onConnected();
    }
  }, [isConnected]);

  return (
    <Provider>
      <WalletContext.Provider
        value={{
          alert,
          address,
          status,
          isConnected,
          isConnecting,
          isDisconnected,
          Disconnect,
        }}
      >
        {children}
      </WalletContext.Provider>
    </Provider>
  );
}
