#!/usr/bin/env bash
# Deterministically compiles the non-proprietary browser probe with the wabt npm package.
# No host clang, wasm-ld, or version-specific LLVM toolchain is needed.
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"
node tools/build-bytecode-probe.mjs
