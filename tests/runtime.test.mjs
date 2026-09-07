import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
const read = path => readFile(new URL(path, import.meta.url), 'utf8');
test('research documentation keeps actual-client execution blocked until evidence exists', async () => {
  const source = await read('../docs/BROWSER_RUNTIME_RESEARCH.md');
  assert.match(source, /actual Minecraft code executed by this repository is \*\*0%\*\*/);
  assert.match(source, /achieved milestone remains \*\*M0 \/ 0%\*\*/);
});
test('runtime has no mock, renderer, or remote-streaming fallback', async () => {
  const source = await read('../packages/browser-runtime/src/index.ts');
  assert.match(source, /minecraft_execution_probe/);
  assert.match(source, /No authorized adapter artifact selected/);
  assert.doesNotMatch(source, /WebRTC|RTCPeerConnection|cloud gaming|mock runtime|fake renderer/i);
});
test('execution decision requires an attested actual-client class invocation', async () => {
  const source = await read('../docs/WASM_EXECUTION_DECISION.md');
  assert.match(source, /net\.minecraft\.client\.main\.Main/);
  assert.match(source, /must export `minecraft_execution_probe/);
  assert.match(source, /Not achieved/);
});
test('M1 probe executes supplied code bytes in WASM rather than asserting from JavaScript', async () => {
  const source = await read('../packages/browser-runtime/src/class-probe.ts');
  assert.match(source, /e\.execute_jvm_code\(offset,method\.code\.length\)/);
  assert.match(source, /WASM interpreter rejected/);
  assert.doesNotMatch(source, /executionObserved\s*=\s*true/);
});
test('CSP keeps unsafe-eval development-only while preserving isolation headers', async () => {
  const source = await read('../apps/web/next.config.ts');
  assert.match(source, /NODE_ENV === "production"/);
  assert.match(source, /unsafe-eval/);
  assert.match(source, /Cross-Origin-Opener-Policy/);
  assert.match(source, /Cross-Origin-Embedder-Policy/);
});
test('OAuth routes use PKCE, signed state, server-side exchange, and entitlement separation', async () => {
  const auth = await read('../apps/web/lib/auth.ts');
  const start = await read('../apps/web/app/api/auth/microsoft/start/route.ts');
  const callback = await read('../apps/web/app/api/auth/microsoft/callback/route.ts');
  assert.match(start, /code_challenge/); assert.match(auth, /verifyMinecraft/); assert.match(auth, /entitlement: Entitlement/);
  assert.match(start, /httpOnly:true/); assert.match(callback, /exchangeCode/); assert.match(callback, /txn=verify/); assert.match(callback, /secure:process\.env\.NODE_ENV==="production"/);
  assert.doesNotMatch(auth, /console\.log/);
});
test('environment example documents non-secret formats and auth code distinguishes failures', async () => {
 const env=await read('../.env.example'), auth=await read('../apps/web/lib/auth.ts'), callback=await read('../apps/web/app/api/auth/microsoft/callback/route.ts');
 assert.match(env,/\.env\.local is ignored/); assert.match(env,/consumers/); assert.match(env,/http:\/\/localhost:3000\/api\/auth\/microsoft\/callback/);
 assert.match(auth,/Missing application configuration/); assert.match(auth,/Invalid OAuth configuration/); assert.match(auth,/Microsoft authentication failure/); assert.match(callback,/OAuth callback failure/);
});
