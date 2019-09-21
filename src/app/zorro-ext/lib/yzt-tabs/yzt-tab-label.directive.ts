import { Directive, ElementRef, HostBinding, Input } from '@angular/core';
import { toBoolean } from "..//util/convert";


@Directive({
  selector: '[yzt-tab-label]',
  host: {
    '[class.yzt-tabs-tab]': 'true'
  }
})
export class YztTabLabelDirective {

  private _disabled = false;

  @Input()
  @HostBinding('class.yzt-tabs-tab-disabled')
  set disabled(value: boolean) {
    this._disabled = toBoolean(value);
  }

  get disabled(): boolean {
    return this._disabled;
  }

  constructor(public elementRef: ElementRef) {
  }

  getOffsetLeft(): number {
    return this.elementRef.nativeElement.offsetLeft;
  }

  getOffsetWidth(): number {
    return this.elementRef.nativeElement.offsetWidth;
  }

  getOffsetTop(): number {
    return this.elementRef.nativeElement.offsetTop;
  }

  getOffsetHeight(): number {
    return this.elementRef.nativeElement.offsetHeight;
  }
}
