import { AbstractControl, Validators, ValidatorFn } from '@angular/forms';

import { isPresent } from '../util/lang';

export const phone: ValidatorFn = (control: AbstractControl): {[key: string]: boolean} => {
  if (isPresent(Validators.required(control))) {
    return null;
  }

  const v: string = control.value;
  const phoneReg = /^[1][1,2,3,4,5,6,7,8,9][0-9]{9}$/
  /* tslint:disable */
  return phoneReg.test(v) ? null : {'phone': true};
  /* tslint:enable */
};
