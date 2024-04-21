// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

#[macro_use]
extern crate lazy_static;

use std::sync::Mutex;
use std::fs;
use std::thread;

use tauri::Manager;
use tauri::{Position, Window};


use coqui_tts::Synthesizer;

use rodio::buffer::SamplesBuffer;
use rodio::{OutputStream, Sink};


lazy_static! {
    static ref SYNTHESIZER : Mutex<Synthesizer> = Mutex::new(Synthesizer::new("tts_models/en/ljspeech/tacotron2-DDC", false));
}

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn software_version() -> String {
    env!("CARGO_PKG_VERSION").to_string()
}

#[tauri::command]
fn build_type() -> String {
    if cfg!(debug_assertions) {
        return "debug".to_string();
    } else {
        return "release".to_string();
    }
}

unsafe fn get_tts(text: &String) {
    let synth: &mut Synthesizer = &mut *SYNTHESIZER.lock().unwrap();
    let (_stream, stream_handle) = OutputStream::try_default().unwrap();
    let sink = Sink::try_new(&stream_handle).unwrap();
    let audio = synth.tts(&text);
    let rate = synth.sample_rate();
    println!("playing audio at rate {}", rate);
    sink.append(SamplesBuffer::new(1, rate as u32, audio.clone()));
    sink.sleep_until_end();
}

#[tauri::command]
fn say(text: String) {
    println!("generating audio: {}", &text);
    unsafe {
        thread::spawn(move || {
            get_tts(&text);
        });
    }
}

#[allow(dead_code)] //TODO: Remove before prod
fn move_window_to_other_monitor(window: &Window, i: usize) -> tauri::Result<()> {
    let monitors = window.available_monitors()?;
    let monitor = monitors.get(i).ok_or(tauri::Error::CreateWindow)?;

    let pos = monitor.position();

    window.set_position(Position::Physical(tauri::PhysicalPosition {
        x: pos.x,
        y: 0,
    }))?;

    window.center()?;
    Ok(())
}
fn main() {
    unsafe {
        get_tts(&"Wavespeak Tablet".to_string());
    }
    
    let app = tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            software_version,
            build_type,
            say
        ])
        .build(tauri::generate_context!())
        .expect("error while running tauri application");

    let window = app.get_window("main").expect("Cannot get main window");
    //move_window_to_other_monitor(&window, 1).expect("Cannot move window to other monitor");

    app.run(|_app_handle, _event| {
        let _ = window;
    });
}
