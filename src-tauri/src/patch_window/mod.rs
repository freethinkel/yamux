#[cfg(target_os = "macos")]
pub mod macos;

#[cfg(target_os = "macos")]
use self::macos::ToolbarThickness;
#[cfg(target_os = "macos")]
use tauri::Window as TauriWindow;

#[cfg(target_os = "macos")]
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
