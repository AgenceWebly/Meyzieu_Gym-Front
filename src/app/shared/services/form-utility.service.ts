import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class FormUtilityService {

  constructor() { }
  
  trimFormValues(form: FormGroup): { [key: string]: any } {
    const formValues = form.value as { [key: string]: any };

    const trimmedValues = Object.keys(formValues).reduce((acc, key) => {
      const value = formValues[key];
      if (typeof value === 'string') {
        acc[key] = value.trim();
      } else {
        acc[key] = value;
      }
      return acc;
    }, {} as { [key: string]: any });

    return trimmedValues;
  }

}
