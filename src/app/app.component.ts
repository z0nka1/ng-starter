import { Component, HostBinding, OnDestroy, OnInit, AfterViewInit } from '@angular/core';
import { API_BASE_URL, IPS_LOGIN_ACCOUNT, IPS_BASE_URL, IPS_TOKEN_KEY, TOKEN_KEY, IGNORE_API_INTERCEPT } from './config/config';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { TitleService, SettingsService, ReStorageService, AuthService } from '@core/core.module';
import { InterceptorService } from '@core/services/api/interceptor';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit, AfterViewInit {

  @HostBinding('class.aside-collapsed') get isCollapsed() {
    return this.settings.layout.collapsed;
  }

  get api() {
    return API_BASE_URL;
  }

  constructor(
    private router: Router,
    private titleService: TitleService,
    private settings: SettingsService,
    private auth: AuthService,
    private interceptorSrv: InterceptorService
  ) { }

  ngOnInit(): void {

    this.router.events.subscribe(evt => {
      if (evt instanceof NavigationStart) {
        // TODO 需要通过路由守卫来控制权限
        if (evt.url.includes('access_token')) {
          if (!this.auth.checkLogin()) {
            this.auth.goToLogin();
          }
          return;
        }
      } else if (evt instanceof NavigationEnd) {
        this.titleService.setTitle()
      }
    });
    this.interceptorSrv.setup();
  }

  ngAfterViewInit() {
    // 系统初始化时检查一下登陆情况
    if (!this.auth.checkLogin()) {
      this.auth.goToLogin();
    }
  }

}
