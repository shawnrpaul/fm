use mime_guess;
use std::fs::DirEntry;
use std::path::Path;

pub fn get_mime_type(path: &Path) -> String {
    if path.is_dir() {
        return String::new();
    }

    let guess = mime_guess::from_path(path);
    match guess.first() {
        Some(mime_type) => mime_type.to_string(),
        None => String::new(),
    }
}

pub fn check_path_exists(path: &Path) -> bool {
    // Check if the path exists
    match path.try_exists() {
        Err(_) => false,
        Ok(exists) => exists,
    }
}

#[cfg(target_os = "windows")]
pub fn is_entry_hidden(dir_entry: DirEntry) -> bool {
    use std::os::windows::fs::MetadataExt;
    let entry_info = dir_entry.metadata().unwrap();
    let attrs = entry_info.file_attributes();
    (attrs & 0x2) > 0
}

#[cfg(target_os = "linux")]
pub fn is_entry_hidden(dir_entry: DirEntry) -> bool {
    let name = dir_entry.file_name().into_string().unwrap();
    name.starts_with(".")
}
