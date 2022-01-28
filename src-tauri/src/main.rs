#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

mod patch_window;

use crate::menu::AddDefaultSubmenus;
mod menu;

use tauri::{Manager, Menu};
use tauri_plugin_vibrancy::{Vibrancy, MacOSVibrancy};

#[cfg(target_os = "macos")]
use crate::patch_window::Toolbar;


fn main() {
  let ctx = tauri::generate_context!();

  tauri::Builder::default()
    .setup(|app| {
      let window = app.get_window("main").unwrap();

      #[cfg(target_os = "windows")]
      window.apply_blur();

      #[cfg(target_os = "macos")]
      {
        window.apply_toolbar();
        window.apply_vibrancy(MacOSVibrancy::AppearanceBased);
      }

      Ok(())
    })
    .menu(
      Menu::new()
        .add_default_app_submenu_if_macos(&ctx.package_info().name)
        .add_default_file_submenu()
        .add_default_edit_submenu()
        .add_default_view_submenu()
        .add_default_window_submenu()
    )
    .run(ctx)
    .expect("error while running tauri application");
}
