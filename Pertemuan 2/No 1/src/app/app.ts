import { Component } from '@angular/core';
import { Home } from './home/home';
import { Admin } from './admin/admin';
import { ContactUs } from './contact-us/contact-us';

@Component({
  selector: 'app-root',
  imports: [Home, Admin, ContactUs],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
}