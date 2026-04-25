export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category_id: string;
  categories?: {
    name: string;
    slug: string;
  };
};

export type Category = {
  id: string;
  name: string;
  slug: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  role: "customer" | "admin";
};

export type CartItem = {
  product: Product;
  quantity: number;
};

export type Order = {
  id: string;
  status: string;
  total_amount: number;
  created_at: string;
  order_items: any[];
};