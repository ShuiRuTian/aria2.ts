//https://aria2.github.io/manual/en/html/aria2c.html
var FunctionTrees = document.querySelectorAll("#methods .function");
var methodArray = [];
FunctionTrees.forEach((FunctionTree) => {
    const methodName = FunctionTree.querySelector("dt").id;
    const description = FunctionTree.querySelector("dd p").textContent.replace(/\n/g,' ');
    const methodInformation = [];

    methodInformation.push("/**");
    methodInformation.push("* " + description);
    methodInformation.push("*/");

    methodInformation.push(methodName.split('.').pop() + "(){");
    methodInformation.push(`return this._methodSend("${methodName}");`);
    methodInformation.push("}");

    methodArray.push(methodInformation.join("\n"));
    console.log(methodArray.join("\n"));
})


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




    