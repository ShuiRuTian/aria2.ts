import fs from 'fs-extra';
import os from 'os';
import path from 'path';
import { zip } from 'compressing';

import download from './downloader';

type Platform = typeof process.platform;

type SupportPlatform = 'linux'|'win32';

function ensurePlatform(platform: Platform): SupportPlatform {
  switch (platform) {
    case 'linux':
    case 'win32':
      return platform;
    default:
      throw new Error(`${platform} is not supported for now`);
  }
}

// eslint-disable-next-line class-methods-use-this
function getDownloadLink(platform: SupportPlatform): string {
  switch (platform) {
    case 'linux':
      return 'https://github.com/aria2/aria2/releases/download/release-1.35.0/aria2-1.35.0-aarch64-linux-android-build1.zip';
    case 'win32':
      return 'https://github.com/aria2/aria2/releases/download/release-1.35.0/aria2-1.35.0-win-64bit-build1.zip';
    default:
      throw new Error();
  }
}

// eslint-disable-next-line class-methods-use-this
function getCompressedFileName(platform: SupportPlatform): string {
  const compressedFolderName = getDownloadLink(platform).split('/').pop();
  if (compressedFolderName) return compressedFolderName;
  throw new Error();
}

// eslint-disable-next-line class-methods-use-this
export function getAria2BinName(platform: SupportPlatform): string {
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
async function ExtractAndGetBinPath(compressedFilePath: string, platform: SupportPlatform): Promise<string> {
  // extract compressed file under the same folder
  // only support zip file for now.
  await zip.uncompress(compressedFilePath, path.dirname(compressedFilePath));
  const compressedFileFolderName = getCompressedFileName(platform).slice(0, getCompressedFileName(platform).lastIndexOf('.'));
  const aria2BinName = getAria2BinName(platform);
  const aria2BinPath = path.join(path.dirname(compressedFilePath), compressedFileFolderName, aria2BinName);
  return aria2BinPath;
}


export default async function downloadAria2Exe(dir = './'): Promise<void> {
  const platform = ensurePlatform(os.platform());
  const aria2DesFolder = path.resolve(dir);
  const aria2DesPath = path.join(aria2DesFolder, getAria2BinName(platform));
  // create a tmp foler to place compressed file.
  const aria2SrcFolder = fs.mkdtempSync(path.join(os.tmpdir(), 'aria2'));
  const aria2SrcFilePath = path.join(aria2SrcFolder, getCompressedFileName(platform));

  // if directory not exists, create it.
  if (fs.existsSync(aria2DesFolder)) {
    const desStatus = fs.statSync(aria2DesFolder);
    if (!desStatus.isDirectory()) {
      await fs.mkdirp(aria2DesFolder);
    }
  } else {
    await fs.mkdirp(aria2DesFolder);
  }
  const downloadLink = getDownloadLink(platform);
  try {
    await download(downloadLink, aria2SrcFilePath);
  } catch (error) {
    console.log(error);
    throw error;
  }

  const aria2BinSrcPath = await ExtractAndGetBinPath(aria2SrcFilePath, platform);
  fs.moveSync(aria2BinSrcPath, aria2DesPath);
}
