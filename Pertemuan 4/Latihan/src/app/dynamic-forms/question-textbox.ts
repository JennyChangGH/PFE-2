import { QuestionBase, QuestionOptions } from './question-base';

export interface TextboxQuestionOptions extends QuestionOptions<string> {
  type?: 'text' | 'email' | 'url' | 'number' | 'tel';
}

export class TextboxQuestion extends QuestionBase<string> {
  override controlType = 'textbox';
  type: 'text' | 'email' | 'url' | 'number' | 'tel';

  constructor(options: TextboxQuestionOptions = {}) {
    super(options);
    this.type = options.type ?? 'text';
  }
}
