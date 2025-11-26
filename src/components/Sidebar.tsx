import React from 'react'
import { NICHES, LAYOUT_STYLES } from '../core/config'
import { ImageIcon, LayoutIcon, Palette, Sparkles, Plus, Trash2, RefreshCw } from '../icons'
import { Slide, ImageStyle, Theme } from '../core/types'

interface SidebarProps {
  activeNiche: 'barber'|'agro'
  currentNicheData: any
  activeTab: 'design'|'profile'|'content'
  setActiveTab: (t:'design'|'profile'|'content')=>void
  activeLayout: string
  setActiveLayout: (l:any)=>void
  activeImageStyle: string
  setActiveImageStyle: (v:string)=>void
  theme: Theme
  setTheme: (t:any)=>void
  profile: { name:string; handle:string; show:boolean; avatar?:string }
  setProfile: (p:any)=>void
  topic: string
  setTopic: (v:string)=>void
  generateCarousel: ()=>void
  isGenerating: boolean
  slides: Slide[]
  activeSlideIndex: number
  setActiveSlideIndex: (n:number)=>void
  setSlides: (slides:Slide[])=>void
  moveSlide: (from:number,to:number)=>void
  duplicateSlide: (index:number)=>void
  removeSlide: (index:number)=>void
  addSlide: ()=>void
  sanitizeText?: (s:string)=>string
  clamp?: (s:string, max?:number)=>string
  savedThemes?: Theme[]
  duplicateTheme?: ()=>void
  resetThemeDefault?: ()=>void
  resetThemeOriginal?: ()=>void
  applySavedTheme?: (i:number)=>void
  removeSavedTheme?: (i:number)=>void
  // Mídia (Pexels)
  mediaQuery?: string
  setMediaQuery?: (v:string)=>void
  mediaLoading?: boolean
  mediaError?: string
  mediaResults?: Array<{ id:number; alt:string; preview:string; original:string; photographer?:string }>
  fetchMedia?: (query?:string)=>void
  applyPhotoToSlide?: (photo:{ original:string; alt?:string })=>void
  clearCustomMedia?: (index?:number)=>void
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeNiche, currentNicheData, activeTab, setActiveTab, activeLayout, setActiveLayout,
  activeImageStyle, setActiveImageStyle, theme, setTheme, profile, setProfile,
  topic, setTopic, generateCarousel, isGenerating, slides, activeSlideIndex,
  setActiveSlideIndex, setSlides, moveSlide, duplicateSlide, removeSlide, addSlide, sanitizeText, clamp,
  savedThemes = [], duplicateTheme, resetThemeDefault, resetThemeOriginal, applySavedTheme, removeSavedTheme,
  mediaQuery = '', setMediaQuery, mediaLoading = false, mediaError, mediaResults = [], fetchMedia, applyPhotoToSlide, clearCustomMedia
}) => {
  return (
    <aside className="w-80 bg-stone-950 border-r border-stone-800 overflow-y-auto flex flex-col z-20 shadow-lg">
      <div className="p-4 border-b border-stone-800">
        <label className="text-[10px] uppercase font-bold text-stone-500 mb-2 block tracking-widest">Nicho de Mercado</label>
        <div className="flex gap-2 bg-stone-900 p-1 rounded border border-stone-800">
          {(['barber','agro'] as const).map(n => (
            <button
              key={n}
              onClick={()=> currentNicheData.id!==n && window.confirm('Trocar nicho? Ajustes serão redefinidos.') && location.reload()}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded text-xs font-bold transition-all ${activeNiche===n? `${NICHES[n].bgColor} text-white shadow`:'text-stone-500 hover:bg-stone-800'}`}
            >
              {NICHES[n].icon}
              {n==='barber'?'Barber':'Agro'}
            </button>
          ))}
        </div>
      </div>
      <div className="flex border-b border-stone-800">
        {(['design','profile','content'] as const).map(tab => (
          <button key={tab} onClick={()=>setActiveTab(tab)} className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider ${activeTab===tab? `${currentNicheData.color} border-b-2 ${currentNicheData.borderColor}`:'text-stone-500 hover:text-stone-300'}`}>{tab==='design'?'Estilo': tab==='profile'?'Perfil':'Conteúdo'}</button>
        ))}
      </div>
      <div className="p-5 space-y-8 pb-20">
        {activeTab==='design' && (
          <>
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-stone-500 uppercase tracking-wider flex items-center gap-2"><LayoutIcon size={14}/> Layout</h3>
              <div className="grid grid-cols-2 gap-2">
                {Object.values(LAYOUT_STYLES).map(l => (
                  <button
                    key={l.id}
                    aria-label={`Layout ${l.name}`}
                    title={`Layout ${l.name}`}
                    aria-pressed={activeLayout===l.id}
                    onClick={()=>setActiveLayout(l.id)}
                    className={`p-2 border rounded-sm text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 ${activeLayout===l.id? `${currentNicheData.borderColor} ${activeNiche==='agro'? 'bg-emerald-900/20':'bg-amber-900/20'} ring-1`:'border-stone-800 hover:bg-stone-900'}`}
                  >
                    <div className="text-xs font-bold text-stone-200">{l.name}</div>
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-stone-500 uppercase tracking-wider flex items-center gap-2"><ImageIcon size={14}/> Estilo de Imagem</h3>
              <select aria-label="Estilo de Imagem" title="Estilo de Imagem" value={activeImageStyle} onChange={e=>setActiveImageStyle(e.target.value)} className="w-full p-2 text-sm bg-stone-900 border border-stone-800 rounded-sm text-stone-200 focus:border-current outline-none focus-visible:ring-2 focus-visible:ring-amber-500">
                {Object.entries(currentNicheData.imageStyles as Record<string, ImageStyle>).map(([k,v])=> <option key={k} value={k}>{v.name}</option>)}
              </select>
            </div>
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-stone-500 uppercase tracking-wider flex items-center gap-2"><Palette size={14}/> Cores</h3>
              <div className="grid grid-cols-5 gap-2">
                {Object.entries(theme).map(([key,val]) => (
                  <div key={key} className="relative w-8 h-8 rounded-full border border-stone-700 overflow-hidden cursor-pointer group">
                    <input aria-label={`Alterar cor ${key}`} title={`Alterar cor ${key}`} type="color" value={val} onChange={e=> setTheme({...theme,[key]: e.target.value})} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                    <div className="w-full h-full" style={{ background: val }} />
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                <button
                  type="button"
                  onClick={resetThemeOriginal}
                  disabled={!resetThemeOriginal}
                  aria-label="Reset Tema"
                  title="Reset Tema (voltar ao inicial da sessão)"
                  className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded-sm bg-stone-800 border border-stone-700 text-stone-300 hover:bg-stone-700 disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                >Reset</button>
                <button
                  type="button"
                  onClick={resetThemeDefault}
                  disabled={!resetThemeDefault}
                  aria-label="Tema Padrão"
                  title="Aplicar tema padrão do nicho"
                  className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded-sm bg-stone-800 border border-stone-700 text-stone-300 hover:bg-stone-700 disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                >Padrão</button>
                <button
                  type="button"
                  onClick={duplicateTheme}
                  disabled={!duplicateTheme}
                  aria-label="Duplicar Tema"
                  title="Salvar tema atual"
                  className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded-sm bg-stone-800 border border-stone-700 text-stone-300 hover:bg-stone-700 disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                >Duplicar</button>
              </div>
              {!!savedThemes.length && (
                <div className="mt-2 space-y-1">
                  <div className="text-[10px] uppercase font-bold text-stone-500 tracking-wider">Temas Salvos</div>
                  <div className="flex flex-wrap gap-2">
                    {savedThemes.map((t,i)=>(
                      <button
                        key={i}
                        type="button"
                        aria-label={`Aplicar tema salvo ${i+1}`}
                        title="Aplicar tema salvo"
                        onClick={()=> applySavedTheme && applySavedTheme(i)}
                        onContextMenu={(e)=>{e.preventDefault(); removeSavedTheme && removeSavedTheme(i)}}
                        className="w-8 h-8 rounded-full border border-stone-700 overflow-hidden flex focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                        style={{ background: t.background }}
                      >
                        <div className="w-full h-full" style={{ background: `linear-gradient(45deg, ${t.primary} 0%, ${t.secondary} 50%, ${t.accent} 100%)` }} />
                      </button>
                    ))}
                  </div>
                  <p className="text-[10px] text-stone-600">Clique para aplicar • Botão direito para excluir</p>
                </div>
              )}
            </div>
          </>
        )}
        {activeTab==='profile' && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-24 h-24 mx-auto bg-stone-900 rounded-full mb-3 relative group overflow-hidden border-2 border-dashed border-stone-700 flex items-center justify-center">
                {profile.avatar? <img src={profile.avatar} className="w-full h-full object-cover" /> : <div className="text-stone-600">{currentNicheData.icon}</div>}
                <input type="file" accept="image/*" onChange={e=> { const f=(e.target.files||[])[0]; if(f){ const r=new FileReader(); r.onloadend=()=> setProfile({...profile, avatar: r.result as string }); r.readAsDataURL(f) } }} className="absolute inset-0 opacity-0 cursor-pointer" />
                <div className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold">Alterar</div>
              </div>
              <p className="text-xs text-stone-500">Logo da Marca</p>
            </div>
            <div className="space-y-3">
              <div><label className="text-xs font-bold text-stone-500">Nome</label><input value={profile.name} onChange={e=> setProfile({...profile, name: e.target.value})} className="w-full p-2 bg-stone-900 border border-stone-800 rounded-sm text-sm text-white outline-none focus:border-stone-600" /></div>
              <div><label className="text-xs font-bold text-stone-500">Handle / Bio</label><input value={profile.handle} onChange={e=> setProfile({...profile, handle: e.target.value})} className="w-full p-2 bg-stone-900 border border-stone-800 rounded-sm text-sm text-white outline-none focus:border-stone-600" /></div>
              <div className="flex items-center gap-2"><input type="checkbox" checked={profile.show} onChange={e=> setProfile({...profile, show: e.target.checked})} /><label className="text-sm text-stone-300">Mostrar</label></div>
            </div>
          </div>
        )}
        {activeTab==='content' && (
          <div className="space-y-6">
            <div className="p-4 bg-stone-900 rounded-xl border border-stone-800">
              <label className={`text-xs font-bold ${currentNicheData.color} mb-2 flex items-center gap-2`}><Sparkles size={12}/> IA GERADORA ({activeNiche.toUpperCase()})</label>
              <div className="relative">
                <input value={topic} onChange={e=> setTopic(e.target.value)} onKeyDown={e=> e.key==='Enter' && generateCarousel()} placeholder={activeNiche==='agro'? 'Ex: Plantio de Soja...':'Ex: Corte Degradê...'} className="w-full pl-3 pr-10 py-2 bg-stone-950 border border-stone-700 rounded-sm text-sm focus:border-current text-white outline-none" />
                <button onClick={generateCarousel} disabled={isGenerating} className={`absolute right-1.5 top-1.5 p-1 ${currentNicheData.bgColor} text-white rounded-sm hover:opacity-90 disabled:opacity-50`}>{isGenerating? <RefreshCw className="animate-spin" size={14}/> : <Sparkles size={14} />}</button>
              </div>
            </div>
            <div className="space-y-4 pt-4 border-t border-stone-800">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-bold text-stone-500 uppercase tracking-wider">Slide {activeSlideIndex+1}</h3>
                <div className="flex items-center gap-1">
                  <button aria-label="Mover slide para cima" title="Mover slide para cima" onClick={()=> moveSlide(activeSlideIndex, activeSlideIndex-1)} className="text-stone-400 hover:text-stone-200 p-1 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500">↑</button>
                  <button aria-label="Mover slide para baixo" title="Mover slide para baixo" onClick={()=> moveSlide(activeSlideIndex, activeSlideIndex+1)} className="text-stone-400 hover:text-stone-200 p-1 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500">↓</button>
                  <button aria-label="Duplicar slide" title="Duplicar slide" onClick={()=> duplicateSlide(activeSlideIndex)} className="text-stone-300 hover:text-white p-1 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500">⎘</button>
                  <button aria-label="Remover slide" title="Remover slide" onClick={()=> removeSlide(activeSlideIndex)} className="text-red-500 hover:text-red-400 p-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"><Trash2 size={14}/></button>
                </div>
              </div>
              <input aria-label="Título do slide" title="Título do slide" value={slides[activeSlideIndex].title} onChange={e=> { const ns=[...slides]; ns[activeSlideIndex].title = clamp? clamp(sanitizeText? sanitizeText(e.target.value): e.target.value,80): e.target.value; setSlides(ns) }} className="w-full p-2 bg-stone-900 border border-stone-800 rounded-sm text-sm font-bold text-white outline-none focus-visible:ring-2 focus-visible:ring-amber-500" placeholder="Título" />
              <textarea aria-label="Conteúdo do slide" title="Conteúdo do slide" value={slides[activeSlideIndex].content} onChange={e=> { const ns=[...slides]; ns[activeSlideIndex].content = clamp? clamp(sanitizeText? sanitizeText(e.target.value): e.target.value,240): e.target.value; setSlides(ns) }} rows={4} className="w-full p-2 bg-stone-900 border border-stone-800 rounded-sm text-sm text-stone-300 outline-none focus-visible:ring-2 focus-visible:ring-amber-500" placeholder="Texto" />
              <div className="flex items-center gap-2"><ImageIcon size={14} className="text-stone-500" /><input aria-label="Palavra-chave da imagem" title="Palavra-chave da imagem" value={slides[activeSlideIndex].imageKeyword||''} onChange={e=> { const ns=[...slides]; ns[activeSlideIndex].imageKeyword = clamp? clamp(sanitizeText? sanitizeText(e.target.value): e.target.value,60): e.target.value; setSlides(ns) }} className="flex-1 bg-transparent border-b border-stone-800 text-xs py-1 outline-none text-stone-400 focus-visible:ring-2 focus-visible:ring-amber-500" placeholder="Palavra-chave imagem..." /></div>

              {/* Banco de Mídia (Pexels) */}
              <div className="mt-4 p-4 bg-stone-900 rounded-xl border border-stone-800 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">Banco de Mídia (Pexels)</label>
                  {(slides[activeSlideIndex] as any)?.customImageUrl && (
                    <button type="button" onClick={()=> clearCustomMedia && clearCustomMedia()} className="text-[10px] uppercase font-bold text-amber-400 hover:text-amber-300">Limpar</button>
                  )}
                </div>
                <div className="flex gap-2">
                  <input aria-label="Buscar imagens" value={mediaQuery} onChange={e=> setMediaQuery && setMediaQuery(e.target.value)} onKeyDown={e=> e.key==='Enter' && fetchMedia && fetchMedia()} placeholder="Palavra-chave (ex: classic haircut)" className="flex-1 pl-3 pr-10 py-2 bg-stone-950 border border-stone-700 rounded-sm text-sm focus:border-current text-white outline-none" />
                  <button onClick={()=> fetchMedia && fetchMedia()} disabled={mediaLoading} className={`px-3 py-2 ${mediaLoading? 'bg-stone-700':'bg-stone-800 hover:bg-stone-700'} rounded-sm text-xs font-bold text-stone-200 border border-stone-700`}>{mediaLoading? 'Buscando...':'Buscar'}</button>
                </div>
                {mediaError && <p className="text-[11px] text-red-400">{mediaError}</p>}
                <div className="grid grid-cols-3 gap-2 max-h-44 overflow-auto">
                  {mediaResults.map(it => (
                    <button key={it.id} type="button" className="relative group border border-stone-800 rounded-sm overflow-hidden" onClick={()=> applyPhotoToSlide && applyPhotoToSlide({ original: it.original, alt: it.alt })}>
                      <img src={it.preview} alt={it.alt} className="w-full h-20 object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] text-white flex items-center justify-center">Aplicar</div>
                    </button>
                  ))}
                  {!mediaResults.length && <div className="col-span-3 text-[11px] text-stone-500">Nenhum resultado. Busque por uma palavra-chave.</div>}
                </div>
                {(slides[activeSlideIndex] as any)?.customImageUrl && (
                  <p className="text-[11px] text-stone-400">Imagem personalizada aplicada ao slide.</p>
                )}
              </div>
              <button aria-label="Adicionar novo slide" title="Adicionar novo slide" onClick={addSlide} className="w-full py-2 bg-stone-800 hover:bg-stone-700 rounded-sm text-xs font-bold text-stone-300 flex items-center justify-center gap-2 mt-4 border border-stone-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"><Plus size={14}/> Adicionar Slide</button>
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}
