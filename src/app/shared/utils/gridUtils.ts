import { ENUM_FIELD } from './../../config/Enum';
import { API_BASE_URL, TOKEN_KEY } from "app/config/config";
/**
 * 表格方法
 */
import { NzNotificationService } from "ng-zorro-antd";
declare var $;

/**
 * 配合 query-condition-list 组件使用
 * 解决问题：枚举翻译，查询条件值自动根据queryField更新
 * @param conditions query-condition-list 组件的input值
 * @param queryField 查询参数对象
 */
const REG_LETTER = /^[a-zA-Z_]+$/
export function seachConditionHandle(conditions: any[] = [], queryField) {
    let result = [];
    conditions.forEach(item => {
        let value = queryField[item.field];
        let obj = {
            label: item.label,
            field: item.field,
            value: value
        };
        // ALL枚举全部不应该显示
        if (queryField.hasOwnProperty(item.field) && value && value !== 'ALL') {
            if (REG_LETTER.test(value) && ENUM_FIELD.hasOwnProperty(value)) {
                obj.value = ENUM_FIELD[value] || '枚举未维护';
                result.push(obj)
                return;
            }
            obj['value'] = value;
        }
        result.push(obj)
    });
    return result;
}


export function getRecordById(data: any[] = [], id: string) {
    let result = data.filter(row => {
        return row._id === id
    });

    return result[0];
}

export function printFn(endpoint: string, params, msgServer: NzNotificationService, url) {
    // 目前仅支持打印运单和标签，先写死localstorage名字
    const storageName = endpoint.indexOf('printWaybillLabel') === -1 ? 'print_sign_order' : 'print_sign_label';
    $.ajax({
        type: "POST",
        url: API_BASE_URL + endpoint,
        data: JSON.stringify([params]),
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        beforeSend: function (request) {
            request.setRequestHeader(
                "Authorization",
                "Bearer " + JSON.parse(sessionStorage.getItem(TOKEN_KEY)).value
            );
        },
        success: function (json) {
            if (json.resultCode === "200") {
                localStorage.removeItem(storageName);
                localStorage.setItem(storageName, JSON.stringify(json.content));
                window.open(window.location.protocol + '//' + window.location.host + `/iframe/print/${url}`);
            } else {
                msgServer.create('error', '错误提示', json.msg || json.error || '服务异常', { nzDuration: 4000 });
            }
        },
        error: function (jqXHR, textStatus, errorMsg) {
            msgServer.create('error', '错误提示', jqXHR.msg || jqXHR.error || '服务异常', { nzDuration: 4000 });
        }
    });
}

export function printFnTask(endpoint, params, msgServer: NzNotificationService, url) {
    $.ajax({
        type: "POST",
        url: API_BASE_URL + endpoint,
        data: JSON.stringify([params]),
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        beforeSend: function (request) {
            request.setRequestHeader(
                "Authorization",
                "Bearer " + JSON.parse(sessionStorage.getItem(TOKEN_KEY)).value
            );
        },
        success: function (json) {
            if (json.resultCode === "200") {
                localStorage.removeItem('print_sign_response');
                localStorage.setItem('print_sign_response', JSON.stringify(json.content));
                window.open(window.location.protocol + '//' + window.location.host + `/iframe/print/${url}`);
            } else {
                msgServer.create('error', '错误提示', json.msg || json.error || '服务异常', { nzDuration: 4000 });
            }
        },
        error: function (jqXHR, textStatus, errorMsg) {
            msgServer.create('error', '错误提示', jqXHR.msg || jqXHR.error || '服务异常', { nzDuration: 4000 });
        }
    });
}
