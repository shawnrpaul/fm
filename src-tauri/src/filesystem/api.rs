use crate::filesystem::objects::Entry;
use directories_next::UserDirs;
use std::fs;

#[tauri::command]
pub fn get_user_dirs() -> Result<Vec<Entry>, String> {
    if let Some(user_dirs) = UserDirs::new() {
        let mut directories: Vec<Entry> = Vec::new();

        let home_dir = user_dirs.home_dir();
        let path = home_dir.canonicalize().unwrap();
        directories.push(Entry::new("Home".to_string(), path, true, 0));

        let user_dir_paths = vec![
            user_dirs.audio_dir(),
            user_dirs.desktop_dir(),
            user_dirs.document_dir(),
            user_dirs.download_dir(),
            user_dirs.font_dir(),
            user_dirs.picture_dir(),
            user_dirs.public_dir(),
            user_dirs.template_dir(),
            user_dirs.video_dir(),
        ];

        for user_dir_path in user_dir_paths {
            if let Some(user_dir) = user_dir_path {
                let name = user_dir.file_name().unwrap().to_str().unwrap().to_string();
                let path = user_dir.canonicalize().unwrap();
                directories.push(Entry::new(name, path, true, 0));
            }
        }
        return Ok(directories);
    }
    Err(String::from("Failed to get user directories"))
}

#[tauri::command]
pub fn get_dir_content(path: String) -> Result<Vec<Entry>, String> {
    match fs::read_dir(path) {
        Ok(dir_iter) => {
            let mut entries: Vec<Entry> = Vec::new();
            let iter = dir_iter
                .filter(|entry| entry.is_ok())
                .map(|entry| entry.unwrap());

            for dir_entry in iter {
                let name = dir_entry.file_name().into_string().unwrap();
                let path = dir_entry.path().canonicalize().unwrap();
                let entry_info = dir_entry.metadata().unwrap();
                let is_dir = entry_info.is_dir();
                let size = if is_dir { 0 } else { entry_info.len() };
                entries.push(Entry::new(name, path, is_dir, size));
            }

            Ok(entries)
        }
        Err(e) => Err(e.to_string()),
    }
}
