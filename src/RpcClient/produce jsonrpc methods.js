//https://aria2.github.io/manual/en/html/aria2c.html

namePara={
    'addUri':"uris: string[], options?: AllOption, position?: number",
    'addTorrent':"torrent: string, uris?: string[], options?: AllOption, position?: number",
    'addMetalink':    "metalink:string,options?: AllOption, position?: number",
    'remove':"gid: string",
    'forceRemove' :"gid: string",
    'pause': "gid: string",
    'pauseAll' :"",
    'forcePause':"gid: string",
    'forcePauseAll' :"",
    'unpause' :"gid: string",
    'unpauseAll' :"",
    'tellStatus' :"gid: string, keys?: Array<keyof DownloadStatus>",
    'getUris' :"gid: string",
    'getFiles' :"gid: string",
     'getPeers' :"gid: string",
    'getServers' :"gid: string",
    'tellActive' :"keys?: Array<keyof DownloadStatus>",
    'tellWaiting' :"offset: number, num: number, keys?: Array<keyof DownloadStatus>",
    'tellStopped' :"offset: number, num: number, keys?: Array<keyof DownloadStatus>",
    'changePosition' :"gid: string, pos: number, how:'POS_SET'|'POS_CUR'|'POS_END'",
    'changeUri' :"gid:string, fileIndex:number , delUris:string[] , addUris: string[], position: number",
    'getOption' :"gid:string",
    'changeOption' :"gid:string, options:AllOption",
    'getGlobalOption' :"",
    'changeGlobalOption' :"options:AllOption",
    'getGlobalStat' :"",
    'purgeDownloadResult' :"",
    'removeDownloadResult' :"gid:string",
    'getVersion' :"",
    'getSessionInfo' :"",
    'shutdown' :"",
    'forceShutdown' :"",
    'saveSession' :"",
    'multicall' :"",
    'listMethods' :"",
    'listNotifications':""
}

nameReturnType={
    'addUri':"string",
    'addTorrent':"string",
    'addMetalink':"string",
    'remove':"string",
    'forceRemove' :"string",
    'pause': "string",
    'pauseAll' :"\"OK\"",
    'forcePause':"string",
    'forcePauseAll' :"\"OK\"",
    'unpause' :"string",
    'unpauseAll' :"\"OK\"",
    'tellStatus' :"Partial<DownloadStatus>",
    'getUris' :"ResponseGetUris",
    'getFiles' :"ResponseGetFiles",
    'getPeers' :"ResponseGetPeers",
    'getServers' :"ResponseGetServers",
    'tellActive' :"DownloadStatus",
    'tellWaiting' :"DownloadStatus",
    'tellStopped' :"DownloadStatus",
    'changePosition' :"number",
    'changeUri' :"ResponseChangeUri",
    'getOption' :"AllOption",
    'changeOption' :"\"OK\"",
    'getGlobalOption' :"AllOption",
    'changeGlobalOption' :"AllOption",
    'getGlobalStat' :"ResponseGetGlobalStat",
    'purgeDownloadResult' :"\"OK\"",
    'removeDownloadResult' :"\"OK\"",
    'getVersion' :"ResponseGetVersion",
    'getSessionInfo' :"ResponseGetSessionInfo",
    'shutdown' :"\"OK\"",
    'forceShutdown' :"\"OK\"",
    'saveSession' :"\"OK\"",
    'multicall' :"any",
    'listMethods' :"string[]",
    'listNotifications':"string[]"
}

var FunctionTrees = document.querySelectorAll("#methods .function");
var methodArray = [];
FunctionTrees.forEach((FunctionTree) => {
    const methodName = FunctionTree.querySelector("dt").id;
    const description = FunctionTree.querySelector("dd p").textContent.replace(/\n/g,' ');
    const methodInformation = [];

    methodInformation.push("/**");
    methodInformation.push("* " + description);
    methodInformation.push("*/");
    
    const classMethodName =methodName.split('.').pop();
    methodInformation.push(classMethodName + "(" + namePara[classMethodName] +"): Promise<"+nameReturnType[classMethodName]+">{");
    
    methodInformation.push(`return this.methodSend("${methodName}", Array.from(arguments));`);
    methodInformation.push("}");

    methodArray.push(methodInformation.join("\n"));
})
console.log(methodArray.join("\n"));


    // let classInformation = [];
    // let className = FunctionTree.id;
    // className = `export interface ${className} {`;
    // classInformation.push(className);
    // var OptionLeaves = FunctionTree.querySelectorAll(".option");
    // OptionLeaves.forEach((optionleaf)=>{
    //     let optionProp = Array.from(optionleaf.querySelectorAll(".descname")).pop().textContent;
    //     let optionValue = Array.from(optionleaf.querySelectorAll(".descclassname")).pop().textContent;
    //     let optionComment = optionleaf.querySelector("dd").textContent;
    //     let optionCommentArray = optionComment.split("\n\n");
    //     optionCommentArray = optionCommentArray.map((oc)=>oc.replace(/\n/g,' ')).filter((a)=>a.length!=0);
    //     classInformation.push("/**");
    //     classInformation.push("* "+optionValue);
    //     classInformation.push("*");
    //     optionCommentArray.forEach((comment)=>{        
    //         classInformation.push("* "+comment);
    //     });
    //     classInformation.push("*/");
    //     classInformation.push(optionProp+'?: '+optionValue+';');
    // });




    