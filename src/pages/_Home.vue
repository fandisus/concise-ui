<template>
  <article class="home-page">
    <p class="eyebrow">Vue 3 component framework</p>
    <h1>Concise UI</h1>
    <p class="intro">
      Compact, predictable components for desktop enterprise and productivity applications.
    </p>

    <div class="actions">
      <RouterLink class="demo-button demo-button--primary" to="/components/app-bar-menu">
        Browse components
      </RouterLink>
    </div>

    <section class="principles" aria-label="Design principles">
      <div>
        <strong>Dense</strong>
        <span>Controls and layouts use space deliberately.</span>
      </div>
      <div>
        <strong>Professional</strong>
        <span>Neutral surfaces let application data stay prominent.</span>
      </div>
      <div>
        <strong>Keyboard-friendly</strong>
        <span>Desktop productivity is treated as a first-class concern.</span>
      </div>
    </section>
  </article>
</template>

<style scoped lang="scss">
.home-page {
  max-width: 760px;
  margin: 0 auto;
  padding: 56px 24px;

  .eyebrow {
    margin: 0 0 8px;
    color: var(--c-primary-color, #2f6fad);
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  h1 {
    margin: 0;
    font-size: 30px;
    line-height: 1.2;
  }

  .intro {
    max-width: 580px;
    margin: 12px 0 0;
    color: var(--c-muted-text-color, #626a75);
    font-size: 15px;
    line-height: 1.55;
  }

  .actions {
    margin-top: 22px;
  }

  .principles {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    margin-top: 48px;
    border: 1px solid var(--c-border-color, #d5d9df);

    > div {
      display: flex;
      flex-direction: column;
      min-width: 0;
      padding: 14px;
      gap: 5px;

      + div {
        border-inline-start: 1px solid var(--c-border-color, #d5d9df);
      }
    }

    span {
      color: var(--c-muted-text-color, #626a75);
      font-size: 13px;
      line-height: 1.45;
    }
  }
}
</style>
