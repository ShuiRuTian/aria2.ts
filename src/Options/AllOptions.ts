/* eslint-disable @typescript-eslint/camelcase */
import {
  http_ftp_sftp_options, ftp_sftp_specific_options, advanced_options, basic_options, bittorrent_metalink_options, bittorrent_specific_options, http_specific_options, rpc_options,
} from './internal/aria2DocumentOptions';

export interface AllOption extends http_ftp_sftp_options, ftp_sftp_specific_options, advanced_options, basic_options, bittorrent_metalink_options, bittorrent_specific_options, http_specific_options, rpc_options
{

}
