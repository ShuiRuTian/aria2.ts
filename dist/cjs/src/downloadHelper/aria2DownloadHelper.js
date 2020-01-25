"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = __importDefault(require("fs-extra"));
const os_1 = __importDefault(require("os"));
const path_1 = __importDefault(require("path"));
const compressing_1 = require("compressing");
const downloader_1 = __importDefault(require("./downloader"));
function ensurePlatform(platform) {
    switch (platform) {
        case 'linux':
        case 'win32':
            return platform;
        default:
            throw new Error(`${platform} is not supported for now`);
    }
}
// eslint-disable-next-line class-methods-use-this
function getDownloadLink(platform) {
    switch (platform) {
        case 'linux':
            return 'https://github.com/aria2/aria2/releases/download/release-1.35.0/aria2-1.35.0-aarch64-linux-android-build1.zip';
        case 'win32':
        default:
            throw new Error();
    }
}
// eslint-disable-next-line class-methods-use-this
function getCompressedFileName(platform) {
    const compressedFolderName = getDownloadLink(platform).split('/').pop();
    if (compressedFolderName)
        return compressedFolderName;
    throw new Error();
}
// eslint-disable-next-line class-methods-use-this
function getAria2BinName(platform) {
    switch (platform) {
        case 'linux':
            return 'aria2c';
        case 'win32':
            return 'aria2c.exe';
        default:
            throw new Error();
    }
}
/**
 *
 * @param compressedFilePath
 * @param platform
 */
async function ExtractAndGetBinPath(compressedFilePath, platform) {
    // extract compressed file under the same folder
    // only support zip file for now.
    await compressing_1.zip.uncompress(compressedFilePath, path_1.default.dirname(compressedFilePath));
    const compressedFileFolderName = getCompressedFileName(platform).slice(0, getCompressedFileName(platform).lastIndexOf('.'));
    const aria2BinName = getAria2BinName(platform);
    // this assume that compressed file has the same name with the folder it contains.
    const aria2BinPath = path_1.default.join(path_1.default.dirname(compressedFilePath), compressedFileFolderName, compressedFileFolderName, aria2BinName);
    return aria2BinPath;
}
async function downloadAria2Exe(dir = './') {
    const platform = ensurePlatform(os_1.default.platform());
    const aria2DesFolder = path_1.default.resolve(dir);
    const aria2DesPath = path_1.default.join(aria2DesFolder, getAria2BinName(platform));
    // create a tmp foler to place compressed file.
    const aria2SrcFolder = fs_extra_1.default.mkdtempSync(path_1.default.join(os_1.default.tmpdir(), 'aria2'));
    const aria2SrcFilePath = path_1.default.join(aria2SrcFolder, getCompressedFileName(platform));
    // if directory not exists, create it.
    if (fs_extra_1.default.existsSync(aria2DesFolder)) {
        const desStatus = fs_extra_1.default.statSync(aria2DesFolder);
        if (!desStatus.isDirectory()) {
            await fs_extra_1.default.mkdirp(aria2DesFolder);
        }
    }
    else {
        await fs_extra_1.default.mkdirp(aria2DesFolder);
    }
    const downloadLink = getDownloadLink(platform);
    try {
        await downloader_1.default(downloadLink, aria2SrcFilePath);
    }
    catch (error) {
        console.log(error);
        throw error;
    }
    const aria2BinSrcPath = await ExtractAndGetBinPath(aria2SrcFilePath, platform);
    fs_extra_1.default.moveSync(aria2BinSrcPath, aria2DesPath);
}
exports.default = downloadAria2Exe;
//# sourceMappingURL=aria2DownloadHelper.js.map