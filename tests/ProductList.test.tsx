import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ProductList from "../src/components/ProductList";
import type { Product } from "../src/types";

const products: Product[] = [
  { id: 1, name: "Teclado", description: "USB", stock: 10, created_at: "2026-10-04" },
  { id: 2, name: "Monitor", description: "", stock: 0, created_at: "2026-10-04" },
];

describe("ProductList", () => {
  it("muestra un mensaje cuando no hay productos", () => {
    render(<ProductList products={[]} />);
    expect(screen.getByText("No hay productos registrados.")).toBeInTheDocument();
  });

  it("muestra los productos con su stock", () => {
    render(<ProductList products={products} />);
    expect(screen.getByText("Teclado")).toBeInTheDocument();
    expect(screen.getByText("Monitor")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
    expect(screen.getByText("USB")).toBeInTheDocument();
  });

  it("marca como Disponible si hay stock y Agotado si es 0", () => {
    render(<ProductList products={products} />);
    expect(screen.getByText("Disponible")).toBeInTheDocument();
    expect(screen.getByText("Agotado")).toBeInTheDocument();
  });
});
