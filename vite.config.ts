import { defineConfig, Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import path from 'path'

// Virtual module ID for rpc-websockets shim
const RPC_WS_SHIM_ID = '\0rpc-websockets-shim'

// Plugin to fix rpc-websockets imports for old @solana/web3.js in jito-ts
function fixRpcWebsockets(): Plugin {
  return {
    name: 'fix-rpc-websockets',
    resolveId(source) {
      if (source === 'rpc-websockets/dist/lib/client' ||
        source === 'rpc-websockets/dist/lib/client/websocket.browser') {
        return RPC_WS_SHIM_ID
      }
      if (source.includes('rpc-websockets') && source.includes('websocket.browser')) {
        return RPC_WS_SHIM_ID
      }
      return null
    },
    load(id) {
      if (id === RPC_WS_SHIM_ID) {
        // Provide a shim that exports what jito-ts's old @solana/web3.js expects
        return `
          import { Client } from 'rpc-websockets';
          export default Client;
          export { Client as createRpc };
        `
      }
      return null
    },
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    fixRpcWebsockets(),
    nodePolyfills({
      // Required for Solana web3.js and Drift SDK
      include: ['buffer', 'crypto', 'stream', 'util', 'events', 'process', 'vm', 'path', 'os', 'fs'],
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
    }),
  ],
  define: {
    'process.env': {},
  },
  resolve: {
    alias: {
      buffer: 'buffer',
    },
  },
  optimizeDeps: {
    include: ['buffer', 'rpc-websockets'],
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
    },
  },
  build: {
    rollupOptions: {
      external: [],
    },
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
})
