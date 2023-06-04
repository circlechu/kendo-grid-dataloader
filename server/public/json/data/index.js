import data from './_data.json' assert {type:'json'};
import fs from 'fs';

const now=new Date(2020,0,1);

const newData=data.map((d,i)=>{
    delete d.Order_Details;
    let Y=now.getFullYear();
    let M=now.getMonth();
    let D=now.getDate();
    let h=now.getHours();
    let m=now.getMinutes();
    let s=now.getSeconds();
    
    return {
        ...d,
        FirstOrderedOn: new Date(Y,M,D+i*16,h,m,s).toISOString()
    }

});

console.table(newData);

fs.writeFileSync('data.json',JSON.stringify(newData,null,4));