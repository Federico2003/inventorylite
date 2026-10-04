import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import App from "../src/App";

describe("App", () => {
  it("carga y muestra los productos desde la API", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => [
          { id: 1, name: "Teclado", description: "", stock: 10, created_at: "2026-10-04" },
        ],
      }),
    );

    render(<App />);

    expect(screen.getByRole("heading", { name: "Inventory Lite" })).toBeInTheDocument();
    expect(await screen.findByText("Teclado")).toBeInTheDocument();
  });

  it("muestra un error si la API falla", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false }));

    render(<App />);

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Error al obtener productos",
    );
  });
});
