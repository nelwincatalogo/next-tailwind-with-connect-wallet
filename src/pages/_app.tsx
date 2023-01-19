import type { AppProps } from 'next/app';
import { transitions, positions, Provider as AlertProvider } from 'react-alert';

import AlertTemplate from '@/components/layout/AlertTemplate';
import '@/styles/globals.css';
import { useEffect, useState } from 'react';
import { WalletProvider } from '@/app/wallet';

const options = {
  // you can also just use 'bottom center'
  position: positions.BOTTOM_RIGHT,
  timeout: 2500,
  offset: '20px',
  // you can also just use 'scale'
  transition: transitions.SCALE,
};

declare global {
  interface Window {
    grecaptcha: any;
    dataLayer: any;
  }
}

function MyApp({ Component, pageProps }: AppProps) {
  const [recaptchaLoaded, setRecaptchaLoaded] = useState(false);

  useEffect(() => {
    if (recaptchaLoaded) return;
    const handleLoaded = (_) => {
      window.grecaptcha.ready();
    };
    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`;
    document.body.appendChild(script);
    script.addEventListener('load', handleLoaded);
    setRecaptchaLoaded(true);
  }, [recaptchaLoaded]);

  return (
    <AlertProvider template={AlertTemplate} {...options}>
      <WalletProvider>
        <Component {...pageProps} />
      </WalletProvider>
    </AlertProvider>
  );
}

export default MyApp;
