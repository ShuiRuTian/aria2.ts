/* eslint-disable prefer-rest-params */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { RequestInit } from 'node-fetch';
import { URL } from 'url';
import {
  BaseClient, clientBody, ClientSendProperty, PromiseResultFunction,
} from './BaseClient';
import type{ AllOption } from '../Options/AllOptions';
import type{ DownloadStatus } from './ResponseTypes/DownloadStatus';
import type{ ResponseGetUris } from './ResponseTypes/ResponseGetUris';
import type{ ResponseGetFiles } from './ResponseTypes/ResponseGetFiles';
import type{ ResponseGetPeers } from './ResponseTypes/ResponseGetPeers';
import type{ ResponseGetServers } from './ResponseTypes/ResponseGetServers';
import type{ ResponseChangeUri } from './ResponseTypes/ResponseChangeUri';
import type { ResponseGetGlobalStat } from './ResponseTypes/ResponseGetGlobalStat';
import type{ ResponseGetVersion } from './ResponseTypes/ResponseGetVersion';
import type{ ResponseGetSessionInfo } from './ResponseTypes/ResponseGetSessionInfo';

const JsonRpcDefaultUrl = 'http://localhost:6800/jsonrpc';

const JsonRpcDefaultHttpRequestInit: RequestInit = {
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  method: 'POST',
};

const JsonRpcDefaultBody: clientBody = {
  jsonrpc: '2.0',
};

type METHODS = 'aria2.addUri' | 'aria2.addTorrent' | 'aria2.getPeers' | 'aria2.addMetalink' | 'aria2.remove' | 'aria2.pause' | 'aria2.forcePause' | 'aria2.pauseAll' | 'aria2.forcePauseAll' | 'aria2.unpause' | 'aria2.unpauseAll' | 'aria2.forceRemove' | 'aria2.changePosition' | 'aria2.tellStatus' | 'aria2.getUris' | 'aria2.getFiles' | 'aria2.getServers' | 'aria2.tellActive' | 'aria2.tellWaiting' | 'aria2.tellStopped' | 'aria2.getOption' | 'aria2.changeUri' | 'aria2.changeOption' | 'aria2.getGlobalOption' | 'aria2.changeGlobalOption' | 'aria2.purgeDownloadResult' | 'aria2.removeDownloadResult' | 'aria2.getVersion' | 'aria2.getSessionInfo' | 'aria2.shutdown' | 'aria2.forceShutdown' | 'aria2.getGlobalStat' | 'aria2.saveSession' | 'system.multicall' | 'system.listMethods' | 'system.listNotifications'
type JsonRpcClientMehods = 'addUri' | 'addTorrent' | 'getPeers' | 'addMetalink' | 'remove' | 'pause' | 'forcePause' | 'pauseAll' | 'forcePauseAll' | 'unpause' | 'unpauseAll' | 'forceRemove' | 'changePosition' | 'tellStatus' | 'getUris' | 'getFiles' | 'getServers' | 'tellActive' | 'tellWaiting' | 'tellStopped' | 'getOption' | 'changeUri' | 'changeOption' | 'getGlobalOption' | 'changeGlobalOption' | 'purgeDownloadResult' | 'removeDownloadResult' | 'getVersion' | 'getSessionInfo' | 'shutdown' | 'forceShutdown' | 'getGlobalStat' | 'saveSession' | 'multicall' | 'listMethods' | 'listNotifications';
type Aria2Notifications = 'aria2.onDownloadStart'|'aria2.onDownloadPause'|'aria2.onDownloadStop'|'aria2.onDownloadComplete'|'aria2.onDownloadError'|'aria2.onBtDownloadComplete'
interface Aria2RpcMethod {
    (...paras: any): Promise<any>;
}

interface Aria2RpcMethodBase{
  id: string;
  jsonrpc: '2.0';

}
interface Aria2RpcMethodRequest extends Aria2RpcMethodBase{
  method: string;
  params: any;
}

interface Aria2RpcMethodSuccessResponse extends Aria2RpcMethodBase{
  result: any;
}

interface Aria2RpcMethodFailedResponse extends Aria2RpcMethodBase{
  error: {
    code: number;
    message: string;
  };
}

interface Aria2RpcNotificationResponseDataStruct{
  gid: string;
}

// The response of notification data will only have one object in its array.
interface Aria2RpcNotificationResponseDataArray extends Array<Aria2RpcNotificationResponseDataStruct>{
  length: 1;
}

