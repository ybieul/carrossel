import React from 'react'
import { Slide, FontPair, Format } from '../core/types'
import { NICHES, FONT_PAIRS, FORMATS } from '../core/config'
import { ProfileBadge } from './ProfileBadge'
import { ProgressBar } from './ProgressBar'
import { ArrowRight, Scissors, Tractor } from '../icons'

interface SlideRendererProps {
  slide: Slide
  index: number
  activeNiche: 'barber'|'agro'
  activeLayout: string
  activeImageStyle: string
  activeFontPair: string
  activeFormat: string
  fontScales: { title: number; subtitle: number; body: number }
  slidesLength: number
  theme: { primary:string; secondary:string; background:string; text:string; accent:string }
  profile: { name:string; handle:string; show:boolean; avatar?:string }
  preview?: boolean
  scale?: number
}

const getResponsiveFontSize = (text:string|undefined, type:string, canvasWidth:number, userScale=1) => {
  const length = text? text.length:0
  const baseScale = canvasWidth / 1080
  let size=1
  if (type==='title'){ if(length<20) size=5; else if(length<40) size=4; else if(length<80) size=3; else size=2.2 }
  else if (type==='body'){ if(length<100) size=2; else if(length<200) size=1.6; else size=1.4 }
  else if (type==='subtitle') size=1.5
  else if (type==='number') size=15
  return `${size * baseScale * userScale}rem`
}

