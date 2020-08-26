declare type IListSource = string[] & {
    __is_listed_as_source__?: boolean;
};
declare function main_(source: string | string[] | IListSource): Promise<string[]>;
export default main_;