interface Aria2RpcNotificationResponse{
  jsonrpc: string;
  method: Aria2Notifications;
  // the length of array would only be one.
  params: Aria2RpcNotificationResponseDataArray;
}

// why here use string rather than specific interface?
// 1. the abstract in BaseClient would hide the event to promise, but it could not use specific interface.
// so if we merge the two file together, the parse function could reduce from 6 times to only 1.
// Maybe we need it?
const aria2WebSocketPromiseFunction: PromiseResultFunction = {
  isResponseTreatedAsPromise(message: string) {
    const messageObject: any = JSON.parse(message);
    const isSuccessMethodResponse = messageObject.result !== undefined;
    const isFailedMethodResponse = messageObject.error !== undefined;
    return isSuccessMethodResponse || isFailedMethodResponse;
  },
  getIdFromSentMessage(message: string) {
    const messageObject: Aria2RpcMethodBase = JSON.parse(message);
    return messageObject.id;
  },
  getIdFromReceivedMessage(message: string) {
    const messageObject: Aria2RpcMethodBase = JSON.parse(message);
    return messageObject.id;
  },
  resolvedCallback(message: string) {
    const messageObject: Aria2RpcMethodSuccessResponse = JSON.parse(message);
    return messageObject.result;
  },
  rejectCallback(message: string) {
    const messageObject: Aria2RpcMethodFailedResponse = JSON.parse(message);
    return messageObject.error;
  },
  isPromiseSuccess(message: string) {
    const messageObject: any = JSON.parse(message);
    return messageObject.result !== undefined;
  },
};


export default class JsonRpcClient extends BaseClient implements Record<JsonRpcClientMehods, Aria2RpcMethod> {
    private Index = 0;

    id() {
      this.Index += 1;
      return this.Index;
    }

    private methodSend(methodName: METHODS, params: any[]): Promise<any> {
      const mutableBodyObject = {
        method: methodName,
        id: this.id(),
        params,
      };
      const requestInfo: Partial<ClientSendProperty> = {
        body: JSON.stringify(mutableBodyObject),
      };
      return this.send(requestInfo);
    }

    // to translate the result of websocket to Promise, some things must be known: 1. when to mark result as Resolved and rejected? 2. to resolve 1, the message sent and received must have information to know each other
    constructor(url: URL | string = JsonRpcDefaultUrl, requestInit: RequestInit = JsonRpcDefaultHttpRequestInit, body: clientBody = JsonRpcDefaultBody) {
      super(url, aria2WebSocketPromiseFunction, requestInit, body);
    }

    // #region notification

    // different from methods, the returned value has same struct, so we just only need one method.
    // return unsubscribe function.
    notification(notification: Aria2Notifications, callback: (data: Aria2RpcNotificationResponseDataStruct) => any) {
      // this code only deal with specific condition
      // eslint-disable-next-line consistent-return
      return this.addEventListenerForWebSocket('message', ({ data: receivedMessage }) => {
        const messageObject: Aria2RpcNotificationResponse = JSON.parse(receivedMessage);
        if (messageObject.method === notification) {
          const [notificationGid] = messageObject.params;
          const callBackValue = callback(notificationGid);
          return callBackValue;
        }
      });
    }
    // #endregion notification

    // #region methods

    /**
* This method adds a new download. uris is an array of HTTP/FTP/SFTP/BitTorrent URIs (strings) pointing to the same resource.  If you mix URIs pointing to different resources, then the download may fail or be corrupted without aria2 complaining.  When adding BitTorrent Magnet URIs, uris must have only one element and it should be BitTorrent Magnet URI.  options is a struct and its members are pairs of option name and value.  See Options below for more details.  If position is given, it must be an integer starting from 0. The new download will be inserted at position in the waiting queue. If position is omitted or position is larger than the current size of the queue, the new download is appended to the end of the queue.  This method returns the GID of the newly registered download.
*/
    addUri(uris: string[], options?: AllOption, position?: number): Promise<string> {
      return this.methodSend('aria2.addUri', Array.from(arguments));
    }

