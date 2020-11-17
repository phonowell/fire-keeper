import prompts from 'prompts';
declare function main_(option: {
    default?: boolean;
    id?: string;
    message?: string;
    type: 'confirm';
}): Promise<boolean>;
declare function main_(option: {
    default?: number;
    max?: number;
    message?: string;
    min?: number;
    type: 'number';
}): Promise<number>;
declare function main_(option: {
    default?: string;
    id?: string;
    message?: string;
    type: 'text';
}): Promise<string>;
declare function main_(option: {
    default?: string | number;
    id?: string;
    list: prompts.Choice[] | unknown[];
    message?: string;
    type: 'auto' | 'autocomplete' | 'select';
}): Promise<string>;
export default main_;
