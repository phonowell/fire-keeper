import { FnAsync } from '../type';
declare type MapFunction = {
    [key: string]: FnAsync;
};
declare const _default: {
    (): MapFunction;
    (name: string): FnAsync;
    (name: string, fn: FnAsync): void;
};
export default _default;
