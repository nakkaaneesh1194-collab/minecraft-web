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
