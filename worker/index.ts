type ProductInput = {
  name?: unknown;
  description?: unknown;
  stock?: unknown;
};

export function validateProduct(input: ProductInput) {
  const name = typeof input.name === "string" ? input.name.trim() : "";
  const description =
    typeof input.description === "string" ? input.description.trim() : "";
  const stock = Number(input.stock ?? 0);

  if (!name) {
    return { error: "El nombre es obligatorio" } as const;
  }
  if (!Number.isInteger(stock) || stock < 0) {
    return { error: "El stock debe ser un entero mayor o igual a 0" } as const;
  }
  return { value: { name, description, stock } } as const;
}

async function listProducts(env: Env) {
  const { results } = await env.DB.prepare(
    "SELECT id, name, description, stock, created_at FROM products ORDER BY id",
  ).all();
  return Response.json(results);
}

async function createProduct(request: Request, env: Env) {
  const body = (await request.json().catch(() => null)) as ProductInput | null;
  if (!body) {
    return Response.json({ error: "JSON inválido" }, { status: 400 });
  }

  const result = validateProduct(body);
  if ("error" in result) {
    return Response.json({ error: result.error }, { status: 400 });
  }

  const { name, description, stock } = result.value;
  const createdAt = new Date().toISOString().slice(0, 10);

  const product = await env.DB.prepare(
    `INSERT INTO products (name, description, stock, created_at)
     VALUES (?, ?, ?, ?)
     RETURNING id, name, description, stock, created_at`,
  )
    .bind(name, description, stock, createdAt)
    .first();

  return Response.json(product, { status: 201 });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/products") {
      try {
        if (request.method === "GET") return await listProducts(env);
        if (request.method === "POST") return await createProduct(request, env);
        return Response.json({ error: "Método no permitido" }, { status: 405 });
      } catch (error) {
        console.error(error);
        return Response.json({ error: "Error del servidor" }, { status: 500 });
      }
    }

    if (url.pathname.startsWith("/api/")) {
      return Response.json({ error: "No encontrado" }, { status: 404 });
    }

    return new Response(null, { status: 404 });
  },
} satisfies ExportedHandler<Env>;
