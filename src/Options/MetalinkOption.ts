/* eslint-disable @typescript-eslint/camelcase */
import { bittorrent_metalink_options, metalink_specific_options } from './internal/aria2DocumentOptions';

export interface BitTorrentOption extends bittorrent_metalink_options, metalink_specific_options {

}
