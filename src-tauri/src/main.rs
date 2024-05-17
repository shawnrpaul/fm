// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
#![allow(dead_code)]

mod filesystem;

use crate::filesystem::api;

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            api::get_settings,
            api::get_drives,
            api::get_user_dirs,
            api::get_dir_content,
            api::open_file,
            api::open_file_with,
            api::create_path,
            api::rename_path,
            api::remove_path
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
