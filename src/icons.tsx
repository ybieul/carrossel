import React from 'react'

interface IconProps { size?: number; stroke?: number; className?: string }
const BaseIcon: React.FC<IconProps & { paths: string[] }> = ({ size=18, stroke=2, className='', paths }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" className={className}>
    {paths.map((d,i)=><path key={i} d={d} />)}
  </svg>
)
export const Scissors: React.FC<IconProps> = (p) => <BaseIcon {...p} paths={["M4 7a3 3 0 1 1 4 4L19 21","M4 17a3 3 0 1 0 4-4l11-10"]} />
export const Tractor: React.FC<IconProps> = (p) => <BaseIcon {...p} paths={["M5 16h2","M3 13h6l3 3h6l1-5h-7","M18 8h3","M13 5h2l1 3H9"]} />
export const RefreshCw: React.FC<IconProps> = (p) => <BaseIcon {...p} paths={["M21 2v6h-6","M3 22v-6h6","M3 6a9 9 0 0 1 14.8-3.6","M21 18a9 9 0 0 1-14.8 3.6"]} />
export const FileText: React.FC<IconProps> = (p) => <BaseIcon {...p} paths={["M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z","M14 2v6h6","M16 13H8","M16 17H8","M10 9H8"]} />
export const ImageIcon: React.FC<IconProps> = (p) => <BaseIcon {...p} paths={["M3 3v18h18V3Z","M3 15l4-4 5 5 4-4 4 4"]} />
export const Layers: React.FC<IconProps> = (p) => <BaseIcon {...p} paths={["M12 2 3 7l9 5 9-5-9-5Z","M3 17l9 5 9-5","M3 12l9 5 9-5"]} />
export const LayoutIcon: React.FC<IconProps> = (p) => <BaseIcon {...p} paths={["M3 3h18v6H3Z","M3 15h18v6H3Z","M3 9h18v6H3Z"]} />
export const Palette: React.FC<IconProps> = (p) => <BaseIcon {...p} paths={["M12 3a9 9 0 1 0 0 18h1a2 2 0 0 0 2-2 2 2 0 0 1 2-2h2a2 2 0 0 0 2-2 9 9 0 0 0-9-9Zm-5 9h.01","M8 7h.01","M12 6h.01","M16 8h.01"]} />
export const Sparkles: React.FC<IconProps> = (p) => <BaseIcon {...p} paths={["M12 3v6","M9 6h6","M5 13v4","M3 15h4","M17 11v4","M15 13h4"]} />
export const ChevronRight: React.FC<IconProps> = (p) => <BaseIcon {...p} paths={["M9 18 15 12 9 6"]} />
export const ChevronLeft: React.FC<IconProps> = (p) => <BaseIcon {...p} paths={["M15 18 9 12 15 6"]} />
export const Trash2: React.FC<IconProps> = (p) => <BaseIcon {...p} paths={["M3 6h18","M8 6V4h8v2","M13 10v8","M9 10v8","M5 6l1 14a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-14"]} />
export const Monitor: React.FC<IconProps> = (p) => <BaseIcon {...p} paths={["M4 3h16v12H4Z","M8 21h8","M12 15v6"]} />
export const Grid: React.FC<IconProps> = (p) => <BaseIcon {...p} paths={["M3 3h7v7H3Z","M14 3h7v7h-7Z","M3 14h7v7H3Z","M14 14h7v7h-7Z"]} />
export const ArrowRight: React.FC<IconProps> = (p) => <BaseIcon {...p} paths={["M5 12h14","M13 5l7 7-7 7"]} />
export const Plus: React.FC<IconProps> = (p) => <BaseIcon {...p} paths={["M12 5v14","M5 12h14"]} />
