# vite-test-utils

[![NPM downloads](https://img.shields.io/npm/dm/vite-test-utils.svg)](https://npmjs.com/package/vite-test-utils)
[![version](https://img.shields.io/npm/v/vite-test-utils/latest.svg)](https://npmjs.com/package/vite-test-utils)
[![CI](https://github.com/kazupon/vite-test-utils/actions/workflows/ci.yaml/badge.svg)](https://github.com/kazupon/vite-test-utils/actions/workflows/ci.yaml)

Test utilties for Vite Application

## π Features

- Approachable test utils
  - Out-of-box like web starndard fetch API, manually server and browser control API, these can be used as they are.
- Instant server and browser start
  - With vite dev or preview server and playwright, itβs no need to ready for boilerplate code for integration / e2e testing.
- Fixture based on vite config and overridable
  - Get ready for your integration / e2e test environment with vite config and you can override it.
- Optimized for Vitest
  - Feel the lightning speed integration / e2e testing with vitest!

## π Documentation

See the [docs site](https://kazupon.github.io/vite-test-utils/).

## π Contributing guidelines

If you are interested in contributing to `vite-test-utils`, I highly recommend checking out [the contributing guidelines](/CONTRIBUTING.md) here. You'll find all the relevant information such as [how to make a PR](/CONTRIBUTING.md#pull-request-guidelines), [how to setup development](/CONTRIBUTING.md#development-setup)) etc., there.

## π Special thanks!

This project is inspired, influenced by the following awesome projects:

- π [`nuxt`](https://v3.nuxtjs.org/)
  - [`@nuxt/test-utils`](https://github.com/nuxt/framework/tree/main/packages/test-utils) package
- π‘ [`unjs`](https://github.com/unjs)
  - use the several packages
- β‘ [`vite`](https://vitejs.dev/)
  - fork from config loading logic
- β [`vitest`](https://vitest.dev/)
  - integrate setup / teardown hooks and context API

## Β©οΈ License

[MIT](https://opensource.org/licenses/MIT)
