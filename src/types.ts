export interface Entry {
  name: string
  path: string
  is_dir: boolean,
  size: bigint,
  mime_type: string
}

export type ThemeTypes = "light" | "dark" | "default"

export interface AppSettings {
  showHidden: boolean
  theme: ThemeTypes
}
