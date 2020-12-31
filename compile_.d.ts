/// <reference types="node" />
declare global {
    function using(): NodeJS.ReadWriteStream;
}
declare type Option = {
    bare: boolean;
    base: string;
    minify: boolean;
    sourcemaps: boolean;
};
declare function main_(source: string | string[], option?: Partial<Option>): Promise<void>;
declare function main_(source: string | string[], target: string, option?: Partial<Option>): Promise<void>;
export default main_;
