import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Build as a library
    lib: {
      entry: 'src/main.jsx', // Your library's entry point
      name: 'ChatWidget',   // A global variable name for your library
      fileName: (format) => `chat-widget.${format}.js`, // The name of the output file
    },
    // Don't produce a separate CSS file; inject it directly into the JS bundle
    // This makes it MUCH easier for your clients. One file is all they need.
    cssCodeSplit: false, 
  }
})