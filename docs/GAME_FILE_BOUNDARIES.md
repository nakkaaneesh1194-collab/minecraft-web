# Game file boundaries

| Category | Redistributable by this project? | Source / handling | Proprietary | Hash verified |
|---|---:|---|---:|---:|
| Project TypeScript, adapter interfaces, tests | Yes | Built from this repository | No | Build lockfile |
| Minecraft client JAR | No | Deliberately user-supplied after entitlement/official acquisition | Yes | Official manifest SHA-1 |
| Minecraft asset objects/resources | No | Authorized mechanism only; local OPFS cache | Yes | Official object hash |
| Mojang libraries / LWJGL natives | No by default | Only if official terms authorize the exact mechanism | Mixed | Official manifest hash |
| User-built WASM adapter | No default distribution | Generated locally from authorized inputs; not committed | Derivative risk | SHA-256 manifest |
| OAuth/session tokens | Never | Server-side session only | Sensitive | N/A |
| Runtime metrics and execution attestations | Yes, if no tokens/content | Generated locally | No | Optional signed audit record |

`GameAssetManager` stores opaque hash-named assets in OPFS. It never scans host paths, embeds proprietary bytes, or treats a file picker selection as entitlement. Clearing game cache must not clear a secure server session.