export const SlideRenderer: React.FC<SlideRendererProps> = ({
  slide, index, activeNiche, activeLayout, activeImageStyle, activeFontPair, activeFormat,
  fontScales, slidesLength, theme, profile, preview=false, scale=1
}) => {
  const fmt: Format = FORMATS[activeFormat]
  const fonts: FontPair = FONT_PAIRS[activeFontPair]
  const isCover = slide.type==='cover'
  const currentNicheData = NICHES[activeNiche]

  const renderClassic = () => (
    <div className="flex flex-col h-full relative z-10">
  <div className="absolute top-0 left-0 w-full p-8 z-20"><ProfileBadge mode="dark" profile={profile} activeNiche={activeNiche} /></div>
      <div className="p-12 md:p-14 flex-1 flex flex-col justify-center h-full overflow-hidden mt-8">
        {slide.imageKeyword && (
          <div className="mb-8 relative rounded-sm overflow-hidden shadow-lg flex-shrink-0 border border-current/10 group" style={{ height: isCover?'35%':'25%' }}>
            {(() => {
              const custom = (slide as any).customImageUrl as string | undefined
              const url = custom || `https://image.pollinations.ai/prompt/${slide.imageKeyword}%20${currentNicheData.imageStyles[activeImageStyle].prompt}?width=800&height=600&nologo=true`
              const alt = (slide as any).customImageAlt || slide.imageKeyword
              return <img src={url} alt={alt} onError={(e)=>{(e.currentTarget as HTMLImageElement).style.display='none'}} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" crossOrigin="anonymous" />
            })()}
          </div>
        )}
        <div className="flex flex-col flex-1 min-h-0 justify-start">
          <h1 style={{ fontFamily: fonts.title, color: theme.secondary==='#FFFFFF' && activeNiche==='agro'? theme.text: theme.secondary, fontSize: getResponsiveFontSize(slide.title,'title',fmt.width,fontScales.title), lineHeight:1.1 }} className="font-bold mb-4 break-words uppercase tracking-tight">{slide.title}</h1>
          {slide.subtitle && <h3 className="mb-4 font-medium opacity-80 uppercase tracking-widest text-xs" style={{ color: theme.primary, fontSize: getResponsiveFontSize(slide.subtitle,'subtitle',fmt.width,fontScales.subtitle) }}>{slide.subtitle}</h3>}
          <p className="opacity-80 leading-relaxed overflow-hidden text-ellipsis font-light" style={{ fontSize: getResponsiveFontSize(slide.content,'body',fmt.width,fontScales.body) }}>{slide.content}</p>
        </div>
      </div>
      <div className="absolute bottom-0 w-full p-8 flex justify-between items-center">
        <div className="text-xs font-bold opacity-40">{index+1} / {slidesLength}</div>
        <ProgressBar current={index} total={slidesLength} color={theme.primary} />
      </div>
    </div>
  )

  const renderImmersive = () => (
    <div className="h-full w-full relative flex flex-col justify-end p-14 z-10">
      {slide.imageKeyword && (
        <div className="absolute inset-0 z-0">
          {(() => {
            const custom = (slide as any).customImageUrl as string | undefined
            const url = custom || `https://image.pollinations.ai/prompt/${slide.imageKeyword}%20${currentNicheData.imageStyles[activeImageStyle].prompt}?width=1080&height=1350&nologo=true`
            const alt = (slide as any).customImageAlt || slide.imageKeyword
            return <img src={url} alt={alt} onError={(e)=>{(e.currentTarget as HTMLImageElement).style.display='none'}} className="w-full h-full object-cover" crossOrigin="anonymous" />
          })()}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/10" />
        </div>
      )}
  <div className="absolute top-0 left-0 w-full p-8 z-20"><ProfileBadge mode="light" profile={profile} activeNiche={activeNiche} /></div>
      <div className="relative z-10 text-white flex flex-col justify-end max-h-[80%] pb-8">
        <div className="w-16 h-1 mb-8 flex-shrink-0" style={{ background: theme.primary }} />
        <h1 style={{ fontFamily: fonts.title, fontSize: getResponsiveFontSize(slide.title,'title',fmt.width,fontScales.title), lineHeight:1 }} className="font-bold drop-shadow-lg mb-6 break-words uppercase">{slide.title}</h1>
        <p className="opacity-90 font-light leading-relaxed border-l-4 pl-6 overflow-hidden text-ellipsis" style={{ borderColor: theme.primary, fontSize: getResponsiveFontSize(slide.content,'body',fmt.width,fontScales.body) }}>{slide.content}</p>
      </div>
      {!isCover && slide.type!=='cta' && <div className="absolute bottom-6 right-6 flex items-center gap-2 text-white/50 text-[10px] uppercase font-bold tracking-widest animate-pulse">Arrastar <ArrowRight size={12} /></div>}
    </div>
  )

  const renderListicle = () => (
    <div className="h-full w-full flex flex-col p-14 relative z-10 overflow-hidden" style={{ background: theme.background }}>
  <div className="absolute top-8 right-8 z-20"><ProfileBadge mode="dark" profile={profile} activeNiche={activeNiche} /></div>
      <div className="absolute -top-10 -left-10 opacity-[0.08] font-black select-none pointer-events-none" style={{ fontSize: getResponsiveFontSize('00','number',fmt.width), fontFamily: fonts.title, color: theme.secondary==='#FFFFFF' && activeNiche==='agro'? theme.text: theme.secondary }}>{String(index+1).padStart(2,'0')}</div>
      <div className="flex flex-col justify-center flex-1 z-10 h-full mt-10">
        <div className="w-12 h-12 rounded-sm mb-8 flex items-center justify-center font-bold text-white shadow-lg" style={{ background: theme.primary }}>{index+1}</div>
        <h1 style={{ fontFamily: fonts.title, color: theme.secondary==='#FFFFFF' && activeNiche==='agro'? theme.text: theme.secondary, fontSize: getResponsiveFontSize(slide.title,'title',fmt.width,fontScales.title), lineHeight:1.1 }} className="font-bold mb-6 uppercase">{slide.title}</h1>
        {slide.imageKeyword && (
          <div className="w-full h-40 rounded-sm overflow-hidden mb-6 shadow-md object-cover flex-shrink-0 border border-current/10">
            {(() => {
              const custom = (slide as any).customImageUrl as string | undefined
              const url = custom || `https://image.pollinations.ai/prompt/${slide.imageKeyword}%20${currentNicheData.imageStyles[activeImageStyle].prompt}?width=800&height=400&nologo=true`
              const alt = (slide as any).customImageAlt || slide.imageKeyword
              return <img src={url} alt={alt} onError={e=>{(e.currentTarget as HTMLImageElement).style.display='none'}} className="w-full h-full object-cover" crossOrigin="anonymous" />
            })()}
          </div>
        )}
        <p className="leading-relaxed opacity-80 font-light" style={{ fontSize: getResponsiveFontSize(slide.content,'body',fmt.width,fontScales.body) }}>{slide.content}</p>
      </div>
    </div>
  )

  const renderMinimal = () => (
    <div className="h-full w-full flex flex-col p-14 relative z-10 justify-between" style={{ background: theme.background }}>
  <div className="absolute top-8 left-8"><ProfileBadge mode="dark" profile={profile} activeNiche={activeNiche} /></div>
      <div className="flex flex-col justify-center flex-1 min-h-0 mt-10">
        <div className="mb-8 opacity-40" style={{ color: theme.primary }}>{activeNiche==='agro'? <Tractor size={64} stroke={1} /> : <Scissors size={64} stroke={1} />}</div>
        <h1 style={{ fontFamily: fonts.title, color: theme.secondary==='#FFFFFF' && activeNiche==='agro'? theme.text: theme.secondary, fontSize: getResponsiveFontSize(slide.title,'title',fmt.width,fontScales.title), lineHeight:.95 }} className="font-black tracking-tighter mb-8 break-words uppercase">{slide.title}</h1>
        <p className="font-light leading-relaxed max-w-xl overflow-hidden border-l-2 pl-4" style={{ borderColor: theme.accent, color: theme.text, fontSize: getResponsiveFontSize(slide.content,'body',fmt.width,fontScales.body) }}>{slide.content}</p>
      </div>
      <div className="w-full flex justify-between items-end border-t border-current/10 pt-6"><span className="text-4xl font-black opacity-10" style={{ fontFamily: fonts.title, color: theme.secondary }}>{String(index+1).padStart(2,'0')}</span></div>
    </div>
  )

  let content: React.ReactNode
  switch(activeLayout){
    case 'immersive': content = renderImmersive(); break
    case 'minimal': content = renderMinimal(); break
    case 'quote': content = renderMinimal(); break
    case 'editorial': content = renderClassic(); break
    case 'listicle': content = renderListicle(); break
    default: content = renderClassic(); break
  }

  return (
    <div id={!preview? 'slide-preview-area':undefined} className="relative overflow-hidden shadow-sm flex flex-col" style={{ width: fmt.width*scale, height: fmt.height*scale, backgroundColor: theme.background, color: theme.text, fontFamily: fonts.body }}>
      {content}
    </div>
  )
}
