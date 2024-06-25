import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function checkEqualityValidator(controlName1: string, controlName2: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const query = control.get(controlName1);
    const confirmQuery = control.get(controlName2);

    const isValid = query?.value === confirmQuery?.value;

    return isValid ? null : { 'notEqual': true };
  }
}