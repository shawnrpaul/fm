use serde::Serialize;

#[derive(Serialize)]
pub struct Entry {
    name: String,
    path: String,
    is_dir: bool,
    metadata: EntryMetaData,
}

impl Entry {
    pub fn new(
        name: String,
        path: String,
        is_dir: bool,
        size: u64,
        is_hidden: bool,
        mime_type: String,
        updated_at: u64,
        created_at: u64,
    ) -> Self {
        let metadata = EntryMetaData::new(size, is_hidden, mime_type, updated_at, created_at);

        Self {
            name: name,
            path: path,
            is_dir: is_dir,
            metadata: metadata,
        }
    }
}

#[derive(Serialize)]
pub struct EntryMetaData {
    size: u64,
    is_hidden: bool,
    mime_type: String,
    updated_at: u64,
    created_at: u64,
}

impl EntryMetaData {
    fn new(
        size: u64,
        is_hidden: bool,
        mime_type: String,
        updated_at: u64,
        created_at: u64,
    ) -> Self {
        Self {
            size: size,
            is_hidden: is_hidden,
            mime_type: mime_type,
            updated_at: updated_at,
            created_at: created_at,
        }
    }
}
