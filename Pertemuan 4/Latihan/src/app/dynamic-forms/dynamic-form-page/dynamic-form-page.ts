import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { QuestionBase } from '../question-base';
import { QuestionService } from '../question.service';
import { DynamicForm } from '../dynamic-form/dynamic-form';

@Component({
  selector: 'app-dynamic-form-page',
  imports: [DynamicForm],
  templateUrl: './dynamic-form-page.html',
})
export class DynamicFormPage {
  private readonly questionService = inject(QuestionService);

  protected readonly questions = toSignal(this.questionService.getQuestions(), {
    initialValue: [] as QuestionBase<string>[],
  });
}
