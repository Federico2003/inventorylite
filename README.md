# Inventory Lite

Control de inventario: React + TypeScript + Cloudflare Workers + D1, con tests (Vitest), coverage y pipeline de GitHub Actions.

## Estructura

```
src/                 Frontend React
  components/        ProductList, ProductForm
  services/          Llamadas a /api/products
worker/index.ts      API (GET / POST /api/products) sobre D1
schema.sql           Tabla products
seed.sql             Datos de ejemplo
tests/               Tests de componentes y de la API
.github/workflows/   Pipeline build-test -> deploy-production
```

## Ambientes

| Ambiente | Worker | Base D1 |
|---|---|---|
| Desarrollo | `inventorylite` | `inventorylite-db` |
| Producción | `inventorylite-prod` | `inventorylite-db-prod` |

## Comandos

| Comando | Qué hace |
|---|---|
| `npm run dev` | App local con D1 local |
| `npm run db:init:local` | Crea tabla + datos en D1 local |
| `npm test` | Unit tests |
| `npm run test:coverage` | Tests + reporte de coverage (`coverage/index.html`) |
| `npm run lint` | ESLint |
| `npm run build:prod` | Build para producción |
| `npm run deploy` | Publica el ambiente de desarrollo |
| `npm run db:init:remote` / `db:init:prod` | Crea tabla + datos en D1 remota (dev / prod) |
