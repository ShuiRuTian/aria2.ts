# Aria2.ts
rich function helper to use aria2 in js

## Need to do

[] websocket supported

[] returned type

[] encrypt RPC traffic with SSL/TLS supported

[] Options in methods might not be all, some options could not be used.

[] notification event response.

## Functions
- install aria2 according to your platform.
- ability to use JSON-RPC with running aria2 easily

## Getting started
### Inatall aria2 bin
you can install aria2 through any one from following ways:

- (offical site)[https://github.com/aria2/aria2/releases]
- package manager If you are using linux, such as `pacman S aria2` in `arch linux`

### Open aria2 with rpc enabled

``` shell
aria2c --enable-rpc
```

## useage

### Rpc

#### Basic

create client

``` typescript
// dedault endpoint is http://localhost:6800/jsonrpc
var tmpClient = new JsonRpcClient();
```

##### Aria2 Rpc Methods

There are total 36 methods in aria2 rpc methods, such as `aria2.addUri`, `aria2.getOption`, `system.listMethods`. 

when you want to call these methods, you might have two wanys(only one is supported for now):
- omit the prefix, and call through client directly, all parameters have types. For example:

``` typescript
await res = tmpClient.addUri(['https://github.com/aria2/aria2/releases/download/release-1.35.0/aria2-1.35.0-aarch64-linux-android-build1.zip'], { dir: './' }, 2)
```

- or you might want to use something like follows, and , and allparameters do not have types.
``` typescript
tmpClient.send("addUri", [XX], YY)
```

## some scripts to produce JSONRPC methods and Options 
Almost all comments are from aria2 offical site, and I use two scripts to produce code.

1. produce Options -- produce options.js
2. produce methods -- produce jsonrpc methods.js

Just go to the web, and press F12, copy code and run them in the console. Then you could see the code.

However, some modification are still needed.
these script still need to improved.


## thanks
- Inspired by aria2.js
- use download code from @electron/get