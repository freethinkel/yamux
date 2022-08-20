#[cfg(target_os = "macos")]
pub mod macos;

use tauri::Window as TauriWindow;


pub trait PatchWindow {
  #[cfg(target_os = "macos")]
  fn apply_toolbar(&self);

  #[cfg(target_os = "macos")]
  fn apply_fix_blur(&self);
}


impl PatchWindow for TauriWindow {
  #[cfg(target_os = "macos")]
  fn apply_fix_blur(&self) {
      macos::apply_fix_blur(self.ns_window().unwrap() as _);
  }

  #[cfg(target_os = "macos")]
  fn apply_toolbar(&self) {
      macos::apply_toolbar(self.ns_window().unwrap() as _);
  }
}
