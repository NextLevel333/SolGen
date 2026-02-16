import React from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

export const WalletConnect: React.FC = () => {
  const { connected } = useWallet();
  
  // Only show wallet control when wallet is connected
  if (!connected) {
    return null;
  }
  
  return (
    <div className="flex justify-end">
      <WalletMultiButton className="!bg-gradient-to-r !from-solana-purple !to-solana-green hover:!shadow-lg hover:!shadow-solana-purple/50 !transition-all !duration-200 !rounded-[25px]" />
    </div>
  );
};
