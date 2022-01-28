#![cfg(target_os = "macos")]

use cocoa::{
    appkit::{
        NSWindow, NSToolbar, NSWindowTitleVisibility, NSWindowStyleMask
    },
    base::{id, nil},
};

#[allow(deprecated)]
pub fn apply_toolbar(window: id) {
    unsafe {
        let custom_toolbar = NSToolbar::alloc(nil).init_();
        custom_toolbar.setShowsBaselineSeparator_(0);
        window.setToolbar_(custom_toolbar);
        let masks = window.styleMask() | NSWindowStyleMask::NSUnifiedTitleAndToolbarWindowMask
        | NSWindowStyleMask::NSFullSizeContentViewWindowMask
        | NSWindowStyleMask::NSBorderlessWindowMask;
        
        window.setStyleMask_(masks);
        window.setTitlebarAppearsTransparent_(1);
        window.setTitleVisibility_(NSWindowTitleVisibility::NSWindowTitleHidden);
    }
}
