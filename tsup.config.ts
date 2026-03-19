import { resolve } from 'node:path';

import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  outDir: 'dist',
  clean: true,
  banner: { js: '#!/usr/bin/env node' },
  esbuildOptions(options) {
    options.alias = { '@': resolve('./src') };
  },
});
