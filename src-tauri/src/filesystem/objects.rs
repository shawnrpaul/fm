use serde::Serialize;
use std::path::PathBuf;

#[derive(Serialize)]
pub struct Entry {
    name: String,
    path: PathBuf,
    is_dir: bool,
    size: u64,
    is_hidden: bool,
    mime_type: String,
}

impl Entry {
    pub fn new(
        name: String,
        path: PathBuf,
        is_dir: bool,
        size: u64,
        is_hidden: bool,
        mime_type: String,
    ) -> Self {
        Self {
            name,
            path,
            is_dir,
            size,
            is_hidden,
            mime_type,
        }
    }
}
