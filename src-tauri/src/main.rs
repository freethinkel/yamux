#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

mod patch_window;

use crate::menu::AddDefaultSubmenus;
mod menu;

use tauri::{window, Manager, Menu};
use window_vibrancy::{apply_blur, apply_vibrancy, NSVisualEffectMaterial};

#[cfg(target_os = "macos")]
use crate::patch_window::PatchWindow;

fn main() {
  let ctx = tauri::generate_context!();

  let mut app = tauri::Builder::default().setup(|app| {
    let window = app.get_window("main").unwrap();

    #[cfg(target_os = "windows")]
    {
      apply_blur(&window, Some((18, 18, 18, 125)))
        .expect("Unsupported platform! 'apply_blur' is only supported on Windows");
    }

    #[cfg(target_os = "macos")]
    {
      apply_vibrancy(&window, NSVisualEffectMaterial::UnderWindowBackground)
        .expect("Unsupported platform! 'apply_vibrancy' is only supported on macOS");
      window.apply_toolbar();
      window.apply_fix_blur();
    }

    Ok(())
  });

  #[cfg(target_os = "macos")]
  {
    app = app
      .menu(
        Menu::new()
          .add_default_app_submenu_if_macos(&ctx.package_info().name)
          .add_default_file_submenu()
          .add_default_edit_submenu()
          .add_default_view_submenu()
          .add_default_window_submenu(),
      )
      .on_menu_event(menu::handle_menu_event);
  }

  app.run(ctx).expect("error while running tauri application");
}
