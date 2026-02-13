import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { WalletContextProvider } from '@/components/WalletContextProvider';
import Head from 'next/head';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>SolGen - Privacy-First Solana Vanity Wallet Generator</title>
        <meta name="description" content="Generate custom Solana wallet addresses with your chosen prefix or suffix. 100% client-side, zero server storage." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <WalletContextProvider>
        <Component {...pageProps} />
      </WalletContextProvider>
    </>
  );
}
