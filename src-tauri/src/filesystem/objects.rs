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

#[derive(Serialize)]
pub struct File {
    name: String,
    path: PathBuf,
    size: u64,
}

impl File {
    pub fn new(name: String, path: PathBuf, size: u64) -> Self {
        Self {
            name: name,
            path: path,
            size: size,
        }
    }
}

#[derive(Serialize)]
pub enum EntryType {
    Dir(Directory),
    File(File),
}
