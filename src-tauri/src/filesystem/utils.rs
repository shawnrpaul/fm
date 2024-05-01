use mime_guess;
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
