export type Product = {
    id?: string;
    name: string;
    description?: string;
    price: number;
    categoryId: string | null;
    imageUrl?: string | null;
    extraIds?: number[];
  }