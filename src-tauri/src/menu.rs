use serde::Serialize;
use tauri::{CustomMenuItem, Manager, Menu, MenuItem, Submenu, WindowMenuEvent, Wry};

pub trait AddDefaultSubmenus {
  fn add_default_app_submenu_if_macos(self, app_name: &str) -> Self;
  fn add_default_file_submenu(self) -> Self;
  fn add_default_edit_submenu(self) -> Self;
  fn add_default_view_submenu(self) -> Self;
  fn add_default_window_submenu(self) -> Self;
}

#[derive(Serialize, Clone)]
pub struct DOMKeyboardEvent {
  #[serde(rename = "metaKey")]
  meta_key: bool,
  key: String,
}

impl AddDefaultSubmenus for Menu {
  fn add_default_app_submenu_if_macos(self, app_name: &str) -> Menu {
    #[cfg(target_os = "macos")]
    return self.add_submenu(Submenu::new(
      app_name.to_string(),
      Menu::new()
        // .add_native_item(MenuItem::About(app_name.to_string()))
        .add_native_item(MenuItem::Separator)
        .add_native_item(MenuItem::Services)
        .add_native_item(MenuItem::Separator)
        .add_native_item(MenuItem::Hide)
        .add_native_item(MenuItem::HideOthers)
        .add_native_item(MenuItem::ShowAll)
        .add_native_item(MenuItem::Separator)
        .add_native_item(MenuItem::Quit),
    ));
    #[cfg(not(target_os = "macos"))]
    return self;
  }
  fn add_default_file_submenu(self) -> Menu {
    self.add_submenu(Submenu::new(
      "Файл",
      Menu::new().add_native_item(MenuItem::CloseWindow),
    ))
  }

  fn add_default_edit_submenu(self) -> Menu {
    self.add_submenu(Submenu::new("Правка", {
      let mut menu = Menu::new()
        .add_native_item(MenuItem::Undo)
        .add_native_item(MenuItem::Redo)
        .add_native_item(MenuItem::Separator)
        .add_native_item(MenuItem::Cut)
        .add_native_item(MenuItem::Copy)
        .add_native_item(MenuItem::Paste);
      #[cfg(not(target_os = "macos"))]
      {
        menu = menu.add_native_item(MenuItem::Separator);
      }
      menu = menu.add_native_item(MenuItem::SelectAll);
      // macOS automatically adds "Start Dictation" and "Emoji & Symbols" to
      // the bottom of the Edit menu
      menu
    }))
  }

  fn add_default_view_submenu(self) -> Menu {
    let mut view_menu = Menu::new().add_native_item(MenuItem::EnterFullScreen);
    view_menu = view_menu.add_item(
      CustomMenuItem::new("toggle_devtools".to_string(), "Toggle Developer Tools")
        .accelerator("CmdOrCtrl+Alt+I"),
    );
    self.add_submenu(Submenu::new("Вид", view_menu))
  }

  fn add_default_window_submenu(self) -> Menu {
    self.add_submenu(Submenu::new(
      "Окно",
      Menu::new()
        .add_native_item(MenuItem::Minimize)
        .add_native_item(MenuItem::Zoom),
    ))
  }
}

pub(crate) fn handle_menu_event(event: WindowMenuEvent<Wry>) {
  match event.menu_item_id() {
    "quit" => {
      let app = event.window().app_handle();
      app.exit(0);
    }
    "open_settings" => event
      .window()
      .emit(
        "do_keyboard_input",
        DOMKeyboardEvent {
          meta_key: true,
          key: ",".into(),
        },
      )
      .unwrap(),
    "close" => {
      let window = event.window();

      #[cfg(debug_assertions)]
      if window.is_devtools_open() {
        window.close_devtools();
      } else {
        window.close().unwrap();
      }

      #[cfg(not(debug_assertions))]
      window.close().unwrap();
    }
    "open_search" => event
      .window()
      .emit(
        "do_keyboard_input",
        DOMKeyboardEvent {
          meta_key: true,
          key: "l".into(),
        },
      )
      .unwrap(),
    #[cfg(debug_assertions)]
    "toggle_devtools" => {
      let window = event.window();

      if window.is_devtools_open() {
        window.close_devtools();
      } else {
        window.open_devtools();
      }
    }
    _ => {}
  }
}
