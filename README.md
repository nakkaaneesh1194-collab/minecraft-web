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
