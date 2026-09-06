import { Directive, input, signal } from '@angular/core';

@Directive({
  selector: '[appHighlight]',
  host: {
    '(mouseenter)': 'hovered.set(true)',
    '(mouseleave)': 'hovered.set(false)',

    '[style.background-color]':
      'hovered() ? color() : ""',

    '[style.transition]':
      '"background-color 160ms"',
  },
})
export class Highlight {
  color = input('#FFF59D');

  hovered = signal(false);
}