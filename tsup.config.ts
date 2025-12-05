import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/**/*.{ts,js}'],
  format: ['esm'],
  dts: true,
  outDir: 'dist',
  splitting: false,
  clean: false,
  minify: 'terser',
  terserOptions: {
    compress: true,
    mangle: false,
    format: {
      comments: false,
    },
  },
})
