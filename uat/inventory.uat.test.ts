import { afterAll, describe, expect, it } from "vitest";

type Product = {
  id: number;
  name: string;
  description: string;
  stock: number;
  created_at: string;
};

const BASE_URL = (process.env.UAT_BASE_URL ?? "http://localhost:5173").replace(/\/$/, "");
const runId = Date.now();
const createdIds: number[] = [];

async function createProduct(name: string, stock: number) {
  const res = await fetch(`${BASE_URL}/api/products`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, description: `Prueba UAT ${runId}`, stock }),
  });
  const product = (await res.json()) as Product;
  if (res.ok) createdIds.push(product.id);
  return { res, product };
}

async function listProducts() {
  const res = await fetch(`${BASE_URL}/api/products`);
  return (await res.json()) as Product[];
}

// Limpia los productos que crearon las pruebas para no ensuciar la base
afterAll(async () => {
  for (const id of createdIds) {
    await fetch(`${BASE_URL}/api/products/${id}`, { method: "DELETE" });
  }
});

describe(`UAT Inventory Lite (${BASE_URL})`, () => {
  it("UAT-01 Abrir aplicación: la página carga", async () => {
    const res = await fetch(`${BASE_URL}/`);
    expect(res.status).toBe(200);
    expect(await res.text()).toContain("<title>Inventory Lite</title>");
  });

  it("UAT-02 Consultar productos: la API regresa la lista de D1", async () => {
    const res = await fetch(`${BASE_URL}/api/products`);
    expect(res.status).toBe(200);
    expect(Array.isArray(await res.json())).toBe(true);
  });

  it("UAT-03 Agregar producto: aparece en la lista", async () => {
    const name = `UAT Teclado ${runId}`;
    const { res, product } = await createProduct(name, 7);
    expect(res.status).toBe(201);
    expect(product).toMatchObject({ name, stock: 7 });

    const products = await listProducts();
    expect(products.some((p) => p.id === product.id && p.name === name)).toBe(true);
  });

  it("UAT-04 Producto con stock 0: se guarda como agotado", async () => {
    const { res, product } = await createProduct(`UAT Agotado ${runId}`, 0);
    expect(res.status).toBe(201);

    const saved = (await listProducts()).find((p) => p.id === product.id);
    expect(saved?.stock).toBe(0);
  });

  it("UAT-05 Validación: rechaza un producto sin nombre", async () => {
    const res = await fetch(`${BASE_URL}/api/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "", stock: 1 }),
    });
    expect(res.status).toBe(400);
  });
});
