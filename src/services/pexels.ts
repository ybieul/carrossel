import type { Theme } from '../core/types'

const API_BASE = 'https://api.pexels.com'

export interface PexelsPhotoSrc {
  original: string
  large2x?: string
  large?: string
  medium?: string
  small?: string
  portrait?: string
  landscape?: string
  tiny?: string
}
export interface PexelsPhoto {
  id: number
  width: number
  height: number
  url: string
  photographer: string
  photographer_url?: string
  alt?: string
  src: PexelsPhotoSrc
}
export interface PexelsPhotoResponse {
  page: number
  per_page: number
  photos: PexelsPhoto[]
  total_results: number
  next_page?: string
}

export interface NormalizedPhoto {
  id: number
  alt: string
  url: string
  width: number
  height: number
  preview: string
  original: string
  photographer?: string
}

const getKey = () => {
  // 1) Vite .env
  const rawEnv = (import.meta as any)?.env?.VITE_PEXELS_KEY
  const envKey = typeof rawEnv === 'string' ? rawEnv.trim() : ''
  // 2) LocalStorage fallback (permite configurar sem rebuild)
  const lsKey = typeof localStorage !== 'undefined' ? (localStorage.getItem('PEXELS_KEY') || '').trim() : ''
  // 3) Window global fallback (para injecções manuais)
  const winKey = typeof window !== 'undefined' ? (window as any).__PEXELS_KEY?.trim?.() || '' : ''
  const key = envKey || lsKey || winKey
  if (!key) {
    throw new Error('Missing VITE_PEXELS_KEY: defina em .env (ex: VITE_PEXELS_KEY=seu_token), ou salve em localStorage (PEXELS_KEY), e reinicie o servidor')
  }
  return key
}

export async function searchPhotos(query: string, page = 1, perPage = 15): Promise<{items: NormalizedPhoto[]; total: number}> {
  const key = getKey()
  const url = `${API_BASE}/v1/search?query=${encodeURIComponent(query)}&per_page=${perPage}&page=${page}`
  const res = await fetch(url, { headers: { Authorization: key } })
  if (!res.ok) throw new Error(`Pexels error ${res.status}`)
  const data = await res.json() as PexelsPhotoResponse
  const items: NormalizedPhoto[] = data.photos.map(p => ({
    id: p.id,
    alt: p.alt || 'Foto Pexels',
    url: p.url,
    width: p.width,
    height: p.height,
    preview: p.src.large || p.src.medium || p.src.small || p.src.original,
    original: p.src.original,
    photographer: p.photographer
  }))
  return { items, total: data.total_results }
}
