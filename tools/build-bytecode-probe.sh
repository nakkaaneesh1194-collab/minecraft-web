#!/usr/bin/env bash
# Builds the non-proprietary WASM bytecode probe consumed by /runtime at deployment.
# Link explicitly with wasm-ld: some dev containers ship clang-N but only an
# unversioned wasm-ld, so letting clang guess wasm-ld-N is not portable.
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"
CLANG_BIN="${CLANG:-clang}"
WASM_LD_BIN="${WASM_LD:-wasm-ld}"
command -v "$CLANG_BIN" >/dev/null || { echo 'clang is required to compile the browser probe' >&2; exit 1; }
command -v "$WASM_LD_BIN" >/dev/null || { echo 'wasm-ld is required to link the browser probe; install LLVM lld or set WASM_LD=/path/to/wasm-ld' >&2; exit 1; }
mkdir -p apps/web/public
OBJECT="$(mktemp "${TMPDIR:-/tmp}/minecraft-bytecode-probe.XXXXXX.o")"
trap 'rm -f "$OBJECT"' EXIT
"$CLANG_BIN" --target=wasm32-unknown-unknown -O2 -nostdlib -c \
  packages/browser-runtime/wasm/minecraft_bytecode_probe.c -o "$OBJECT"
"$WASM_LD_BIN" --no-entry --export=execute_jvm_code --export=executed_opcode_count \
  --export-memory --allow-undefined "$OBJECT" \
  -o apps/web/public/minecraft-bytecode-probe.wasm
