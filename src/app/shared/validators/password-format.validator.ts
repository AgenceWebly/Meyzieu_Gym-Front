import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function passwordFormatValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    
    if (typeof value === 'string' && value.length >= 8) {
      return null;
    } else {
      return { passwordFormat: true };
    }
  };
}