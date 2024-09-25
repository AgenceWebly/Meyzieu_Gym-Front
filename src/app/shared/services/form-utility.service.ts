import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})

export class FormUtilityService {

	constructor() { }

	trimFormValues<T extends { [key: string]: any }>(form: FormGroup): T {
		const formValues = form.value as { [key: string]: any };
	
		const trimValue = (value: any): any => {
		// Trim strings
		if (typeof value === 'string' && value != null) {
			return value.trim();
		} 
		// Recursively trim object properties (nested FormGroups)
		else if (value && typeof value === 'object' && !Array.isArray(value)) {
			return Object.keys(value).reduce((acc, key) => {
			acc[key] = trimValue(value[key]); // Recursively call trimValue
			return acc;
			}, {} as { [key: string]: any });
		} 
		// Recursively trim arrays (nested FormArrays)
		else if (Array.isArray(value)) {
			return value.map(trimValue);
		}
		return value; // Return non-string values unchanged
		};

		// Accumulate trimmed form values in an intermediate object
		const trimmedValues = Object.keys(formValues).reduce<{ [key: string]: any }>((acc, key) => {
		acc[key] = trimValue(formValues[key]);
		return acc;
		}, {});
	
		return trimmedValues as T; // Return the trimmed object, cast as T
	}

}

// In doubt, read below

// Extract Form Values: The form’s values are retrieved as a JavaScript object using form.value.

// Recursive Trimming: The trimValue function recursively trims each string value in the form,
// and it handles nested form groups (FormGroup) and form arrays (FormArray).

// Rebuild the Form Values Object: The trimmed values are accumulated into a new object using reduce,
// ensuring that all values—whether nested or not—are properly trimmed.

// Return: Finally, the trimmed object is returned, ensuring the trimmed form values have 
// the same structure as the original form values.