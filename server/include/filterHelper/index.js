import _ from 'lodash';

const opMap = {
    "lt": arr => {
        const [field,op,value]=arr;
        return `x.${field} < ${value}`
    },
    "lte": arr => {
        const [field,op,value]=arr;
        return `x.${field} <= ${value}`
    },
    "gt": arr => {
        const [field,op,value]=arr;
        return `x.${field} > ${value}`
    },
    "gte": arr => {
        const [field,op,value]=arr;
        return `x.${field} >= ${value}`
    },
    "eq": arr => {
        const [field,op,value]=arr;
        return `x.${field} == ${value}`
    },
    "neq": arr => {
        const [field,op,value]=arr;
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