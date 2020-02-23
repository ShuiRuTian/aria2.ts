import { ResponseGetUris } from './ResponseGetUris';

interface StructGetFiles{
/**
 * Index of the file, starting at 1, in the same order as files appear in the multi-file torrent.
 */
index: number;
/**
 * File path.
 */
path: string;
/**
 * File size in bytes.
 */
length: number;
/**
 * Completed length of this file in bytes. Please note that it is possible that sum of completedLength is less than the completedLength returned by the aria2.tellStatus() method. This is because completedLength in aria2.getFiles() only includes completed pieces. On the other hand, completedLength in aria2.tellStatus() also includes partially completed pieces.
 */
completedLength: number;
/**
 * true if this file is selected by --select-file option. If --select-file is not specified or this is single-file torrent or not a torrent download at all, this value is always true. Otherwise false.
 */
selected: boolean;
/**
 * Returns a list of URIs for this file. The element type is the same struct used in the aria2.getUris() method.
 */
uris: ResponseGetUris;
}

export type ResponseGetFiles = Array<StructGetFiles>;
