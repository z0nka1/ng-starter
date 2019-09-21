import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SettingsService } from '@core/services/settings';
import { AuthService } from '@core/services/auth/auth.service';
import { ReStorageService } from '@core/services/storage/storage.service';

@Component({
  selector: 'header-user',
  template: `
  <nz-dropdown nzPlacement="bottomRight">
    <div class="item d-flex align-items-center px-sm" nz-dropdown>
      <nz-avatar *ngIf="imgSrc" [nzSrc]="imgSrc" nzSize="lg" class="margin-right-8"></nz-avatar>
      {{settings.user.name || '暂无用户名称'}}
      <i class="anticon anticon-down margin-left-5" style="font-size: 16px;"></i>
    </div>
    <div nz-menu class="width-sm">
        <!--<div nz-menu-item (click)="jumpTo()"><i class="anticon anticon-user mr-sm margin-right-5"></i>账号设置</div>-->
        <!--<li nz-menu-divider></li>-->
      <div nz-menu-item (click)="logout()"><i class="anticon anticon-logout mr-sm margin-right-5"></i>退出登录</div>
    </div>
  </nz-dropdown>
  `,
  styles: [`
  
  `]
})
export class HeaderUserComponent implements OnInit {

  imgSrc = "./assets/img/avatar.png";

  constructor(
    public settings: SettingsService,
    private router: Router,
    private authSrv: AuthService,
  ) { }

  ngOnInit() {
    this.authSrv.event.subscribe(
      data => {
        this.imgSrc = data;
      }
    )
  }

  logout() {
    this.authSrv.logout();
  }

  jumpTo() {
    this.router.navigateByUrl('/client-center/account-person');
  }
}
