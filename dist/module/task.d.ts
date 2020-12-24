declare type MapFunction = {
    [key: string]: Function;
};
declare function main(): MapFunction;
declare function main(name: string): Function;
declare function main(name: string, fn: Function): void;
export default main;
