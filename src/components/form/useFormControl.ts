import { computed, inject, useAttrs } from 'vue'

import { cFormFieldKey } from '../form-field/context'

export function useFormControl(props: { invalid: boolean; required: boolean }) {
  const attrs = useAttrs()
  const field = inject(cFormFieldKey, undefined)

  const controlId = computed(() => {
    const id = attrs.id
    return typeof id === 'string' ? id : field?.controlId.value
  })

  const describedBy = computed(() => {
    const value = attrs['aria-describedby']
    return typeof value === 'string' ? value : field?.describedBy.value
  })

  const invalid = computed(() => props.invalid || Boolean(field?.invalid.value))
  const required = computed(() => props.required || Boolean(field?.required.value))

  return { controlId, describedBy, invalid, required }
}
