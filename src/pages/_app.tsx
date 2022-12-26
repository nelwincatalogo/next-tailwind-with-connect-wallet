import type { AppProps } from 'next/app';
import { transitions, positions, Provider as AlertProvider } from 'react-alert';

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

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AlertProvider template={AlertTemplate} {...options}>
      <Component {...pageProps} />
    </AlertProvider>
  );
}

export default MyApp;
