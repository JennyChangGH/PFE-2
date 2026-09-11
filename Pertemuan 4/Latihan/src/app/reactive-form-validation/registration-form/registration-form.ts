import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { forbiddenUsernameValidator, passwordMatchValidator } from '../validators';
import { UsernameAvailabilityValidator } from '../username-availability.service';

@Component({
  selector: 'app-registration-form',
  imports: [ReactiveFormsModule],
  templateUrl: './registration-form.html',
  styleUrl: './registration-form.css',
})
export class RegistrationForm {
  private readonly fb = inject(FormBuilder);
  private readonly usernameAvailability = inject(UsernameAvailabilityValidator);

  protected readonly form = this.fb.nonNullable.group(
    {
      username: this.fb.nonNullable.control(
        '',
        {
          validators: [
            Validators.required,
            Validators.minLength(4),
            forbiddenUsernameValidator(/^(admin|root)$/i),
          ],
          asyncValidators: [(control) => this.usernameAvailability.validate(control)],
          updateOn: 'blur',
        },
      ),
      email: this.fb.nonNullable.control('', [Validators.required, Validators.email]),
      password: this.fb.nonNullable.control('', [Validators.required, Validators.minLength(6)]),
      confirmPassword: this.fb.nonNullable.control('', Validators.required),
      subscribeNewsletter: this.fb.nonNullable.control(false),
      phone: this.fb.nonNullable.control(''),
    },
    { validators: passwordMatchValidator },
  );

  protected readonly successPayload = signal<string | null>(null);

  constructor() {
    this.form.controls.subscribeNewsletter.valueChanges.subscribe((subscribe) => {
      const phoneControl = this.form.controls.phone;
      if (subscribe) {
        phoneControl.addValidators([Validators.required, Validators.pattern(/^\d{3}-\d{3}-\d{4}$/)]);
      } else {
        phoneControl.clearValidators();
      }
      phoneControl.updateValueAndValidity();
    });
  }

  protected onSubmit(): void {
    this.successPayload.set(null);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.successPayload.set(JSON.stringify(this.form.getRawValue(), null, 2));
    this.form.reset({ subscribeNewsletter: false });
  }
}
