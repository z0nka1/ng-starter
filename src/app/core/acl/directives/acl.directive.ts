import {
  Directive,
  Input,
  ElementRef,
  Renderer2,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { ACLService } from '../services/acl.service';
import { ACLCanType } from '../acl.type';

@Directive({
  selector: '[acl]',
})
export class ACLDirective implements OnDestroy {

  private _value: any;
  private change$: Subscription;

  @Input('acl')
  set acl(value: ACLCanType) {
    this.set(value);
  }

  @Input('acl-ability')
  set ability(value: ACLCanType) {
    this.set(this.srv.parseAbility(value));
  }

  private set(value: ACLCanType) {
    // const CLS = 'acl__can';
    const el = this.el.nativeElement;
    if (!this.srv.canModule(value)) {
      el.remove();
    }
    this._value = value;

  }

  constructor(
    private el: ElementRef,
    private srv: ACLService,
  ) {
    this.change$ = <any>this.srv.change.subscribe(() => this.set(this._value));
  }

  ngOnDestroy(): void {
    this.change$.unsubscribe();
  }
}
