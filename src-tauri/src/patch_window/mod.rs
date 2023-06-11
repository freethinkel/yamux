#[cfg(target_os = "macos")]
pub mod macos;

use self::macos::ToolbarThickness;
use tauri::Window as TauriWindow;

pub trait PatchWindow {
  #[cfg(target_os = "macos")]
  fn apply_toolbar(&self, tickness: ToolbarThickness);
}

impl PatchWindow for TauriWindow {
  #[cfg(target_os = "macos")]
  fn apply_toolbar(&self, tickness: ToolbarThickness) {
    macos::apply_toolbar(self, tickness);
  }
}
