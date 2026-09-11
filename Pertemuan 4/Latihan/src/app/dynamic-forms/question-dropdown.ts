import { QuestionBase, QuestionOptions } from './question-base';

export interface DropdownQuestionOptions extends QuestionOptions<string> {
  options?: { key: string; value: string }[];
}

export class DropdownQuestion extends QuestionBase<string> {
  override controlType = 'dropdown';
  options: { key: string; value: string }[];

  constructor(options: DropdownQuestionOptions = {}) {
    super(options);
    this.options = options.options ?? [];
  }
}
