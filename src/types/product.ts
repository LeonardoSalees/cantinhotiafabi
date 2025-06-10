export type Product = {
    id?: number;
    name: string;
    description?: string;
    price: number;
    category: string | null;
    imageUrl?: string | null;
    extraIds?: number[];
  }