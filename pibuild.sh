export PKG_CONFIG_SYSROOT_DIR = "/usr/aarch64-linux-gnu/"
export PKG_CONFIG_PATH = "/usr/lib/aarch64-linux-gnu/pkgconfig"

cargo tauri build -vv --target aarch64-unknown-linux-gnu