    /**
  * This method adds a BitTorrent download by uploading a ".torrent" file. If you want to add a BitTorrent Magnet URI, use the aria2.addUri() method instead.  torrent must be a base64-encoded string containing the contents of the ".torrent" file. uris is an array of URIs (string). uris is used for Web-seeding.  For single file torrents, the URI can be a complete URI pointing to the resource; if URI ends with /, name in torrent file is added. For multi-file torrents, name and path in torrent are added to form a URI for each file. options is a struct and its members are pairs of option name and value. See Options below for more details. If position is given, it must be an integer starting from 0. The new download will be inserted at position in the waiting queue. If position is omitted or position is larger than the current size of the queue, the new download is appended to the end of the queue. This method returns the GID of the newly registered download. If --rpc-save-upload-metadata is true, the uploaded data is saved as a file named as the hex string of SHA-1 hash of data plus ".torrent" in the directory specified by --dir option.  E.g. a file name might be 0a3893293e27ac0490424c06de4d09242215f0a6.torrent.  If a file with the same name already exists, it is overwritten!  If the file cannot be saved successfully or --rpc-save-upload-metadata is false, the downloads added by this method are not saved by --save-session.
  */
    addTorrent(torrent: string, uris?: string[], options?: AllOption, position?: number): Promise<string> {
      return this.methodSend('aria2.addTorrent', Array.from(arguments));
    }

    /**
  * This method adds a Metalink download by uploading a ".metalink" file. metalink is a base64-encoded string which contains the contents of the ".metalink" file. options is a struct and its members are pairs of option name and value. See Options below for more details. If position is given, it must be an integer starting from 0. The new download will be inserted at position in the waiting queue. If position is omitted or position is larger than the current size of the queue, the new download is appended to the end of the queue. This method returns an array of GIDs of newly registered downloads. If --rpc-save-upload-metadata is true, the uploaded data is saved as a file named hex string of SHA-1 hash of data plus ".metalink" in the directory specified by --dir option.  E.g. a file name might be 0a3893293e27ac0490424c06de4d09242215f0a6.metalink.  If a file with the same name already exists, it is overwritten!  If the file cannot be saved successfully or --rpc-save-upload-metadata is false, the downloads added by this method are not saved by --save-session.
  */
    addMetalink(metalink: string, options?: AllOption, position?: number): Promise<string> {
      return this.methodSend('aria2.addMetalink', Array.from(arguments));
    }

    /**
  * This method removes the download denoted by gid (string).  If the specified download is in progress, it is first stopped.  The status of the removed download becomes removed. This method returns GID of removed download.
  */
    remove(gid: string): Promise<string> {
      return this.methodSend('aria2.remove', Array.from(arguments));
    }

    /**
  * This method removes the download denoted by gid.  This method behaves just like aria2.remove() except that this method removes the download without performing any actions which take time, such as contacting BitTorrent trackers to unregister the download first.
  */
    forceRemove(gid: string): Promise<string> {
      return this.methodSend('aria2.forceRemove', Array.from(arguments));
    }

    /**
  * This method pauses the download denoted by gid (string).  The status of paused download becomes paused.  If the download was active, the download is placed in the front of waiting queue.  While the status is paused, the download is not started.  To change status to waiting, use the aria2.unpause() method. This method returns GID of paused download.
  */
    pause(gid: string): Promise<string> {
      return this.methodSend('aria2.pause', Array.from(arguments));
    }

    /**
  * This method is equal to calling aria2.pause() for every active/waiting download. This methods returns OK.
  */
    pauseAll(): Promise<'OK'> {
      return this.methodSend('aria2.pauseAll', Array.from(arguments));
    }

    /**
  * This method pauses the download denoted by gid.  This method behaves just like aria2.pause() except that this method pauses downloads without performing any actions which take time, such as contacting BitTorrent trackers to unregister the download first.
  */
    forcePause(gid: string): Promise<string> {
      return this.methodSend('aria2.forcePause', Array.from(arguments));
    }

    /**
  * This method is equal to calling aria2.forcePause() for every active/waiting download. This methods returns OK.
  */
    forcePauseAll(): Promise<'OK'> {
      return this.methodSend('aria2.forcePauseAll', Array.from(arguments));
    }

    /**
  * This method changes the status of the download denoted by gid (string) from paused to waiting, making the download eligible to be restarted. This method returns the GID of the unpaused download.
  */
    unpause(gid: string): Promise<string> {
      return this.methodSend('aria2.unpause', Array.from(arguments));
    }

    /**
  * This method is equal to calling aria2.unpause() for every paused download. This methods returns OK.
  */
    unpauseAll(): Promise<'OK'> {
      return this.methodSend('aria2.unpauseAll', Array.from(arguments));
    }

