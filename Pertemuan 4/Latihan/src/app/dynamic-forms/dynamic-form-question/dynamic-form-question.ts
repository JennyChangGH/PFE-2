import { Component, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { QuestionBase } from '../question-base';
import { DropdownQuestion } from '../question-dropdown';
import { TextboxQuestion } from '../question-textbox';

@Component({
  selector: 'app-dynamic-form-question',
  imports: [ReactiveFormsModule],
  templateUrl: './dynamic-form-question.html',
})
export class DynamicFormQuestion {
  question = input.required<QuestionBase<string>>();
  form = input.required<FormGroup>();

  protected get textType(): string {
    const question = this.question();
    return question instanceof TextboxQuestion ? question.type : 'text';
  }

  protected get dropdownOptions(): { key: string; value: string }[] {
    const question = this.question();
    return question instanceof DropdownQuestion ? question.options : [];
  }

  protected get isInvalid(): boolean {
    const control = this.form().get(this.question().key);
    return !!control && control.invalid && (control.dirty || control.touched);
  }
}
