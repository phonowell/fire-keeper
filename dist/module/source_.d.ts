declare type ListSource = string[] & {
    __is_listed_as_source__?: boolean;
};
declare function main_(source: string | string[] | ListSource): Promise<string[]>;
export default main_;
