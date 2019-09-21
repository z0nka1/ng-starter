import { Injectable } from '@angular/core';
import { RebirthHttp } from 'rebirth-http';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class DemoService extends RebirthHttp {
  constructor(http: HttpClient) {
    super(http);
  }
}
