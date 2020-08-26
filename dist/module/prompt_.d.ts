import prompts from 'prompts';
declare const _default: {
    (option: {
        default?: boolean | undefined;
        id?: string | undefined;
        message?: string | undefined;
        type: "confirm";
    }): Promise<boolean>;
    (option: {
        default?: number | undefined;
        max?: number | undefined;
        message?: string | undefined;
        min?: number | undefined;
        type: "number";
    }): Promise<number>;
    (option: {
        default?: string | undefined;
        id?: string | undefined;
        message?: string | undefined;
        type: "text";
    }): Promise<string>;
    (option: {
        default?: string | undefined;
        id?: string | undefined;
        list: unknown[] | prompts.Choice[];
        message?: string | undefined;
        type: "auto" | "select" | "autocomplete";
    }): Promise<string>;
};
export default _default;
