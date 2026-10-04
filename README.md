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
tests/               Tests unitarios de componentes y de la API
uat/                 Pruebas de aceptación contra la app desplegada
.github/workflows/   Pipeline build-test -> deploy-dev -> uat -> deploy-production
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
| `npm run test:coverage` | Tests + coverage (`coverage/index.html`) + JUnit (`reports/junit-unit.xml`) |
| `npm run test:uat` | UAT contra una URL desplegada (`UAT_BASE_URL=...`), JUnit en `reports/junit-uat.xml` |
| `npm run lint` | ESLint |
| `npm run build:prod` | Build para producción |
| `npm run deploy` | Publica el ambiente de desarrollo |
| `npm run db:init:remote` / `db:init:prod` | Crea tabla + datos en D1 remota (dev / prod) |
