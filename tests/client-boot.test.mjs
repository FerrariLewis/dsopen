import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import vm from 'node:vm'

function clientExports() {
  let definition
  const sandbox = { window: { __ModuleLoader__: { load(value) { definition = value } } } }
  vm.runInNewContext(readFileSync(new URL('../lib/client.js', import.meta.url), 'utf8'), sandbox)
  assert.equal(definition.id, 'dsh-boot-studio')
  const React = { createElement: (...args) => args, useState() {}, useEffect() {}, useRef() {}, useCallback() {} }
  return definition.factory(id => {
    assert.equal(id, 'react', 'DSH client must only require the host React runtime')
    return React
  })
}

test('actual shipped client is a valid DSH ModuleLoader module without blocking static dependencies', () => {
  const client = clientExports()
  assert.equal(typeof client.apply, 'function')
  assert.equal(typeof client.SettingsPanel, 'function')
  assert.equal(typeof client.BootRoot, 'function')
  assert.equal(client.inject, undefined)
  assert.doesNotThrow(() => client.apply({}))
})

test('actual shipped client dynamically registers real settings, overlay and sidebar slots', () => {
  const client = clientExports()
  const registrations = []
  const injections = []
  const ready = {
    slots: {
      inject(name, register) { injections.push(name); return register() },
      register(options, component) { registrations.push({ options, component }); return () => {} },
    },
    effect(register) { register() },
  }
  let requested
  client.apply({ inject(deps, callback) { requested = Array.from(deps); callback(ready) } })
  assert.deepEqual(requested, ['slots'])
  assert.deepEqual(injections, ['shell.overlay', 'settings.section', 'sidebar.footer.action'])
  assert.equal(registrations.length, 3)
  assert.equal(new Set(registrations.map(row => row.options.id)).size, 3)
  const settings = registrations.find(row => row.options.name === 'settings.section')
  assert.equal(settings.options.label(), '开机动画')
  for (const row of registrations) assert.equal(typeof row.component, 'function')
})
