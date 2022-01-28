#[cfg(target_os = "macos")]
pub mod macos;

use tauri::Window as TauriWindow;


pub trait Toolbar {
  #[cfg(target_os = "macos")]
  fn apply_toolbar(&self);
}


impl Toolbar for TauriWindow {

  #[cfg(target_os = "macos")]
  fn apply_toolbar(&self) {
      macos::apply_toolbar(self.ns_window().unwrap() as _);
  }
}