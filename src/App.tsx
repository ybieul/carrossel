import React from 'react'
import clsx from 'clsx'
import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'
import JSZip from 'jszip'
import { useCarouselState } from './hooks/useCarouselState'
import { Header } from './components/Header'
import { Sidebar } from './components/Sidebar'
import { SlideRenderer } from './components/SlideRenderer'
import { Monitor, Grid, ChevronLeft, ChevronRight, Plus, RefreshCw } from './icons'
import { FORMATS } from './core/config'

const waitForImagesInElement = (el: HTMLElement|null) => {
  if (!el) return Promise.resolve()
  const imgs = Array.from(el.querySelectorAll('img'))
  if (!imgs.length) return Promise.resolve()
  return Promise.all(imgs.map(img => new Promise<void>(resolve => {
    if ((img.complete || (img as any).readyState === 4) && img.naturalWidth) return resolve()
    const done = () => { img.removeEventListener('load', done); img.removeEventListener('error', done); resolve() }
    img.addEventListener('load', done)
    img.addEventListener('error', done)
  })))
}

const App: React.FC = () => {
  const state = useCarouselState()
  const {
    activeNiche, currentNicheData, slides, theme, profile, activeImageStyle, activeSlideIndex,
    viewMode, activeTab, topic, isGenerating, isExporting, dragedIndex, activeFormat, activeFontPair, activeLayout, fontScales,
    exportProgress, exportTotal, exportScale, exportTransparent,
    setExportProgress, setExportTotal, setExportScale, setExportTransparent,
    setActiveSlideIndex, setViewMode, setActiveTab, setTopic, setIsExporting, setDragedIndex,
    handleNicheChange, addSlide, duplicateSlide, moveSlide, removeSlide, generateCarousel,
    undo, redo, sanitizeText, clamp, setTheme, setProfile, setActiveImageStyle, setActiveLayout, setSlides,
    // mídia Pexels
    mediaQuery, mediaLoading, mediaError, mediaResults, setMediaQuery, fetchMedia, applyPhotoToSlide, clearCustomMedia
  } = state

  // Exportação consolidada usando estado do hook
  const handleExport = async (type: 'pdf'|'png'|'zip') => {
    if (!slides.length) return
    setIsExporting(true)
    const fmt = FORMATS[activeFormat]
    const originalView = viewMode
    const originalIndex = activeSlideIndex
    setViewMode('edit')
    setExportProgress(0)
    setExportTotal(slides.length)

    const captureSlide = async (index:number): Promise<string|null> => {
      try {
        setActiveSlideIndex(index)
        await new Promise(r=>setTimeout(r,70))
        const node = document.getElementById('slide-preview-area') as HTMLElement | null
        if (!node) throw new Error('Elemento de slide não encontrado.')
        await waitForImagesInElement(node)
        const canvas = await html2canvas(node, { scale: exportScale, backgroundColor: (exportTransparent && type==='png') ? null : theme.background, useCORS:true })
        return canvas.toDataURL('image/png')
      } catch (err) {
        console.error('Falha ao capturar slide', index+1, err)
        return null
      }
    }

    try {
      const zip = type==='zip' ? new JSZip() : null
      const pdf = type==='pdf' ? new jsPDF({ orientation: fmt.width>fmt.height?'l':'p', unit:'px', format:[fmt.width,fmt.height] }) : null
      for (let i=0; i<slides.length; i++) {
        const data = await captureSlide(i)
        if (!data) continue
        if (pdf) { if (i>0) pdf.addPage(); pdf.addImage(data,'PNG',0,0,fmt.width,fmt.height) }
        if (type==='png') {
          const a = document.createElement('a'); a.href = data; a.download = `${activeNiche}-slide-${String(i+1).padStart(2,'0')}.png`; document.body.appendChild(a); a.click(); a.remove()
        }
        if (zip) zip.file(`${activeNiche}-slide-${String(i+1).padStart(2,'0')}.png`, data.split(',')[1], { base64:true })
        setExportProgress(i+1)
      }
      if (pdf) pdf.save(`${activeNiche}-carousel.pdf`)
      if (zip) {
        const blob = await zip.generateAsync({ type:'blob' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a'); a.href = url; a.download = `${activeNiche}-carousel-pngs.zip`; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url)
      }
    } catch (e) {
      console.error(e); alert('Erro na exportação.')
    } finally {
      setActiveSlideIndex(originalIndex); setIsExporting(false); setViewMode(originalView)
    }
  }

  const handleDrag = (e:React.DragEvent, idx:number, kind:'start'|'over'|'end') => {
    if (kind==='start') { setDragedIndex(idx); e.dataTransfer.effectAllowed='move' }
    if (kind==='over') { e.preventDefault(); if(dragedIndex===null||dragedIndex===idx) return; const ns=[...slides]; const item=ns[dragedIndex]; ns.splice(dragedIndex,1); ns.splice(idx,0,item); setSlides(ns); setDragedIndex(idx) }
    if (kind==='end') setDragedIndex(null)
  }

  return (
    <div className="h-screen flex flex-col bg-stone-900 text-stone-100 overflow-hidden font-sans">
      <Header
        activeNiche={activeNiche}
        currentNicheData={currentNicheData}
        isExporting={isExporting}
        exportScale={exportScale}
        exportTransparent={exportTransparent}
        setExportScale={setExportScale}
        setExportTransparent={setExportTransparent}
        handleExport={handleExport}
        undo={undo}
        redo={redo}
      />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          activeNiche={activeNiche}
          currentNicheData={currentNicheData}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          activeLayout={activeLayout}
          setActiveLayout={setActiveLayout}
          activeImageStyle={activeImageStyle}
          setActiveImageStyle={setActiveImageStyle}
          theme={theme}
          setTheme={setTheme}
          profile={profile}
          setProfile={setProfile}
          topic={topic}
          setTopic={setTopic}
          generateCarousel={generateCarousel}
          isGenerating={isGenerating}
          slides={slides}
          activeSlideIndex={activeSlideIndex}
          setActiveSlideIndex={setActiveSlideIndex}
          setSlides={setSlides}
          moveSlide={moveSlide}
          duplicateSlide={duplicateSlide}
          removeSlide={removeSlide}
          addSlide={addSlide}
          sanitizeText={sanitizeText}
          clamp={clamp}
          // mídia Pexels
          mediaQuery={mediaQuery}
          setMediaQuery={setMediaQuery}
          mediaLoading={mediaLoading}
          mediaError={mediaError as any}
          mediaResults={mediaResults}
          fetchMedia={fetchMedia}
          applyPhotoToSlide={applyPhotoToSlide}
          clearCustomMedia={clearCustomMedia}
        />
        <main className="flex-1 bg-gradient-to-br from-stone-900 to-stone-950 overflow-hidden relative flex flex-col items-center justify-center p-8">
          <div className="absolute top-4 flex gap-2 bg-stone-950/80 backdrop-blur p-1 rounded-full shadow border border-stone-800 z-30">
            <button
              aria-label="Modo edição"
              title="Modo edição"
              aria-pressed={viewMode==='edit'}
              onClick={()=> setViewMode('edit')}
              className={`p-2 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 ${viewMode==='edit'? `${currentNicheData.bgColor} text-white`:'text-stone-500 hover:bg-stone-800'}`}
            ><Monitor size={14} /></button>
            <button
              aria-label="Modo grade"
              title="Modo grade"
              aria-pressed={viewMode==='grid'}
              onClick={()=> setViewMode('grid')}
              className={`p-2 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 ${viewMode==='grid'? `${currentNicheData.bgColor} text-white`:'text-stone-500 hover:bg-stone-800'}`}
            ><Grid size={14} /></button>
          </div>
          {viewMode==='edit' ? (
            <div className="flex items-center gap-4 md:gap-10 w-full justify-center h-full relative">
              <button
                aria-label="Slide anterior"
                title="Slide anterior"
                onClick={()=> setActiveSlideIndex(i=> Math.max(0,i-1))}
                disabled={activeSlideIndex===0}
                className={clsx(
                  'p-5 bg-stone-950/90 border border-stone-800 rounded-full shadow-2xl transition-all text-white disabled:opacity-30 disabled:cursor-not-allowed group z-40 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40',
                  activeNiche==='agro' ? 'hover:border-emerald-600 hover:text-emerald-500' : 'hover:border-amber-600 hover:text-amber-500'
                )}
              >
                <ChevronLeft size={32} className="group-hover:-translate-x-1 transition-transform" />
              </button>
              <div className="transform transition-all duration-500 shadow-2xl shadow-black rounded-sm ring-1 ring-white/10" style={{ transform:`scale(${Math.min(1,(window.innerHeight-150)/FORMATS[activeFormat].height)})` }}>
                <SlideRenderer
                  slide={slides[activeSlideIndex]}
                  index={activeSlideIndex}
                  activeNiche={activeNiche}
                  activeLayout={activeLayout}
                  activeImageStyle={activeImageStyle}
                  activeFontPair={activeFontPair}
                  activeFormat={activeFormat}
                  fontScales={fontScales}
                  slidesLength={slides.length}
                  theme={theme}
                  profile={profile}
                />
              </div>
              <button
                aria-label="Próximo slide"
                title="Próximo slide"
                onClick={()=> setActiveSlideIndex(i=> Math.min(slides.length-1,i+1))}
                disabled={activeSlideIndex===slides.length-1}
                className={clsx(
                  'p-5 bg-stone-950/90 border border-stone-800 rounded-full shadow-2xl transition-all text-white disabled:opacity-30 disabled:cursor-not-allowed group z-40 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40',
                  activeNiche==='agro' ? 'hover:border-emerald-600 hover:text-emerald-500' : 'hover:border-amber-600 hover:text-amber-500'
                )}
              >
                <ChevronRight size={32} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-6xl h-full overflow-y-auto content-start pt-10 px-4">
              {slides.map((s,i)=>(
                <div key={s.id} draggable onDragStart={e=>handleDrag(e,i,'start')} onDragOver={e=>handleDrag(e,i,'over')} onDragEnd={e=>handleDrag(e,i,'end')} onClick={()=>{setActiveSlideIndex(i); setViewMode('edit')}} className={`cursor-pointer transition-all ${dragedIndex===i? 'opacity-30 scale-90':''} hover:-translate-y-1`}>
                  <div className="border border-stone-800 rounded-sm overflow-hidden shadow-sm bg-stone-950 relative aspect-[4/5]">
                    <div className="absolute inset-0 transform scale-[0.25] origin-top-left w-[400%] h-[400%] pointer-events-none">
                      <SlideRenderer
                        slide={s}
                        index={i}
                        activeNiche={activeNiche}
                        activeLayout={activeLayout}
                        activeImageStyle={activeImageStyle}
                        activeFontPair={activeFontPair}
                        activeFormat={activeFormat}
                        fontScales={fontScales}
                        slidesLength={slides.length}
                        theme={theme}
                        profile={profile}
                        preview
                      />
                    </div>
                  </div>
                  <div className="text-center text-xs mt-2 font-bold text-stone-500">Slide {i+1}</div>
                </div>
              ))}
              <button onClick={addSlide} className={`border-2 border-dashed border-stone-800 rounded-sm aspect-[4/5] flex flex-col items-center justify-center text-stone-600 hover:${currentNicheData.color} hover:border-current hover:bg-stone-900 transition-all`}><Plus size={32} /><span className="text-xs font-bold mt-2 uppercase">Novo Slide</span></button>
            </div>
          )}
        </main>
      </div>
      {isExporting && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center z-[100]">
          <div className="w-72 bg-stone-900 rounded-md p-5 space-y-4 border border-stone-700 shadow-xl">
            <div className="text-xs font-bold uppercase tracking-widest text-stone-400 flex items-center gap-2"><RefreshCw className="animate-spin" size={14}/> Exportando</div>
            <div className="text-sm font-medium text-stone-200">{exportProgress} / {exportTotal} slides</div>
            <div className="h-2 bg-stone-700 rounded overflow-hidden">
              <div className="h-full transition-all" style={{ width: `${exportTotal? (exportProgress/exportTotal)*100 : 0}%`, background: theme.primary }}></div>
            </div>
            <div className="text-[10px] text-stone-500 uppercase tracking-wider">Qualidade {exportScale}x {exportTransparent && '• Transparente'}</div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
