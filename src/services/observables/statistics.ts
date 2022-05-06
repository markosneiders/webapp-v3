import { combineLatest } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import BigNumber from 'bignumber.js';
import numbro from 'numbro';
import { apiData$ } from 'services/observables/apiData';
import { bntToken } from 'services/web3/config';
import { fifteenSeconds$ } from 'services/observables/timers';
import { BancorApi } from 'services/api/bancorApi/bancorApi';
import { switchMapIgnoreThrow } from 'services/observables/customOperators';

export interface Statistic {
  label: string;
  value: string;
  change24h?: number;
}

const averageFormat = {
  average: true,
  mantissa: 2,
  optionalMantissa: true,
  spaceSeparated: true,
  lowPrecision: false,
};

export const statisticsV3$ = combineLatest([apiData$, fifteenSeconds$]).pipe(
  switchMapIgnoreThrow(async ([apiDataV2]) => {
    const stats = await BancorApi.v3.getStatistics();

    const bnt24hChange = new BigNumber(stats.bntRate)
      .div(stats.bntRate24hAgo)
      .times(100)
      .minus(100)
      .toNumber();

    const totalLiquidity = new BigNumber(stats.tradingLiquidityBNT.usd).plus(
      stats.tradingLiquidityTKN.usd
    );

    const bntSupply = apiDataV2.bnt_supply;
    const totalBntStaked = stats.stakedBalanceBNT.bnt;

    const bntStakedPercentage =
      (Number(totalBntStaked) /
        Number(parseFloat(bntSupply).toExponential(18))) *
      100;

    const statistics: Statistic[] = [
      {
        label: 'BNT Price',
        value: '$' + numbro(stats.bntRate).format({ mantissa: 2 }),
        change24h: bnt24hChange,
      },
      {
        label: 'Total Liquidity',
        value: '$' + numbro(totalLiquidity).format(averageFormat),
        change24h: 0,
      },
      {
        label: 'Volume (24h)',
        value: '$' + numbro(stats.totalVolume24h.usd).format(averageFormat),
        change24h: 0,
      },
      {
        label: 'Fees (24h)',
        value: '$' + numbro(stats.totalFees24h.usd).format(averageFormat),
        change24h: 0,
      },
      {
        label: 'Total BNT Staked',
        value: numbro(bntStakedPercentage).format({ mantissa: 2 }) + '%',
      },
    ];
    return statistics;
  }),
  shareReplay(1)
);

export const statistics$ = combineLatest([apiData$]).pipe(
  map(([apiData]) => {
    const bnt24hChange = new BigNumber(apiData.bnt_price.usd!)
      .div(apiData.bnt_price_24h_ago.usd!)
      .times(100)
      .minus(100)
      .toNumber();

    const liquidity24hChange = new BigNumber(apiData.total_liquidity.usd!)
      .div(apiData.total_liquidity_24h_ago.usd!)
      .times(100)
      .minus(100)
      .toNumber();

    const fees24hChange = new BigNumber(apiData.total_fees_24h.usd!)
      .div(apiData.total_fees_24h_ago.usd!)
      .times(100)
      .minus(100)
      .toNumber();

    const bntSupply: string = apiData.bnt_supply;
    const totalBntStaked: number = apiData.pools.reduce((acc, item) => {
      const bntReserve = item.reserves.find(
        (reserve) => reserve.address === bntToken
      );
      if (!bntReserve) return acc;
      return Number(bntReserve.balance) + acc;
    }, 0);

    const stakedBntPercent =
      (totalBntStaked / Number(parseFloat(bntSupply).toExponential(18))) * 100;

    const statistics: Statistic[] = [
      {
        label: 'BNT Price',
        value: '$' + numbro(apiData.bnt_price.usd).format({ mantissa: 2 }),
        change24h: bnt24hChange,
      },
      {
        label: 'Total Liquidity',
        value: '$' + numbro(apiData.total_liquidity.usd).format(averageFormat),
        change24h: liquidity24hChange,
      },
      {
        label: 'Fees (24h)',
        value: '$' + numbro(apiData.total_fees_24h.usd).format(averageFormat),
        change24h: fees24hChange,
      },
      {
        label: 'Total BNT Staked',
        value: numbro(stakedBntPercent).format({ mantissa: 2 }) + '%',
      },
    ];
    return statistics;
  }),
  shareReplay(1)
);
