import { defineConfig } from 'vitepress'
import { version } from '../../package.json'

let base = '/vite-test-utils/'
if (process.env.NODE_ENV === 'development') {
  // NOTE: Workaround for dev server not starting with base option in vitepress v1 alpha 8
  base = '/'
}

export default defineConfig({
  lang: 'en-US',
  title: 'Vite Test Utils',
  description: 'Test utilties for Vite application',

  lastUpdated: true,

  vue: {
    reactivityTransform: true
  },

  base,

  themeConfig: {
    socialLinks: [
      { icon: 'github', link: 'https://github.com/kazupon/vite-test-utils' },
      { icon: 'twitter', link: 'https://twitter.com/kazu_pon' }
    ],

    nav: nav(),

    sidebar: {
      '/guide/': sidebarGuide()
      // '/api/': sidebarAPI()
    },

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright ©2022-present Kazuya Kawaguchi'
    }
  }
})

function nav() {
  return [
    { text: 'Guide', link: '/guide/getting-started', activeMatch: '/guide/' },
    // { text: 'API', link: '/api/index', activeMatch: '/api/' },
    {
      text: version,
      items: [
        {
          text: 'Changelog',
          link: 'https://github.com/kazupon/vite-test-utils/releases'
        },
        {
          text: 'Contributing',
          link: 'https://github.com/kazupon/vite-test-utils/blob/main/CONTRIBUTING.md'
        }
      ]
    }
  ]
}

function sidebarGuide() {
  return [
    {
      text: 'Introduction',
      collapsible: true,
      items: [
        { text: 'Credits', link: '/guide/credits' },
        { text: 'Getting Started', link: '/guide/getting-started' }
      ]
    },
    {
      text: 'Writing Tests',
      collapsible: true,
      items: [
        { text: 'Setup', link: '/guide/setup' },
        { text: 'Testing for browser', link: '/guide/browser' },
        { text: 'Testing for server', link: '/guide/server' }
      ]
    }
  ]
}

function sidebarAPI() {
  return [
    // {
    //   text: 'API',
    //   collapsible: true,
    //   items: [{ text: 'API Reference', link: '/api/index' }]
    // }
  ]
}
