import fs from 'fs-extra';
import path from 'path';
import got from 'got';
/**
 * this whole function from @electron/get, which use got(https://github.com/sindresorhus/got) to download a file.
 * @param options - see [`got#options`](https://github.com/sindresorhus/got#options) for possible keys/values.
*/
export default async function download(url, targetFilePath, options) {
    await fs.mkdirp(path.dirname(targetFilePath));
    const writeStream = fs.createWriteStream(targetFilePath);
    await new Promise((resolve, reject) => {
        const downloadStream = got.stream(url, options);
        downloadStream.pipe(writeStream);
        downloadStream.on('error', (error) => reject(error));
        writeStream.on('error', (error) => reject(error));
        writeStream.on('close', () => resolve());
    });
}
//# sourceMappingURL=downloader.js.map