import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function phoneFormatValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) {
      return null;
    }

    const isValid = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/.test(value.replace(/[\s.]/g, ''));
    
    return isValid ? null : { phoneFormat: true };
  };
}