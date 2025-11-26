import React from 'react'
import { FileText, ImageIcon, Layers, RefreshCw } from '../icons'
import { NICHES } from '../core/config'

interface HeaderProps {
  activeNiche: 'barber'|'agro'
  currentNicheData: any
  isExporting: boolean
  exportScale: number
  exportTransparent: boolean
  setExportScale: (v:number)=>void
  setExportTransparent: (v:boolean)=>void
  handleExport: (type:'pdf'|'png'|'zip')=>void
  undo: ()=>void
  redo: ()=>void
  children?: React.ReactNode
}

export const Header: React.FC<HeaderProps> = ({ activeNiche, currentNicheData, isExporting, exportScale, exportTransparent, setExportScale, setExportTransparent, handleExport, undo, redo, children }) => {
  return (
    <header className="bg-stone-950 border-b border-stone-800 px-4 py-3 flex flex-wrap gap-4 justify-between items-center shrink-0 z-50">
      <div className="flex items-center gap-3 flex-shrink-0">
        <div className={`w-8 h-8 ${currentNicheData.bgColor} rounded-sm flex items-center justify-center text-white shadow-md transition-colors duration-500`}>{currentNicheData.icon}</div>
        <div><h1 className="font-bold text-lg text-white tracking-tight">{activeNiche==='barber'?'Barber':'Agro'}<span className={currentNicheData.color}>Pro</span></h1></div>
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-2 bg-stone-900 px-3 py-2 rounded border border-stone-800">
          <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400" htmlFor="selectQualidade">Qualidade</label>
          <select id="selectQualidade" aria-label="Qualidade da exportação" title="Qualidade da exportação" value={exportScale} onChange={e=> setExportScale(Number(e.target.value))} className="bg-stone-800 text-xs rounded px-2 py-1 outline-none border border-stone-700 focus-visible:ring-2 focus-visible:ring-amber-500">
            <option value={1}>1x</option>
            <option value={2}>2x</option>
            <option value={3}>3x</option>
          </select>
          <label className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-stone-400">
            <input aria-label="PNG Transparente" title="PNG Transparente" type="checkbox" checked={exportTransparent} onChange={e=> setExportTransparent(e.target.checked)} className="focus-visible:ring-2 focus-visible:ring-amber-500" /> PNG Transparente
          </label>
        </div>
        <button
          aria-label="Exportar como PDF"
          title="Exportar como PDF"
          onClick={()=>handleExport('pdf')}
          disabled={isExporting}
          className={`flex items-center gap-2 px-3 py-2 ${currentNicheData.bgColor} text-white rounded-sm text-xs font-bold hover:opacity-90 transition-all shadow-md disabled:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40`}
        >{isExporting? <RefreshCw className="animate-spin" size={14} /> : <FileText size={14} />}<span>PDF</span></button>
        <button
          aria-label="Exportar slides PNG"
          title="Exportar slides PNG"
          onClick={()=>handleExport('png')}
          disabled={isExporting}
          className="flex items-center gap-2 px-3 py-2 bg-stone-800 text-white rounded-sm text-xs font-bold hover:bg-stone-700 transition-all shadow-md disabled:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
        ><ImageIcon size={14} /><span>PNG</span></button>
        <button
          aria-label="Exportar pacote ZIP"
          title="Exportar pacote ZIP"
          onClick={()=>handleExport('zip')}
          disabled={isExporting}
          className="flex items-center gap-2 px-3 py-2 bg-stone-800 text-white rounded-sm text-xs font-bold hover:bg-stone-700 transition-all shadow-md disabled:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
        ><Layers size={14} /><span>ZIP</span></button>
        <div className="ml-2 flex items-center gap-1">
          <button aria-label="Desfazer" title="Desfazer" onClick={undo} className="px-2 py-1 bg-stone-800 text-white rounded-sm text-xs hover:bg-stone-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30">Undo</button>
          <button aria-label="Refazer" title="Refazer" onClick={redo} className="px-2 py-1 bg-stone-800 text-white rounded-sm text-xs hover:bg-stone-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30">Redo</button>
        </div>
        {children}
      </div>
    </header>
  )
}
