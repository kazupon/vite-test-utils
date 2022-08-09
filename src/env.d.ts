declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production'
    __VTU_PORT?: string
    __VTU_MODE?: string
    __VTU_FIXTURE_ROOT?: string
    __VTU_FIXTURE_BUILD_DIR?: string
    __VTU_FIXTURE_CONFIG_FILE?: string
    __VTU_FIXTURE_VITE_CONFIG?: string
    __VTU_FIXTURE_VITE_CONFIG_FILE?: string
  }
}

declare let __BUILD__: boolean
