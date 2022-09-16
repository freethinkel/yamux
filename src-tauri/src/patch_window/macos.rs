#![cfg(target_os = "macos")]

use cocoa::{
  appkit::{NSToolbar, NSWindow, NSWindowStyleMask, NSWindowTitleVisibility},
  base::{id, nil, BOOL, NO, YES},
  foundation::NSAutoreleasePool,
};

#[allow(deprecated)]
pub fn apply_toolbar(window: id) {
  unsafe {
    let custom_toolbar = NSToolbar::alloc(nil).init_();
    custom_toolbar.setShowsBaselineSeparator_(NO);
    window.setToolbar_(custom_toolbar);
    let masks = window.styleMask()
      | NSWindowStyleMask::NSUnifiedTitleAndToolbarWindowMask
      | NSWindowStyleMask::NSFullSizeContentViewWindowMask
      | NSWindowStyleMask::NSBorderlessWindowMask;

    window.setStyleMask_(masks);
    window.setTitlebarAppearsTransparent_(YES);
    window.setTitleVisibility_(NSWindowTitleVisibility::NSWindowTitleHidden);
  }
}

#[allow(deprecated)]
pub fn apply_fix_blur(window: id) {
  unsafe {
    // window.setState_(NSVisualEffectState::Active);
  }
}
