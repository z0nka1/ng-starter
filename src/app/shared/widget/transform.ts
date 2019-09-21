import { BootStrapDefaultWidgetRegistry } from "@shared/widget/defaultwidget-registry";
import { CheckboxWidget } from "@shared/widget/inputTemplate/checkbox/checkbox.widget";
import { RadioWidget } from "@shared/widget/inputTemplate/radio/radio.widget";
import { StringWidget } from "@shared/widget/inputTemplate/string/string.widget";

export function TransFormStr(str: string) {

    const registry = BootStrapDefaultWidgetRegistry;

    let tempStr = ``;

    let originStr = str || '';

    let arr = originStr.split('$');

    let cloneArr = [...arr];

    arr.forEach((val, index) => {
        let tempArr = [];
        if (val.indexOf('&') !== -1) {
            const name = `tmp-checkbox-${index}`;
            let checkboxArr = [];
            tempArr = val.trim().split('&');
            tempArr.shift();
            tempArr.forEach((temp, i) => {
                checkboxArr.push({ description: temp, name: `tmp-checkbox-${index}-${i}`, enum: temp });
            })
            tempStr += new CheckboxWidget().getTemplate({ type: 'array', name: name, items: { oneOf: checkboxArr } }, 'ckbTemplate');
            tempStr += '<br>';
            cloneArr[index] += `${name}`;
        } else if (val.indexOf('|') !== -1) {
            const name = `tmp-radio-${index}`;
            let radioArr = [];
            tempArr = val.trim().split('|');
            tempArr.shift();
            tempArr.forEach(temp => {
                radioArr.push({ description: temp, enum: temp });
            });
            tempStr += new RadioWidget().getTemplate({ type: 'radio', name: name, oneOf: radioArr }, 'radioTemplate');
            tempStr += '<br>';
            cloneArr[index] += `${name}`;
        } else if (val.indexOf('input') !== -1) {
            const name = `tmp-input-${index}`;
            tempStr += new StringWidget().getTemplate({ type: 'string', name: name }, 'strTemplate');
            cloneArr[index] += `${name}`;
        } else if (val.indexOf('*') !== -1) {
            let value = val.trim().split('*');
            tempStr += `<span class="strWrap"><em style="color: red; font-style: normal;">注意事项: </em>${value.join('')}</span>`;
        } else {
            tempStr += `<span class="strWrap">${val}</span>`;
        }
    });
    return { tempStr, cloneArr };

}
