/**
 * @Description: 主要用于把英文枚举转成中文
 * @Author: zomixi
 * @Date: 2019-05-15 14:39:06
 */

import { Pipe, PipeTransform } from '@angular/core';
import { ENUM_FIELD } from 'app/config/Enum';

@Pipe({
  name: 'translate'
})
export class TranslatePipe implements PipeTransform {
  transform(rawValue: any, _lexicon: { [key: string]: string }) {
    const lexicon = { ..._lexicon, ...ENUM_FIELD };
    let newValue: any = '';
    if (Array.isArray(rawValue)) {
      newValue = rawValue.map(value => translate(value, lexicon));
      newValue = newValue.join(',');
    } else {
      newValue = translate(rawValue, lexicon);
    }
    return newValue;
  }
}

function translate(rawValue: any, lexicon: { [key: string]: string }) {
  if (typeof rawValue !== 'string') {
    return rawValue;
  }

  let newValue = '';

  for (const key in lexicon) {
    if (lexicon.hasOwnProperty(key)) {
      if (key === rawValue) {
        newValue = lexicon[key];
        return newValue;
      }
    }
  }

  return rawValue;
}
