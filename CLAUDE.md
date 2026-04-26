# CLAUDE.md — ploutos-api

## Proyecto

API REST con Express y TypeScript. Sirve como base/boilerplate para nuevos servicios backend.

## Comandos

```bash
yarn dev              # Desarrollo con hot-reload (nodemon)
yarn build            # Compilar TypeScript → dist/
yarn build:prod       # Compilar + minificar con terser
yarn start            # Ejecutar build compilado
yarn start:prod       # Ejecutar en modo producción
yarn clean            # Eliminar dist/
```

## Arquitectura

```
src/
├── app.ts                    # Entry point: Express server
├── config/config.ts          # Variables de entorno centralizadas (AppConfig)
├── controllers/              # Funciones async (Request, Response) con try/catch
├── middlewares/               # Middleware Express (auth, validación, etc.)
├── routes/                   # Archivos de rutas (se cargan dinámicamente)
│   └── index.ts              # loadRoutes() — escanea este directorio y monta cada archivo como /{nombre}
├── services/                 # Lógica de negocio separada de controllers
└── utils/                    # Utilidades: error handler, password hashing, token verification
```

### Carga dinámica de rutas

`loadRoutes()` en `routes/index.ts` lee todos los archivos del directorio `routes/`, excluye `index.ts`, y monta cada uno en `/{nombreArchivo}`. Cada archivo de ruta debe exportar `{ router }`.

## Convenciones de código

### Nombrado de archivos
- Controllers: `{entity}Controller.ts` (e.g. `exchangeController.ts`)
- Routes: `{entity}.ts` (e.g. `exchange.ts`)
- Services: `{entity}.service.ts` (e.g. `exchange.service.ts`)
- Middlewares: `{Name}.ts` PascalCase (e.g. `Session.ts`)
- Utils: `{purpose}.handler.ts` o `{purpose}.ts`

### Nombrado de funciones y variables
- camelCase para funciones y variables
- Controllers exportan funciones con patrón: `{verb}{Entity}Controller`
- Error strings siguen el formato: `ACTION_ENTITY_ERROR:: {e}`

### Estilo de código (Prettier)
- Single quotes, 4 espacios de indentación, print width 120
- Trailing commas (es5), semicolons siempre
- Arrow parens: avoid (`x => x` en vez de `(x) => x`)

### TypeScript
- Target: ES2020, Module: CommonJS, Strict mode activado
- Sin path aliases — usar imports relativos (`../utils/error.handler`)
- Decoradores habilitados (experimentalDecorators + emitDecoratorMetadata)

## Patrones

### Controller
```typescript
export const getEntityController = async ({ body }: Request, res: Response) => {
    try {
        // lógica o llamada a service
        res.send(result);
    } catch (e) {
        handleHttp(res, `GET_ENTITY_ERROR:: ${e}`);
    }
};
```

### Ruta
```typescript
import { Router } from 'express';
import { getEntityController } from '../controllers/entityController';
import { checkSession } from '../middlewares/Session';

const router = Router();
router.post('/action', checkSession, getEntityController);
export { router };
```

### Configuración
Todas las variables de entorno se centralizan en `src/config/config.ts` como `AppConfig`. No leer `process.env` directamente fuera de ese archivo.

## Autenticación

- Middleware `checkSession` verifica el header `clientsecret` contra `CLIENT_SECRET` del env.
- Password hashing con bcryptjs (8 salt rounds) en `utils/password.handler.ts`.

## Docker

- Multi-stage build: builder (node:20-alpine + tsc) → production (solo deps de producción, usuario non-root).
- Puerto interno: 3000, expuesto en 8000.
- `docker-compose.yml` para desarrollo, `docker-compose.prod.yml` para producción.

## Variables de entorno

Ver `.env.example`. Mínimo requerido:
- `CLIENT_SECRET` — secreto para autenticación via header
- `PORT` — puerto del servidor (default: 925)

## Notas

- No hay tests configurados aún.
- `yarn.lock` es el lockfile principal — usar yarn como package manager.
- No commitear archivos `.env` (está en .gitignore).
