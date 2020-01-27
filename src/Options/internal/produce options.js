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
        classInformation.push(optionProp+'?: '+optionValue+';');
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

//  help[: =<TAG>|<KEYWORD>];              help: "#basic"| "#advanced"| "#http"| "#https"| "#ftp"| "#metalink"| "#bittorrent"| "#cookie"| "#hook"| "#file"| "#rpc"| "#checksum"| "#experimental"| "#deprecated"| "#help"| "#all"
//  checksum: =<TYPE>DIGEST;                checksum: string;
//  stream_piece_selector: SELECTOR;            stream_piece_selector: "default"|"inorder"|"random"|"geom";
//                                      uri_selector: "inorder"| "feedback" | "adaptive";

/**
 * Or you can replace regular expression by using VsCode!
 * (interface.*)-(.*\{)     =>      $1_$2       repeat 4 times
 * -(.*;)    =>     _$1         repeat 7 times.
 * _    =>   
 * =<(\w*)>;     =>  $1;
 * \[true\|false\];      =>      boolean;
 */