import type { ComputedRef, InjectionKey } from 'vue'

export interface CFormFieldContext {
  controlId: ComputedRef<string>
  describedBy: ComputedRef<string | undefined>
  invalid: ComputedRef<boolean>
  required: ComputedRef<boolean>
}

export const cFormFieldKey: InjectionKey<CFormFieldContext> = Symbol('c-form-field')
