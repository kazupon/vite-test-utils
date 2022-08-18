# Setup

## Setting up the test context

In each describe block where you are taking advantage of the `vite-test-utils` helper APIs, you will need to set up the test context before beginning:

```ts
import { setup } from 'vite-test-utils'

await setup({
  // test context options
})

test('test case 1', () => {
  // ...
})
```

Behind the scenes, `setup` performs a number of tasks in `beforeAll`, `beforeEach`, `afterEach` and `afterAll` to setup the Vite test environment correctly.

This means it must be run before any other calls to test or it.

## `setup` options

### Paths and Vite configuration

#### rootDir

The root directory path that is put in your vite application project.

If vite-test-utils could not find vite config in this option, it falls back to `process.cwd()`

- Type: `string`
- Default: `process.cwd()`

#### configFile

The vite config **filename** which is used in test fixture.

If vite config file is specified with this option, it will be respected over the default config file that will be resolved by vite.

The file for this option is **relative** to the directory specified in the `rootDir` option.

- Type: `string`
- Default: `'vite.config.ts' | 'vite.config.js' | 'vite.config.mjs' | 'vite.config.mts' | 'vite.config.cjs' | 'vite.config.cts'`

#### viteConfig

The vite config that is overrided the config resolved by utils.

Simply, use this option if you hope override the vite config with **javascript premitive value** such as object or string.

If you hope set up programmaticaly overrides using like `import` syntax, you must prepare the vite config for the override and specify it with `viteConfigPath`.

- Type: `UserConfig`
- Default: `{}`

#### viteConfigFile

The vite config file path that is overrided the config resolved by utils.

If this option is specified, it's respected than `viteConfig` option.

- Type: `string` | `undefined`
  : Default: `undefined`

### Features to enable

#### mode

The vite server working mode.

If you use `'dev'`, vite-test-utils will start dev server, else you use `'preview'` vite-test-utils will build fixture and start preview server.

- Type: `string`
- Default: `'dev'`

#### server

Whether to launch a server to respond to requests in the test suite.

- Type: `boolean`
- Default: `true`

#### browser

Under the hood, vite-test-utils uses [`playwright`](https://playwright.dev/) to carry out browser testing. If this option is set, a browser will be launched and can be controlled in the subsequent test suite. (More info can be found [here](/api-reference/browser-testing).)

- Type: `boolean`
- Default: `true`

#### browserOptions

- Type: `object` with the following properties
  - **type**: The type of browser to launch - either `chromium`, `firefox` or `webkit`
  - **launch**: `object` of options that will be passed to playwright when launching the browser. See [full API reference](https://playwright.dev/docs/api/class-browsertype#browser-type-launch).
