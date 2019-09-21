/*tslint:disable*/
export class RadioWidget {

	constructor() {
		// super();
	}

	getTemplate(schema, customClass?) {
		return `
    	<div class="widget form-group ${customClass}">
			<label class="horizontal control-label">
				${schema.title || ''}
			</label>
			${schema.description ? `<span class="formHelp">${schema.description}</span>` : ''}
			${this.iterateOptions(schema)}
		</div>
    `;
	}

	iterateOptions(schema) {
		let htmlStr = '', options = schema.oneOf;
		for (let option of options) {
			htmlStr += `
			<div class="inline-b ${schema.grid && schema.grid.mode ? ('-' + schema.grid.mode) : ''}">
				<label class="horizontal control-label">
					<input name="${schema.name}"
					type="radio" value="${option.enum}" ${schema.readOnly ? ` disabled="true"` : ""}>
					${option.description}
				</label>
			</div>
			`;
		}
		return htmlStr;
	}
}

