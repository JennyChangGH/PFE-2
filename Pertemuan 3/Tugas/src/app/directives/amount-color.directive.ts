import { Directive, ElementRef, Input, OnChanges } from '@angular/core';

const HIGH_AMOUNT_THRESHOLD = 300_000;

@Directive({
  selector: '[appAmountColor]',
})
export class AmountColorDirective implements OnChanges {
  @Input() appAmountColor!: number;

  constructor(private el: ElementRef<HTMLElement>) {}

  ngOnChanges(): void {
    this.el.nativeElement.style.color =
      this.appAmountColor > HIGH_AMOUNT_THRESHOLD ? '#dc2626' : '#16a34a';
  }
}
