import { Component, signal } from '@angular/core';
import {
  FormField,
  form,
  minLength,
  required,
  submit,
  validate,
  validateTree,
} from '@angular/forms/signals';

interface RegistrationModel {
  accountType: 'personal' | 'business';
  companyName: string;
  startDate: string;
  endDate: string;
  password: string;
  confirmPassword: string;
  contact: {
    email: string;
    phone: string;
  };
}

@Component({
  selector: 'app-event-registration-form',
  imports: [FormField],
  templateUrl: './event-registration-form.html',
  styleUrl: './event-registration-form.css',
})
export class EventRegistrationForm {
  protected readonly model = signal<RegistrationModel>({
    accountType: 'personal',
    companyName: '',
    startDate: '',
    endDate: '',
    password: '',
    confirmPassword: '',
    contact: { email: '', phone: '' },
  });

  protected readonly registrationForm = form(this.model, (path) => {
    required(path.companyName, {
      when: ({ valueOf }) => valueOf(path.accountType) === 'business',
      message: 'Nama perusahaan wajib diisi untuk akun bisnis.',
    });

    required(path.startDate, { message: 'Tanggal mulai wajib diisi.' });
    required(path.endDate, { message: 'Tanggal selesai wajib diisi.' });

    validate(path.endDate, ({ value, valueOf }) => {
      const start = valueOf(path.startDate);
      const end = value();
      if (!start || !end || end > start) {
        return null;
      }
      return { kind: 'invalidDateRange', message: 'Tanggal selesai harus setelah tanggal mulai.' };
    });

    required(path.password, { message: 'Password wajib diisi.' });
    minLength(path.password, 6, { message: 'Password minimal 6 karakter.' });

    validate(path.confirmPassword, ({ value, valueOf, stateOf }) => {
      if (!stateOf(path.password).touched()) {
        return null;
      }
      if (value() !== valueOf(path.password)) {
        return { kind: 'passwordMismatch', message: 'Konfirmasi password tidak cocok.' };
      }
      return null;
    });

    validateTree(path.contact, ({ value, fieldTree }) => {
      const { email, phone } = value();
      if (email || phone) {
        return null;
      }
      return {
        kind: 'contactRequired',
        message: 'Isi salah satu: email atau nomor telepon.',
        fieldTree: fieldTree.email,
      };
    });
  });

  protected readonly successPayload = signal<string | null>(null);

  protected onSubmit(): void {
    submit(this.registrationForm, async () => {
      this.successPayload.set(JSON.stringify(this.model(), null, 2));
    });
  }
}
