import $ from '..';
declare type IArgument = Parameters<typeof $.copy_>;
declare function main_(source: IArgument[0], target: IArgument[1], option?: IArgument[2]): Promise<void>;
export default main_;
