<script setup lang="ts">
withDefaults(
  defineProps<{
    tag?: string
  }>(),
  {
    tag: 'div',
  },
)
</script>

<template>
  <component :is="tag" class="c-app-bar">
    <div v-if="$slots.start" class="section start">
      <slot name="start" />
    </div>

    <div v-if="$slots.center" class="section center">
      <slot name="center" />
    </div>

    <div v-if="$slots.end" class="section end">
      <slot name="end" />
    </div>
  </component>
</template>

<style scoped lang="scss">
.c-app-bar {
  box-sizing: border-box;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
  align-items: center;
  width: 100%;
  min-height: var(--c-app-bar-height, 38px);
  padding: var(--c-app-bar-padding, 3px 8px);
  color: var(--c-text-color, #20242a);
  background: var(--c-surface-color, #fff);
  border-bottom: 1px solid var(--c-border-color, #d5d9df);

  .section {
    display: flex;
    align-items: center;
    min-width: 0;
    gap: var(--c-app-bar-gap, 6px);
  }

  .start {
    grid-column: 1;
    justify-self: start;
  }

  .center {
    grid-column: 2;
    justify-self: center;
  }

  .end {
    grid-column: 3;
    justify-self: end;
  }
}
</style>
