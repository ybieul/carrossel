import React from 'react'
import { Scissors, Tractor } from '../icons'
import { NicheConfig, FontPair, Format } from './types'

export const NICHES: Record<string, NicheConfig> = {
  barber: {
    id: 'barber',
    label: 'Barbeiro',
    icon: <Scissors size={18} />,
    color: 'text-amber-500',
    bgColor: 'bg-amber-600',
    borderColor: 'border-amber-600',
    promptRole: 'Atue como Barbeiro Profissional e Especialista em Estilo Masculino.',
    defaultTheme: { primary: '#D4AF37', secondary: '#FFFFFF', background: '#1c1917', text: '#e7e5e4', accent: '#ef4444' },
    defaultProfile: { name: '@BarberKing', handle: 'Cortes Clássicos', show: true },
    imageStyles: {
      vintage: { name: 'Vintage / Old School', prompt: 'vintage barbershop interior, leather chairs, classic tools, warm retro lighting, 1950s aesthetic' },
      modern: { name: 'Modern Studio', prompt: 'modern minimalist hair studio, bright clinical lighting, sharp focus, professional barber tools' },
      dark_luxury: { name: 'Dark Luxury', prompt: 'luxury barbershop, dark moody lighting, gold accents, black marble, cinematic, masculine aesthetic' },
      macro_hair: { name: 'Detalhe (Macro)', prompt: 'extreme close up of a haircut fade, sharp lines, hair texture, professional photography' },
      neon: { name: 'Neon Street', prompt: 'barbershop window at night, neon barber pole, rainy street, cinematic, cyberpunk vibes' }
    },
    defaultSlides: [
      { id: '1', type: 'cover', title: 'Estilo & Corte', subtitle: 'Tendências 2025', imageKeyword: 'haircut fade', content: 'O guia definitivo para o homem moderno.' },
      { id: '2', type: 'content', title: 'Textura', content: 'Aposte em finalizadores mate para um visual natural e duradouro.', imageKeyword: 'hair product' },
      { id: '3', type: 'content', title: 'Navalhado', content: 'O acabamento na navalha traz definição e um visual mais limpo.', imageKeyword: 'straight razor' },
      { id: '4', type: 'cta', title: 'Reserve Já', content: 'Agenda aberta para esta semana. Link na bio.', imageKeyword: 'barber chair' }
    ]
  },
  agro: {
    id: 'agro',
    label: 'Agro & Pecuária',
    icon: <Tractor size={18} />,
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-600',
    borderColor: 'border-emerald-600',
    promptRole: 'Atue como Engenheiro Agrônomo e Especialista em Pecuária de Precisão. Use termos técnicos do setor.',
    defaultTheme: { primary: '#059669', secondary: '#1c1917', background: '#f5f5f4', text: '#292524', accent: '#d97706' },
    defaultProfile: { name: '@AgroTech', handle: 'Soluções Rurais', show: true },
    imageStyles: {
      field_realistic: { name: 'Campo Realista', prompt: 'wide angle shot of a green pasture, blue sky, sunny day, high resolution, national geographic style' },
      drone: { name: 'Vista Aérea (Drone)', prompt: 'aerial drone shot of farmland, geometric crop patterns, cinematic lighting, 4k' },
      cattle_portrait: { name: 'Retrato Animal', prompt: 'close up portrait of a prize bull, detailed fur, soft natural lighting, blurred background, professional photography' },
      tech_agro: { name: 'Agro Tech', prompt: 'futuristic smart farm, drones spraying crops, digital data overlay, interface, technology in agriculture' },
      sunset: { name: 'Pôr do Sol Rural', prompt: 'golden hour over a wheat field, warm lighting, silhouette of a tractor, emotional, cinematic' }
    },
    defaultSlides: [
      { id: '1', type: 'cover', title: 'Manejo Eficiente', subtitle: 'Lucratividade no Pasto', imageKeyword: 'cattle grazing', content: 'Como aumentar a arroba sem aumentar o custo.' },
      { id: '2', type: 'content', title: 'Nutrição', content: 'O sal mineral é o investimento de menor custo e maior retorno na seca.', imageKeyword: 'cattle eating' },
      { id: '3', type: 'content', title: 'Genética', content: 'Touros melhoradores garantem bezerros mais pesados na desmama.', imageKeyword: 'bull prize' },
      { id: '4', type: 'cta', title: 'Saiba Mais', content: 'Baixe nosso e-book gratuito sobre pastagem rotacionada.', imageKeyword: 'farm tablet' }
    ]
  }
}

export const LAYOUT_STYLES = {
  classic: { id: 'classic', name: 'Clássico' },
  immersive: { id: 'immersive', name: 'Imersivo' },
  editorial: { id: 'editorial', name: 'Editorial' },
  minimal: { id: 'minimal', name: 'Minimalista' },
  listicle: { id: 'listicle', name: 'Lista (Num)' },
  quote: { id: 'quote', name: 'Citação' }
}
export const FONT_PAIRS: Record<string, FontPair> = {
  modern: { name: 'Moderno', title: 'Montserrat', body: 'Open Sans' },
  elegant: { name: 'Elegante', title: 'Playfair Display', body: 'Lato' },
  bold: { name: 'Impacto', title: 'Oswald', body: 'Roboto' },
  tech: { name: 'Tech', title: 'Space Grotesk', body: 'Inter' },
  lufga: { name: 'Lufga (Geo)', title: 'Outfit', body: 'Outfit' }
}
export const FORMATS: Record<string, Format> = {
  instagram: { name: 'Instagram (4:5)', width: 1080, height: 1350 },
  linkedin: { name: 'LinkedIn (1:1)', width: 1080, height: 1080 },
  presentation: { name: 'Paisagem (16:9)', width: 1920, height: 1080 }
}
