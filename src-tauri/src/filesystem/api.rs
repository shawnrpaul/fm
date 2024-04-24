use crate::filesystem::objects::Directory;
use directories_next::UserDirs;

#[tauri::command]
pub fn get_user_dirs() -> Result<Vec<Directory>, String> {
    if let Some(user_dirs) = UserDirs::new() {
        let mut directories: Vec<Directory> = Vec::new();
        let home_dir = user_dirs.home_dir();
        let mut name = home_dir.file_name().unwrap().to_str().unwrap().to_string();
        let mut path = home_dir.canonicalize().unwrap();
        directories.push(Directory::new(name, path));

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
                name = user_dir.file_name().unwrap().to_str().unwrap().to_string();
                path = user_dir.canonicalize().unwrap();
                directories.push(Directory::new(name, path))
            }
        }
        return Ok(directories);
    }
    Err(String::from("Failed to get user directories"))
}
