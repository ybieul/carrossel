// Serviço para geração de conteúdo de slides usando Gemini 2.5
// Endpoint: generateContent
// Modelo: gemini-2.5-flash-preview-09-2025
// A resposta é parseada como texto e deve conter JSON com { slides: [...] }

export interface GeneratedSlide {
  type: 'cover' | 'content' | 'cta'
  title: string
  subtitle?: string
  content: string
  imageKeyword?: string
}

export interface GeminiResult {
  slides: GeneratedSlide[]
}

const PRIMARY_MODEL = 'gemini-2.5-flash-preview-09-2025'
const FALLBACK_MODEL = 'gemini-1.5-flash'

function getApiKey(): string {
  const envKey = (import.meta as any)?.env?.VITE_GEMINI_KEY?.trim?.() || ''
  const lsKey = typeof localStorage !== 'undefined' ? (localStorage.getItem('GEMINI_KEY') || '').trim() : ''
  const winKey = typeof window !== 'undefined' ? (window as any).__GEMINI_KEY?.trim?.() || '' : ''
  const key = envKey || lsKey || winKey
  return key
}

import { retrieveKnowledge } from './knowledge'

function formatContext(chunks: {id:string; text:string}[]): string {
  if (!chunks.length) return ''
  const lines = chunks.map((c,i)=>`[${i+1}] ${c.text}`).join('\n\n')
  return `\n\nCONTEXTO AUTORIZADO:\n${lines}\n\nREGRAS:\n- Use apenas informações acima.\n- Não invente dados fora do contexto.\n- Se faltar base suficiente, gere erro {"erro":"contexto_insuficiente"}.\n`
}

async function buildPrompt(niche: string, topic: string): Promise<string> {
  const nicheName = niche === 'barber' ? 'Barbearia' : niche === 'agro' ? 'Agronegócio' : niche
  let context = ''
  try {
    const saved = localStorage.getItem('KB_SELECTED')
    const selected = saved? JSON.parse(saved) as string[] : []
    if (selected.length) {
      const sel = await retrieveKnowledge(topic, selected)
      context = formatContext(sel.chunks)
    }
  } catch {}
  return `Gere slides para carrossel de ${nicheName} sobre: ${topic}.
Regras objetivas:
- Exatamente 4 itens em slides.
- Campos por slide: {type: 'cover'|'content'|'cta', title, subtitle?, content, imageKeyword}
- title ≤ 70 chars; subtitle (apenas no cover) ≤ 40; content ≤ 220 chars, frases curtas; imageKeyword em inglês.
- Último slide deve ser cta.
Saída: apenas JSON válido conforme schema, sem comentários ou markdown.${context}`
}

// Extrai JSON de um texto de forma tolerante (objeto OU array no topo)
function safeJsonExtractAny(text: string): any | null {
  const sanitize = (t: string) => {
    // remove fences ```json ... ``` e BOM
    let s = t.replace(/```[a-zA-Z]*\n?|```/g, '').replace(/^\uFEFF/, '')
    // recorta bloco principal: tenta primeiro array [ ... ] e depois objeto { ... }
    const oStart = s.indexOf('{')
    const oEnd = s.lastIndexOf('}')
    const aStart = s.indexOf('[')
    const aEnd = s.lastIndexOf(']')
    if (aStart !== -1 && aEnd !== -1 && aEnd > aStart) {
      // se o bloco de array parecer mais abrangente que o de objeto, prioriza
      const objLen = oStart !== -1 && oEnd !== -1 ? (oEnd - oStart) : -1
      const arrLen = aEnd - aStart
      if (arrLen > objLen) {
        s = s.slice(aStart, aEnd + 1)
      }
    }
    // Se ainda não cortou para array, tenta objeto
    if (!(s.trim().startsWith('[') && s.trim().endsWith(']'))) {
      if (oStart !== -1 && oEnd !== -1 && oEnd > oStart) s = s.slice(oStart, oEnd + 1)
    }
    // remove vírgulas penduradas antes de } ou ]
    s = s.replace(/,\s*([}\]])/g, '$1')
    return s.trim()
  }
  try {
    return JSON.parse(sanitize(text))
  } catch {
    try {
      // última tentativa: desescape de barras duplicadas
      const s = sanitize(text).replace(/\\n/g, '\n').replace(/\\t/g, '\t')
      return JSON.parse(s)
    } catch { return null }
  }
}

