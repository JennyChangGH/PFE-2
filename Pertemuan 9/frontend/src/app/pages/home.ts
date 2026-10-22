import { Component, inject } from '@angular/core';
import { AuthService } from '../core/auth.service';

@Component({
  selector: 'app-home',
  template: `
    <h1>Selamat datang, {{ auth.user()?.fullName }}</h1>
    <p>Berikut hak akses Anda pada setiap menu:</p>

    <div class="card">
      <table>
        <thead>
          <tr><th>Menu</th><th>Read</th><th>Create</th><th>Update</th><th>Delete</th></tr>
        </thead>
        <tbody>
          @for (m of auth.menus(); track m.id) {
            @if (m.url === '#') {
              <tr class="group"><td colspan="5">{{ m.name }}</td></tr>
              @for (c of m.children; track c.id) {
                <tr>
                  <td class="indent">{{ c.name }}</td>
                  <td>{{ c.privilege?.read ? '✔' : '–' }}</td>
                  <td>{{ c.privilege?.create ? '✔' : '–' }}</td>
                  <td>{{ c.privilege?.update ? '✔' : '–' }}</td>
                  <td>{{ c.privilege?.delete ? '✔' : '–' }}</td>
                </tr>
              }
            }
          } @empty {
            <tr><td colspan="5">Belum ada menu yang dapat diakses.</td></tr>
          }
        </tbody>
      </table>
    </div>
  `,
})
export class Home {
  protected auth = inject(AuthService);
}
