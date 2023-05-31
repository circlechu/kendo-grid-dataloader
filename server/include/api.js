import fileDirName from "./file-dir-name.js";
import _ from 'lodash'
import fs from 'fs'
import path from 'path';
import { json } from "express";

const {__dirname, __filename} = fileDirName(import.meta);
const jsonFilePath=path.join(__dirname,'../public/json/');


export const getData=(req, res) => {
    const {method,query,body}=req;
    console.log(`method=${method},query=${JSON.stringify(query,null,4)},body=${JSON.stringify(body,null,4)}`);

    const {page,pageSize,filter,sort}=method==="GET"?query:body;
    
    const take=parseInt(pageSize);
    const skip= (parseInt(page) - 1 ) * pageSize;

    const jsonfile = `${jsonFilePath}data/_data.json`;
    
    let result={data:[],total:0};
    try {
        const buffer = fs.readFileSync(jsonfile);
        let data=JSON.parse(buffer.toString());
       
        result={total:data.length,data:data.slice(skip,take+skip)};

    } catch (e) {
        console.error(e.message);
    }
    res.setHeader('Content-Type', 'application/json');
    res.send(result);
};