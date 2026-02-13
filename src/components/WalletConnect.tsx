import React from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

export const WalletConnect: React.FC = () => {
  return (
    <div className="flex justify-end">
      <WalletMultiButton className="!bg-gradient-to-r !from-solana-purple !to-solana-green hover:!shadow-lg hover:!shadow-solana-purple/50 !transition-all !duration-200" />
    </div>
  );
};
