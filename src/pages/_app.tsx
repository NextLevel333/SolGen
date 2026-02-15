import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { WalletContextProvider } from '@/components/WalletContextProvider';
import Head from 'next/head';
import { useRouter } from 'next/router';

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const basePath = router.basePath || '';
  
  return (
    <>
      <Head>
        <title>SolGen - First Solana Vanity Wallet Generator</title>
        <meta name="description" content="Generate custom Solana wallet addresses with your chosen prefix or suffix. 100% client-side, zero server storage." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/png" href={`${basePath}/favicon.svg`} />
      </Head>
      <WalletContextProvider>
        <Component {...pageProps} />
      </WalletContextProvider>
    </>
  );
}
