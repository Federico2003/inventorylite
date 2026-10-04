import type { Product } from "../types";

interface ProductListProps {
  products: Product[];
}

export default function ProductList({ products }: ProductListProps) {
  return (
    <section className="card">
      <h2>Productos</h2>

      {products.length === 0 ? (
        <p className="empty">No hay productos registrados.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Producto</th>
              <th className="num">Stock</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => {
              const available = product.stock > 0;
              return (
                <tr key={product.id}>
                  <td>
                    <strong>{product.name}</strong>
                    {product.description && (
                      <span className="desc">{product.description}</span>
                    )}
                  </td>
                  <td className="num">{product.stock}</td>
                  <td>
                    <span className={available ? "badge ok" : "badge out"}>
                      {available ? "Disponible" : "Agotado"}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </section>
  );
}
