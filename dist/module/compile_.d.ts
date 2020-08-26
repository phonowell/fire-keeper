/// <reference types="node" />
declare global {
    function using(): NodeJS.ReadWriteStream;
}
interface IOption {
    bare: boolean;
    base: string;
    minify: boolean;
    sourcemaps: boolean;
}
declare const _default: {
    (source: string | string[], option?: Partial<IOption> | undefined): Promise<void>;
    (source: string | string[], target: string, option?: Partial<IOption> | undefined): Promise<void>;
};
export default _default;
