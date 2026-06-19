import { defineConfig } from 'astro/config';

// Static output: build produces plain HTML/CSS/JS, no Node server required at runtime.
export default defineConfig({
  output: 'static',
});
