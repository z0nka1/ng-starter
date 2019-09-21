/*tslint:disable*/
export class StringWidget {

    constructor() {
        // super();
    }

    getTemplate(schema, customClass?) {
        let templ = "";
        templ = `
            <div class="widget form-group ${customClass}">
                <label for="${schema.formId}" class="horizontal control-label">
                    ${schema.title || ''}
                </label>
                ${schema.description ? `<span  class="formHelp"> ${schema.description}</span>` : ''}
                <input
                [(ngModel)]="${schema.name}"
                id="${schema.formId}"
                name="${schema.name}"
                class="ant-input text-widget.id textline-widget form-control"
                type="text"
                placeholder="${schema.placeholder ? schema.placeholder : ' '}"
                ${(schema.maxLength || schema.maxLength === 0) ? `[attr.maxLength]="${schema.maxLength}"` : ""}
                ${(schema.minLength || schema.minLength === 0) ? `[attr.minLength]="${schema.minLength}"` : ""}/>
            </div>
            `;

        return templ;
    }

    // getInputType(widgetInfo) {
    //     if (!widgetInfo.widget.id || widgetInfo.widget.id === 'string') {
    //         return 'text';
    //     } else {
    //         return widgetInfo.widget.id;
    //     }
    // }
}