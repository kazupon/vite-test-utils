# Getting Started

This section will introduce to your Vite application project.

## Installation

With NPM:

```sh
npm install --save-dev vite-test-utils vitest
```

With Yarn:

```sh
yarn add --dev vite-test-utils vitest
```

With PNPM:

```sh
pnpm add --save-dev vite-test-utils vitest
```

::: tip
If you have already installed `vitest` to your vite application project, You don't need to install it together with the above package maanger.
:::

## Configuration

Create a `vitest.config.ts` in your vite project root directory the below:

```ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    deps: {
      inline: [/vite-test-utils/]
    }
  }
})
```

::: tip
If you have already existing `vitest.config.ts` in your vite application project, you need to add `/vite-test-utils/` to `test.deps.inline` field.
:::

## Do you need to test in the browser?

You will need to install playwright.

With NPM:

```sh
npm install --save-dev playwright
```

With Yarn:

```sh
yarn add --dev playwright
```

With PNPM:

```sh
pnpm add --save-dev playwright
```
