import { useEffect, useRef, useState } from 'react'
import { Slide, Theme, Profile, FontPair, Format, Layout } from '../core/types'
import { searchPhotos } from '../services/pexels'
import { NICHES, FONT_PAIRS, FORMATS } from '../core/config'
import { generateSlidesFromTopic } from '../services/gemini'

const STORAGE_KEY = 'niche_carousel_state_v2'

const generateId = () => (crypto?.randomUUID ? crypto.randomUUID() : `id_${Date.now()}_${Math.random().toString(36).slice(2)}`)
const sanitizeText = (s = '') => String(s).replace(/[<>]/g, '').trim()
const clamp = (s = '', max = 200) => (s.length > max ? s.slice(0, max) : s)

export const useCarouselState = () => {
  // Estado principal
  const [activeNiche, setActiveNiche] = useState<'barber'|'agro'>('barber')
  const currentNicheData = NICHES[activeNiche]
  const [slides, setSlides] = useState<Slide[]>(() => currentNicheData.defaultSlides.map(s => ({ ...s, id: s.id || generateId() })))
  const [theme, setTheme] = useState<Theme>(currentNicheData.defaultTheme)
  const [profile, setProfile] = useState<Profile>(currentNicheData.defaultProfile)
  // Removido activeImageStyle (era usado para Pollinations)
  const [activeSlideIndex, setActiveSlideIndex] = useState(0)
  const [viewMode, setViewMode] = useState<'edit'|'grid'>('edit')
  const [activeTab, setActiveTab] = useState<'design'|'profile'|'content'>('design')
  const [topic, setTopic] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [dragedIndex, setDragedIndex] = useState<number|null>(null)
  const [activeFormat, setActiveFormat] = useState<'instagram'|'linkedin'|'presentation'>('instagram')
  const [activeFontPair, setActiveFontPair] = useState<'bold'|'modern'|'elegant'|'tech'|'lufga'>('bold')
  const [activeLayout, setActiveLayout] = useState<Layout>('classic')
  const [fontScales, setFontScales] = useState({ title: 1, subtitle: 1, body: 1 })
  // Temas salvos e referência original para reset rápido
  const [savedThemes, setSavedThemes] = useState<Theme[]>([])
  const originalThemeRef = useRef<Theme|undefined>(undefined)

  // Export avançado (mantido aqui para centralizar estado)
  const [exportProgress, setExportProgress] = useState(0)
  const [exportTotal, setExportTotal] = useState(0)
  const [exportScale, setExportScale] = useState<number>(2)
  const [exportTransparent, setExportTransparent] = useState(false)

  // Mídia (Pexels)
  const [mediaQuery, setMediaQuery] = useState('')
  const [mediaLoading, setMediaLoading] = useState(false)
  const [mediaError, setMediaError] = useState<string|undefined>(undefined)
  const [mediaResults, setMediaResults] = useState<Array<{ id:number; alt:string; preview:string; original:string; photographer?:string }>>([])

  // Histórico (undo/redo)
  const pastRef = useRef<any[]>([])
  const futureRef = useRef<any[]>([])
  const snapshotState = () => ({ slides, theme, profile, activeFormat, activeFontPair, activeLayout, fontScales, activeSlideIndex, activeNiche })
  const commitHistory = (prev:any) => { pastRef.current.push(prev); futureRef.current = [] }
  function Object_assignState(obj:any){
  setSlides(obj.slides); setTheme(obj.theme); setProfile(obj.profile); setActiveFormat(obj.activeFormat); setActiveFontPair(obj.activeFontPair); setActiveLayout(obj.activeLayout); setFontScales(obj.fontScales); setActiveSlideIndex(obj.activeSlideIndex); setActiveNiche(obj.activeNiche)
  }
  const undo = () => { const past = pastRef.current; if (!past.length) return; const last = past.pop(); futureRef.current.push(snapshotState()); Object_assignState(last) }
  const redo = () => { const future = futureRef.current; if (!future.length) return; const next = future.pop(); pastRef.current.push(snapshotState()); Object_assignState(next) }

  // Persistência
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return
      const saved = JSON.parse(raw)
      if (saved.activeNiche && NICHES[saved.activeNiche]) setActiveNiche(saved.activeNiche)
      if (saved.theme) setTheme(saved.theme)
      if (saved.profile) setProfile(saved.profile)
      if (saved.slides?.length) setSlides(saved.slides)
      
      if (saved.activeFormat) setActiveFormat(saved.activeFormat)
      if (saved.activeFontPair) setActiveFontPair(saved.activeFontPair)
      if (saved.activeLayout) setActiveLayout(saved.activeLayout)
      if (saved.fontScales) setFontScales(saved.fontScales)
      if (saved.savedThemes) setSavedThemes(saved.savedThemes)
      if (saved.originalTheme) originalThemeRef.current = saved.originalTheme
      if (typeof saved.activeSlideIndex === 'number') setActiveSlideIndex(Math.max(0, Math.min(saved.activeSlideIndex, (saved.slides?.length || 1)-1)))
    } catch {}
  }, [])
  useEffect(() => {
    const toSave = { ...snapshotState(), savedThemes, originalTheme: originalThemeRef.current }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave))
  }, [slides, theme, profile, activeFormat, activeFontPair, activeLayout, fontScales, activeSlideIndex, activeNiche, savedThemes])

  // Niche change
  const handleNicheChange = (nicheId: 'barber'|'agro') => {
    if (nicheId === activeNiche) return
    const data = NICHES[nicheId]
    setActiveNiche(nicheId)
    setTheme(data.defaultTheme)
    originalThemeRef.current = data.defaultTheme
    setSlides(data.defaultSlides.map(s=>({...s, id: s.id || generateId()})))
    setProfile(data.defaultProfile)
    
    setActiveSlideIndex(0)
  }

  // Slide operations
  const addSlide = () => { const prev = snapshotState(); commitHistory(prev); setSlides([...slides, { id: generateId(), type:'content', title:'Novo Tópico', content:'Insira seu conteúdo aqui.', subtitle:'', imageKeyword: activeNiche==='agro'?'farm':'barbershop'}]); setActiveSlideIndex(slides.length) }
  const duplicateSlide = (index:number) => { const src = slides[index]; if(!src) return; const prev = snapshotState(); commitHistory(prev); const clone = {...src, id: generateId()}; const ns=[...slides]; ns.splice(index+1,0,clone); setSlides(ns); setActiveSlideIndex(index+1) }
  const moveSlide = (from:number,to:number) => { if (to<0||to>=slides.length) return; const prev=snapshotState(); commitHistory(prev); const ns=[...slides]; const [it]=ns.splice(from,1); ns.splice(to,0,it); setSlides(ns); setActiveSlideIndex(to) }
  const removeSlide = (index:number) => { if (slides.length<=1) return; const prev=snapshotState(); commitHistory(prev); const ns=slides.filter((_,i)=>i!==index); setSlides(ns); if (activeSlideIndex>=ns.length) setActiveSlideIndex(ns.length-1) }

  const [aiError, setAiError] = useState<string|undefined>(undefined)

  // Geração usando Gemini com fallback local
  const generateCarousel = async () => {
    const rawTopic = topic.trim()
    if (!rawTopic) return
    setIsGenerating(true)
    setAiError(undefined)
    try {
      const result = await generateSlidesFromTopic(activeNiche, rawTopic)
      const genSlides: Slide[] = result.slides.map(s => ({
        id: generateId(),
        type: s.type === 'cover' && result.slides.indexOf(s)!==0 ? 'content' : s.type,
        title: sanitizeText(s.title),
        subtitle: s.subtitle ? sanitizeText(s.subtitle) : '',
        content: sanitizeText(s.content),
        imageKeyword: s.imageKeyword || (activeNiche==='agro'?'farm':'barbershop')
      }))
      if (genSlides.length) {
        setSlides(genSlides)
        setActiveSlideIndex(0)
      } else {
        throw new Error('Resposta vazia da IA')
      }
    } catch (e:any) {
      // Fallback simulada
      setAiError(e?.message || 'Falha na geração via IA, usando fallback local.')
      if(activeNiche==='agro') {
        setSlides([
          { id: generateId(), type:'cover', title: sanitizeText(rawTopic) || 'Tecnologia no Campo', subtitle:'Agricultura 4.0', imageKeyword:'smart farming', content:'O futuro da produtividade rural.'},
          { id: generateId(), type:'content', title:'Drones', content:'Monitoramento aéreo detecta pragas cedo.', imageKeyword:'agriculture drone'},
          { id: generateId(), type:'content', title:'GPS Agrícola', content:'Precisão economiza sementes e combustível.', imageKeyword:'tractor gps'},
          { id: generateId(), type:'cta', title:'Modernize', content:'Conheça soluções tecnológicas.', imageKeyword:'digital farm'}
        ])
      } else {
        setSlides([
          { id: generateId(), type:'cover', title: sanitizeText(rawTopic) || 'Corte Clássico', subtitle:'Elegância Atemporal', imageKeyword:'classic haircut', content:'Descubra por que os clássicos não morrem.'},
          { id: generateId(), type:'content', title:'Tesoura', content:'Corte na tesoura = caimento natural.', imageKeyword:'scissors hair'},
          { id: generateId(), type:'content', title:'Pomada ou Gel?', content:'Pomada efeito seco, gel efeito molhado.', imageKeyword:'hair pomade'},
          { id: generateId(), type:'cta', title:'Agende', content:'Garanta seu horário hoje.', imageKeyword:'barber pole'}
        ])
      }
      setActiveSlideIndex(0)
    } finally {
      setIsGenerating(false)
    }
  }

  // Funções de tema
  const duplicateTheme = () => {
    setSavedThemes(ts => {
      const exists = ts.some(t => JSON.stringify(t) === JSON.stringify(theme))
      if (exists) return ts
      return [...ts, { ...theme }]
    })
  }
  const resetThemeDefault = () => {
    setTheme(NICHES[activeNiche].defaultTheme)
  }
  const resetThemeOriginal = () => {
    if (originalThemeRef.current) setTheme(originalThemeRef.current)
    else setTheme(NICHES[activeNiche].defaultTheme)
  }
  const applySavedTheme = (index:number) => {
    const t = savedThemes[index]; if (!t) return; setTheme({ ...t })
  }
  const removeSavedTheme = (index:number) => {
    setSavedThemes(ts => ts.filter((_,i)=>i!==index))
  }
  // Captura primeiro tema original se ainda não armazenado
  useEffect(()=> { if (!originalThemeRef.current) originalThemeRef.current = theme }, [])

  // Busca de mídia (Pexels)
  const fetchMedia = async (query?:string) => {
    const q = (query ?? mediaQuery ?? '').trim()
    if (!q) return
    setMediaLoading(true)
    setMediaError(undefined)
    try {
      const { items } = await searchPhotos(q, 1, 20)
      setMediaResults(items.map(i => ({ id: i.id, alt: i.alt, preview: i.preview, original: i.original, photographer: i.photographer })))
    } catch (e:any) {
      setMediaError(e?.message || 'Falha ao buscar mídia')
    } finally {
      setMediaLoading(false)
    }
  }

  const applyPhotoToSlide = (photo:{ original:string; alt?:string }) => {
    const idx = activeSlideIndex
    const ns = [...slides]
    ns[idx] = { ...(ns[idx] as any), customImageUrl: photo.original, customImageAlt: photo.alt || 'Imagem Pexels' } as Slide
    setSlides(ns)
  }

  const clearCustomMedia = (index?:number) => {
    const idx = typeof index === 'number' ? index : activeSlideIndex
    const ns = [...slides]
    const s = ns[idx]
    if (!s) return
    const { customImageUrl, customImageAlt, ...rest } = s as any
    ns[idx] = rest as Slide
    setSlides(ns)
  }

  return {
    // dados
  activeNiche, currentNicheData, slides, theme, profile, activeSlideIndex,
    viewMode, activeTab, topic, isGenerating, isExporting, dragedIndex, activeFormat, activeFontPair, activeLayout, fontScales,
  exportProgress, exportTotal, exportScale, exportTransparent,
  mediaQuery, mediaLoading, mediaError, mediaResults,
  aiError,
  savedThemes,
    // setters
  setTheme, setProfile, setActiveSlideIndex, setViewMode, setActiveTab, setTopic, setIsGenerating, setIsExporting,
  setDragedIndex, setActiveFormat, setActiveFontPair, setActiveLayout, setFontScales, setExportProgress, setExportTotal, setExportScale, setExportTransparent,
  setMediaQuery,
    // operações
    handleNicheChange, addSlide, duplicateSlide, moveSlide, removeSlide, generateCarousel,
  duplicateTheme, resetThemeDefault, resetThemeOriginal, applySavedTheme, removeSavedTheme,
    fetchMedia, applyPhotoToSlide, clearCustomMedia,
    // undo/redo
    undo, redo,
    // helpers
    sanitizeText, clamp, generateId,
    // constantes
    NICHES, FONT_PAIRS, FORMATS,
    // setters adicionais necessários externamente
    setSlides
  }
}
