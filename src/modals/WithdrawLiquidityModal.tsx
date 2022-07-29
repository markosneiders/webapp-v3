import { EmergencyInfo } from 'components/EmergencyInfo';
import { PopoverV3 } from 'components/popover/PopoverV3';
import { Modal } from 'modals';
import { useMemo } from 'react';
import { useAppSelector } from 'store';

export const WithdrawLiquidityModal = ({
  isModalOpen,
  setIsModalOpen,
}: {
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
}) => {
  const { lockDuration } = useAppSelector(
    (state) => state.v3Portfolio.withdrawalSettings
  );

  const lockDurationInDays = useMemo(
    () => lockDuration / 60 / 60 / 24,
    [lockDuration]
  );

  return (
    <Modal setIsOpen={() => setIsModalOpen(false)} isOpen={isModalOpen} large>
      <div className="flex flex-col items-center gap-20 p-20 pb-40 text-center">
        <div className="text-20 mb-30">
          <div className="font-bold">Migrate to Bancor V3 to withdraw.</div>
          <div>
            V3 withdrawals involve a {lockDurationInDays}-day cool-down.
          </div>
          <div className="mt-10 font-bold text-error">
            Please note that BNT distribution is temporarily paused.
          </div>
        </div>
        <PopoverV3
          children={<EmergencyInfo />}
          hover
          buttonElement={() => (
            <span className="underline cursor-pointer">More info</span>
          )}
        />
      </div>
    </Modal>
  );
};
