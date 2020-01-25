"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const got_1 = __importDefault(require("got"));
/**
 * this whole function from @electron/get, which use got(https://github.com/sindresorhus/got) to download a file.
 * @param options - see [`got#options`](https://github.com/sindresorhus/got#options) for possible keys/values.
*/
async function download(url, targetFilePath, options) {
    await fs_extra_1.default.mkdirp(path_1.default.dirname(targetFilePath));
    const writeStream = fs_extra_1.default.createWriteStream(targetFilePath);
    await new Promise((resolve, reject) => {
        const downloadStream = got_1.default.stream(url, options);
        downloadStream.pipe(writeStream);
        downloadStream.on('error', (error) => reject(error));
        writeStream.on('error', (error) => reject(error));
        writeStream.on('close', () => resolve());
    });
}
exports.default = download;
//# sourceMappingURL=downloader.js.map