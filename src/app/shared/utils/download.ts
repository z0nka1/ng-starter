/**
 * 内容下载，支持后端二进制文件下载。
 * @param content 文件内容
 * @param fileName 文件名称 
 */
export function downloadContent(content, fileName?: string) {
    let eleLink = document.createElement('a');
    eleLink.download = fileName || '下载.xlsx';
    eleLink.style.display = 'none';

    const blob = new Blob([content]);
    eleLink.href = URL.createObjectURL(blob);

    document.body.appendChild(eleLink);
    eleLink.click();
    document.body.removeChild(eleLink);
}

/**
 * 下载统一接口，判断浏览器是否支持a标签download属性，如果不支持采用form表单提交方式下载文件
 * @param url 
 * @param fileName 
 */
export function download(url: string, fileName?: string) {
    const isSupportDownload = 'download' in document.createElement('a');
    if (isSupportDownload) {
        downloadByLink(url, fileName);
    } else {
        downloadByForm(url);
    }
}

/**
 * 根据url直接下载文件（IE10+ 浏览器）
 * @param url 文件地址
 * @param fileName 自定义下载文件名称（必须有文件名后缀，比如图片就 picture.jpg，excel文档就为：模板.xls）
 * 不过这里的文件名目前可能受到浏览器兼容性的影响，一些浏览器可能需要通过右键文件另存为才可以自定义文件名称。
 */
function downloadByLink(url: string, fileName?: string) {
    if (!url) {
        return;
    }
    let eleA = document.createElement('a');
    eleA.style.display = 'none';
    eleA.href = url;
    eleA.nodeValue = '下载' + fileName;
    eleA.setAttribute('download', fileName || '模板.xlsx');
    document.body.appendChild(eleA);
    eleA.click();
    document.body.removeChild(eleA)
}

/**
 * 根据url直接下载文件
 * 不好的地方是不能更改下载文件的文件名称，如http://yztfile.gz.bcebos.com/WMGb-cvmXnwLHOIj.xlsx 下载的文件为 WMGb-cvmXnwLHOIj.xlsx
 * @param url 
 */
function downloadByForm(url: string) {
    if (!url) {
        return;
    }
    let eleForm = document.createElement('form');
    eleForm.method = "GET";
    eleForm.style.display = 'none';
    eleForm.action = url;
    document.body.appendChild(eleForm);
    eleForm.submit();
    document.body.removeChild(eleForm)
}

/**
 * 打开空白页下载文件（体验差，或者文本的文件可能直接浏览器打开。不推荐使用）
 * @param url 
 */
export function openByUrl(url: string) {
    if (!url) {
        return;
    }
    window.open(url);
}

/**
 * 自定义导出数据
 * @param tableHtml
 */
export function customDownLoad(tableHtml) {
    const template = `
        <html xmlns:o="urn:schemas-microsoft-com:office:office" 
        xmlns:x="urn:schemas-microsoft-com:office:excel" 
        xmlns="http://www.w3.org/TR/REC-html40">
        <head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>
        <x:Name>Sheet1</x:Name>
        <x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet>
        </x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
        </head><body>${tableHtml}</body></html>`;
    const uri = 'data:text/csv;charset=utf-8,\ufeff' + encodeURIComponent(template);
    download(uri)
}

/**
 * 自定义导出内容
 * @param {columns} 列名 
 * @param {dataList} 数据
 * @param {fileName} 保存文件名
 */
export function customDownTable(columns, dataList, fileName?: string) {

    let thead = '', tbody = '';

    dataList.forEach(value => {
        let body = '';
        columns.forEach(item => {
            if (value[item.field + '_error']) {
                body += `<td style='background:#f00'>${value[item.field]}</td>`
            } else {
                body += `<td>${value[item.field]}</td>`
            }
        })
        tbody += `<tr>${body}</tr>`;
    })

    columns.forEach(item => {
        thead += `<th>${item.name}</th>`;
    })

    thead = `<tr>${thead}</tr>`;

    const template = `
        <html xmlns:o="urn:schemas-microsoft-com:office:office" 
        xmlns:x="urn:schemas-microsoft-com:office:excel" 
        xmlns="http://www.w3.org/TR/REC-html40">
        <head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>
        <x:Name>Sheet1</x:Name>
        <x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet>
        </x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
        </head><body><table>${thead + tbody}</table></body></html>`;
    const uri = 'data:text/csv;charset=utf-8,\ufeff' + encodeURIComponent(template);
    download(uri, fileName);
}

/**
 * 自定义导出csv文件
 * @param {str} 传送内容
 */
export function customDownCsv(columns, dataList) {

    let template = '';

    columns.forEach(item => {
        template += `${item.header},`;
    })

    template = `${template.substr(0, template.length - 1)}\n`;

    for (let i = 0; i < dataList.length; i++) {
        const data = dataList[i];
        for (let n = 0; n < columns.length; n++) {
            const attr = columns[n]['field'];
            template += `${data[attr] ? data[attr] : '' + '\t'},`;
        }

        template += '\n';
    }


    const uri = 'data:text/csv;charset=utf-8,\ufeff' + encodeURIComponent(template);
    download(uri, '模板.csv');
}


/**
 * 自定义导出数据到xlsx 插件版
 */
export function simpleExportExcel(columns, dataList, fileName?: string, XLSX?: any) {

    let thead = '', tbody = '';

    dataList.forEach(value => {
        let body = '';
        columns.forEach(item => {
            if (value[item.field + '_error']) {
                body += `<td style='background:#f00'>${value[item.field]}</td>`
            } else {
                body += `<td>${value[item.field]}</td>`
            }
        })
        tbody += `<tr>${body}</tr>`;
    })

    columns.forEach(item => {
        thead += `<th>${item.field}</th>`;
    })

    thead = `<tr>${thead}</tr>`;

    const table = document.createElement('table');

    table.innerHTML = thead + tbody;

    let wb = XLSX.utils.table_to_book(table);

    XLSX.writeFile(wb, fileName);

}
