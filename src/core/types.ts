import React from 'react'

export interface Slide {
  id: string
  type: 'cover' | 'content' | 'cta'
  title: string
  subtitle?: string
  content: string
  imageKeyword?: string
}
export interface Theme { primary: string; secondary: string; background: string; text: string; accent: string }
export interface Profile { name: string; handle: string; show: boolean; avatar?: string }
export interface ImageStyle { name: string; prompt: string }
export interface NicheConfig {
  id: string
  label: string
  icon: React.ReactNode
  color: string
  bgColor: string
  borderColor: string
  promptRole: string
  defaultTheme: Theme
  defaultProfile: Profile
  imageStyles: Record<string, ImageStyle>
  defaultSlides: Slide[]
}
export interface FontPair { name: string; title: string; body: string }
export interface Format { name: string; width: number; height: number }
export type Layout = 'classic'|'immersive'|'minimal'|'listicle'|'quote'|'editorial'
