export type Theme = {
  primary?: string
  gray?: string
  dark?: string
  background?: string
  dimSecondary: boolean
  inverseButton: boolean
}

const theme: Theme = {
  primary: undefined,
  gray: undefined,
  dark: undefined,
  background: undefined,
  dimSecondary: true,
  inverseButton: true,
}

export function useTheme(): Theme {
  return theme
}
