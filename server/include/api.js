import fileDirName from "./file-dir-name.js";
import _ from 'lodash'
import fs from 'fs'
import path from 'path';
import { json } from "express";
import moment from "moment/moment.js";

// import * as FilterConverter from "./filter-parser/index.js";
import * as FilterConverter from 'kendo-filter-string-parser';

const {__dirname, __filename} = fileDirName(import.meta);
const jsonFilePath=path.join(__dirname,'../public/json/');



export const getData=(req, res) => {
    const {method,query,body}=req;
    console.log(`method=${method},query=${JSON.stringify(query,null,4)},body=${JSON.stringify(body,null,4)}`);

    const {page,pageSize,filter,sort}=method==="GET"?query:body;
    
    const filterFn=FilterConverter.toLodashFn(filter);
    

    console.log(filterFn);
    const take=parseInt(pageSize);
    const skip= (parseInt(page) - 1 ) * pageSize;

    const jsonfile = `${jsonFilePath}data/_data.json`;
    
    let result={data:[],total:0};
    try {
        const buffer = fs.readFileSync(jsonfile);
        let data=JSON.parse(buffer.toString());
        let startDate=moment();
        _(data).forEach((d,i)=>{
            if(!_.get(d,'FirstOrderedOn')){
                
                let date =startDate.add(i,'days').format('MM/DD/YYYY')
                _.set(d,'FirstOrderedOn',date)
            }
        });
        if(_.isFunction(filterFn)){
            data=_(data).filter(x=>filterFn(x,moment)).value();
        }
        if(sort){
            const [fields,orders]=sort.split('-')
            data=_.orderBy(data,[fields],[orders]);
        }
        result={total:data.length,data:data.slice(skip,take+skip)};

    } catch (e) {
        console.error('here-----------'+e.message);
    }
    res.setHeader('Content-Type', 'application/json');
    res.send(result);
};