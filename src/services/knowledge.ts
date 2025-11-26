// Serviço de conhecimento: carrega arquivos .md, faz chunking e recupera blocos relevantes
// Primeira versão: chunking simples + score léxico por termo

export interface KnowledgeChunk {
  id: string
  source: string
  text: string
}

export interface KnowledgeSelection {
  sourceIds: string[]
  chunks: KnowledgeChunk[]
}

// Listar arquivos em src/knowledge via Vite glob (modo raw)
// Nota: 'as: "raw"' foi deprecado. Usamos query: '?raw' + import: 'default'.
// Para máxima compatibilidade em dev/build, combinamos múltiplos padrões relativos e absolutos.
// Vite 5 aceita múltiplos globs individuais; aqui mesclamos manualmente em um único mapa.
// Use a sintaxe com option 'query: "?raw"' em vez de embutir na pattern, para compatibilidade com Vite 5.
const filesRoot = import.meta.glob('/src/knowledge/*.md', { query: '?raw', import: 'default' }) as Record<string, () => Promise<string>>
const filesRootDeep = import.meta.glob('/src/knowledge/**/*.md', { query: '?raw', import: 'default' }) as Record<string, () => Promise<string>>
const filesRel = import.meta.glob('../knowledge/*.md', { query: '?raw', import: 'default' }) as Record<string, () => Promise<string>>
const filesRelDeep = import.meta.glob('../knowledge/**/*.md', { query: '?raw', import: 'default' }) as Record<string, () => Promise<string>>
const files = { ...filesRoot, ...filesRootDeep, ...filesRel, ...filesRelDeep } as Record<string, () => Promise<string>>

export async function listKnowledgeSources(): Promise<{ id:string; name:string }[]> {
  return Object.keys(files).map((path) => {
    const name = path.split('/').pop() || path
    return { id: path, name }
  })
}

// Debug: obter os paths detectados pelo glob
export function getKnowledgeDebugPaths(): string[] {
  return Object.keys(files)
}

export async function loadSources(sourceIds: string[]): Promise<Record<string, string>> {
  const map: Record<string,string> = {}
  for (const id of sourceIds) {
    const loader = files[id]
    if (!loader) continue
    const raw = await loader()
    map[id] = raw || ''
  }
  return map
}

function chunkMarkdown(raw: string, source: string): KnowledgeChunk[] {
  const lines = raw.split(/\r?\n/)
  const chunks: KnowledgeChunk[] = []
  let buffer: string[] = []
  const flush = () => {
    const text = buffer.join('\n').trim()
    if (text.length >= 50) {
      chunks.push({ id: `${source}#${chunks.length+1}` , source, text })
    }
    buffer = []
  }
  for (const line of lines) {
    if (/^#{1,4}\s/.test(line) || line.trim()==='') {
      if (buffer.length) flush()
      if (line.trim()) buffer.push(line)
    } else {
      buffer.push(line)
      // limitar chunk
      if (buffer.join('\n').length > 900) flush()
    }
  }
  if (buffer.length) flush()
  return chunks
}

function tokenize(s: string): string[] {
  return s.toLowerCase().normalize('NFKC').replace(/[^\p{L}\p{N}\s]/gu,' ').split(/\s+/).filter(Boolean)
}

function scoreChunkByQuery(chunk: KnowledgeChunk, queryTokens: string[]): number {
  const tokens = tokenize(chunk.text)
  let score = 0
  for (const qt of queryTokens) {
    const freq = tokens.filter(t=>t===qt).length
    score += freq
  }
  // bônus se aparecer em heading
  if (/^#{1,4}\s/.test(chunk.text.split('\n')[0]||'')) score += 0.5
  return score
}

export async function retrieveKnowledge(topic: string, sourceIds: string[], limitChars = 1400): Promise<KnowledgeSelection> {
  const rawMap = await loadSources(sourceIds)
  const allChunks: KnowledgeChunk[] = []
  for (const id of Object.keys(rawMap)) {
    const chunks = chunkMarkdown(rawMap[id], id)
    allChunks.push(...chunks)
  }
  const qTokens = tokenize(topic).filter(t=>t.length>2)
  const ranked = allChunks
    .map(c=>({ c, s: scoreChunkByQuery(c,qTokens) }))
    .sort((a,b)=> b.s - a.s)
    .map(x=>x.c)

  const selected: KnowledgeChunk[] = []
  let acc = 0
  for (const c of ranked) {
    if (acc + c.text.length > limitChars) break
    selected.push(c)
    acc += c.text.length
  }
  return { sourceIds, chunks: selected }
}
