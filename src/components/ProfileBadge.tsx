import React from 'react'
import { NICHES } from '../core/config'
import { Profile } from '../core/types'

interface Props {
  profile: Profile
  activeNiche: 'barber'|'agro'
  mode: 'light'|'dark'
}
export const ProfileBadge: React.FC<Props> = ({ profile, activeNiche, mode }) => {
  const data = NICHES[activeNiche]
  const isLight = activeNiche==='agro'
  const textColor = mode==='light' ? 'text-white' : (isLight? 'text-stone-800':'text-stone-200')
  return (
    <div className={`flex items-center gap-3 ${textColor} ${!profile.show?'opacity-0':'opacity-100'}`}>
      <div className={`w-10 h-10 rounded-full overflow-hidden border-2 border-current/20 shadow-md flex-shrink-0 ${isLight?'bg-white':'bg-stone-800'}`}>
        {profile.avatar ? <img src={profile.avatar} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center opacity-50">{data.icon}</div>}
      </div>
      <div className="leading-tight">
        <div className="text-xs font-bold uppercase tracking-wider">{profile.name}</div>
        <div className="text-[10px] opacity-80">{profile.handle}</div>
      </div>
    </div>
  )
}
