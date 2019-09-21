import { Directive, forwardRef } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl } from '@angular/forms';

import { phone2 } from './validator';

const PHONE2_VALIDATOR: any = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => Phone2Validator),
  multi: true
};

@Directive({
  selector: '[phone2][formControlName],[phone2][formControl],[phone2][ngModel]',
  providers: [PHONE2_VALIDATOR]
})
export class Phone2Validator implements Validator {
  validate(c: AbstractControl): {[key: string]: any} {
    return phone2(c);
  }
}
