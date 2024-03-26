// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::Manager;
use tauri::{Position, Window};

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn software_version() -> String {
    env!("CARGO_PKG_VERSION").to_string()
}

#[tauri::command]
fn build_type() -> String {

    if cfg!(debug_assertions){
        return "debug".to_string();
    }
    else {
        return "release".to_string();
    }
}

fn move_window_to_other_monitor(window: &Window, i: usize) -> tauri::Result<()> {
    let monitors = window.available_monitors()?;
    let monitor = monitors.get(i).ok_or(tauri::Error::CreateWindow)?;

    let pos = monitor.position();

    window.set_position(Position::Physical(
        tauri::PhysicalPosition{
            x: pos.x,
            y: 0
        })
    )?;

    window.center()?;
    Ok(())
}

fn main() {
    let app = tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![software_version, build_type])
        .build(tauri::generate_context!())
        .expect("error while running tauri application");

    let window = app.get_window("main").expect("Cannot get main window");

    //move_window_to_other_monitor(&window, 1).expect("Cannot move window to other monitor");

    app.run(|_app_handle, _event| {
        let _ = window;
    });
}
