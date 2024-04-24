use serde::Serialize;
use std::path::PathBuf;

#[derive(Serialize)]
pub struct Directory {
    name: String,
    path: PathBuf,
}

impl Directory {
    pub fn new(name: String, path: PathBuf) -> Self {
        Self {
            name: name,
            path: path,
        }
    }
}
