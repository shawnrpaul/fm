use serde::Serialize;
use std::path::PathBuf;

#[derive(Serialize)]
pub struct Entry {
    name: String,
    path: PathBuf,
    is_dir: bool,
    size: u64,
    mime_type: String,
}

impl Entry {
    pub fn new(name: String, path: PathBuf, is_dir: bool, size: u64, mime_type: String) -> Self {
        Self {
            name,
            path,
            is_dir,
            size,
            mime_type,
        }
    }
}
