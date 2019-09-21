import { Component, Input, ContentChild, TemplateRef, HostBinding } from '@angular/core';

@Component({
  selector: 'exception',
  templateUrl: `./exception.component.html`,
  // host: { '[class.ad-exception]': 'true' },
  styleUrls: ['./exception.component.scss'],
  preserveWhitespaces: false,
})
export class ExceptionComponent {
  _img = '';
  _imgLogo = '';
  _title = '';
  _desc = '';

  @HostBinding('class.ad-exception') private _ad_exception = true;

  @Input()
  set type(value: 403 | 404 | 500) {
    const item = {
      403: {
        img: '/assets/img/security/403.png',
        imgLogo: '/assets/img/security/403-not-find.png',
        title: '403',
        desc: '抱歉，你无权访问该页面',
      },
      404: {
        img: '/assets/img/security/404.png',
        imgLogo: '/assets/img/security/404-not-find.png',
        title: '404',
        desc: '抱歉，你访问的页面不存在',
      },
      500: {
        img: '/assets/img/security/500.png',
        imgLogo: '/assets/img/security/500-not-find.png',
        title: '500',
        desc: '抱歉，服务器出错了',
      },
    }[value];

    if (!item) {
      return;
    }

    this._img = item.img;
    this._imgLogo = item.imgLogo;
    this._title = item.title;
    this._desc = item.desc;
  }

  @Input()
  set img(value) {
    this._img = value;
  }
  @Input()
  set imglogo(value) {
    this._imgLogo = value;
  }
  @Input()
  set title(value) {
    this._title = value;
  }
  @Input()
  set desc(value) {
    this._desc = value;
  }

  @ContentChild('actions') actions: TemplateRef<any>;
}
