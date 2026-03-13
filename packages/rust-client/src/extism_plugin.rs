#![cfg(all(not(target_arch = "wasm32"), feature = "extism-plugin"))]

use anyhow::{anyhow, Result};
use std::fs;

pub struct WasmPlugin {
    inner: extism::Plugin,
}

pub fn load_plugin_from_file(path: &str) -> Result<WasmPlugin> {
    let bytes = fs::read(path).map_err(|e| anyhow!(e))?;
    let manifest = extism::manifest::Manifest::new([extism::manifest::Wasm::data(bytes)]);
    let plugin = extism::PluginBuilder::new(manifest).build()?;
    Ok(WasmPlugin { inner: plugin })
}

pub fn call_function(plugin: &mut WasmPlugin, func: &str, input: &[u8]) -> Result<Vec<u8>> {
    let out = plugin.inner.call(func, input)?;
    Ok(out.to_vec())
}
