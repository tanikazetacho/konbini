import { app, BrowserWindow, session } from 'electron'
import * as path from 'node:path'
import { fileURLToPath } from 'node:url'
import * as os from 'node:os'

// Disable Electron's security warning during development.
// This prevents console clutter when running in dev mode.
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

const isDev = !app.isPackaged

// @ts-ignore
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function createWindow() {
    const win = new BrowserWindow({
        width: 1024,
        height: 768,
        webPreferences: {
            preload: path.join(__dirname, 'preload.cjs'),
            contextIsolation: true,
        },
    })

    console.log('✅ Electron main process is running...')

    if (isDev) {
        win.loadURL('http://localhost:5173')
        win.webContents.openDevTools()
        const devtoolsPath = path.join(__dirname, '../extensions/react-devtools')
        session.defaultSession.loadExtension(devtoolsPath, { allowFileAccess: true })
            .then(() => console.log('✅ React DevTools loaded from local copy'))
            .catch((err) => console.error('Failed to load React DevTools:', err))

        session.defaultSession
            .loadExtension(devtoolsPath, { allowFileAccess: true })
            .then((ext) => console.log(`React DevTools loaded: ${ext.name}`))
            .catch((err) => console.error('Failed to load React DevTools:', err))
    } else {
        win.loadFile(path.join(__dirname, '../dist/index.html'))
    }
}

app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})