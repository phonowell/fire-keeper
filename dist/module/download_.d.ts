interface IOption {
    filename: string;
    timeout: number;
}
declare function main_(source: string, target: string, option?: string | Partial<IOption>): Promise<void>;
export default main_;
