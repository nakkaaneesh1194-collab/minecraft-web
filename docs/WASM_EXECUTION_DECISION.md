# WASM execution decision

## Selected route: user-authorized Java bytecode adapter on a browser WASM JVM

This preserves the greatest possible fraction of Minecraft Java code: the target client JAR remains bytecode, while the runtime and native dependency bindings are replaced at the platform boundary. It is selected as an **experimental adapter contract**, not as a claim that vanilla Minecraft currently starts.

| Rank | Approach | Untouched Minecraft code | Feasibility | Performance | Legal/distribution | Decision |
|---:|---|---|---|---|---|---|
| 1 | Browser JVM / bytecode adapter | Potentially most client bytecode | Medium-long term | Interpreter poor; AOT/JIT research required | User-authorized JAR only; adapter authorization required | Selected prototype boundary |
| 2 | OpenJDK-derived WASM VM | Nearly all bytecode | Long-term research | VM/JIT/heap constrained | Same proprietary-content boundary | Not parallelized now |
| 3 | TeaVM source/AOT conversion | Requires broad transformation | Low for unmodified client | Good if compatible | No source/distribution authority | Rejected for client |
| 4 | Native Bedrock transformation | Binary only | Very low | Unknown | Closed native platform | Rejected |
| 5 | Reimplementation/renderer | None | Technically easy | Irrelevant | Violates objective | Prohibited |

## Reproducible adapter boundary

An external build must take a user-supplied, hash-verified client JAR, generate a WASM module, and emit a manifest:

```json
{"wasmUrl":"/user-runtime/minecraft-adapter.wasm","sha256":"<base64 SHA-256>","clientJarSha1":"<official manifest SHA-1>","clientMainClass":"net.minecraft.client.main.Main"}
```

The module must export `minecraft_execution_probe(): i32`. Returning `1` attests that the declared class was invoked inside the WASM JVM; anything else leaves the runtime non-executing. This contract is intentionally insufficient to claim boot success: it is M2 evidence only after independent inspection of the authorized adapter.

## Milestone ledger

| Milestone | Status | Evidence required |
|---|---|---|
| M1 client JAR/class loading | Not achieved | Hash + classloader trace from WASM |
| M2 actual class executes | Not achieved | Probe attestation + invocation trace |
| M3 initialization begins through M10 playable | Not achieved | Client-originated logs/traces and real local rendering |

No proprietary JAR, generated adapter, trace or mock fixture ships in this repository.
