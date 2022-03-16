#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

mod patch_window;

use crate::menu::AddDefaultSubmenus;
mod menu;

use tauri::{Manager, Menu};
use window_vibrancy::{apply_vibrancy, apply_blur, NSVisualEffectMaterial};

#[cfg(target_os = "macos")]
use crate::patch_window::Toolbar;

fn main() {
  let ctx = tauri::generate_context!();

  let mut app = tauri::Builder::default()
    .setup(|app| {
      let window = app.get_window("main").unwrap();

      #[cfg(target_os = "windows")] {
        apply_blur(&window);
      }
  
      #[cfg(target_os = "macos")] {
        apply_vibrancy(&window, NSVisualEffectMaterial::AppearanceBased);
        window.apply_toolbar();
      } 

      Ok(())
    });

    #[cfg(target_os = "macos")]
    {
      app = app.menu(
        Menu::new()
          .add_default_app_submenu_if_macos(&ctx.package_info().name)
          .add_default_file_submenu()
          .add_default_edit_submenu()
          .add_default_view_submenu()
          .add_default_window_submenu()
      );
    }


    app.run(ctx)
    .expect("error while running tauri application");
}
