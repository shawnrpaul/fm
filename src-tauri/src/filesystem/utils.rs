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
