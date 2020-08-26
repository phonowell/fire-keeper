/// <reference types="node" />
import rename from 'gulp-rename';
declare global {
    function using(): NodeJS.ReadWriteStream;
}
declare function main_(source: string | string[], option: string | rename.Options): Promise<void>;
export default main_;
