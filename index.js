import {promisePool} from "./main.js";
import { createWriteStream } from "node:fs";
import { mkdir } from "node:fs/promises";
import { pipeline } from "node:stream/promises";

const a=[];

const saveDir="./";

let tasks=a.map(item=>async()=>{
    const url=item.url;
    const response=await fetch(url);
    if(response.ok){
        await mkdir(saveDir,{recursive:true});
        await pipeline(response.body,createWriteStream(saveDir+"/"+url.split("/").at(-1)));
    }else{
        throw new Error(`fetch ${url} failed with status ${response.status}`);
    }
});

const result=await promisePool(tasks,3);
console.log(result.filter(item=>item.status==="failed"));

