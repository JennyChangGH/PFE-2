import {
  ChangeDetectionStrategy,
  Component,
  signal
} from '@angular/core';

import { NgClass, NgStyle, CurrencyPipe, DatePipe, TitleCasePipe} from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Highlight } from './highlight';
import { InitialPipe } from './initials-pipe';

@Component({
  selector: 'app-root',
  imports: [
    NgClass,
    NgStyle,
    FormsModule,
    InitialPipe,
    Highlight,
    TitleCasePipe,
    CurrencyPipe,
    DatePipe
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class App {
  isActive = signal(false);

  toggleStatus() {
    this.isActive.update(value => !value);
  }

  fontSize = signal(20);
  textColor = signal('blue');

  increaseFont() {
    this.fontSize.update(size => size + 2);
  }

  decreaseFont() {
    this.fontSize.update(size => size - 2);
  }

  changeColor() {
    this.textColor.set(
      this.textColor() === 'blue'
        ? 'red'
        : 'blue'
    );
  }

  nama = signal('');
  highlightColor = signal('#B2EBF2');
  customerName = signal('Jenny Chang');
  total = signal(1250000);
  tanggal = signal(new Date().toISOString().slice(0, 10));
}