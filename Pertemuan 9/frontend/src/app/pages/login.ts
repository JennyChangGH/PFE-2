import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../core/auth.service';
import { errorMessage } from '../core/util';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  template: `
    <div class="login-wrap">
      <form class="card login" (ngSubmit)="submit()">
        <h2>Login</h2>
        @if (error()) {
          <div class="alert">{{ error() }}</div>
        }
        <label>Username
          <input name="username" [(ngModel)]="username" autocomplete="username" required />
        </label>
        <label>Password
          <input name="password" type="password" [(ngModel)]="password" autocomplete="current-password" required />
        </label>
        <button class="btn primary" [disabled]="loading()">{{ loading() ? 'Memproses...' : 'Masuk' }}</button>
        <p class="hint">Contoh: admin / admin123 · kasir / kasir123 · viewer / viewer123</p>
      </form>
    </div>
  `,
})
export class Login {
  private auth = inject(AuthService);
  private router = inject(Router);

  username = '';
  password = '';
  readonly loading = signal(false);
  readonly error = signal('');

  async submit() {
    this.loading.set(true);
    this.error.set('');
    try {
      await this.auth.login(this.username, this.password);
      await this.router.navigateByUrl('/');
    } catch (e) {
      this.error.set(errorMessage(e));
    } finally {
      this.loading.set(false);
    }
  }
}
