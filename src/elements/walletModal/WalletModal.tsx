import { useState } from 'react';
import { SUPPORTED_WALLETS } from 'web3/wallet/utils';
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core';
import { AbstractConnector } from '@web3-react/abstract-connector';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';

export const WalletModal = () => {
  const { activate } = useWeb3React();
  const [pending, setPending] = useState<AbstractConnector | undefined>();
  const [error, setError] = useState<boolean>(false);

  const tryConnecting = async (connector: AbstractConnector | undefined) => {
    setPending(connector);

    if (
      connector instanceof WalletConnectConnector &&
      connector.walletConnectProvider?.wc?.uri
    )
      connector.walletConnectProvider = undefined;

    connector &&
      activate(connector, undefined, true).catch((error) => {
        if (error instanceof UnsupportedChainIdError) activate(connector);
        else setError(true);
      });
  };

  return (
    <>
      {SUPPORTED_WALLETS.map((wallet, index) => {
        return (
          <button key={index} onClick={() => tryConnecting(wallet.connector)}>
            <div>{wallet.name}</div>
          </button>
        );
      })}
    </>
  );
};