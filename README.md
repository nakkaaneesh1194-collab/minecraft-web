# Minecraft Browser Client Runtime Lab

A research-first launcher shell for an **actual Minecraft client in the browser**, never a clone or stream. The project intentionally blocks launch until an authorized, browser-compatible actual-client adapter exists. See [the architecture decision](docs/BROWSER_RUNTIME_RESEARCH.md).

## Run

```bash
npm install
npm run dev
npm run typecheck
npm run build
```

No Minecraft proprietary files, account tokens, or credentials are in this repository.

## Runtime artifact build

`minecraft-bytecode-probe.wasm` is **generated**, non-proprietary WebAssembly from `packages/browser-runtime/wasm/minecraft_bytecode_probe.wat`. It is intentionally not committed. Both `npm run dev` and `npm run build` invoke `tools/build-bytecode-probe.sh` before Next.js starts/builds, placing it at `apps/web/public/minecraft-bytecode-probe.wasm` so the deployed `/runtime` route can fetch it. The build uses the pinned `wabt` npm dependency and requires only Node.js—no host Clang, LLD, or version-specific WASM linker. Minecraft JARs remain user-authorized inputs and are never generated or committed.
