declare type IOS = 'linux' | 'macos' | 'unknown' | 'windows';
declare function main(): IOS;
declare function main(os: IOS): boolean;
export default main;
