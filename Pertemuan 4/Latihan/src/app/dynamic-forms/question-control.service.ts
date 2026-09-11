import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { QuestionBase } from './question-base';

@Injectable({ providedIn: 'root' })
export class QuestionControlService {
  toFormGroup(questions: QuestionBase<string>[]): FormGroup {
    const group: Record<string, FormControl<string>> = {};
    for (const question of questions) {
      group[question.key] = new FormControl(question.value ?? '', {
        nonNullable: true,
        validators: question.required ? [Validators.required] : [],
      });
    }
    return new FormGroup(group);
  }
}
