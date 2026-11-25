import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// In `npm run dev`, serve /api/chat from api/chat.js so the assistant works locally
// with GEMINI_API_KEY in .env.local. On Vercel the same file runs as a serverless function.
function localApi() {
  return {
    name: 'local-api',
    configureServer(server) {
      server.middlewares.use('/api/chat', async (req, res) => {
        if (req.method !== 'POST') { res.statusCode = 405; return res.end() }
        const chunks = []
        for await (const c of req) chunks.push(c)
        const { POST } = await server.ssrLoadModule('/api/chat.js')
        const response = await POST(new Request(`http://${req.headers.host}/api/chat`, {
          method: 'POST',
          headers: { 'content-type': 'application/json', host: req.headers.host, ...(req.headers.origin ? { origin: req.headers.origin } : {}) },
          body: Buffer.concat(chunks),
        }))
        res.statusCode = response.status
        res.setHeader('content-type', 'application/json')
        res.end(await response.text())
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  Object.assign(process.env, loadEnv(mode, process.cwd(), ''))
  return { plugins: [react(), localApi()] }
})
