use serde::Serialize;
use std::path::PathBuf;

#[derive(Serialize)]
pub struct Entry {
    name: String,
    path: PathBuf,
    is_dir: bool,
    size: u64,
}

impl Entry {
    pub fn new(name: String, path: PathBuf, is_dir: bool, size: u64) -> Self {
        Self {
            name,
            path,
            is_dir,
            size,
        }
    }
}
