# Performance measurement plan

No FPS or client-startup performance claim is valid before M2. The runtime records a first set of adapter-independent metrics: WASM adapter load time, exported memory size, loaded module URLs, and JavaScript→WASM probe calls.

| Measurement | Capture point | Status |
|---|---|---|
| Startup time | `load()` before/after streaming compilation | Implemented when artifact exists |
| WASM memory | exported `WebAssembly.Memory` | Implemented when adapter exports memory |
| JS↔WASM crossings | adapter probe counter | Implemented |
| Asset load and hash duration | asset manager around authorized download | Pending authorized source |
| FPS/frame time/GPU/shaders | actual renderer adapter only | Blocked before M6 |
| CPU and worker utilization | `Performance`/worker telemetry | Blocked before threaded adapter |

Benchmark protocol: cold and warm runs on a cross-origin-isolated supported browser; record p50/p95 startup, bytes, crossings, frame pacing and worker time. Do not compare custom renderers or mocks.
