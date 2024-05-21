import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function passwordStrengthValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (!value) {
      return { passwordStrength: 'Password is required' };
    }

    const hasUpperCase = /[A-Z]+/.test(value);
    const hasLowerCase = /[a-z]+/.test(value);
    const hasNumeric = /[0-9]+/.test(value);
    const hasSpecial = /[\W_]+/.test(value);
    const isLengthValid = value.length >= 8;

    const passwordStrength = [hasUpperCase, hasLowerCase, hasNumeric, hasSpecial, isLengthValid].filter(Boolean).length;

    if (passwordStrength < 3) {
      return { passwordStrength: 'Password is too weak' };
    } else if (passwordStrength === 3 || passwordStrength === 4) {
      return { passwordStrength: 'Password is medium' };
    } else {
      return null;
    }
  };
}
