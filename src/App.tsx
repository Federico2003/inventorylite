import { useCallback, useEffect, useState } from "react";
import ProductList from "./components/ProductList";
import ProductForm from "./components/ProductForm";
import { getProducts } from "./services/products";
import type { Product } from "./types";

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = useCallback(async () => {
    try {
      const data = await getProducts();
      setProducts(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado");
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadProducts();
  }, [loadProducts]);

  return (
    <main>
      <header>
        <h1>Inventory Lite</h1>
        <p>Control de inventario</p>
      </header>

      {error && (
        <p role="alert" className="error">
          {error}
        </p>
      )}

      <ProductList products={products} />
      <ProductForm onProductCreated={loadProducts} />
    </main>
  );
}

export default App;
