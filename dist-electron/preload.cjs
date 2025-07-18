"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
electron_1.contextBridge.exposeInMainWorld('electronAPI', {
    ping: () => 'pong'
});
if (globalThis.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
    electron_1.contextBridge.exposeInMainWorld('__REACT_DEVTOOLS_GLOBAL_HOOK__', globalThis.__REACT_DEVTOOLS_GLOBAL_HOOK__);
}
console.log('✅ Preload script executed');
