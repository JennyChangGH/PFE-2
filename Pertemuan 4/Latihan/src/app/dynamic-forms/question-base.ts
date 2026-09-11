export interface QuestionOptions<TValue> {
  value?: TValue;
  key?: string;
  label?: string;
  required?: boolean;
  order?: number;
  controlType?: string;
}

export class QuestionBase<TValue> {
  value: TValue | undefined;
  key: string;
  label: string;
  required: boolean;
  order: number;
  controlType: string;

  constructor(options: QuestionOptions<TValue> = {}) {
    this.value = options.value;
    this.key = options.key ?? '';
    this.label = options.label ?? '';
    this.required = !!options.required;
    this.order = options.order === undefined ? 1 : options.order;
    this.controlType = options.controlType ?? '';
  }
}
