import {readdir,writeFile} from "node:fs/promises";

const targetDir="./";

const files=await readdir(targetDir);
files.sort((a,b)=>{
    if(a.length===b.length){
        return a>b?1:-1;
    }else{
        return a.length-b.length;
    }
});

await writeFile(targetDir+"/images.txt",files.join("\n"),"utf8");
