# What for
helper to use aria2 in js

## functions

1. install aria2 according to your platform.
2. ability to easy use JSON-RPC with running aria2

## useage

### Rpc
First, you should open your aria2.

Then you could use any rpc methods through RpcClient

``` typescript
// dedault endpoint is http://localhost:6800/jsonrpc
var tmpClient = new JsonRpcClient();

tmpClient.listMethods().then(async (res) => {
    const tmp = await res.json();
    const methodsArray: string[] = tmp.result;
    const resultArray: string[] = [];
    const methodsFunctionArray:  Array<string|undefined> = [];
    methodsArray.forEach((s) => {
        methodsFunctionArray.push(s.split('.').pop());
        resultArray.push(s.split('.').pop() + "(){");
        resultArray.push(`return this._methodSend("${s}");`);
        resultArray.push("}");
    });
    console.log(resultArray.join('\n'));
    console.log(methodsFunctionArray.join("\"|\""))
}).catch((err) => {
    console.log(err);
})

```

## some scripts to produce JSONRPC methods and Options 
1. produce Options -- produce options.js
2. produce methods -- produce jsonrpc methods.js
However, some modification are still needed.
these script still need to improved.

## thanks
Inspired by aria2.js
use download code from @electron/get