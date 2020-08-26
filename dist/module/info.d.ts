import { IFnAsync } from '../type';
declare class M {
    cacheTime: [number, string];
    cacheType: {
        [key: string]: string;
    };
    isFrozen: boolean;
    isSilent: boolean;
    regHome: RegExp;
    regRoot: RegExp;
    separator: string;
    constructor();
    execute(): this;
    execute<T>(input: T): T;
    execute<T>(type: string, input: T): T;
    freeze_(fn_: IFnAsync): Promise<unknown>;
    makeTextOfTime(): string;
    pause(): void;
    render(type: string, message: string): string;
    renderContent(message: string): string;
    renderPath(message: string): string;
    renderTime(): string;
    renderType(type: string): string;
    resume(): void;
    whisper_(fn_: IFnAsync): Promise<unknown>;
}
declare const _default: {
    (): M;
    <T>(input: T): T;
    <T_1>(type: string, input: T_1): T_1;
};
export default _default;
