import {
  CanActivate,
  CanActivateChild,
  CanLoad,
  ActivatedRouteSnapshot,
  Route,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { Injectable, Inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { ACLService } from './acl.service';
import { ACLCanType } from '../acl.type';
import { DelonACLConfig } from '../acl.config';

@Injectable()
export class ACLGuard implements CanActivate, CanActivateChild, CanLoad {
  constructor(
    private srv: ACLService,
    private router: Router,
    private options: DelonACLConfig,
  ) { }

  private process(
    guard: ACLCanType | Observable<ACLCanType> | Boolean,
  ): Observable<boolean> {
    return (guard && guard instanceof Observable
      ? guard
      : of(
        typeof guard !== 'undefined' && guard !== null
          ? guard
          : null,
      )
    ).pipe(
      map(v => {
        if (v === false) {
          return true;
        } else {
          return this.srv.can(v);
        }
      }),
      tap(v => {
        if (v) {
          return;
        }
        this.router.navigateByUrl(this.options.guard_url);
      }),
    );
  }

  // lazy loading
  canLoad(route: Route): Observable<boolean> {
    return this.process((route.data && route.data.guard) || null);
  }
  // all children route
  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean> {
    return this.canActivate(childRoute, state);
  }
  // route
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean> {
    let pathFromRoot = route.pathFromRoot;
    let arr = [];
    let paths = pathFromRoot.filter(path => {
      if (path.url.length) {
        arr = arr.concat(path.url)
        return true;
      }
    });
    if (route.routeConfig.path.includes(':')) {
      arr.pop();
    }
    let fullPath = arr.join('/');
    // console.log('/',fullPath);
    if ((route.data && (route.data.guard === false || route.data.guard === true))) {
      return this.process(route.data.guard)
    }
    return this.process(`/${fullPath}` || null);
  }
}
