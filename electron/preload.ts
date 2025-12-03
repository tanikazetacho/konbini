import { contextBridge } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
    ping: () => 'pong'
})

if ((globalThis as any).__REACT_DEVTOOLS_GLOBAL_HOOK__) {
  contextBridge.exposeInMainWorld(
    '__REACT_DEVTOOLS_GLOBAL_HOOK__',
    (globalThis as any).__REACT_DEVTOOLS_GLOBAL_HOOK__
  )
}

console.log('✅ Preload script executed')