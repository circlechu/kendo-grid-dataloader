import _ from 'lodash';
import moment from 'moment';

const opMap = {
    "lt": arr => {
        let [field,op,value]=arr;
        if(value.includes('datetime')){
            value=value.replace(/'|datetime/g,'');
            return `moment(new Date(x.${field}),'YYYY-MM-DD').isBefore(moment('${value}','YYYY-MM-DD'),'day');`;
        }
        return `x.${field} < ${value}`
    },
    "lte": arr => {
        let [field,op,value]=arr;
        if(value.includes('datetime')){
            value=value.replace(/'|datetime/g,'');
            return `moment(new Date(x.${field}),'YYYY-MM-DD').isSameOrBefore(moment('${value}','YYYY-MM-DD'),'day');`;
        }
        return `x.${field} <= ${value}`
    },
    "gt": arr => {
        let [field,op,value]=arr;
        if(value.includes('datetime')){
            value=value.replace(/'|datetime/g,'');
            return `moment(new Date(x.${field}),'YYYY-MM-DD').isAfter(moment('${value}','YYYY-MM-DD'),'day');`;
        }
        return `x.${field} > ${value}`
    },
    "gte": arr => {
        let [field,op,value]=arr;
        if(value.includes('datetime')){
            value=value.replace(/'|datetime/g,'');
            return `moment(new Date(x.${field}),'YYYY-MM-DD').isSameOrAfter(moment('${value}','YYYY-MM-DD'),'day');`;
        }
         
        return `x.${field} >= ${value}`
    },
    "eq": arr => {
        let [field,op,value]=arr;
        if(value.includes('datetime')){
            value=value.replace(/'|datetime/g,'');
            return `moment(new Date(x.${field}),'YYYY-MM-DD').isSame(moment('${value}','YYYY-MM-DD'),'day');`;
        }
        return `x.${field} == ${value}`
    },
    "neq": arr => {
        let [field,op,value]=arr;
        if(value.includes('datetime')){
            value=value.replace(/'|datetime/g,'');
            return `!moment(new Date(x.${field}),'YYYY-MM-DD').isSame(moment('${value}','YYYY-MM-DD'),'day');`;
        }
        return `x.${field} != ${value}`
    },
    "startswith": arr => {
        let [field,op,value]=arr;
        value=value.replace(/\'/gi,"");
        return `/^${value}/gi.test(x.${field})`;
    },
    "endswith": arr => {
        let [field,op,value]=arr;
        value=value.replace(/\'/gi,"");
        return `/${value}$/gi.test(x.${field})`;
    },
    "contains": arr => {
        let [field,op,value]=arr;
        value=value.replace(/\'/gi,"");
        return `/${value}/gi.test(x.${field})`;
    },
    "doesnotcontain": arr => {
        let [field,op,value]=arr;
        value=value.replace(/\'/gi,"");
        return `!/${value}/gi.test(x.${field})`;
    },
    "isnull":arr => {
        let [field,op,value]=arr;
        return `_.isNull(x.${field})`;
    },
    "isnotnull":arr => {
        let [field,op,value]=arr;
        return `!_.isNull(x.${field})`;
    },
    "isempty":arr => {
        let [field,op,value]=arr;
        return `_.isEmpty(x.${field})`;
    },
    "isnotempty":arr => {
        let [field,op,value]=arr;
        return `!_.isEmpty(x.${field})`;
    },
};


const parseFitlerStr = str => {
    try {
        if(typeof(str)=="undefined" || str.includes('undefined')) return null;
        let query="";
        // var rx1 = /\[([^\]]+)]/;
        var rx2 = /\(([^)]+)\)/;
        // var rx3 = /{([^}]+)}/;

        const breakpoint = '~and~';

        let found = str.match(rx2);
        if(!found){
            const tmp=str.split('~');
            query=_.invoke(opMap, tmp[1], tmp);
        }else{
            const splitted = found[1].split(breakpoint);

            query = _(splitted).map(el => {

                const tmp = el.split('~');
                return _.invoke(opMap, tmp[1], tmp);
            }).join(" && ");

        }
        
        return eval(`x=>{
            return ${query}
        }`);
    } catch (e) {
        console.warn(e);
        return null;
    }

};

export default parseFitlerStr;