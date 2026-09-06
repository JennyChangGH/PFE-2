import { Pipe, PipeTransform } from '@angular/core';
import { ExpenseCategory } from '../models/expense.model';

const CATEGORY_LABELS: Record<ExpenseCategory, string> = {
  food: '🍚 Makanan',
  utility: '⚡ Perlengkapan',
  entertainment: '🎬 Hiburan',
  transport: '🚗 Kendaraan',
  other: '📦 Lainnya',
};

@Pipe({
  name: 'category',
})
export class CategoryPipe implements PipeTransform {
  transform(value: ExpenseCategory): string {
    return CATEGORY_LABELS[value] ?? value;
  }
}
