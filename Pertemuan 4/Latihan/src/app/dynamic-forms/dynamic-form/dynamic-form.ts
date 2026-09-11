import { Component, computed, inject, input, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { QuestionBase } from '../question-base';
import { QuestionControlService } from '../question-control.service';
import { DynamicFormQuestion } from '../dynamic-form-question/dynamic-form-question';

@Component({
  selector: 'app-dynamic-form',
  imports: [ReactiveFormsModule, DynamicFormQuestion],
  templateUrl: './dynamic-form.html',
})
export class DynamicForm {
  private readonly questionControlService = inject(QuestionControlService);

  questions = input<QuestionBase<string>[]>([]);

  protected readonly sortedQuestions = computed(() =>
    [...this.questions()].sort((a, b) => a.order - b.order),
  );

  protected readonly form = computed(() =>
    this.questionControlService.toFormGroup(this.questions()),
  );

  protected readonly payload = signal<string | null>(null);

  protected onSubmit(): void {
    const form = this.form();
    if (form.invalid) {
      form.markAllAsTouched();
      return;
    }
    this.payload.set(JSON.stringify(form.getRawValue(), null, 2));
  }
}
