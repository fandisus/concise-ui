<template>
  <div class="c-input-group">
    <slot />
  </div>
</template>

<style scoped lang="scss">
.c-input-group {
  display: flex;
  width: 100%;
  min-width: 0;

  > :deep(*) {
    margin-inline-start: -1px;
  }

  > :deep(:first-child) {
    margin-inline-start: 0;
  }

  > :deep(.c-input),
  > :deep(.c-password),
  > :deep(.c-number-input) {
    flex: 1 1 auto;
    min-width: 0;
  }

  > :deep(.c-input),
  > :deep(.c-button),
  > :deep(.c-input-addon) {
    border-radius: 0;
  }

  > :deep(:first-child.c-input),
  > :deep(:first-child.c-button),
  > :deep(:first-child.c-input-addon) {
    border-start-start-radius: var(--c-border-radius, 3px);
    border-end-start-radius: var(--c-border-radius, 3px);
  }

  > :deep(:last-child.c-input),
  > :deep(:last-child.c-button),
  > :deep(:last-child.c-input-addon) {
    border-start-end-radius: var(--c-border-radius, 3px);
    border-end-end-radius: var(--c-border-radius, 3px);
  }

  > :deep(.c-password:not(:first-child) .input),
  > :deep(.c-number-input:not(:first-child) .decrement),
  > :deep(.c-number-input:not(:first-child) .input:first-child) {
    border-start-start-radius: 0;
    border-end-start-radius: 0;
  }

  > :deep(.c-password:not(:last-child) .toggle),
  > :deep(.c-password:not(:last-child) .input:last-child),
  > :deep(.c-number-input:not(:last-child) .increment),
  > :deep(.c-number-input:not(:last-child) .input:last-child) {
    border-start-end-radius: 0;
    border-end-end-radius: 0;
  }

  > :deep(:focus-within) {
    position: relative;
    z-index: 1;
  }
}
</style>
