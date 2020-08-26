declare type IOption = {
    base?: string;
    filename?: string;
};
declare const _default: (source: string | string[], target?: string, option?: string | IOption) => Promise<void>;
export default _default;
