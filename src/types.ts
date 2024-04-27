export interface Entry {
    name: string
    path: string
    is_dir: boolean,
    size: bigint,
    mime_type: string
}