declare type OS = 'linux' | 'macos' | 'unknown' | 'windows';
declare function main(): OS;
declare function main(os: OS): boolean;
export default main;
