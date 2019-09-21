export class WidgetRegistry {


  private bootstrap_widgets: { [type: string]: any } = {};
  private primeng_widgets: { [type: string]: any } = {};
  private zorro_widgets: { [type: string]: any } = {};

  private defaultWidget: any;

  constructor() {

  }

  get widgets() {
      return this.bootstrap_widgets;
  }

  setDefaultWidget(widget: any) {
    this.defaultWidget = widget;
  }

  getDefaultWidget() {
    return this.defaultWidget;
  }

  hasWidget(type: string) {
    return this.widgets.hasOwnProperty(type);
  }

  register(type: string, widget: any) {
    this.widgets[type] = widget;
  }

  getWidgetType(type: string): any {
    if (this.hasWidget(type)) {
      return this.widgets[type];
    }
    return this.defaultWidget;
  }
}
