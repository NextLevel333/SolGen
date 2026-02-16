import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { WalletContextProvider } from '@/components/WalletContextProvider';
import { ToastProvider } from '@/components/Toast';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const basePath = router.basePath || '';
  
  // Scroll to top on route change
  useEffect(() => {
    const handleRouteChange = () => {
      window.scrollTo(0, 0);
    };
    
    router.events.on('routeChangeComplete', handleRouteChange);
    
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);
  
  return (
    <>
      <Head>
        <title>AlienTek - Solana Vanity Wallet & Contract Address Generator</title>
        <meta name="description" content="Generate custom Solana wallet addresses and contract addresses with your chosen prefix or suffix. 100% client-side, zero server storage." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="application-name" content="AlienTek" />
        <meta name="apple-mobile-web-app-title" content="AlienTek" />
        <meta name="theme-color" content="#9945FF" />
        <link rel="icon" type="image/png" href={`${basePath}/favicon.svg`} />
      </Head>
      <ToastProvider>
        <WalletContextProvider>
          <Component {...pageProps} />
        </WalletContextProvider>
      </ToastProvider>
    </>
  );
}
