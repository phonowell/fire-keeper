import { IFnAsync } from '../type';
declare type IMapFunction = {
    [key: string]: IFnAsync;
};
declare const _default: {
    (): IMapFunction;
    (name: string): IFnAsync;
    (name: string, fn: IFnAsync): void;
};
export default _default;
