use crate::filesystem::{objects::Entry, utils};
use directories_next::UserDirs;
use open;
use std::{fs, path::PathBuf};

#[tauri::command]
pub fn get_user_dirs() -> Result<Vec<Entry>, String> {
    if let Some(user_dirs) = UserDirs::new() {
        let mut directories: Vec<Entry> = Vec::new();

        // add the home path first
        let home_dir = user_dirs.home_dir();
        let path = home_dir.canonicalize().unwrap();
        directories.push(Entry::new("Home".to_string(), path, true, 0, String::new()));

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

        // add the remaining user dirs if exists
        for user_dir_path in user_dir_paths {
            if let Some(user_dir) = user_dir_path {
                let name = user_dir.file_name().unwrap().to_str().unwrap().to_string();
                let path = user_dir.canonicalize().unwrap();
                directories.push(Entry::new(name, path, true, 0, String::new()));
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

            // filter out the entries that could be found
            // then unwrap the DirEntry objects
            let iter = dir_iter
                .filter(|entry| entry.is_ok())
                .map(|entry| entry.unwrap());

            for dir_entry in iter {
                let name = dir_entry.file_name().into_string().unwrap();
                let path = dir_entry.path().canonicalize().unwrap();
                let entry_info = dir_entry.metadata().unwrap();
                let is_dir = entry_info.is_dir();
                let size = if is_dir { 0 } else { entry_info.len() };
                let mime_type = utils::get_mime_type(&path);
                entries.push(Entry::new(name, path, is_dir, size, mime_type));
            }

            Ok(entries)
        }
        Err(e) => Err(e.to_string()),
    }
}

#[tauri::command]
pub fn create_path(dir: String, name: String, is_file: bool) -> Result<(), String> {
    // Check if the dir exists first
    let mut path = PathBuf::from(&dir);
    if !utils::check_path_exists(&path) {
        return Err(String::from("The given directory doesn't exists"));
    }

    // Append the name to the path object
    // then check if the path exists
    path.extend([name]);
    if utils::check_path_exists(&path) {
        return Err(String::from("The given path already exists"));
    }

    // Handle if the path should be a file or a directory
    if is_file {
        match fs::File::create(path) {
            Err(e) => Err(e.to_string()),
            Ok(_) => Ok(()),
        }
    } else {
        match fs::create_dir(path) {
            Err(e) => Err(e.to_string()),
            Ok(()) => Ok(()),
        }
    }
}

#[tauri::command]
pub fn rename_path(path: String, name: String) -> Result<(), String> {
    // Check if the dir exists first
    let path_obj = PathBuf::from(&path);
    if !utils::check_path_exists(&path_obj) {
        return Err(String::from("The given path doesn't exists"));
    }

    // Create the new path
    let new_path = if let Some(parent) = path_obj.parent() {
        let mut parent = parent.to_path_buf();
        parent.push(&name);
        parent
    } else {
        return Err(String::from("Cannot rename the given path"));
    };

    // Check if the new path already exists
    if utils::check_path_exists(&new_path) {
        return Err(String::from(format!("Path {:} already exists", name)));
    }

    match fs::rename(path, new_path) {
        Err(e) => Err(e.to_string()),
        Ok(()) => Ok(()),
    }
}

#[tauri::command]
pub fn remove_path(path: String) -> Result<(), String> {
    let path_obj = PathBuf::from(&path);

    // Check if the path exists
    if !utils::check_path_exists(&path_obj) {
        return Err(String::from("The given path doesn't exist"));
    }

    // Check if the path is a file or a directory
    // to handle which remove function to use
    if path_obj.is_dir() {
        match fs::remove_dir_all(path) {
            Err(e) => return Err(e.to_string()),
            Ok(()) => Ok(()),
        }
    } else {
        match fs::remove_file(path) {
            Err(e) => return Err(e.to_string()),
            Ok(()) => Ok(()),
        }
    }
}

#[tauri::command]
pub fn open_file(path: String) -> Result<(), String> {
    match open::that(path) {
        Ok(()) => Ok(()),
        Err(e) => Err(e.to_string()),
    }
}

#[tauri::command]
pub fn open_file_with(path: String, app: String) -> Result<(), String> {
    match open::with(path, app) {
        Ok(()) => Ok(()),
        Err(e) => Err(e.to_string()),
    }
}