    /**
  * This method returns the progress of the download denoted by gid (string). keys is an array of strings. If specified, the response contains only keys in the keys array. If keys is empty or omitted, the response contains all keys. This is useful when you just want specific keys and avoid unnecessary transfers. For example, aria2.tellStatus("2089b05ecca3d829", ["gid", "status"]) returns the gid and status keys only.  The response is a struct and contains following keys. Values are strings.
  */
    tellStatus(gid: string, keys?: Array<keyof DownloadStatus>): Promise<Partial<DownloadStatus>> {
      return this.methodSend('aria2.tellStatus', Array.from(arguments));
    }

    /**
  * This method returns the URIs used in the download denoted by gid (string). The response is an array of structs and it contains following keys. Values are string.
  */
    getUris(gid: string): Promise<ResponseGetUris> {
      return this.methodSend('aria2.getUris', Array.from(arguments));
    }

    /**
  * This method returns the file list of the download denoted by gid (string). The response is an array of structs which contain following keys. Values are strings.
  */
    getFiles(gid: string): Promise<ResponseGetFiles> {
      return this.methodSend('aria2.getFiles', Array.from(arguments));
    }

    /**
  * This method returns a list peers of the download denoted by gid (string). This method is for BitTorrent only.  The response is an array of structs and contains the following keys. Values are strings.
  */
    getPeers(gid: string): Promise<ResponseGetPeers> {
      return this.methodSend('aria2.getPeers', Array.from(arguments));
    }

    /**
  * This method returns currently connected HTTP(S)/FTP/SFTP servers of the download denoted by gid (string). The response is an array of structs and contains the following keys. Values are strings.
  */
    getServers(gid: string): Promise<ResponseGetServers> {
      return this.methodSend('aria2.getServers', Array.from(arguments));
    }

    /**
  * This method returns a list of active downloads.  The response is an array of the same structs as returned by the aria2.tellStatus() method. For the keys parameter, please refer to the aria2.tellStatus() method.
  */
    tellActive(keys?: Array<keyof DownloadStatus>): Promise<DownloadStatus[]> {
      return this.methodSend('aria2.tellActive', Array.from(arguments));
    }

    /**
  * This method returns a list of waiting downloads, including paused ones. offset is an integer and specifies the offset from the download waiting at the front. num is an integer and specifies the max. number of downloads to be returned. For the keys parameter, please refer to the aria2.tellStatus() method.
  */
    tellWaiting(offset: number, num: number, keys?: Array<keyof DownloadStatus>): Promise<DownloadStatus[]> {
      return this.methodSend('aria2.tellWaiting', Array.from(arguments));
    }

    /**
  * This method returns a list of stopped downloads. offset is an integer and specifies the offset from the least recently stopped download. num is an integer and specifies the max. number of downloads to be returned. For the keys parameter, please refer to the aria2.tellStatus() method.
  */
    tellStopped(offset: number, num: number, keys?: Array<keyof DownloadStatus>): Promise<DownloadStatus[]> {
      return this.methodSend('aria2.tellStopped', Array.from(arguments));
    }

    /**
  * This method changes the position of the download denoted by gid in the queue. pos is an integer. how is a string. If how is POS_SET, it moves the download to a position relative to the beginning of the queue.  If how is POS_CUR, it moves the download to a position relative to the current position. If how is POS_END, it moves the download to a position relative to the end of the queue. If the destination position is less than 0 or beyond the end of the queue, it moves the download to the beginning or the end of the queue respectively. The response is an integer denoting the resulting position.
  */
    changePosition(gid: string, pos: number, how: 'POS_SET'|'POS_CUR'|'POS_END'): Promise<number> {
      return this.methodSend('aria2.changePosition', Array.from(arguments));
    }

    /**
  * This method removes the URIs in delUris from and appends the URIs in addUris to download denoted by gid. delUris and addUris are lists of strings. A download can contain multiple files and URIs are attached to each file.  fileIndex is used to select which file to remove/attach given URIs. fileIndex is 1-based. position is used to specify where URIs are inserted in the existing waiting URI list. position is 0-based. When position is omitted, URIs are appended to the back of the list.  This method first executes the removal and then the addition. position is the position after URIs are removed, not the position when this method is called.  When removing an URI, if the same URIs exist in download, only one of them is removed for each URI in delUris. In other words, if there are three URIs http://example.org/aria2 and you want remove them all, you have to specify (at least) 3 http://example.org/aria2 in delUris.  This method returns a list which contains two integers. The first integer is the number of URIs deleted. The second integer is the number of URIs added.
  */
    changeUri(gid: string, fileIndex: number, delUris: string[], addUris: string[], position: number): Promise<ResponseChangeUri> {
      return this.methodSend('aria2.changeUri', Array.from(arguments));
    }

