#![cfg(target_os = "macos")]

use cocoa::{
  appkit::{NSColor, NSToolbar, NSWindow, NSWindowStyleMask, NSWindowTitleVisibility},
  base::{id, nil, BOOL, NO, YES},
  delegate,
};
use objc::{
  class, msg_send,
  runtime::{Object, Sel},
  sel, sel_impl,
};
use tauri::Window;

#[allow(dead_code)]
pub enum ToolbarThickness {
  Thick,
  Medium,
  Thin,
}

#[allow(deprecated)]
pub fn apply_toolbar(tauri_win: &Window, thickness: ToolbarThickness) {
  let window = tauri_win.ns_window().unwrap() as id;
  unsafe {
    let masks = window.styleMask()
      | NSWindowStyleMask::NSUnifiedTitleAndToolbarWindowMask
      | NSWindowStyleMask::NSFullSizeContentViewWindowMask
      | NSWindowStyleMask::NSBorderlessWindowMask;

    window.setStyleMask_(masks);
    window.setTitlebarAppearsTransparent_(YES);
    window.setTitleVisibility_(NSWindowTitleVisibility::NSWindowTitleHidden);
    let color = NSColor::colorWithSRGBRed_green_blue_alpha_(nil, 255.0, 255.0, 255.0, 1.0);
    window.setBackgroundColor_(color);
    window.setHasShadow_(YES);

    match thickness {
      ToolbarThickness::Thick => {
        tauri_win.set_title("").expect("Title wasn't set to ''");
        window.setToolbarStyle_(cocoa::appkit::NSWindowToolbarStyle::NSWindowToolbarStyleUnified);
        // window.setTitleVisibility_(NSWindowTitleVisibility::NSWindowTitleVisible);
        make_toolbar(window);
      }
      ToolbarThickness::Medium => {
        make_toolbar(window);
      }
      ToolbarThickness::Thin => {}
    }
    extern "C" fn on_enter_fullscreen(this: &Object, _cmd: Sel, _notification: id) {
      unsafe {
        let window: id = *this.get_ivar("window");
        window.toolbar().setIsVisible_(NO);
      }
    }
    extern "C" fn on_exit_fullscreen(this: &Object, _cmd: Sel, _notification: id) {
      unsafe {
        let window: id = *this.get_ivar("window");
        window.toolbar().setIsVisible_(YES);
      }
    }
    let delegate_name = format!("window_delegate_{}", tauri_win.label());
    let dn = delegate_name.as_str();

    window.setDelegate_(delegate!(dn, {
        window: id = window,
        (windowWillEnterFullScreen:) => on_enter_fullscreen as extern fn(&Object, Sel, id),
        (windowDidExitFullScreen:) => on_exit_fullscreen as extern fn(&Object, Sel, id)
    }));
  }
}

#[cfg(target_os = "macos")]
unsafe fn make_toolbar(id: id) -> id {
  let new_toolbar = NSToolbar::alloc(id);
  new_toolbar.setShowsBaselineSeparator_(NO);
  new_toolbar.init_();
  id.setToolbar_(new_toolbar);

  return new_toolbar;
}

#[allow(dead_code)]
#[repr(u64)]
#[derive(Clone, Copy, Debug, PartialEq)]
enum NSVisualEffectState {
  FollowsWindowActiveState = 0,
  Active = 1,
  Inactive = 2,
}

#[allow(non_snake_case)]
trait NSVisualEffectView: Sized {
  unsafe fn alloc(_: Self) -> id {
    msg_send![class!(NSVisualEffectView), alloc]
  }

  unsafe fn setState_(self, state: NSVisualEffectState);
}

#[allow(non_snake_case)]
trait ChangeVisible: Sized {
  unsafe fn setIsVisible_(self, state: BOOL);
}

#[allow(non_snake_case)]
impl NSVisualEffectView for id {
  unsafe fn setState_(self, state: NSVisualEffectState) {
    msg_send![self, setState: state]
  }
}

#[allow(non_snake_case)]
impl ChangeVisible for id {
  unsafe fn setIsVisible_(self, state: BOOL) {
    msg_send![self, setVisible: state]
  }
}
