import type { Plugin } from 'vite'

export default function plugin(): Plugin {
  return {
    name: 'my-plugin',
    resolveId: (id: string) => {
      if (id === 'virtual:module1') {
        return id
      }
    },
    load: (id: string) => {
      if (id === 'virtual:module1') {
        return 'export default "this is module1"'
      }
    }
  }
}
