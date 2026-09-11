import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { passwordMatchValidator } from '../../reactive-form-validation/validators';

const KECAMATAN_OPTIONS = [
  'Batu Ampar',
  'Lubuk Baja',
  'Sekupang',
  'Nongsa',
  'Batam Kota',
  'Bengkong',
  'Sagulung',
  'Batu Aji',
];

const KELURAHAN_OPTIONS = [
  'Batu Merah',
  'Sungai Jodoh',
  'Tiban Baru',
  'Batu Besar',
  'Teluk Tering',
  'Bengkong Indah',
  'Tembesi',
  'Kibing',
];

@Component({
  selector: 'app-registrasi-form',
  imports: [ReactiveFormsModule],
  templateUrl: './registrasi-form.html',
  styleUrl: './registrasi-form.css',
})
export class RegistrasiForm {
  private readonly fb = inject(FormBuilder);

  protected readonly kecamatanOptions = KECAMATAN_OPTIONS;
  protected readonly kelurahanOptions = KELURAHAN_OPTIONS;

  protected readonly form = this.fb.nonNullable.group(
    {
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      address: ['', Validators.required],
      rt: ['', Validators.required],
      rw: ['', Validators.required],
      kecamatan: ['', Validators.required],
      kelurahan: ['', Validators.required],
      gender: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      reasonJoin: ['', Validators.required],
    },
    { validators: passwordMatchValidator },
  );

  protected readonly submittedData = signal<string | null>(null);

  protected onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.submittedData.set(JSON.stringify(this.form.getRawValue(), null, 2));
  }

  protected onReset(): void {
    this.form.reset();
    this.submittedData.set(null);
  }
}
