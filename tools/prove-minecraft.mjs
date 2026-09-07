import { existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
const jar = process.env.MINECRAFT_CLIENT_JAR || 'runtime-input/minecraft-client.jar';
execFileSync('./tools/build-bytecode-probe.sh', { stdio: 'inherit' });
if (!existsSync(jar)) { console.error(`M1 attempted but not demonstrated: provide an authorized JAR at ${jar} or set MINECRAFT_CLIENT_JAR. Open /runtime in a browser to execute original bytecode in WASM.`); process.exitCode=2; }
else { console.log(`Authorized artifact found: ${jar}. Open /runtime and select it; the browser route performs the WASM execution attempt and reports the exact method or failure.`); }
