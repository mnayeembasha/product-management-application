export type ProductType = {
    _id?: string;
    name: string;
    price: string;
    description: string;
    category: string;
    slug?: string;
    image?: string;
    createdAt?:Date;
    updatedAt?:Date;
  };