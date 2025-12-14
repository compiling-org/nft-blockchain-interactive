use wasm_bindgen::prelude::*;
use js_sys::Uint8Array;
use wgpu::*;
use wgpu::util::DeviceExt;

#[wasm_bindgen]
pub async fn wgpu_render_compute(width: u32, height: u32, valence: f32, arousal: f32, dominance: f32) -> Result<Uint8Array, JsValue> {
    let instance = Instance::default();
    let adapter = instance
        .request_adapter(&RequestAdapterOptions {
            power_preference: PowerPreference::HighPerformance,
            compatible_surface: None,
            force_fallback_adapter: false,
        })
        .await
        .ok_or_else(|| JsValue::from_str("adapter"))?;
    let (device, queue) = adapter
        .request_device(&DeviceDescriptor {
            features: Features::empty(),
            limits: Limits::downlevel_webgl2_defaults(),
            label: None,
        }, None)
        .await
        .map_err(|_| JsValue::from_str("device"))?;

    let pixel_count = (width * height * 4) as usize;
    let storage_buffer = device.create_buffer(&BufferDescriptor {
        label: None,
        size: pixel_count as u64,
        usage: BufferUsages::STORAGE | BufferUsages::COPY_SRC | BufferUsages::MAP_READ,
        mapped_at_creation: false,
    });

    #[repr(C)]
    #[derive(Clone, Copy, bytemuck::Pod, bytemuck::Zeroable)]
    struct Params {
        resolution: [f32; 2],
        vad: [f32; 3],
        time: f32,
    }
    let params = Params { resolution: [width as f32, height as f32], vad: [valence, arousal, dominance], time: 0.0 };
    let uniform_buffer = device.create_buffer_init(&util::BufferInitDescriptor {
        label: None,
        contents: bytemuck::cast_slice(&[params]),
        usage: BufferUsages::UNIFORM | BufferUsages::COPY_DST,
    });

    let shader_src = r#"
struct Params {
  resolution: vec2<f32>,
  vad: vec3<f32>,
  time: f32,
};
@group(0) @binding(0) var<storage, read_write> out_buffer: array<u32>;
@group(0) @binding(1) var<uniform> params: Params;
@compute @workgroup_size(8,8)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
  if (gid.x >= u32(params.resolution.x) || gid.y >= u32(params.resolution.y)) { return; }
  let i = gid.y * u32(params.resolution.x) + gid.x;
  let r = clamp(0.5 + params.vad.x * 0.5, 0.0, 1.0);
  let g = clamp(0.5 + params.vad.y * 0.5, 0.0, 1.0);
  let b = clamp(0.5 + params.vad.z * 0.5, 0.0, 1.0);
  let ur: u32 = u32(r * 255.0);
  let ug: u32 = u32(g * 255.0);
  let ub: u32 = u32(b * 255.0);
  let base: u32 = i * 4u;
  out_buffer[base + 0u] = ur;
  out_buffer[base + 1u] = ug;
  out_buffer[base + 2u] = ub;
  out_buffer[base + 3u] = 255u;
}
"#;

    let module = device.create_shader_module(ShaderModuleDescriptor {
        label: None,
        source: ShaderSource::Wgsl(shader_src.into()),
    });

    let bind_layout = device.create_bind_group_layout(&BindGroupLayoutDescriptor {
        label: None,
        entries: &[
            BindGroupLayoutEntry {
                binding: 0,
                visibility: ShaderStages::COMPUTE,
                ty: BindingType::Buffer { ty: BufferBindingType::Storage { read_only: false }, has_dynamic_offset: false, min_binding_size: None },
                count: None,
            },
            BindGroupLayoutEntry {
                binding: 1,
                visibility: ShaderStages::COMPUTE,
                ty: BindingType::Buffer { ty: BufferBindingType::Uniform, has_dynamic_offset: false, min_binding_size: None },
                count: None,
            },
        ],
    });

    let pipeline_layout = device.create_pipeline_layout(&PipelineLayoutDescriptor { label: None, bind_group_layouts: &[&bind_layout], push_constant_ranges: &[] });
    let pipeline = device.create_compute_pipeline(&ComputePipelineDescriptor { label: None, layout: Some(&pipeline_layout), module: &module, entry_point: "main" });

    let bind_group = device.create_bind_group(&BindGroupDescriptor {
        label: None,
        layout: &bind_layout,
        entries: &[
            BindGroupEntry { binding: 0, resource: storage_buffer.as_entire_binding() },
            BindGroupEntry { binding: 1, resource: uniform_buffer.as_entire_binding() },
        ],
    });

    let mut encoder = device.create_command_encoder(&CommandEncoderDescriptor { label: None });
    {
        let mut pass = encoder.begin_compute_pass(&ComputePassDescriptor { label: None });
        pass.set_pipeline(&pipeline);
        pass.set_bind_group(0, &bind_group, &[]);
        let wx = (width + 7) / 8;
        let wy = (height + 7) / 8;
        pass.dispatch_workgroups(wx, wy, 1);
    }
    let command_buf = encoder.finish();
    queue.submit(Some(command_buf));

    let slice = storage_buffer.slice(..);
    slice.map_async(MapMode::Read, |_| {});
    device.poll(Maintain::Wait);
    let data = slice.get_mapped_range();
    let out = Uint8Array::new_with_length(pixel_count as u32);
    out.copy_from(&data);
    drop(data);
    storage_buffer.unmap();
    Ok(out)
}
