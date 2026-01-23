# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Desarrollo con hot-reload (nodemon)
npm start        # Producción
npx prisma generate   # Regenerar cliente Prisma después de cambios en schema
npx prisma migrate dev --name <nombre>  # Crear migración
npx prisma db push    # Sincronizar schema sin migración
```

## Architecture

**Express 5 API con ESM** - Usa `"type": "module"` y Node.js subpath imports.

### Path Aliases (package.json imports)
```
#controllers/*  → ./src/controllers/*
#routes/*       → ./src/routes/*
#middlewares/*  → ./src/middlewares/*
#services/*     → ./src/services/*
#lib/*          → ./src/lib/*
#data/*         → ./data/*
```

### Flujo de datos
```
routes → controllers → services → prisma
```

- **Routes**: Definen endpoints y delegan a controllers
- **Controllers**: Validación de request y respuestas (usan `sendSuccess`/`sendError`)
- **Services**: Lógica de negocio y queries Prisma
- **lib/prisma.js**: Instancia singleton de PrismaClient

### Prisma
- Schema: `prisma/schema.prisma`
- Cliente generado: `src/generated/prisma/` (output personalizado)
- Base de datos: PostgreSQL (`DATABASE_URL` en `.env`)

**Import correcto para ESM:**
```js
import { PrismaClient } from '../generated/prisma/client.js'  // NO directorio
```

### Datos estáticos
- `data/movies.js`: Array de películas en memoria (endpoints legacy `/movies`)
- Endpoints `/movies/prisma`: Usan base de datos real

## API Docs
Swagger UI disponible en `/docs` (carga `docs/swagger.yaml`)
