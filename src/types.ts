export interface Entry {
  name: string
  path: string
  is_dir: boolean
  metadata: EntryMetaData
  isSelected: boolean
}

export interface EntryMetaData {
  size: bigint
  is_hidden: boolean
  mime_type: string
  updated_at: bigint
  created_at: bigint
}

export type ThemeTypes = "light" | "dark" | "default"

export type ViewType = "grid" | "list"

export interface AppSettings {
  showHidden: boolean
  deletePermanently: boolean
  theme: ThemeTypes
  view: ViewType
  gridItemSize: number
}
