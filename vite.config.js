import { defineConfig } from 'vite';
import vitePluginAngular from 'vite-plugin-angular';

export default defineConfig({
  plugins: [
    vitePluginAngular({
      appEntryFile: '/src/main.ts'
    })
  ]  
})