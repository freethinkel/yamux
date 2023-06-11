#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

mod patch_window;

use crate::menu::AddDefaultSubmenus;
mod menu;

use cocoa::{appkit::NSWindow, base::id};
use objc::runtime::{NO, YES};
use patch_window::macos::ToolbarThickness;
use serde::{Deserialize, Serialize};
use tauri::{command, AppHandle, Manager, Menu, WindowBuilder, WindowUrl};
use url::Url;
use window_vibrancy::{apply_blur, apply_vibrancy, NSVisualEffectMaterial, NSVisualEffectState};

#[cfg(target_os = "macos")]
use crate::patch_window::PatchWindow;

#[derive(Serialize, Deserialize, Clone)]
pub struct OnNavigationPayload {
  pub url: String,
  pub label: String,
}

#[tauri::command]
fn create_auth_window(app: AppHandle, uri: String, label: String) {
  let handle = app.app_handle();
  let window = handle.get_window(label.clone().as_str());

  match window {
    Some(window) => {
      let _ = window.show();
      return;
    }
    None => {}
  }
  let win = WindowBuilder::new(
    &app,
    label.clone(),
    WindowUrl::External(Url::parse(uri.as_str()).unwrap()),
  )
  .on_navigation(move |url| {
    println!("change navigation: {}", url);
    let _ = handle.emit_all(
      "change_navigation_url",
      OnNavigationPayload {
        url: url.to_string(),
        label: label.clone(),
      },
    );

    return true;
  })
  .build()
  .unwrap();
  let _ = win.set_title("Yandex music signin");
  #[cfg(target_os = "macos")]
  {
    unsafe {
      let ns_window: id = win.ns_window().unwrap() as id;
      ns_window.setMovableByWindowBackground_(YES);
      win.apply_toolbar(ToolbarThickness::Thin);
    }
  }
}

fn main() {
  tauri::Builder::default()
    .setup(|app| {
      let app = app.handle();

      app.windows().iter().for_each(|(_, window)| {
        #[cfg(target_os = "windows")]
        window.set_decorations(true).unwrap();

        #[cfg(target_os = "macos")]
        {
          window.apply_toolbar(ToolbarThickness::Thick);
          apply_vibrancy(
            &window,
            NSVisualEffectMaterial::HudWindow,
            Some(NSVisualEffectState::Active),
            None,
          )
          .expect("Unsupported platform! 'apply_vibrancy' is only supported on macOS");
        }
      });

      #[cfg(target_os = "windows")]
      apply_acrylic(&window, Some((18, 18, 18, 125)))
        .expect("Unsupported platform! 'apply_blur' is only supported on Windows");

      Ok(())
    })
    .invoke_handler(tauri::generate_handler![create_auth_window])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
