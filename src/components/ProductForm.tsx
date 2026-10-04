import { useState, type FormEvent } from "react";
import { createProduct } from "../services/products";

interface ProductFormProps {
  onProductCreated: () => void;
}

export default function ProductForm({ onProductCreated }: ProductFormProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [stock, setStock] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setSaving(true);

    try {
      await createProduct({ name, description, stock });
      setName("");
      setDescription("");
      setStock(0);
      onProductCreated();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="card" onSubmit={handleSubmit}>
      <h2>Agregar producto</h2>

      <label>
        Nombre
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
        />
      </label>

      <label>
        Descripción
        <input
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />
      </label>

      <label>
        Stock
        <input
          type="number"
          min="0"
          value={stock}
          onChange={(event) => setStock(Number(event.target.value))}
        />
      </label>

      {error && (
        <p role="alert" className="error">
          {error}
        </p>
      )}

      <button type="submit" disabled={saving}>
        {saving ? "Guardando..." : "+ Agregar producto"}
      </button>
    </form>
  );
}
