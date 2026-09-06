import type { CompatibilityReport, RuntimeStatus } from "@browser-client/shared";
export interface GameRuntime { initialize(): Promise<void>; load(): Promise<void>; start(): Promise<void>; pause(): void; resume(): void; shutdown(): Promise<void>; }
export class RuntimeBlockedError extends Error { constructor(message: string) { super(message); this.name = "RuntimeBlockedError"; } }
export function detectCompatibility(): CompatibilityReport {
  const canvas = document.createElement("canvas");
  const nav = navigator as Navigator & { gpu?: unknown; storage: StorageManager & { getDirectory?: () => Promise<FileSystemDirectoryHandle> } };
  const webgl2 = Boolean(canvas.getContext("webgl2"));
  const webgpu = Boolean(nav.gpu);
  return { wasm: typeof WebAssembly !== "undefined", webgpu, webgl2, opfs: Boolean(nav.storage?.getDirectory), workers: typeof Worker !== "undefined", sharedArrayBuffer: typeof SharedArrayBuffer !== "undefined" && crossOriginIsolated, pointerLock: "requestPointerLock" in canvas, renderer: webgpu ? "webgpu" : webgl2 ? "webgl2" : "unavailable" };
}
/** A deliberate gate: this project must never replace proprietary Minecraft code with a lookalike. */
export class BrowserMinecraftRuntime implements GameRuntime {
  status: RuntimeStatus = { phase: "idle", detail: "No compatible, licensed Minecraft execution adapter is installed." };
  async initialize(): Promise<void> { this.status = { phase: "blocked", detail: "Actual-client adapter unavailable: Java client bytecode and LWJGL/JNI browser bindings are not currently supplied." }; }
  async load(): Promise<void> { throw new RuntimeBlockedError(this.status.detail); }
  async start(): Promise<void> { throw new RuntimeBlockedError(this.status.detail); }
  pause(): void { /* Adapter-owned when implemented. */ }
  resume(): void { /* Adapter-owned when implemented. */ }
  async shutdown(): Promise<void> { this.status = { phase: "idle", detail: "Runtime shut down." }; }
}
export interface AssetManifestEntry { path: string; sha1: string; size: number; }
export class GameAssetManager {
  async verifyAsset(file: ArrayBuffer, expectedSha1: string): Promise<boolean> { const digest = await crypto.subtle.digest("SHA-1", file); return [...new Uint8Array(digest)].map(v => v.toString(16).padStart(2, "0")).join("") === expectedSha1; }
  async cacheAsset(entry: AssetManifestEntry, data: ArrayBuffer): Promise<void> { const root = await navigator.storage.getDirectory(); const file = await root.getFileHandle(`asset-${entry.sha1}`, { create: true }); const stream = await file.createWritable(); await stream.write(data); await stream.close(); }
  async invalidateCache(): Promise<void> { const root = await navigator.storage.getDirectory(); const iterable = root as FileSystemDirectoryHandle & { entries(): AsyncIterable<[string, FileSystemHandle]> }; for await (const [name] of iterable.entries()) if (name.startsWith("asset-")) await root.removeEntry(name); }
}
