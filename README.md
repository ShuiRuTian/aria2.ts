# Thanks to user, feel free to open issues!

# Aria2.ts
TavaScript library for aria2.

- [aria2.ts](#Aria2.ts)
  - [Motivation](#motivation)
  - [Need to do](#need-to-do)
  - [Introduction](#introMduction)
  - [Getting started](#getting-started)
  - [Usage](#usage)
    - [aria2](#Aria2)
      - [How to resume download](#How-to-resume-download)
    - [Rpc](#Rpc)
      - [Create Client](#Create-client)
      - [Aria2 Rpc Methods](#Aria2-Rpc-Methods)
      - [Webscoket event and Notifications](#Webscoket-event-and-Notifications)
  - [Contribution](#Contribution)
    - [produce JSONRPC methods and Options](#produce-JSONRPC-methods-and-Options)
    - [About tests](#About-tests)
    - [websocket event to promise](#websocket-event-to-promise)

  - [thanks](#thanks)

## motivation
Although there have been some lib or implement for aria2 in javascript and typescript.
For lib, there are :
- [aria2.js](https://github.com/sonnyp/aria2.js/)
- [aria2c](https://github.com/song940/aria2c)
- [aria2rpc](https://github.com/pboymt/aria2rpc)

For other implement, often they are electron or web wrapper of aria2:
- [electron-aria2](https://jack9966qk.github.io/electron-aria2/) 
- [aria2ui](https://github.com/znetstar/aria2ui) 
- [ariaNg](https://github.com/mayswind/AriaNg)

aria2.js might be the best in libs. It provide a general method `call` and some specificed methods. 

However, there are still some flaws:
- aria2 provides about 36 methods, but aria2.js only have 4 in them.
- No type check and intellisense. When I use `call`, I have no idea about any method provided by aria2 and I could input any string rather than defined by aria2, such as `aria2.call("addUri123", [magnet], { dir: "/tmp" });`, only when running I could know the issue.
- No comment for methods, I have to check the offical docuemnt to know how to use them. OK, this is not an issue, just little annoying.

## Need to do

[x] notification event response.

[x] websocket supported
    - what should we do to switch http and websocket? Through one method or change url directly? 

[x] returned type
    - However, options parameter might not be right

[] encrypt RPC traffic with SSL/TLS supported

[] Options in methods might not be all, some options could not be used.

## Introduction
- install aria2 according to your platform.
- ability to use JSON-RPC with running aria2 easily

## Getting started
### Inatall aria2 bin
you can install aria2 through any one from following ways:

- [offical site](https://github.com/aria2/aria2/releases)
- package manager If you are using linux, such as `pacman S aria2` in `arch linux`

### Open aria2 with rpc enabled

``` shell
aria2c --enable-rpc
```

## useage
### Aria2
Here I will give some usefule advice for how to use aria2(at least for myself). [Offical document](https://aria2.github.io/manual/en/html/aria2c.html) is always much more recommanded.

#### How to resume download
Just download again. Aria would continur its job! At least three ways:
- through cli(binary). 

``` bash
aria2c 'https://github.com/aria2/aria2/releases/download/release-1.35.0/aria2-1.35.0-aarch64-linux-android-build1.zip'
# some thing happeds, maybe you stop it or aria2 shut down, anyway, downloading is stopped.
aria2c 'https://github.com/aria2/aria2/releases/download/release-1.35.0/aria2-1.35.0-aarch64-linux-android-build1.zip'
```

- through rpc method `adduri`.

``` typescript
await res = tmpClient.addUri(['https://github.com/aria2/aria2/releases/download/release-1.35.0/aria2-1.35.0-aarch64-linux-android-build1.zip'])
# some thing happeds, maybe you stop it or aria2 shut down, anyway, downloading is stopped.
await res = tmpClient.addUri(['https://github.com/aria2/aria2/releases/download/release-1.35.0/aria2-1.35.0-aarch64-linux-android-build1.zip'])
```

- through rpc method `unpause`. When downloading one resource, aria2 will return a gid, unpause could use this gid to restart download. However, if you restart aria2 bin, there are more things to be discussed:
    - If you set options to save session(--save-session), aria2 could start with this session and you could restart by using these messages.
        - you could use --save-session-interval to save automatically every XX seconds.
        - you could set --input-file as the same with --save-session to restart download automatically.
    - If not, you just could use these ways.

```typescript
await res = tmpClient.addUri(['https://github.com/aria2/aria2/releases/download/release-1.35.0/aria2-1.35.0-aarch64-linux-android-build1.zip'])
let gid = await res.json().result;
// some thing happeds, maybe you stop it or aria2 shut down, anyway, downloading is stopped.
await res = tmpClient.unpause(gid);
```

### Rpc

#### Create client

1. default url
2. http url
3. websocket url

``` typescript
// dedault endpoint is http://localhost:6800/jsonrpc
var defaultClient = new JsonRpcClient();
var httpClient = new JsonRpcClient('http://localhost:6800/jsonrpc');
var websocketClient = new JsonRpcClient('ws://localhost:6800/jsonrpc');
```

secure is not supported for temp.

##### Aria2 Rpc Methods

There are total 36 methods in aria2 rpc methods, such as `aria2.addUri`, `aria2.getOption`, `system.listMethods`. 

You can learn more on [Aria2 document](https://aria2.github.io/manual/en/html/aria2c.html?highlight=json#methods). The parameter type imitates the document.

Just call through client directly, all parameters(but not response, for now) have types. For example:

``` typescript
await res = tmpClient.addUri(['https://github.com/aria2/aria2/releases/download/release-1.35.0/aria2-1.35.0-aarch64-linux-android-build1.zip'], { dir: './' }, 2)
```

##### Webscoket event
websocket could add event listener : 'close', 'error', 'message', 'open'.
> thanks to typescript, you could only input these types, and there would be intellisense
You could add them by following code:

``` ts
  client.addEventListenerForWebSocket('message', ({ data }) => {
    console.log(data);
  });
```

#### Notification
Aria2 provides some notifications: 'aria2.onDownloadStart','aria2.onDownloadPause','aria2.onDownloadStop','aria2.onDownloadComplete','aria2.onDownloadError','aria2.onBtDownloadComplete'.
> thanks to typescript, you could only input these types, and there would be intellisense
> In low level, these are some specail case for 'message' event.
you could add them by following code:
``` ts
  client.notification('aria2.onDownloadStop', (res) => {
    console.log('stop');
    console.log(res.gid);
  });
```

## Contribution

### produce JSONRPC methods and Options 
Almost all comments are from aria2 offical site, and I use two scripts to produce code.

1. produce Options -- produce options.js
2. produce methods -- produce jsonrpc methods.js

Just go to the web, and press F12, copy code and run them in the console. Then you could see the code.

However, some modification are still needed.
these script still need to improved.

### About tests
No, there is not any real test that you expect. 

For now, I use them manually to check whether function behaves as expected. But I clean the side effects(if any) by myself.

### websocket event to promise
To hide low level, we wish to use like follows, no matter client is ws or fetch or something else.
``` ts
res = await client.method();
```
However, websocket use eventlistener, which is necessary for it could not expect request returns in order.
So, we need a convention to recognise message pair. For aria2 this is a property called 'id', but generally, it may be something like `sendMessage.recogniseResponseId()`, `receivedMessage.getId()`, the returned values should be the same and unique(bijection, so there will only be one pair for one sentMessage and one receivedMessage)
Then we need two function to judge when to mark Promise as resolved or rejected, like `receivedMessage.success()` and `receiveMessage.fail()` 

Finally we could code:
``` ts
const websocket = new WebSocket('url');
let defferTask={};
websocket.addEventListener('message',(receivedMessage)=>{
    b = receivedMessage.getId()
    if(defferedTask[b]) == undefined throw new Error("this task not existed.")
    if(receivedMessage.success())
    defferedTask[b].resolvePromise(receivedMessage);
    else if(receiveMessage.fail())
    defferedTask[b].rejectPromise("some error")
    else defferedTask[b].rejectPromise("strange error")
})

function send(message){
  let websocket;
  websocket.send('message');
  return new Promise((resolve,reject)=>{
    a = sendMessage.recogniseResponseId()
    defferedTask[a]={
      resolvePromise:(para)=>{
        resolve(para);
      },
      rejectPromise:(para)=>{
        reject(para);
      }
    }
  });
}
```

## thanks
- Inspired by [aria2.js](https://aria2.github.io/)
- use download code from @electron/get
