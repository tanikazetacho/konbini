# Konbini POS

Proyecto base para una aplicación de Punto de Venta (POS) instalable, construida con:

- **Electron** para el entorno de escritorio
- **React 19 + Vite** para la interfaz de usuario
- **TypeScript** en todo el stack
- **Arquitectura modular y limpia (DDD)**

## 🚀 Stack técnico

| Categoría            | Tecnología                      |
|----------------------|----------------------------------|
| Plataforma Desktop   | Electron                        |
| Front-end            | React 19 + Vite                 |
| Lenguaje             | TypeScript                      |
| Empaquetador         | electron-builder                |
| Base del proyecto    | Vite + React + Tailwind + MUI   |
| Comunicación interna | contextBridge (preload)         |

## 🧩 Configuración del proyecto

- Se configuró `jsx: "react-jsx"` en `tsconfig.json` para permitir JSX moderno sin necesidad de `import React`.
- Se definió un alias `@` en `vite.config.ts` y `tsconfig.json`, apuntando a la carpeta `src`.  
  Esto permite importar con rutas absolutas como:

```ts
import logo from '@/path/file.extension'
```

en lugar de:

```ts
import logo from '../../path/file.extension'
```

## 📁 Estructura básica

```
konbini/
├── electron/             # Código fuente de procesos de Electron (main y preload)
│   ├── main.ts            # Proceso principal de Electron (incluye desactivación de warning de seguridad en dev)
│   └── preload.ts
├── dist-electron/        # Código compilado de Electron (main.js, preload.cjs)
├── src/                  # Código React (renderer)
├── tsconfig.*.json       # Configs separadas para Electron y preload
└── package.json
```

## 🔧 Scripts disponibles

- `yarn dev:web` - Inicia el servidor de desarrollo de Vite para la aplicación web.
- `yarn dev` - Inicia la aplicación en modo desarrollo con Electron y Vite.
- `yarn electron:dev` - Compila y ejecuta la aplicación Electron en modo desarrollo.
- `yarn build` - Construye la aplicación para producción (web y Electron).
- `yarn dist` - Empaqueta la aplicación para distribución usando electron-builder.
- `yarn preload` - Compila el preload (`preload.ts`) y lo renombra automáticamente a `preload.cjs`


## 🧠 Detalles importantes

- El `preload.ts` se compila como CommonJS y se renombra automáticamente a `preload.cjs` mediante el script `yarn preload`, lo cual permite que Electron lo cargue correctamente incluso cuando el proyecto usa `"type": "module"` en `package.json`.
- El contexto seguro entre frontend y backend se maneja vía `contextBridge` expuesto en `window.electronAPI`.

## ❓ ¿Qué es el preload?

El archivo `preload.ts` es un script especial que corre en el contexto aislado entre el proceso principal de Electron (Node.js) y la interfaz (React).

Su propósito es:

- **Permitir comunicación segura** entre el backend (Electron) y el frontend (React)
- **Exponer funciones autorizadas** al entorno del navegador usando `contextBridge`

Por ejemplo:

```ts
// preload.ts
contextBridge.exposeInMainWorld('electronAPI', {
  ping: () => 'pong',
})
```

Esto permite que en el frontend puedas usar:

```ts
window.electronAPI.ping()
```

Esta arquitectura mejora la seguridad y el control de lo que se expone al navegador, siguiendo las mejores prácticas recomendadas por Electron.

## ✅ Estado actual

✔️ Vite + React renderiza correctamente  
✔️ Electron levanta sin errores  
✔️ `preload.cjs` funciona y expone funciones  
✔️ Ideal para modularizar dominios tipo DDD

---

Siguientes pasos:
- Agregar módulos por dominio (productos, ventas, etc.)
- Integrar almacenamiento offline y sincronización
- Crear estructura de carpetas escalable por dominio

## 📂 Archivos ignorados en Git

El proyecto incluye un archivo `.gitignore` que previene subir archivos innecesarios al repositorio. Esto incluye:

- `node_modules/` y archivos de instalación
- Carpeta `dist/` y `dist-electron/`
- Archivos intermedios como `preload.js`
- Archivos de configuración local (`.vscode/`, `.idea/`, `.DS_Store`)
- Artifacts de empaquetado y actualización (`build/`, `out/`)
- Archivos de cobertura de tests (`coverage/`)
- Archivos temporales de TypeScript (`*.tsbuildinfo`)

Esto ayuda a mantener un repositorio limpio y enfocado solo en el código fuente relevante.