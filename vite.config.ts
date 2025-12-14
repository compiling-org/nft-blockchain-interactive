import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'inline-api-middleware',
      configureServer(server) {
        const url = require('url')
        const sendJson = (res: any, data: any) => {
          res.statusCode = 200
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify(data))
        }
        const notFound = (res: any, message = 'Not Found') => {
          res.statusCode = 404
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ success: false, error: message }))
        }
        const listings: any[] = [
          {
            id: 'lst_seed_1',
            tokenId: 'seed_1',
            seller: 'demo-user.testnet',
            title: 'Audio-Reactive Fractal #1',
            description: 'GPU fractal seeded with live audio features',
            price: '1.5',
            currency: 'NEAR',
            category: 'AI Art',
            tags: ['fractal', 'audio', 'gpu'],
            emotion_vector: { valence: 0.62, arousal: 0.73, dominance: 0.58 },
            ai_model: 'WebGPU + TFJS',
            media_url: 'https://picsum.photos/seed/fractal1/800/600',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            status: 'active',
            views: 124,
            likes: 17,
            featured: true,
          },
          {
            id: 'lst_seed_2',
            tokenId: 'seed_2',
            seller: 'creator.testnet',
            title: 'Emotion Mesh Portrait',
            description: 'Face-mesh driven shader portrait with emotion vector mapping',
            price: '2.0',
            currency: 'NEAR',
            category: 'Biometric Art',
            tags: ['mediapipe', 'emotion'],
            emotion_vector: { valence: 0.48, arousal: 0.41, dominance: 0.55 },
            ai_model: 'MediaPipe + NN',
            media_url: 'https://picsum.photos/seed/portrait1/800/600',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            status: 'active',
            views: 89,
            likes: 9,
            featured: false,
          },
        ]
        const auctions: any[] = [
          {
            id: 'auc_seed_1',
            tokenId: 'seed_auction_1',
            seller: 'auctioneer.testnet',
            title: 'Live Generative Auction',
            description: 'Bids drive parameters of a live shader render',
            starting_price: '1.0',
            reserve_price: '1.5',
            currency: 'NEAR',
            category: 'Generative',
            emotion_vector: { valence: 0.51, arousal: 0.6, dominance: 0.5 },
            ai_model: 'WebGPU',
            media_url: 'https://picsum.photos/seed/auction1/800/600',
            created_at: new Date().toISOString(),
            end_time: new Date(Date.now() + 1000 * 60 * 30).toISOString(),
            status: 'active',
            current_bid: '1.1',
            bid_count: 3,
            featured: false,
          },
        ]
        const agents: any[] = [
          {
            id: 'bitte_fractal_master_v2',
            name: 'Fractal Master v2',
            description: 'GPU-accelerated fractal generation with emotion awareness',
            capabilities: ['fractal_generation', 'gpu_compute', 'real_time_rendering', 'emotion_awareness'],
            wallet_address: 'fractal-master-v2.bitte.near',
            ai_model: 'WebGPU + NN',
            status: 'active',
            performance: 0.96,
            usage_count: 1247,
            rating: 4.9,
            price_per_use: '200000000000000000000000',
            created_by: 'bitte_ai_team.near',
            created_at: new Date().toISOString(),
          },
          {
            id: 'bitte_emotion_analyzer_pro',
            name: 'Emotion Analyzer Pro',
            description: 'Biometric analysis and emotion detection',
            capabilities: ['emotion_detection', 'biometric_analysis', 'art_generation', 'real_time_processing'],
            wallet_address: 'emotion-analyzer-pro.bitte.near',
            ai_model: 'Biometric NN',
            status: 'active',
            performance: 0.98,
            usage_count: 2156,
            rating: 4.9,
            price_per_use: '150000000000000000000000',
            created_by: 'bitte_ai_team.near',
            created_at: new Date().toISOString(),
          },
        ]
        ;(() => {
          const now = new Date().toISOString()
          const baseEmotion = { valence: 0.6, arousal: 0.5, dominance: 0.5 }
          const sampleListings = [
            {
              id: `lst_${Date.now()}_1`,
              tokenId: `token_${Date.now()}_1`,
              seller: 'demo-user.testnet',
              title: 'Audio-Reactive Fractal',
              description: 'Interactive fractal art driven by live audio and emotion',
              price: '1.5',
              currency: 'NEAR',
              category: 'AI Art',
              tags: ['fractal', 'audio', 'gpu'],
              emotion_vector: baseEmotion,
              ai_model: 'Inline API',
              media_url: 'https://images.unsplash.com/photo-1509099871023-38e5cdcf83c9?w=1200&q=80',
              created_at: now,
              updated_at: now,
              status: 'active',
              views: 127,
              likes: 24,
              featured: true,
            },
            {
              id: `lst_${Date.now()}_2`,
              tokenId: `token_${Date.now()}_2`,
              seller: 'creator-two.testnet',
              title: 'Biometric Emotion Canvas',
              description: 'Canvas that adapts to valence, arousal, and dominance',
              price: '2.1',
              currency: 'NEAR',
              category: 'Generative',
              tags: ['biometric', 'emotion', 'neural'],
              emotion_vector: { valence: 0.7, arousal: 0.6, dominance: 0.55 },
              ai_model: 'Inline API',
              media_url: 'https://images.unsplash.com/photo-1526312426976-0c5df0b53f36?w=1200&q=80',
              created_at: now,
              updated_at: now,
              status: 'active',
              views: 89,
              likes: 31,
              featured: false,
            },
          ]
          const end = new Date(Date.now() + 60 * 60 * 1000).toISOString()
          const sampleAuctions = [
            {
              id: `auc_${Date.now()}_1`,
              tokenId: `token_${Date.now()}_a1`,
              seller: 'auctioneer.testnet',
              title: 'Live Emotion Auction',
              description: 'Real-time generated piece, bidding reacts to sensors',
              starting_price: '1.0',
              reserve_price: '1.8',
              currency: 'NEAR',
              category: 'Interactive',
              emotion_vector: { valence: 0.55, arousal: 0.65, dominance: 0.5 },
              ai_model: 'Inline API',
              media_url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&q=80',
              created_at: now,
              end_time: end,
              status: 'active',
              current_bid: '1.3',
              bid_count: 5,
              featured: true,
            },
          ]
          listings.push(...sampleListings)
          auctions.push(...sampleAuctions)
        })()
        server.middlewares.use((req, res, next) => {
          const parsed = url.parse(req.url || '', true)
          const path = parsed.pathname || ''
          if (!path.startsWith('/api')) return next()
          if (path === '/api/health' && req.method === 'GET') {
            return sendJson(res, { success: true, status: 'healthy', timestamp: new Date().toISOString(), service: 'vite-inline-api' })
          }
          if (path.startsWith('/api/marketplace/listings')) {
            if (req.method === 'GET') {
              const page = parseInt((parsed.query.page as string) || '1', 10)
              const limit = parseInt((parsed.query.limit as string) || '20', 10)
              const start = (page - 1) * limit
              const slice = listings.slice(start, start + limit)
              return sendJson(res, {
                success: true,
                listings: slice,
                pagination: { page, limit, total: listings.length, pages: Math.ceil(listings.length / limit) },
              })
            }
            if (req.method === 'POST') {
              let body = ''
              req.on('data', (chunk) => (body += chunk))
              req.on('end', () => {
                try {
                  const data = JSON.parse(body || '{}')
                  const id = `lst_${Date.now()}`
                  const listing = {
                    id,
                    tokenId: data.tokenId || id,
                    seller: data.seller || 'unknown.testnet',
                    title: data.metadata?.title || 'Untitled',
                    description: data.metadata?.description || '',
                    price: data.price || '0',
                    currency: data.currency || 'NEAR',
                    category: data.category || 'AI Art',
                    tags: [],
                    emotion_vector: data.emotionVector || { valence: 0.5, arousal: 0.5, dominance: 0.5 },
                    ai_model: 'Inline API',
                    media_url: data.metadata?.media || '',
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                    status: 'active',
                    views: 0,
                    likes: 0,
                    featured: false,
                    metadata: data.metadata,
                  }
                  listings.unshift(listing)
                  return sendJson(res, { success: true, listing })
                } catch (e) {
                  res.statusCode = 400
                  return sendJson(res, { success: false, error: 'Invalid JSON' })
                }
              })
              return
            }
          }
          if (path.startsWith('/api/marketplace/auctions')) {
            if (req.method === 'GET') {
              const page = parseInt((parsed.query.page as string) || '1', 10)
              const limit = parseInt((parsed.query.limit as string) || '10', 10)
              const start = (page - 1) * limit
              const slice = auctions.slice(start, start + limit).map((a) => ({
                ...a,
                time_remaining: Math.max(0, new Date(a.end_time).getTime() - Date.now()),
              }))
              return sendJson(res, {
                success: true,
                auctions: slice,
                pagination: { page, limit, total: auctions.length, pages: Math.ceil(auctions.length / limit) },
              })
            }
            if (req.method === 'POST' && /\/bids$/.test(path)) {
              let body = ''
              req.on('data', (chunk) => (body += chunk))
              req.on('end', () => {
                try {
                  const data = JSON.parse(body || '{}')
                  const bid = {
                    id: `bid_${Date.now()}`,
                    auction_id: 'unknown',
                    bidder: data.bidder || 'unknown',
                    amount: data.bid_amount || '0',
                    created_at: new Date().toISOString(),
                  }
                  return sendJson(res, { success: true, bid })
                } catch {
                  res.statusCode = 400
                  return sendJson(res, { success: false, error: 'Invalid JSON' })
                }
              })
              return
            }
          }
          if (path.startsWith('/api/agents')) {
            if (req.method === 'GET' && path === '/api/agents') {
              const page = parseInt((parsed.query.page as string) || '1', 10)
              const limit = parseInt((parsed.query.limit as string) || '12', 10)
              const start = (page - 1) * limit
              const slice = agents.slice(start, start + limit)
              return sendJson(res, {
                success: true,
                agents: slice,
                pagination: { page, limit, total: agents.length, pages: Math.ceil(agents.length / limit) },
              })
            }
            if (req.method === 'GET') {
              const id = path.split('/').pop()
              const agent = agents.find((a) => a.id === id)
              if (!agent) return notFound(res, 'Agent not found')
              return sendJson(res, { success: true, agent })
            }
            if (req.method === 'POST' && /\/deploy$/.test(path)) {
              let body = ''
              req.on('data', (chunk) => (body += chunk))
              req.on('end', () => {
                try {
                  const data = JSON.parse(body || '{}')
                  const endpoint = `https://api.local/${Date.now()}`
                  const deployment = {
                    id: `dep_${Date.now()}`,
                    agent_id: 'unknown',
                    user_id: data.user_id || 'unknown',
                    parameters: data.parameters || {},
                    status: 'active',
                    created_at: new Date().toISOString(),
                    endpoint_url: endpoint,
                    cost: '100000000000000000000000',
                  }
                  return sendJson(res, { success: true, deployment })
                } catch {
                  res.statusCode = 400
                  return sendJson(res, { success: false, error: 'Invalid JSON' })
                }
              })
              return
            }
          }
          if (path === '/api/analytics/market-trends' && req.method === 'GET') {
            return sendJson(res, {
              success: true,
              analytics: {
                total_listings: listings.length,
                total_auctions: auctions.length,
                total_volume: '0',
                average_price: '0',
                category_distribution: { 'AI Art': listings.length },
                emotion_statistics: {
                  valence: { avg: 0.5, min: 0, max: 1 },
                  arousal: { avg: 0.5, min: 0, max: 1 },
                  dominance: { avg: 0.5, min: 0, max: 1 },
                },
                top_categories: [{ category: 'AI Art', count: listings.length }],
              },
            })
          }
          if (path === '/api/analytics/top-agents' && req.method === 'GET') {
            return sendJson(res, {
              success: true,
              top_agents: {
                by_usage: agents.slice().sort((a, b) => b.usage_count - a.usage_count).slice(0, 3),
                by_rating: agents.slice().sort((a, b) => b.rating - a.rating).slice(0, 3),
              },
            })
          }
          return next()
        })
      },
    },
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3002,
    host: '0.0.0.0',
    strictPort: true,
    hmr: {
      overlay: false
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      external: [
        '@polkadot/x-globalThis',
        '@polkadot/x-randomvalues/browser',
        '@polkadot/util-crypto',
        '@polkadot/util',
        '@polkadot/keyring',
        '@polkadot/types',
        '@polkadot/api',
        '@polkadot/api-contract',
        '@polkadot/extension-dapp'
      ],
    },
  },
  define: {
    global: 'globalThis',
    'process.env': {},
  },
  optimizeDeps: {
    include: ['near-api-js'],
  },
})
