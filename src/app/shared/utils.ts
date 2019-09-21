import { Moment, isMoment, isDate } from "moment";
import * as moment from 'moment';

/**
 *  日期格式转换
 * @param date 需转换的日期参数，支持 Date | Moment | string | number 四种类型
 * @param format 可选，转换格式，默认值'YYYY-MM-DD'，支持各种格式类型，如YYYYMMDDHHmmss、YYYYMMDD、MM、DD、YYYY、
 */
export function dateFormat(date: Date | Moment | string | number, format?: string) {
    format = format ? format : 'YYYY-MM-DD';
    if (isMoment(date)) {
        return date.format(format);
    } else if (isDate(date)) {
        return moment(date).format(format);
    } else if (typeof date === 'string') {
        return moment(new Date(date.replace(/-/g, '/'))).format(format);
    } else if (typeof date === 'number') {
        return moment(new Date(date)).format(format);
    }
}

/**
 * 判断value是否为undefined或者null
 * @param value  
 */
export function isNotNil(value: undefined | null | string | number | boolean): boolean {
    return (typeof (value) !== 'undefined') && value !== null;
}

/**
 * 处理服务费用格式，array 2 object
 * eg:
 * fees=[{feeType: "tranSportFee", feeTypeName: "运输费", amount: 13.1},{feeType: "tFee", feeTypeName: "运输费2", amount: 12.1}];
 * return {"tranSportFee":13.1,"tFee":12.1}
 */
export function zipFee(fees: Array<any>) {
    let feeTypes = _.map(fees, 'feeType');
    let amounts = _.map(fees, 'amount');
    let fData = [];
    amounts.forEach(d => {
        let item = isNaN(Number(d)) ? '计算出错' : Number(d);
        fData.push(item);
    });
    return _.zipObject(feeTypes, fData);
}

/**
 * 处理服务费用格式，object 2 array
 * eg:
 * fees={"tranSportFee":13.1,"tFee":12.1}
 * return [{feeType: "tranSportFee",  amount: 13.1},{feeType: "tFee", amount: 12.1}];
 */
export function unZipFee(feeObj: Object) {
    let result = [];
    for (const key in feeObj) {
        result.push({
            feeType: key,
            amount: feeObj[key]
        });
    }
    return result;
}
