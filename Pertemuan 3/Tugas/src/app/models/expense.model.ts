export type ExpenseCategory = 'food' | 'utility' | 'entertainment' | 'transport' | 'other';

export interface Expense {
  id: number;
  title: string;
  category: ExpenseCategory;
  amount: number;
}
  