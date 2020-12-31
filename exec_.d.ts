/// <reference types="node" />
import child from 'child_process';
export declare class M {
    process: child.ChildProcessWithoutNullStreams | undefined;
    spawn: typeof child.spawn;
    static info(type: string, message: string): void;
    static parseMessage(buffer: Uint8Array): string;
    execute_(cmd: string | string[], option?: {
        ignoreError?: boolean;
        silent?: boolean;
    }): Promise<[boolean, string]>;
}
declare const _default: (cmd: string | string[], option?: {
    ignoreError?: boolean | undefined;
    silent?: boolean | undefined;
}) => Promise<[boolean, string]>;
export default _default;