function tryDecodeInlineJson(base64: string): GeminiResult | null {
  try {
    if (typeof atob === 'undefined') return null
    const jsonText = atob(base64)
    return JSON.parse(jsonText)
  } catch {
    return null
  }
}

async function callModel(model: string, prompt: string, key: string) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`
  const body: any = {
    contents: [ { parts: [ { text: prompt } ] } ],
    generationConfig: {
      temperature: 0.4,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 2048,
      // Forçar JSON quando possível (algumas versões aceitam snake, outras camel)
      responseMimeType: 'application/json',
      response_mime_type: 'application/json'
    }
  }
  const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
  if (!res.ok) {
    const errorText = await res.text().catch(()=> '')
    throw new Error(`Gemini HTTP ${res.status}: ${errorText.slice(0,200)}`)
  }
  return res.json()
}

export async function generateSlidesFromTopic(niche: string, topic: string): Promise<GeminiResult> {
  const key = getApiKey()
  if (!key) throw new Error('Missing VITE_GEMINI_KEY (defina em .env ou localStorage GEMINI_KEY)')

  const prompt = await buildPrompt(niche, topic)
  let data: any
  try {
    data = await callModel(PRIMARY_MODEL, prompt, key)
  } catch (ePrimary) {
    // tenta fallback de modelo
    data = await callModel(FALLBACK_MODEL, prompt, key)
  }
  // Debug não invasivo
  if (typeof window !== 'undefined') {
    ;(window as any).__lastGeminiRaw = data
  }
  // Tenta extrair JSON por múltiplas vias (text, inlineData base64)
  let parsed: GeminiResult | null = null
  try {
    const texts: string[] = []
    const inlineJson: GeminiResult[] = []

    const scan = (node: any) => {
      if (!node) return
      if (Array.isArray(node)) { node.forEach(scan); return }
      if (typeof node === 'object') {
        // Captura campos conhecidos
        if (typeof node.text === 'string') texts.push(node.text)
        const id = node.inlineData
        if (id && typeof id?.data === 'string' && typeof id?.mimeType === 'string' && id.mimeType.includes('json')) {
          const decoded = tryDecodeInlineJson(id.data)
          if (decoded?.slides) inlineJson.push(decoded)
        }
        for (const k in node) scan(node[k])
      }
    }

    scan(data?.candidates)

    if (inlineJson.length) parsed = inlineJson[0]
    if (!parsed && texts.length) {
      const raw = texts.join('\n').trim()
      if (typeof window !== 'undefined') { (window as any).__lastGeminiText = raw }
      const maybe = safeJsonExtractAny(raw)
      if (maybe) {
        if (Array.isArray(maybe)) {
          parsed = { slides: maybe }
        } else if (maybe?.slides) {
          parsed = maybe
        } else {
          // procura qualquer propriedade que seja array de objetos com título/conteúdo
          const keys = Object.keys(maybe)
          for (const k of keys) {
            const val = (maybe as any)[k]
            if (Array.isArray(val) && val.length && typeof val[0] === 'object') {
              const hasCore = 'title' in val[0] || 'content' in val[0]
              if (hasCore) { parsed = { slides: val }; break }
            }
          }
        }
      }
    }
  } catch {}

  // Se veio objeto mas slides em string, tenta parsear slides
  if (parsed && !Array.isArray((parsed as any).slides) && typeof (parsed as any).slides === 'string') {
    try {
      const inner = safeJsonExtractAny((parsed as any).slides)
      if (Array.isArray(inner)) (parsed as any).slides = inner
      else if (inner && Array.isArray((inner as any).slides)) (parsed as any).slides = (inner as any).slides
    } catch {}
  }

  if (!parsed || !Array.isArray(parsed.slides)) {
    throw new Error('Formato de resposta inesperado do Gemini')
  }
  // Sanitiza mínimos
  parsed.slides = parsed.slides.map((s,i,arr) => ({
    type: i===arr.length-1? 'cta' : (s.type === 'cover' && i!==0? 'content' : s.type || 'content'),
    title: (s.title||'').trim().slice(0,80),
    subtitle: s.subtitle? s.subtitle.trim().slice(0,60) : undefined,
    content: (s.content||'').trim().slice(0,240),
    imageKeyword: (s.imageKeyword||'').trim().slice(0,60) || undefined
  }))
  return parsed
}
