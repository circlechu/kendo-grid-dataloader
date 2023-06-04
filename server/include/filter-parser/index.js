import moment from "moment";
import _ from 'lodash';

const toSQL = (filter) => { // 替换~为相应的操作符
    if(typeof(filter)==="undefined") return null;
    filter = filter.replace(/~eq~/g, ' = ');
    filter = filter.replace(/~neq~/g, ' <> ');
    filter = filter.replace(/~gt~/g, ' > ');
    filter = filter.replace(/~gte~/g, ' >= ');
    filter = filter.replace(/~lt~/g, ' < ');
    filter = filter.replace(/~lte~/g, ' <= ');
    filter = filter.replace(/~and~/g, ' AND ');
    filter = filter.replace(/~or~/g, ' OR ');


    // 在LIKE操作符后添加通配符%
    filter = filter.replace(/~startswith~'([^']+)'/gi, " LIKE '$1%'");
    filter = filter.replace(/~contains~'([^']+)'/gi, " LIKE '%$1%'");

    // datetime type
    filter = filter.replace(/datetime'([^']+)'/gi, (text,s1)=>{
        return `'${moment(s1,'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss')}'`;
    });

    // 匹配最内层的括号表达式
    const regex = /\(([^()]+)\)/g;

    // 递归函数，将括号表达式转换为SQL查询
    function convertExpressionToSQL(expression) {
        return expression.replace(regex, (match, innerExpression) => {
            const sql = convertExpressionToSQL(innerExpression);
            return `(${sql})`;
        });
    }

    return convertExpressionToSQL(filter);
}

const toLodash = (filter) => { 
    if(typeof(filter)==="undefined") return null;
    // 替换~为相应的操作符
    // datetime type


    filter = filter.replace(/([^(~)]+)~lt~datetime'([^']+)'/gi, (text,field,value)=>{
        return `moment(new Date(x.${field}),'YYYY-MM-DD').isBefore(moment('${value}','YYYY-MM-DD'),'day')`;
    });

    filter = filter.replace(/([^(~)]+)~lte~datetime'([^']+)'/gi, (text,field,value)=>{
        return `moment(new Date(x.${field}),'YYYY-MM-DD').isSameOrBefore(moment('${value}','YYYY-MM-DD'),'day')`;
    });

    filter = filter.replace(/([^(~)]+)~gt~datetime'([^']+)'/gi, (text,field,value)=>{
        return `moment(new Date(x.${field}),'YYYY-MM-DD').isAfter(moment('${value}','YYYY-MM-DD'),'day')`;
    });

    filter = filter.replace(/([^(~)]+)~gte~datetime'([^']+)'/gi, (text,field,value)=>{
        return `moment(new Date(x.${field}),'YYYY-MM-DD').isSameOrAfter(moment('${value}','YYYY-MM-DD'),'day')`;
    });

    filter = filter.replace(/([^(~)]+)~eq~datetime'([^']+)'/gi, (text,field,value)=>{
        // return moment(s1,'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
        return `moment(new Date(x.${field}),'YYYY-MM-DD').isSame(moment('${value}','YYYY-MM-DD'),'day')`;
    });

    filter = filter.replace(/([^(~)]+)~neq~datetime'([^']+)'/gi, (text,field,value)=>{
        return `!moment(new Date(x.${field}),'YYYY-MM-DD').isSame(moment('${value}','YYYY-MM-DD'),'day')`;
    });


    filter = filter.replace(/([^(~)]+)~eq~/g, 'x.$1 === ');
    filter = filter.replace(/([^(~)]+)~neq~/g, 'x.$1 != ');
    filter = filter.replace(/([^(~)]+)~gt~/g, 'x.$1 > ');
    filter = filter.replace(/([^(~)]+)~gte~/g, 'x.$1 >= ');
    filter = filter.replace(/([^(~)]+)~lt~/g, 'x.$1 < ');
    filter = filter.replace(/([^(~)]+)~lte~/g, 'x.$1 <= ');
    filter = filter.replace(/~and~/g, ' && ');
    filter = filter.replace(/~or~/g, ' || ');

    // 匹配startwith和contains
    filter = filter.replace(/([^\s]+)~startswith~'([^']+)'/gi, " /^$2/gi.test(x.$1)");
    filter = filter.replace(/([^\s]+)~contains~'([^']+)'/gi, " /$2/gi.test(x.$1)");
    
    // 匹配最内层的括号表达式
    const regex = /\(([^()]+)\)/g;

    // 递归函数，将括号表达式转换为SQL查询
    function convertExpressionToSQL(expression) {
        return expression.replace(regex, (match, innerExpression) => {
            const query = convertExpressionToSQL(innerExpression);
            return `( ${query} )`;
        });
    }

    return convertExpressionToSQL(filter);
}

const toLodashFn = (filter) => { 
    if(typeof(filter)==="undefined") return null;
    const query=toLodash(filter);
    // return eval(`x=>{
    //     return ${query}
    // }`);
    return new Function('x', 'moment', `return ${query}`);
}
export {
    toSQL,
    toLodash,
    toLodashFn
};
