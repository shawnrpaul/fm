export interface Entry {
  name: string
  path: string
  is_dir: boolean,
  size: bigint,
  is_hidden: boolean,
  mime_type: string
  isSelected: boolean
}

export type ThemeTypes = "light" | "dark" | "default"

export type ViewType = "grid" | "list"

export interface AppSettings {
  showHidden: boolean
  theme: ThemeTypes
  view: ViewType
  gridItemSize: number
}
