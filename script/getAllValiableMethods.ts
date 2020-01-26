import JsonRpcClient from "../src/JsonRpcClient";

var tmpClient = new JsonRpcClient();
tmpClient.send({
    requestInit:{
        body:JSON.stringify({
            'method':'system.listMethods',
            'id':'qwer'
        })
    }
}).then(async(res)=>{
    const tmp = await res.json();
    const methodsArray = tmp.result;
    console.log(methodsArray.map((s)=>s.replace('.',"_")));
}).catch((err)=>{
    console.log(err);
})