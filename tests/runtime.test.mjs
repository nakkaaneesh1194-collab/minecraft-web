import test from 'node:test';
import assert from 'node:assert/strict';
test('architecture documentation declares actual-client execution as blocked', async () => {
  const source = await (await import('node:fs/promises')).readFile(new URL('../docs/BROWSER_RUNTIME_RESEARCH.md', import.meta.url), 'utf8');
  assert.match(source, /actual Minecraft code executed by this repository is \*\*0%\*\*/);
  assert.match(source, /Milestone 10 is explicitly \*\*blocked\*\*/);
});
