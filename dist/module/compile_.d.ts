/// <reference types="node" />
declare global {
    function using(): NodeJS.ReadWriteStream;
}
interface Option {
    bare: boolean;
    base: string;
    minify: boolean;
    sourcemaps: boolean;
}
declare const _default: {
    (source: string | string[], option?: Partial<Option> | undefined): Promise<void>;
    (source: string | string[], target: string, option?: Partial<Option> | undefined): Promise<void>;
};
export default _default;
