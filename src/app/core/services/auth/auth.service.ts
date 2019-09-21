/**
 * @author: giscafer
 * @date: 2018-05-24 16:22:53
 * @description: 登录等权限控制服务
 */



import { HttpClient } from '@angular/common/http';
import { Injectable, EventEmitter } from '@angular/core';
import { ACLService } from '@core/acl';
import { MenuService } from '@core/services/menu';
import { SettingsService } from '@core/services/settings';
import { ReStorageService } from '@core/services/storage/storage.service';
import { dataToTree } from '@shared/utils/dataToTree';
import { getMenus } from '../../../config/menus';
import { BaseUrl, Body, JSONP, POST, Query, RebirthHttp } from 'rebirth-http';
import { StorageType } from 'rebirth-storage';
import { Observable } from 'rxjs/Observable';
import { CUR_USERINFO_URL, LOGOUT_URL, OAUTH_LOGIN_URL, PASSPORT_URL, TOKEN_KEY, USER_PEMISSION_BTN_KEY, USER_PEMISSION_KEY, USER_PEMISSION_ROUTE_KEY } from '../../../config/config';
import './logout.ts';
import { Subject } from 'rxjs';



@Injectable()
@BaseUrl(PASSPORT_URL)
export class PassPortService extends RebirthHttp {
  constructor(
    http: HttpClient,
    private storage: ReStorageService,
  ) {
    super(http);
  }

  // 只支持JSONP请求
  @JSONP(LOGOUT_URL)
  logout(@Query("callback") callback: string): Observable<any> {
    return null;
  }

}

@Injectable()
export class AuthService extends RebirthHttp {

  userInfoChange$: Subject<any> = new Subject<any>();
  event: any = new EventEmitter<any>();

  constructor(
    http: HttpClient,
    private passPortService: PassPortService,
    private storage: ReStorageService,
    private settings: SettingsService,
    private menuSrv: MenuService,
    private aclSrv: ACLService,
  ) {
    super(http);
  }

  /**检查是否存在token */
  checkLogin() {
    let access_token = this._getUrlParam("access_token");
    if (!_.isEmpty(access_token)) {
      this.storage.save(TOKEN_KEY, access_token);
      //   this.initUserInfo();
      return true;
    } else {
      //本地是否有token信息
      access_token = this.storage.get(TOKEN_KEY);
      if (_.isEmpty(access_token)) {
        this.setUser(null);
        return false;
      } else {
        // this.initUserInfo();
        return true;
      }
    }
  }
  /**
   * 获取登陆用户信息
   */
  initUserInfo() {
    this.getCurrUser().subscribe(json => {
      const userInfo = json.content;
      this.event.emit(userInfo.picture ? userInfo.picture : './assets/img/avatar.png');
      this.setUser(userInfo);
      this.getShipperOrNotUser(userInfo)
    });
    // 菜单功能权限
    // if (NO_GUARD_CONTROL) return;
    this.getMyPermissionModule().subscribe(json => {
      this.menuSrv.add(getMenus(json));
    });
  }

  //  更新用户
  toUpdateUserInfo() {
    this.getCurrUser().subscribe(json => {
      const userInfo = json.content;
      this.setUser(userInfo);
      this.event.emit(userInfo.picture ? userInfo.picture : '/assets/img/my-1ziton/header-pic.png');
    })
  }

  //  获取头像
  getHeaderImg() {
    let img = this.settings.user.picture ? this.settings.user.picture : '/assets/img/my-1ziton/header-pic.png';
    return new Observable(observable => {
      return observable.next(img);
    })
  }

  setUser(user = {}) {
    if (user === null) {
      this.storage.remove(TOKEN_KEY);
    }
    this.settings.setUser(user);
  }



  /**判断是否商家 */
  getShipperOrNotUser(userInfo) {
    let isShipperOrNotUser = false;
    if (_.get(userInfo, "organize.external", false) && _.get(userInfo, "organize.externalType", "") === "customer") {
      isShipperOrNotUser = true;
    }
    Object.assign(this.settings.user, { isShipperOrNotUser })
    this.userInfoChange$.next(this.settings.user);

    if (isShipperOrNotUser) {
      this.getMyPermissionModule().subscribe(json => {
        if (isShipperOrNotUser && json[0]) {
          json[0]['_open'] = true;
        }
        this.menuSrv.add(getMenus(json));
      });
    }
  }

  logout() {
    this.storage.clear(StorageType.sessionStorage);
    this.passPortService.logout('_logoutCallback').subscribe(json => {
      this.setUser(null);
      this.goToLogin();
    })
  }

  goToLogin() {
    // demo演示临时注释
    // window.location.href = OAUTH_LOGIN_URL;
  }

  /**获取当前登录用户 */
  @POST(CUR_USERINFO_URL)
  getCurrUser(): Observable<any> {
    return null;
  }


  /**
   * 获取用户下的权限module
   * @param moduleType 1为菜单显示，0为路由不在菜单显示
   */
  getMyPermissionModule(moduleType: string = 'menu'): Observable<any> {

    return new Observable(observer => {
      let cache = this.storage.get(USER_PEMISSION_KEY);
      let routes = this.storage.get(USER_PEMISSION_ROUTE_KEY);
      let btnModules = this.storage.get(USER_PEMISSION_BTN_KEY);
      // console.log(routes)
      // 菜单，路由，按钮缓存都存在才能用缓存
      if (cache && routes && cache['length'] && btnModules) {
        let treeData = this._filterModule(cache, [], moduleType, true);
        return observer.next(_.cloneDeep(treeData));
      }
      this._queryMyPermissionModel([{ subSystem: 'scm' }]).subscribe(json => {
        let arr = json.content || [];
        let routePaths = [];
        // 菜单关键字段
        let treeData = this._filterModule(arr, routePaths, moduleType);
        observer.next(_.cloneDeep(treeData));
      }, err => {
        observer.next([]);
      });
    });
  }

  private _getUrlParam(name) {
    let reg = new RegExp(name + "=([^&]*)(&|$)");
    let url = window.location.hash;
    let r = url.match(reg); //匹配目标参数
    if (r != null) {
      return (<any>window).unescape(r[1]);
    }
    return null;
  }

  @POST('organize/queryMyPermissionModel')
  private _queryMyPermissionModel(@Body body): Observable<any> {
    return null;
  }

  private _filterModule(modules: any, routePaths: any, moduleType: string = 'menu', isCache: boolean = false) {
    let otherModules = []; // 除了菜单之外的module
    let result = modules.filter(item => {
      routePaths.push(item.url);
      item['text'] = item.moduleName;
      item['link'] = item.url;
      item['icon'] = item.icon;
      if (moduleType === item.moduleType || item.moduleType === 'menu') {
        return true;
      } else {
        otherModules.push(item);
        return false;
      }
    });
    let treeData = dataToTree(result, 'parentModule', 'scm', 'moduleCode', 'moduleName');
    routePaths = _.uniq(routePaths);
    let btnModules = _.map(otherModules, 'moduleCode');
    this.aclSrv.aclChange.next({ routePaths, btnModules });

    if (!isCache) {
      this.storage.save(USER_PEMISSION_KEY, modules);
      this.storage.save(USER_PEMISSION_ROUTE_KEY, routePaths);
      this.storage.save(USER_PEMISSION_BTN_KEY, btnModules);
    }
    return treeData;
  }
}


