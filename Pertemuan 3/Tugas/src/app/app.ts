import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { RupiahPipe } from './pipes/rupiah.pipe';
import { CategoryPipe } from './pipes/category.pipe';
import { AmountColorDirective } from './directives/amount-color.directive';
import { Expense, ExpenseCategory } from './models/expense.model';

interface CategoryOption {
  value: ExpenseCategory;
  label: string;
}

const EXPENSE_CATEGORY_OPTIONS: CategoryOption[] = [
  { value: 'food', label: '🍚 Makanan' },
  { value: 'utility', label: '⚡ Perlengkapan' },
  { value: 'entertainment', label: '🎬 Hiburan' },
  { value: 'transport', label: '🚗 Kendaraan' },
  { value: 'other', label: '📦 Lainnya' },
];

@Component({
  selector: 'app-root',
  imports: [FormsModule, RupiahPipe, CategoryPipe, AmountColorDirective],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly categoryOptions = EXPENSE_CATEGORY_OPTIONS;

  protected readonly expenses = signal<Expense[]>([
    { id: 1, title: 'Beli Beras', category: 'food', amount: 200000 },
    { id: 2, title: 'Bayar Internet', category: 'utility', amount: 500000 },
    { id: 3, title: 'Nonton Bioskop', category: 'entertainment', amount: 150000 },
  ]);

  protected readonly totalExpense = computed(() =>
    this.expenses().reduce((sum, item) => sum + item.amount, 0),
  );

  protected title = '';
  protected category: ExpenseCategory = EXPENSE_CATEGORY_OPTIONS[0].value;
  protected amount: number | null = null;

  private nextId = 4;

  addExpense(): void {
    const title = this.title.trim();
    if (!title || this.amount === null || this.amount <= 0) {
      return;
    }

    this.expenses.update((list) => [
      ...list,
      {
        id: this.nextId++,
        title,
        category: this.category,
        amount: this.amount as number,
      },
    ]);

    this.title = '';
    this.amount = null;
    this.category = EXPENSE_CATEGORY_OPTIONS[0].value;
  }

  removeExpense(id: number): void {
    this.expenses.update((list) => list.filter((expense) => expense.id !== id));
  }
}
