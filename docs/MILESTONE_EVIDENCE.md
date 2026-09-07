# Milestone evidence

## M1 — Original Minecraft bytecode execution

**Status: NOT DEMONSTRATED in this repository environment.**

Implementation: `/runtime` accepts a developer-selected, authorized Minecraft Java client JAR. It parses class-file `Code` attributes under `net/minecraft/`, selects only a safe opcode-only method, and copies those original byte bytes into a WASM module. The WASM module interprets the bytes and exposes its executed-opcode count. It rejects all unsupported bytecode and never sets success from JavaScript.

A JAR was not supplied to this environment, so no class, method, SHA-1, browser, or execution trace exists to record. The highest genuinely evidenced milestone remains **M0 (0%)**. This document must be replaced with concrete class/method/opcode evidence only after running `/runtime` against an authorized artifact.
