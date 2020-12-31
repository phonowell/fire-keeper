declare type Option = {
    base?: string;
    filename?: string;
};
declare function main_(source: string | string[], target?: string, option?: string | Option): Promise<void>;
export default main_;
