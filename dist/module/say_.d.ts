declare type IOption = {
    lang?: keyof typeof Lang;
    voice?: typeof Lang[keyof typeof Lang];
};
declare const Lang: {
    readonly ja: "kyoko";
    readonly 'ja-jp': "kyoko";
    readonly zh: "ting-ting";
    readonly 'zh-cn': "ting-ting";
    readonly 'zh-hk': "sin-ji";
    readonly 'zh-tw': "mei-jia";
};
declare function main_(text: string, option?: IOption): Promise<void>;
export default main_;
