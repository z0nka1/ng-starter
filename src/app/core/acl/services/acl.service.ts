import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';
import { ACLType, ACLCanType } from '../acl.type';

/**
 * 访问控制服务
 */
@Injectable()
export class ACLService implements OnDestroy {

  private _change$: Subscription;

  private _routePaths: string[] = [];
  private _moduleCodes: string[] = [];

  aclChange: Subject<ACLType | Array<string>> = new Subject<ACLType | Array<string>>();

  /** ACL变更通知 */
  get change(): Observable<ACLType | Array<string>> {
    return this.aclChange.asObservable();
  }

  constructor() {
    this._change$ = this.change.subscribe((data: { routePaths, btnModules }) => {
      this._routePaths = data.routePaths;
      this._moduleCodes = data.btnModules;
    });
  }
  /* 路由控制 */
  can(v): boolean {
    // if (NO_GUARD_CONTROL) return true;
    return this._routePaths.includes(v);
  }

  /** @inner */
  parseAbility(value: ACLCanType): ACLCanType {
    if (
      typeof value === 'number' ||
      typeof value === 'string' ||
      Array.isArray(value)
    ) {
      value = <ACLType>{ ability: Array.isArray(value) ? value : [value] };
    }
    delete value.role;
    return value;
  }

  /* 页面按钮控制 */
  canModule(v): boolean {
    return this._moduleCodes.includes(v);
  }

  ngOnDestroy(): void {
    this._change$.unsubscribe();
  }

}
