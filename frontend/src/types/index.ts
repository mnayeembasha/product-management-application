export interface UserType {
  _id: string;
  fullName: string;
  email: string;
  profilePic?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type ProductType = {
  _id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  slug: string;
  image?: string;
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: string;
};



export const CATEGORIES = [
  "electronics",
  "fashion",
  "wearables",
  "home-and-living",
  "sports-and-outdoors",
  "toys-and-games",
  "health-and-beauty",
  "groceries",
  "books-and-media",
  "automotive",
  "jewellery",
] as const;

export interface SignUpDataType {
  fullName: string;
  email: string;
  password: string;
}

export interface LoginDataType {
  email: string;
  password: string;
}

export interface AuthState {
  authUser: UserType | null;
  isSigningUp: boolean;
  isLoggingIn: boolean;
  isUpdatingProfile: boolean;
  isLoggingOut: boolean;
  isCheckingAuth: boolean;
}
export interface ApiError {
  message: string;
  status?: number;
}