    /**
  * This method returns options of the download denoted by gid.  The response is a struct where keys are the names of options. The values are strings. Note that this method does not return options which have no default value and have not been set on the command-line, in configuration files or RPC methods.
  */
    getOption(gid: string): Promise<AllOption> {
      return this.methodSend('aria2.getOption', Array.from(arguments));
    }

    /**
  * This method changes options of the download denoted by gid (string) dynamically.  options is a struct. The options listed in Input File subsection are available, except for following options:
  */
    changeOption(gid: string, options: AllOption): Promise<'OK'> {
      return this.methodSend('aria2.changeOption', Array.from(arguments));
    }

    /**
  * This method returns the global options.  The response is a struct. Its keys are the names of options.  Values are strings. Note that this method does not return options which have no default value and have not been set on the command-line, in configuration files or RPC methods. Because global options are used as a template for the options of newly added downloads, the response contains keys returned by the aria2.getOption() method.
  */
    getGlobalOption(): Promise<AllOption> {
      return this.methodSend('aria2.getGlobalOption', Array.from(arguments));
    }

    /**
  * This method changes global options dynamically.  options is a struct. The following options are available:
  */
    changeGlobalOption(options: AllOption): Promise<AllOption> {
      return this.methodSend('aria2.changeGlobalOption', Array.from(arguments));
    }

    /**
  * This method returns global statistics such as the overall download and upload speeds. The response is a struct and contains the following keys. Values are strings.
  */
    getGlobalStat(): Promise<ResponseGetGlobalStat> {
      return this.methodSend('aria2.getGlobalStat', Array.from(arguments));
    }

    /**
  * This method purges completed/error/removed downloads to free memory. This method returns OK.
  */
    purgeDownloadResult(): Promise<'OK'> {
      return this.methodSend('aria2.purgeDownloadResult', Array.from(arguments));
    }

    /**
  * This method removes a completed/error/removed download denoted by gid from memory. This method returns OK for success.
  */
    removeDownloadResult(gid: string): Promise<'OK'> {
      return this.methodSend('aria2.removeDownloadResult', Array.from(arguments));
    }

    /**
  * This method returns the version of aria2 and the list of enabled features. The response is a struct and contains following keys.
  */
    getVersion(): Promise<ResponseGetVersion> {
      return this.methodSend('aria2.getVersion', Array.from(arguments));
    }

    /**
  * This method returns session information. The response is a struct and contains following key.
  */
    getSessionInfo(): Promise<ResponseGetSessionInfo> {
      return this.methodSend('aria2.getSessionInfo', Array.from(arguments));
    }

    /**
  * This method shuts down aria2.  This method returns OK.
  */
    shutdown(): Promise<'OK'> {
      return this.methodSend('aria2.shutdown', Array.from(arguments));
    }

    /**
  * This method shuts down aria2(). This method behaves like :func:'aria2.shutdown` without performing any actions which take time, such as contacting BitTorrent trackers to unregister downloads first. This method returns OK.
  */
    forceShutdown(): Promise<'OK'> {
      return this.methodSend('aria2.forceShutdown', Array.from(arguments));
    }

    /**
  * This method saves the current session to a file specified by the --save-session option. This method returns OK if it succeeds.
  */
    saveSession(): Promise<'OK'> {
      return this.methodSend('aria2.saveSession', Array.from(arguments));
    }

    /**
  * This methods encapsulates multiple method calls in a single request. methods is an array of structs.  The structs contain two keys: methodName and params.  methodName is the method name to call and params is array containing parameters to the method call.  This method returns an array of responses.  The elements will be either a one-item array containing the return value of the method call or a struct of fault element if an encapsulated method call fails.
  */
    multicall(): Promise<any> {
      return this.methodSend('system.multicall', Array.from(arguments));
    }

    /**
  * This method returns all the available RPC methods in an array of string.  Unlike other methods, this method does not require secret token.  This is safe because this method just returns the available method names.
  */
    listMethods(): Promise<string[]> {
      return this.methodSend('system.listMethods', Array.from(arguments));
    }

    /**
  * This method returns all the available RPC notifications in an array of string.  Unlike other methods, this method does not require secret token.  This is safe because this method just returns the available notifications names.
  */
    listNotifications(): Promise<string[]> {
      return this.methodSend('system.listNotifications', Array.from(arguments));
    }

  // #end methods
}
