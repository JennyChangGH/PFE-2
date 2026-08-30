import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {Home} from './home/home';
import {Menu} from './menu/menu';
import {About} from './about/about';
import {Contact} from './contact/contact';

@Component({
  selector: 'app-root',
  imports: [Home, Menu, About, Contact],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('coffeeshop');
}
  