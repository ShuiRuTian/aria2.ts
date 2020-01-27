/* eslint-disable @typescript-eslint/camelcase */
import { http_ftp_sftp_options, ftp_sftp_specific_options } from './internal/aria2DocumentOptions';

export interface FtpOption extends http_ftp_sftp_options, ftp_sftp_specific_options {

}
