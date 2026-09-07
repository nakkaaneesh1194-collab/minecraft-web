export type Renderer = "webgpu" | "webgl2" | "unavailable";
export interface CompatibilityReport { wasm: boolean; webgpu: boolean; webgl2: boolean; opfs: boolean; workers: boolean; sharedArrayBuffer: boolean; pointerLock: boolean; renderer: Renderer; }
export interface GameVersion { id: string; version: string; releaseType: "release" | "snapshot"; runtime: string; requiredAssets: string[]; compatibility: "blocked" | "experimental" | "ready"; }
export type RuntimePhase = "idle" | "initializing" | "awaiting-artifacts" | "runtime-loaded" | "minecraft-class-loaded" | "minecraft-executing" | "blocked" | "failed" | "stopped";
export interface RuntimeStatus { phase: RuntimePhase; detail: string; }
export interface MinecraftExecution { verified: boolean; className?: string; packageName?: string; invocation?: string; evidence?: string; }
export interface RuntimeMetrics { startupMs?: number; wasmMemoryBytes?: number; jsWasmCalls: number; loadedAt?: number; }
export const TARGET_VERSION: GameVersion = { id: "java-browser-runtime", version: "unselected", releaseType: "release", runtime: "user-supplied-java-wasm-adapter", requiredAssets: [], compatibility: "experimental" };
