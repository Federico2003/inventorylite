import { describe, expect, it, vi } from "vitest";
import worker, { validateProduct } from "../worker/index";

type Row = { id: number; name: string; description: string; stock: number; created_at: string };

// D1 simulado en memoria: suficiente para probar la lógica de la API
function createEnv(rows: Row[] = []) {
  const db = {
    prepare: vi.fn((sql: string) => ({
      all: async () => ({ results: rows }),
      bind: (...args: unknown[]) => ({
        run: async () => {
          const index = rows.findIndex((row) => row.id === args[0]);
          if (index >= 0) rows.splice(index, 1);
          return { meta: { changes: index >= 0 ? 1 : 0 } };
        },
        first: async () => {
          if (sql.includes("fail")) throw new Error("db");
          const [name, description, stock, created_at] = args as [string, string, number, string];
          const row = { id: rows.length + 1, name, description, stock, created_at };
          rows.push(row);
          return row;
        },
      }),
    })),
  };
  return { DB: db } as unknown as Env;
}

const call = (env: Env, path: string, init?: RequestInit) =>
  worker.fetch(
    new Request(`http://localhost${path}`, init) as Parameters<typeof worker.fetch>[0],
    env,
  );

describe("validateProduct", () => {
  it("acepta un producto válido y limpia espacios", () => {
    expect(validateProduct({ name: " Mouse ", description: " x ", stock: 3 })).toEqual({
      value: { name: "Mouse", description: "x", stock: 3 },
    });
  });

  it("usa stock 0 y descripción vacía por defecto", () => {
    expect(validateProduct({ name: "Mouse" })).toEqual({
      value: { name: "Mouse", description: "", stock: 0 },
    });
  });

  it("rechaza nombre vacío", () => {
    expect(validateProduct({ name: "  " })).toHaveProperty("error");
  });

  it("rechaza stock negativo o decimal", () => {
    expect(validateProduct({ name: "A", stock: -1 })).toHaveProperty("error");
    expect(validateProduct({ name: "A", stock: 1.5 })).toHaveProperty("error");
  });
});

describe("API /api/products", () => {
  it("GET regresa la lista de productos", async () => {
    const env = createEnv([
      { id: 1, name: "Teclado", description: "", stock: 10, created_at: "2026-10-04" },
    ]);
    const res = await call(env, "/api/products");
    expect(res.status).toBe(200);
    expect(await res.json()).toHaveLength(1);
  });

  it("POST crea un producto y regresa 201", async () => {
    const env = createEnv();
    const res = await call(env, "/api/products", {
      method: "POST",
      body: JSON.stringify({ name: "Mouse", stock: 5 }),
    });
    expect(res.status).toBe(201);
    expect(await res.json()).toMatchObject({ id: 1, name: "Mouse", stock: 5 });
  });

  it("POST con datos inválidos regresa 400", async () => {
    const res = await call(createEnv(), "/api/products", {
      method: "POST",
      body: JSON.stringify({ name: "", stock: 1 }),
    });
    expect(res.status).toBe(400);
  });

  it("POST con JSON mal formado regresa 400", async () => {
    const res = await call(createEnv(), "/api/products", {
      method: "POST",
      body: "{no es json",
    });
    expect(res.status).toBe(400);
  });

  it("otros métodos regresan 405", async () => {
    const res = await call(createEnv(), "/api/products", { method: "DELETE" });
    expect(res.status).toBe(405);
  });

  it("regresa 500 si falla la base de datos", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const env = {
      DB: { prepare: () => ({ all: async () => { throw new Error("db"); } }) },
    } as unknown as Env;
    const res = await call(env, "/api/products");
    expect(res.status).toBe(500);
  });

  it("rutas desconocidas regresan 404", async () => {
    expect((await call(createEnv(), "/api/otra")).status).toBe(404);
    expect((await call(createEnv(), "/otra")).status).toBe(404);
  });

  it("DELETE elimina un producto existente y regresa 204", async () => {
    const rows = [
      { id: 7, name: "Mouse", description: "", stock: 5, created_at: "2026-10-04" },
    ];
    const res = await call(createEnv(rows), "/api/products/7", { method: "DELETE" });
    expect(res.status).toBe(204);
    expect(rows).toHaveLength(0);
  });

  it("DELETE de un producto inexistente regresa 404", async () => {
    const res = await call(createEnv(), "/api/products/99", { method: "DELETE" });
    expect(res.status).toBe(404);
  });

  it("otros métodos sobre /api/products/:id regresan 405", async () => {
    const res = await call(createEnv(), "/api/products/1", { method: "PUT" });
    expect(res.status).toBe(405);
  });

  it("DELETE regresa 500 si falla la base de datos", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const env = {
      DB: { prepare: () => ({ bind: () => ({ run: async () => { throw new Error("db"); } }) }) },
    } as unknown as Env;
    const res = await call(env, "/api/products/1", { method: "DELETE" });
    expect(res.status).toBe(500);
  });
});
