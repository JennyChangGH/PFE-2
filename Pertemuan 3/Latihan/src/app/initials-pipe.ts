import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'initials'
})
export class InitialPipe implements PipeTransform {

  transform(value: string, limit = 2): string {
    if (!value) {
      return '';
    }

    return value
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, limit)
      .map(part => part[0].toUpperCase())
      .join('');
  }

}