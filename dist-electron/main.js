import { app, BrowserWindow, session } from 'electron';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
// Disable Electron's security warning during development.
// This prevents console clutter when running in dev mode.
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';
const isDev = !app.isPackaged;
// @ts-ignore
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
function createWindow() {
    const win = new BrowserWindow({
        width: 1024,
        height: 768,
        webPreferences: {
            preload: path.join(__dirname, 'preload.cjs'),
            contextIsolation: true,
            sandbox: false,
        },
    });
    console.log('✅ Electron main process is running...');
    if (isDev) {
        win.loadURL('http://localhost:5173');
        win.webContents.openDevTools();
        // Filter to suppress noisy internal messages from DevTools
        win.webContents.on('console-message', (event) => {
            const { level, message } = event;
            const suppress = [
                'Autofill.enable',
                'Autofill.setAddresses',
                'Extensions.getStorageItems',
                'sandboxed_renderer.bundle.js',
            ];
            if (suppress.some(entry => message.includes(entry)))
                return;
            console.log(`[Renderer console][${level}]: ${message}`);
        });
        const devtoolsPath = path.join(__dirname, '../extensions/react-devtools');
        session.defaultSession.extensions
            .loadExtension(devtoolsPath, { allowFileAccess: true })
            .then((ext) => console.log(`✅ React DevTools loaded: ${ext.name}`))
            .catch((err) => console.error('Failed to load React DevTools:', err));
    }
    else {
        win.loadFile(path.join(__dirname, '../dist/index.html'));
    }
}
app.whenReady().then(() => {
    createWindow();
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0)
            createWindow();
    });
});
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin')
        app.quit();
});
