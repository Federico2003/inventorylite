import type { NewProduct, Product } from "../types";

export async function getProducts(): Promise<Product[]> {
  const response = await fetch("/api/products");

  if (!response.ok) {
    throw new Error("Error al obtener productos");
  }

  return response.json();
}

export async function createProduct(product: NewProduct): Promise<Product> {
  const response = await fetch("/api/products", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  });

  if (!response.ok) {
    const data = (await response.json().catch(() => null)) as
      | { error?: string }
      | null;
    throw new Error(data?.error ?? "Error al crear producto");
  }

  return response.json();
}
