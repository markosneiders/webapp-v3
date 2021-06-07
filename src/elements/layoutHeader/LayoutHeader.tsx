import 'elements/layoutHeader/LayoutHeader.css';
import walletIcon from 'assets/icons/wallet.svg';
import bellIcon from 'assets/icons/bell.svg';
import cogIcon from 'assets/icons/cog.svg';
import { useState } from 'react';
import { WalletModal } from '../walletModal/WalletModal';

export const LayoutHeader = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="layout-header">
      <div className="layout-header-content">
        <div>
          <button className="btn-secondary btn-sm">
            <div className="bg-success w-6 h-6 rounded-full mr-10">&#8203;</div>
            Ethereum Mainnet
          </button>
        </div>

        <div className="flex items-center">
          <button
            onClick={() => setIsOpen(true)}
            className="btn-outline-secondary btn-sm"
          >
            <img
              src={walletIcon}
              alt="Connect Wallet Icon"
              className="-ml-14 mr-16"
            />
            Connect Wallet
          </button>

          <WalletModal isOpen={isOpen} setIsOpen={setIsOpen} />

          <button className="ml-40">
            <img src={bellIcon} alt="Notification Icon" />
          </button>
          <span className="text-grey-3 text-20 mx-16">|</span>
          <button>
            <img src={cogIcon} alt="Settings Icon" />
          </button>
        </div>
      </div>
    </div>
  );
};