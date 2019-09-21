import { StringWidget } from "./inputTemplate/string/string.widget";
import { WidgetRegistry } from "./widget-registry";
import { RadioWidget } from "./inputTemplate/radio/radio.widget";
import { CheckboxWidget } from "./inputTemplate/checkbox/checkbox.widget";


export class BootStrapDefaultWidgetRegistry extends WidgetRegistry {
  constructor() {
    super();
    this.register('string', StringWidget);
    this.register('radio', RadioWidget);
    this.register('checkbox', CheckboxWidget);

    this.setDefaultWidget(StringWidget);
  }
}

