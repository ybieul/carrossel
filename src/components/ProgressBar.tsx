import React from 'react'

export const ProgressBar: React.FC<{current:number; total:number; color:string; className?:string}> = ({ current, total, color, className }) => (
  <div className={`flex gap-1 w-full max-w-[80px] ${className||''}`}>
    {Array.from({length: total}).map((_,i)=> (
      <div key={i} className={`h-1 rounded-full flex-1 transition-all ${i<=current?'opacity-100':'opacity-20'}`} style={{ backgroundColor: color }} />
    ))}
  </div>
)
