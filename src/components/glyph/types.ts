export type CGlyphDisplay = 'inline' | 'circle'
export type CGlyphSizeUnit = 'px' | 'em' | 'rem'
export type CGlyphSize = `${number}${CGlyphSizeUnit}`

export interface CGlyphPresentationProps {
  display?: CGlyphDisplay
  size?: CGlyphSize
  rotate?: number
  label?: string
}

export function isGlyphSize(value: unknown): value is CGlyphSize {
  return typeof value === 'string' && /^(?:0|[1-9]\d*)(?:\.\d+)?(?:px|em|rem)$/.test(value)
}
