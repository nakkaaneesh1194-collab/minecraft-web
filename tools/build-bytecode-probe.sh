#!/usr/bin/env bash
# Builds the non-proprietary WASM bytecode probe consumed by /runtime at deployment.
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"
command -v clang >/dev/null || { echo 'clang is required to build the browser probe' >&2; exit 1; }
mkdir -p apps/web/public
clang --target=wasm32-unknown-unknown -O2 -nostdlib \
  -Wl,--no-entry -Wl,--export=execute_jvm_code -Wl,--export=executed_opcode_count \
  -Wl,--export-memory -Wl,--allow-undefined \
  packages/browser-runtime/wasm/minecraft_bytecode_probe.c \
  -o apps/web/public/minecraft-bytecode-probe.wasm
