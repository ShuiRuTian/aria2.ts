//https://aria2.github.io/manual/en/html/aria2c.html

var FunctionTrees = document.querySelectorAll("#options .section");
var methodArray = [];
FunctionTrees.forEach((OptionTree)=>{
    let classInformation = [];
    let className = OptionTree.id;
    className = `export interface ${className} {`;
    classInformation.push(className);
    var OptionLeaves = OptionTree.querySelectorAll(".option");
    OptionLeaves.forEach((optionleaf)=>{
        let optionProp = Array.from(optionleaf.querySelectorAll(".descname")).pop().textContent;
        let optionValue = Array.from(optionleaf.querySelectorAll(".descclassname")).pop().textContent;
        let optionComment = optionleaf.querySelector("dd").textContent;
        let optionCommentArray = optionComment.split("\n\n");
        optionCommentArray = optionCommentArray.map((oc)=>oc.replace(/\n/g,' ')).filter((a)=>a.length!=0);
        classInformation.push("/**");
        classInformation.push("* "+optionValue);
        classInformation.push("*");
        optionCommentArray.forEach((comment)=>{        
            classInformation.push("* "+comment);
        });
        classInformation.push("*/");
        // need to add char ', so char - could be supported directly. 
        classInformation.push(`'${optionProp}'?: ${optionValue};`);
    });
    classInformation.push("\}");
    methodArray.push(classInformation.join("\n"));
})

var FinalString = methodArray.join('\n');
FinalString = FinalString.replace(/(interface.*)-(.*\{)/g, "$1_$2")
FinalString = FinalString.replace(/(interface.*)-(.*\{)/g, "$1_$2")
FinalString = FinalString.replace(/(interface.*)-(.*\{)/g, "$1_$2")
FinalString = FinalString.replace(/(interface.*)-(.*\{)/g, "$1_$2")
FinalString = FinalString.replace(/--/g, "")
FinalString = FinalString.replace(/=<(\w*)>;/g, "$1;")
FinalString = FinalString.replace(/\[true\|false\];/g, "boolean;")


// deal with some specail case
FinalString = FinalString.replace(/'help\['\?: =<TAG>\|<KEYWORD>\];/, "help?: '#basic'| '#advanced'| '#http'| '#https'| '#ftp'| '#metalink'| '#bittorrent'| '#cookie'| '#hook'| '#file'| '#rpc'| '#checksum'| '#experimental'| '#deprecated'| '#help'| '#all';")

FinalString = FinalString.replace(/'checksum'\?: =<TYPE>DIGEST;/, "'checksum'?: string;")
FinalString = FinalString.replace(/'stream-piece-selector'\?: SELECTOR;/, "'stream-piece-selector'?: 'default'|'inorder'|'random'|'geom';")
FinalString = FinalString.replace(/'uri-selector'\?: SELECTOR;/, "'uri-selector'?: 'inorder'| 'feedback' | 'adaptive';")
FinalString = FinalString.replace(/'ssh-host-key-md'\?: =<TYPE>DIGEST;/, "'ssh-host-key-md'?: string;")

FinalString = FinalString.replace(/'select-file'\?: =<INDEX>...;/, "'select-file'?: string;")
FinalString = FinalString.replace(/'bt-exclude-tracker'\?: =<URI>\[,...\];/, "'bt-exclude-tracker'?: string")
FinalString = FinalString.replace(/'bt-min-crypto-level'\?: =plain\|arc4;/, "'bt-min-crypto-level'?: 'plain'|'arc4';")
FinalString = FinalString.replace(/'bt-prioritize-piece'\?: =head\[=<SIZE>\],tail\[=<SIZE>\];/, "'bt-prioritize-piece'?: string;")
FinalString = FinalString.replace(/'follow-metalink'\?: =true\|false\|mem;/, "'follow-metalink'?: true|false|'mem';")

FinalString = FinalString.replace(/'metalink-location'\?: =<LOCATION>\[,...\];/, "'metalink-location'?: string;")
FinalString = FinalString.replace(/'async-dns-server'\?: =<IPADDRESS>\[,...\];/, "'async-dns-server'?: string")
FinalString = FinalString.replace(/'optimize-concurrent-downloads'\?:  \[true\|false\|<A>:<B>\];/, "'optimize-concurrent-downloads'?:  true|false|string;")
FinalString = FinalString.replace(/'bt-tracker'\?: =<URI>\[,...\];/, "'bt-tracker'?: string;")
FinalString = FinalString.replace(/'dht-entry-point'\?: =<HOST>:<PORT>;/, "'dht-entry-point'?: string;")
FinalString = FinalString.replace(/'dht-entry-point6'\?: =<HOST>:<PORT>;/, "'dht-entry-point6'?: string;")
FinalString = FinalString.replace(/'dht-listen-port'\?: =<PORT>...;/, "'dht-listen-port'?: string;")
FinalString = FinalString.replace(/'index-out'\?: =<INDEX>PATH;/, "'index-out'?: string;")
FinalString = FinalString.replace(/'listen-port'\?: =<PORT>...;/, "'listen-port'?: string;")
FinalString = FinalString.replace(/'follow-torrent'\?: =true\|false\|mem;/, "'follow-torrent'?: true|false|'mem';")
