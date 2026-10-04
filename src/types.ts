export type Product = {
  id: number;
  name: string;
  description: string;
  stock: number;
  created_at: string;
};

export type NewProduct = {
  name: string;
  description: string;
  stock: number;
};
