import JsonRpcClient from "../src/JsonRpcClient";

var tmpClient = new JsonRpcClient();
tmpClient.send({
    requestInit: {
        body: JSON.stringify({
            'method': 'system.listMethods',
            'id': 'qwer'
        })
    }
}).then(async (res) => {
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
