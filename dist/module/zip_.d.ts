declare type Option = {
    base?: string;
    filename?: string;
};
declare const _default: (source: string | string[], target?: string, option?: string | Option) => Promise<void>;
export default _default;
