import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { QuestionBase } from './question-base';
import { TextboxQuestion } from './question-textbox';
import { DropdownQuestion } from './question-dropdown';

@Injectable({ providedIn: 'root' })
export class QuestionService {
  getQuestions(): Observable<QuestionBase<string>[]> {
    const questions: QuestionBase<string>[] = [
      new DropdownQuestion({
        key: 'kekuatan',
        label: 'Kekuatan favorit',
        options: [
          { key: 'terbang', value: 'Terbang' },
          { key: 'super-strength', value: 'Kekuatan Super' },
          { key: 'kecepatan', value: 'Kecepatan Super' },
          { key: 'kebal', value: 'Kebal Peluru' },
          { key: 'jaring', value: 'Menembak Jaring Laba-laba' },
        ],
        order: 3,
      }),
      new TextboxQuestion({
        key: 'namaDepan',
        label: 'Nama Depan',
        required: true,
        order: 1,
      }),
      new TextboxQuestion({
        key: 'email',
        label: 'Email',
        type: 'email',
        required: true,
        order: 2,
      }),
    ];

    return of(questions.sort((a, b) => a.order - b.order));
  }
}
