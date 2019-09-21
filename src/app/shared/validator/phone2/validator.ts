import { AbstractControl, Validators, ValidatorFn } from '@angular/forms';

import { isPresent } from '../util/lang';

export const phone2: ValidatorFn = (control: AbstractControl): {[key: string]: boolean} => {
  if (isPresent(Validators.required(control))) {
    return null;
  }

  const v: string = control.value;
  const phoneReg = /^[\d](-?[-][\d]|[\d])[\d]*?/
  /* tslint:disable */
  return phoneReg.test(v) ? null : {'phone2': true};
  /* tslint:enable */
};
