# Browser runtime architecture decision — 2026-09-06

## Decision

**Do not claim that Minecraft Java or Bedrock presently runs in this product.** The selected target is a *replaceable Java Edition actual-client adapter boundary*, with the browser launcher, capability probe, local-storage abstraction, asset hash validation, and secure OAuth boundary built independently. Milestone 10 is explicitly **blocked**, not emulated.

At present, no official, browser-distributable Minecraft Java client runtime exists, and a legitimate owner downloading the normal Java client does not create a right to transform or redistribute its proprietary bytecode, assets, native libraries, or authentication/session material through this application. Bedrock is a native, closed platform client and has no browser execution target. Therefore the actual Minecraft code executed by this repository is **0%**. It must remain 0%, rather than substituting a clone, until a demonstrably authorized adapter exists.

## Comparison and technical findings

| Route | What it can execute | Principal blocker | Decision |
|---|---|---|---|
| Java source → WASM (TeaVM-style) | Java applications built/authorized from source | Minecraft source is not supplied or freely compilable; Java SE + JNI surface is incomplete | Not viable for proprietary client |
| JVM/bytecode → WASM | Potentially JVM bytecode under a compatible runtime | Exact Java runtime behavior, reflection, threads, classloading, JNI and LWJGL natives must be supplied; licensing/authorization unresolved | Adapter research only |
| CheerpJ/browser JVM | Java bytecode with a commercial browser JVM | Does not solve permission to transform/distribute Minecraft or native LWJGL dependencies | Not an implementation path |
| Emscripten | C/C++ sources to WASM | Java Edition is not an Emscripten C/C++ program; it cannot compile JARs or proprietary native binaries | Rejected |
| Bedrock binary transformation | Native game binary | Closed native client, platform services, binary licensing, anti-tamper and unsupported browser targets | Rejected |
| Compatibility reimplementation | A separate game | Violates the actual-client requirement | Prohibited |

### Required compatibility surface if an authorized Java adapter is ever available

The adapter must execute verified Minecraft Java bytecode—not reconstructed gameplay—and provide compatible Java classes, dynamic class loading, native memory, threading/Atomics, a virtual filesystem, LWJGL OpenGL calls mapped to WebGPU or WebGL 2, OpenAL mapped to Web Audio, window/input mapped to DOM + Pointer Lock, and a protocol-approved networking transport. Browser sockets cannot issue raw TCP connections; Java multiplayer's normal TCP protocol is consequently a material limitation. A proxy must not be added merely to bypass server, protocol, or authentication restrictions.

## Legal acquisition boundary

| Component | Handling |
|---|---|
| This project's TypeScript, UI, adapter interfaces, tests | Can be compiled and redistributed under this repository's license. |
| Minecraft JARs, resources, asset objects, LWJGL/OpenAL native binaries, game metadata | Never committed or bundled. Only an official, explicitly authorized acquisition path could provide them after ownership verification. |
| Microsoft/Xbox/Minecraft access and session tokens | Server-side only, encrypted/session-bound, never packaged into files or exposed to arbitrary script. |
| Microsoft application client secret, database credentials, signing keys | Server-side secrets only. |
| OAuth redirect/session, entitlement verification, audit/rate limits | Must remain on the backend. The backend must never stream the game. |

The proposed `GameAssetManager` accepts only an allowlisted manifest, verifies SHA-1 before persistence, and stores game-cache payloads locally (OPFS). It does not discover arbitrary native installation paths: browser sandboxes cannot read them. Any file-import flow must require deliberate user selection and separately establish authorization.

## Browser platform architecture

* **Code execution:** `WebAssembly.compileStreaming` for an authorized WASM module, deferred/lazy loading, with no current proprietary module.
* **Rendering:** WebGPU preferred, WebGL 2 fallback. The backend is an API compatibility target, not a separate renderer.
* **Filesystem:** OPFS for large durable opaque blobs, IndexedDB for metadata, Cache Storage for immutable runtime responses. Storage quota and eviction must be handled.
* **Threads:** Worker-owned computation and `SharedArrayBuffer` only under `COOP: same-origin` + `COEP: require-corp`; single-threaded fallback remains functional but is not performance-equivalent.
* **Input/audio:** Pointer Lock and browser events; Web Audio must begin from a user gesture and suspend/resume with page lifecycle.
* **Networking:** WebSocket/WebTransport/WebRTC are not raw TCP. A formally compatible, authorized transport is a prerequisite to client multiplayer—not an excuse to proxy around restrictions.

## OAuth and entitlement sequence

1. Browser generates OAuth state, nonce, and PKCE verifier; server records transaction in a short-lived same-site session.
2. Browser redirects to Microsoft Entra v2 authorization endpoint using authorization-code + PKCE. The password is entered only on Microsoft-controlled UI.
3. Callback validates state/nonce, exchanges code server-side, creates an HttpOnly/Secure/SameSite session cookie, and stores no refresh token in browser storage.
4. Server performs Xbox user authentication, XSTS authorization, Minecraft services login, and entitlement/profile checks using documented/authorized contracts; each service has a separate interface (`MicrosoftAuthService`, `XboxAuthService`, `MinecraftAuthService`, `EntitlementService`).
5. Only successful entitlement can request authorized asset metadata. Never fabricate tokens or ownership.

## Milestones and acceptance gates

1. Compatibility probe — implemented in UI; manual browser coverage required.
2. OAuth — backend contract and registered production redirect URI required.
3. Entitlement — server-only service contract and integration tests required.
4–9. WASM boot, graphics, filesystem, input, audio, networking — implementations must be tested against an authorized adapter.
10. Actual client execution — blocked until legal distribution/acquisition and a compatible adapter are independently demonstrated.
11. Performance — measure cold/warm startup, JS↔WASM crossings, worker/WASM/GPU frame time, memory and 1% lows; target is 60 FPS but no claim is made before milestone 10.
12. Production launcher — contingent on earlier gates.

## References consulted

* Microsoft, [OAuth 2.0 authorization code flow](https://learn.microsoft.com/en-us/entra/identity-platform/v2-oauth2-auth-code-flow) — PKCE/state code-flow requirements.
* MDN, [WebAssembly.compileStreaming()](https://developer.mozilla.org/en-US/docs/WebAssembly/Reference/JavaScript_interface/compileStreaming_static) — streaming compilation API.
* MDN, [Origin private file system](https://developer.mozilla.org/en-US/docs/Web/API/File_System_API/Origin_private_file_system) — browser-private persistent file storage.
* MDN, [Cross-Origin-Opener-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cross-Origin-Opener-Policy) — cross-origin isolation prerequisite context.

This is an engineering decision record, not a legal opinion; obtain Microsoft/Mojang and runtime-vendor authorization before enabling any actual-client import, transformation, or delivery path.
