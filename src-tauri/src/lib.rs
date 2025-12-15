use tauri::Emitter;
use std::env;

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

// Command to get command line arguments
#[tauri::command]
fn get_command_line_args() -> Vec<String> {
    env::args().collect()
}

// Command to open a file from command line
#[tauri::command]
fn open_file_from_args(_app_handle: tauri::AppHandle) -> Option<String> {
    let args: Vec<String> = env::args().collect();
    
    // Skip the first argument (executable path) and look for file arguments
    for arg in args.iter().skip(1) {
        if arg.ends_with(".md") || arg.ends_with(".markdown") || 
           arg.ends_with(".mdown") || arg.ends_with(".mkd") || 
           arg.ends_with(".mkdn") || arg.ends_with(".mdwn") || 
           arg.ends_with(".mdtxt") || arg.ends_with(".mdtext") {
            return Some(arg.clone());
        }
    }
    None
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![greet, get_command_line_args, open_file_from_args])
        .setup(|app| {
            // Handle file opening on startup
            let args: Vec<String> = env::args().collect();
            
            // Check if a markdown file was passed as argument
            for arg in args.iter().skip(1) {
                if arg.ends_with(".md") || arg.ends_with(".markdown") || 
                   arg.ends_with(".mdown") || arg.ends_with(".mkd") || 
                   arg.ends_with(".mkdn") || arg.ends_with(".mdwn") || 
                   arg.ends_with(".mdtxt") || arg.ends_with(".mdtext") {
                    
                    // Emit an event to the frontend with the file path
                    let _ = app.emit("open-file", arg);
                    break;
                }
            }
            
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}