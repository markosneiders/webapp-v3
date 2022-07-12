export abstract class QueryKey {
  static v3 = () => ['v3'];
  static chain = () => [...this.v3(), 'chain'];
  static chainCore = (key?: number | string) => [...this.chain(), 'pools', key];
  static chainCorePoolIds = () => [...this.chainCore('poolIds')];
  static chainCorePoolTokenIds = (key?: number) => [
    ...this.chainCore(key),
    'poolTokenIds',
  ];
  static chainCoreSymbols = (key?: number) => [
    ...this.chainCore(key),
    'symbols',
  ];
  static chainCoreDecimals = (key?: number) => [
    ...this.chainCore(key),
    'decimals',
  ];
  static chainCoreName = (key?: number) => [...this.chainCore(key), 'name'];
  static chainCoreTradingEnabled = (key?: number) => [
    ...this.chainCore(key),
    'tradingEnabled',
  ];
  static chainCoreTradingLiquidity = (key?: number) => [
    ...this.chainCore(key),
    'tradingLiquidity',
  ];
  static chainCoreDepositingEnabled = (key?: number) => [
    ...this.chainCore(key),
    'depositingEnabled',
  ];
  static chainCoreStakedBalance = (key?: number) => [
    ...this.chainCore(key),
    'stakedBalance',
  ];
  static chainCoreTradingFee = (key?: number) => [
    ...this.chainCore(key),
    'tradingFee',
  ];
  static chainCoreLatestProgram = (key?: number) => [
    ...this.chainCore(key),
    'latestProgramId',
  ];
  static chainCorePrograms = (key?: number) => [
    ...this.chainCore(key),
    'programs',
  ];
  static chainPools = () => [...this.chain(), 'pools'];
  static chainPoolsByID = (key?: string) => [...this.chainPools(), key];

  static api = () => [...this.v3(), 'api'];
  static apiPools = () => [...this.api(), 'pools'];
  static apiBnt = () => [...this.api(), 'bnt'];
  static apiFees = () => [...this.api(), 'fees'];
}
