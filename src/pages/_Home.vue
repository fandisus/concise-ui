<template>
  <article class="home-page">
    <section class="hero" aria-labelledby="home-title">
      <div class="hero-copy">
        <p class="eyebrow">Vue 3 component framework</p>
        <h1 id="home-title">Effective UI.<br />Concise code.</h1>
        <p class="intro">
          Compact, predictable components built for desktop enterprise and productivity
          applications.
        </p>

        <div class="actions">
          <RouterLink class="demo-button demo-button--primary" to="/components/installation">
            Get started
          </RouterLink>
          <RouterLink class="demo-button" to="/components/app-bar-menu">
            Browse components
          </RouterLink>
        </div>
      </div>

      <div class="identity" aria-label="Concise UI">
        <img src="/concise-ui-mark.png" alt="" width="176" height="176" />
        <div class="wordmark">concise-ui</div>
        <div class="tagline">Effective UI <span aria-hidden="true">•</span> Concise code</div>
      </div>
    </section>

    <section class="principles" aria-label="Design principles">
      <div>
        <span class="principle-icon" aria-hidden="true">◎</span>
        <span><strong>Concise</strong>Do more with less code.</span>
      </div>
      <div>
        <span class="principle-icon" aria-hidden="true">▦</span>
        <span><strong>UI first</strong>Thoughtful, information-dense controls.</span>
      </div>
      <div>
        <span class="principle-icon" aria-hidden="true">&lt;/&gt;</span>
        <span><strong>Developer friendly</strong>Predictable APIs and native Vue patterns.</span>
      </div>
      <div>
        <span class="principle-icon" aria-hidden="true">ϟ</span>
        <span><strong>Effective</strong>Built for real-world applications.</span>
      </div>
    </section>
  </article>
</template>

<style scoped lang="scss">
.home-page {
  width: 100%;
  max-width: 1080px;
  margin: 0 auto;
  padding: clamp(36px, 7vw, 76px) 24px 40px;

  .hero {
    display: grid;
    grid-template-columns: minmax(0, 1.25fr) minmax(260px, 0.75fr);
    align-items: center;
    min-height: 330px;
    border-bottom: 1px solid var(--c-border-color, #d5d9df);
    gap: clamp(36px, 7vw, 84px);
  }

  .hero-copy {
    padding-bottom: 44px;
  }

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
    color: #0f172a;
    font-size: clamp(38px, 6vw, 64px);
    line-height: 1.04;
    letter-spacing: -0.045em;
  }

  .intro {
    max-width: 600px;
    margin: 18px 0 0;
    color: var(--c-muted-text-color, #626a75);
    font-size: 15px;
    line-height: 1.6;
  }

  .actions {
    display: flex;
    flex-wrap: wrap;
    margin-top: 22px;
    gap: 8px;
  }

  .identity {
    display: flex;
    align-items: center;
    justify-self: center;
    flex-direction: column;
    padding-bottom: 44px;
    text-align: center;

    img {
      display: block;
      width: clamp(124px, 16vw, 176px);
      height: auto;
      aspect-ratio: 1;
      object-fit: contain;
    }

    .wordmark {
      margin-top: -8px;
      color: #0f172a;
      font-size: clamp(28px, 4vw, 42px);
      font-weight: 700;
      line-height: 1;
      letter-spacing: -0.035em;
    }

    .tagline {
      margin-top: 12px;
      color: #64748b;
      font-size: 10px;
      font-weight: 600;
      letter-spacing: 0.2em;
      text-transform: uppercase;

      span {
        color: #2563eb;
      }
    }
  }

  .principles {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    margin-top: 24px;

    > div {
      display: flex;
      align-items: flex-start;
      min-width: 0;
      padding: 12px 18px;
      gap: 10px;

      + div {
        border-inline-start: 1px solid var(--c-border-color, #d5d9df);
      }
    }

    > div > span:last-child {
      display: flex;
      flex-direction: column;
      color: var(--c-muted-text-color, #626a75);
      font-size: 12px;
      line-height: 1.4;
      gap: 3px;
    }

    strong {
      color: var(--c-text-color, #20242a);
      font-size: 12px;
      text-transform: uppercase;
    }

    .principle-icon {
      flex: none;
      color: #2563eb;
      font-size: 22px;
      font-weight: 600;
      line-height: 1;
    }
  }
}

@media (max-width: 760px) {
  .home-page {
    .hero {
      grid-template-columns: 1fr;
      gap: 0;
    }

    .hero-copy {
      padding-bottom: 28px;
    }

    .identity {
      align-items: flex-start;
      justify-self: start;
      padding-bottom: 36px;
      text-align: start;

      img {
        width: 96px;
      }
    }

    .principles {
      grid-template-columns: repeat(2, minmax(0, 1fr));

      > div:nth-child(3) {
        border-inline-start: 0;
      }
    }
  }
}

@media (max-width: 460px) {
  .home-page .principles {
    grid-template-columns: 1fr;

    > div + div {
      border-top: 1px solid var(--c-border-color, #d5d9df);
      border-inline-start: 0;
    }
  }
}
</style>
