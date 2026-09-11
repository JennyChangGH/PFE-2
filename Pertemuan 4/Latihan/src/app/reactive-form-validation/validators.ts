import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function forbiddenUsernameValidator(forbidden: RegExp): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const isForbidden = forbidden.test(control.value ?? '');
    return isForbidden ? { forbiddenUsername: { value: control.value } } : null;
  };
}

export function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');
  if (!password || !confirmPassword) {
    return null;
  }
  return password.value === confirmPassword.value ? null : { passwordMismatch: true };
}
