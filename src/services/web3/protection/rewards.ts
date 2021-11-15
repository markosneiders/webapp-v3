import { stakingRewards$ } from 'services/observables/contracts';
import { take } from 'rxjs/operators';
import { expandToken, shrinkToken } from 'utils/formulas';
import { StakingRewards, StakingRewards__factory } from '../abis/types';
import { web3, writeWeb3 } from '..';
import { ProtectedLiquidity } from './positions';
import { multicall, MultiCall } from '../multicall/multicall';

export const stakeRewards = async ({
  amount,
  poolId,
}: {
  amount: string;
  poolId: string;
}): Promise<string> => {
  const contractAddress = await stakingRewards$.pipe(take(1)).toPromise();

  const contract = StakingRewards__factory.connect(
    contractAddress,
    writeWeb3.signer
  );

  return (await contract.stakeRewards(expandToken(amount, 18), poolId)).hash;
};

export const stakePoolLevelRewards = async ({
  amount,
  poolId,
  reserveId,
  newPoolId,
}: {
  amount: string;
  poolId: string;
  reserveId: string;
  newPoolId: string;
}): Promise<string> => {
  const contractAddress = await stakingRewards$.pipe(take(1)).toPromise();
  const contract = StakingRewards__factory.connect(
    contractAddress,
    writeWeb3.signer
  );

  return (
    await contract.stakeReserveRewards(poolId, reserveId, amount, newPoolId)
  ).hash;
};

export const claimRewards = async (): Promise<string> => {
  const contractAddress = await stakingRewards$.pipe(take(1)).toPromise();
  const contract = StakingRewards__factory.connect(
    contractAddress,
    writeWeb3.signer
  );

  return (await contract.claimRewards()).hash;
};

export const fetchTotalClaimedRewards = async (
  currentUser: string
): Promise<string> => {
  const contractAddress = await stakingRewards$.pipe(take(1)).toPromise();
  const contract = StakingRewards__factory.connect(
    contractAddress,
    web3.provider
  );
  const result = await contract.totalClaimedRewards(currentUser);

  return shrinkToken(result.toString(), 18);
};

export const fetchPendingRewards = async (
  currentUser: string
): Promise<string> => {
  const contractAddress = await stakingRewards$.pipe(take(1)).toPromise();
  const contract = StakingRewards__factory.connect(
    contractAddress,
    web3.provider
  );
  const result = await contract.pendingRewards(currentUser);

  return shrinkToken(result.toString(), 18);
};

export const fetchedRewardsMultiplier = async (
  user: string,
  positions: ProtectedLiquidity[]
) => {
  const contractAddress = await stakingRewards$.pipe(take(1)).toPromise();
  const contract = StakingRewards__factory.connect(
    contractAddress,
    web3.provider
  );
  const calls = positions.map((position) =>
    buildRewardsMultiplierCall(contract, user, position)
  );
  const res = await multicall(calls);
  if (res) return res.map((x) => shrinkToken(x.toString(), 6));

  return [];
};

const buildRewardsMultiplierCall = (
  contract: StakingRewards,
  user: string,
  position: ProtectedLiquidity
): MultiCall => {
  return {
    contractAddress: contract.address,
    interface: contract.interface,
    methodName: 'rewardsMultiplier',
    methodParameters: [user, position.poolToken, position.reserveToken],
  };
};

export const fetchedPendingRewards = async (
  user: string,
  positions: ProtectedLiquidity[]
) => {
  const contractAddress = await stakingRewards$.pipe(take(1)).toPromise();
  const contract = StakingRewards__factory.connect(
    contractAddress,
    web3.provider
  );

  const calls = positions.map((position) =>
    buildPnedingRewardsCall(contract, user, position)
  );
  const res = await multicall(calls);
  if (res) return res.map((x) => shrinkToken(x.toString(), 18));

  return [];
};

const buildPnedingRewardsCall = (
  contract: StakingRewards,
  user: string,
  position: ProtectedLiquidity
): MultiCall => {
  return {
    contractAddress: contract.address,
    interface: contract.interface,
    methodName: 'pendingReserveRewards',
    methodParameters: [user, position.poolToken, position.reserveToken],
  };
};
