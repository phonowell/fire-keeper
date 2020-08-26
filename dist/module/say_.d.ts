declare type IOption = {
    lang?: string;
    voice?: string;
};
declare function main_(text: string, option?: IOption): Promise<void>;
export default main_;
