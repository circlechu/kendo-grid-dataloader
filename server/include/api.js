import fileDirName from "./file-dir-name.js";
import _ from 'lodash'
import fs from 'fs'
import path from 'path';

const {__dirname, __filename} = fileDirName(import.meta);
const jsonFilePath=path.join(__dirname,'../public/json/');

export const getData=(req, res) => {
    
    const {page,pageSize}=req.query;
    
    const take=parseInt(pageSize);
    const skip= (parseInt(page) - 1 ) * pageSize;

    const jsonfile = `${jsonFilePath}data/_data.json`;
    
    let result={data:[],total:0};
    try {
        const buffer = fs.readFileSync(jsonfile);
        const data=JSON.parse(buffer.toString());
        result={total:data.length,data:data.slice(skip,take+skip)};

    } catch (e) {
        console.error(e.message);
    }
    res.setHeader('Content-Type', 'application/json');
    res.send(result);
};