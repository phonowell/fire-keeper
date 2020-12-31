interface Option {
    filename: string;
    timeout: number;
}
declare function main_(source: string, target: string, option?: string | Partial<Option>): Promise<void>;
export default main_;
