import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import ProductForm from "../src/components/ProductForm";

function mockFetch(response: Partial<Response>) {
  const fetchMock = vi.fn().mockResolvedValue(response);
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

describe("ProductForm", () => {
  it("envía el producto a la API y limpia el formulario", async () => {
    const fetchMock = mockFetch({
      ok: true,
      json: async () => ({ id: 3, name: "Mouse", description: "", stock: 5 }),
    });
    const onCreated = vi.fn();
    const user = userEvent.setup();

    render(<ProductForm onProductCreated={onCreated} />);

    await user.type(screen.getByLabelText("Nombre"), "Mouse");
    await user.type(screen.getByLabelText("Descripción"), "Inalámbrico");
    const stock = screen.getByLabelText("Stock");
    await user.clear(stock);
    await user.type(stock, "5");
    await user.click(screen.getByRole("button", { name: /agregar producto/i }));

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/products",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ name: "Mouse", description: "Inalámbrico", stock: 5 }),
      }),
    );
    expect(onCreated).toHaveBeenCalledOnce();
    expect(screen.getByLabelText("Nombre")).toHaveValue("");
  });

  it("muestra el error que regresa la API", async () => {
    mockFetch({
      ok: false,
      json: async () => ({ error: "El nombre es obligatorio" }),
    });
    const onCreated = vi.fn();
    const user = userEvent.setup();

    render(<ProductForm onProductCreated={onCreated} />);
    await user.type(screen.getByLabelText("Nombre"), "X");
    await user.click(screen.getByRole("button", { name: /agregar producto/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "El nombre es obligatorio",
    );
    expect(onCreated).not.toHaveBeenCalled();
  });

  it("usa un mensaje genérico si la API no regresa JSON", async () => {
    mockFetch({
      ok: false,
      json: async () => {
        throw new Error("no json");
      },
    });
    const user = userEvent.setup();

    render(<ProductForm onProductCreated={vi.fn()} />);
    await user.type(screen.getByLabelText("Nombre"), "X");
    await user.click(screen.getByRole("button", { name: /agregar producto/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Error al crear producto",
    );
  });
});
