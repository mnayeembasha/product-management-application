// frontend/store/productSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import { type ProductType } from '@/types';
import { axiosInstance } from '@/lib/axios';

interface ProductState {
  products: ProductType[];
  myProducts: ProductType[];
  isFetchingProducts: boolean;
  isFetchingMyProducts: boolean;
  isAddingProduct: boolean;
  isEditingProduct: boolean;
  isDeletingProduct: boolean;
}

interface ApiError {
  message: string;
  status?: number;
}

const initialState: ProductState = {
  products: [],
  myProducts: [],
  isFetchingProducts: false,
  isFetchingMyProducts: false,
  isAddingProduct: false,
  isEditingProduct: false,
  isDeletingProduct: false,
};

interface FetchProductsParams {
  sort?: string;
  category?: string;
  search?: string;
}

export const fetchProducts = createAsyncThunk<ProductType[], FetchProductsParams, { rejectValue: ApiError }>(
  'product/fetchProducts',
  async (params, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get('/products', { params });
      return res.data.products;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue({
          message: error.response?.data?.message || 'Failed to fetch products',
        });
      }
      return rejectWithValue({ message: 'Unknown error' });
    }
  }
);

export const fetchMyProducts = createAsyncThunk<ProductType[], void, { rejectValue: ApiError }>(
  'product/fetchMyProducts',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get('/products/my');
      return res.data.products;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue({
          message: error.response?.data?.message || 'Failed to fetch my products',
        });
      }
      return rejectWithValue({ message: 'Unknown error' });
    }
  }
);

interface AddProductData {
  name: string;
  price: number;
  description: string;
  category: string;
  image?: string;
}

export const addProduct = createAsyncThunk<ProductType, AddProductData, { rejectValue: ApiError }>(
  'product/addProduct',
  async (data, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post('/products', data);
      toast.success('Product added successfully');
      return res.data.product;
    } catch (error) {
      let errorMessage = 'Error adding product';
      if (error instanceof AxiosError) {
        errorMessage = error.response?.data?.message || 'Add product failed';
      }
      toast.error(errorMessage);
      return rejectWithValue({ message: errorMessage });
    }
  }
);

interface EditProductData {
  price: number;
  description: string;
  category: string;
  image?: string;
}

export const editProduct = createAsyncThunk<ProductType, { id: string; data: EditProductData }, { rejectValue: ApiError }>(
  'product/editProduct',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put(`/products/${id}`, data);
      toast.success('Product updated successfully');
      return res.data.product;
    } catch (error) {
      let errorMessage = 'Error updating product';
      if (error instanceof AxiosError) {
        errorMessage = error.response?.data?.message || 'Edit product failed';
      }
      toast.error(errorMessage);
      return rejectWithValue({ message: errorMessage });
    }
  }
);

export const deleteProduct = createAsyncThunk<string, string, { rejectValue: ApiError }>(
  'product/deleteProduct',
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/products/${id}`);
      toast.success('Product deleted successfully');
      return id;
    } catch (error) {
      let errorMessage = 'Error deleting product';
      if (error instanceof AxiosError) {
        errorMessage = error.response?.data?.message || 'Delete product failed';
      }
      toast.error(errorMessage);
      return rejectWithValue({ message: errorMessage });
    }
  }
);

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Products
      .addCase(fetchProducts.pending, (state) => {
        state.isFetchingProducts = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isFetchingProducts = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state) => {
        state.isFetchingProducts = false;
      })
      // Fetch My Products
      .addCase(fetchMyProducts.pending, (state) => {
        state.isFetchingMyProducts = true;
      })
      .addCase(fetchMyProducts.fulfilled, (state, action) => {
        state.isFetchingMyProducts = false;
        state.myProducts = action.payload;
      })
      .addCase(fetchMyProducts.rejected, (state) => {
        state.isFetchingMyProducts = false;
      })
      // Add Product
      .addCase(addProduct.pending, (state) => {
        state.isAddingProduct = true;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.isAddingProduct = false;
        state.myProducts.push(action.payload);
      })
      .addCase(addProduct.rejected, (state) => {
        state.isAddingProduct = false;
      })
      // Edit Product
      .addCase(editProduct.pending, (state) => {
        state.isEditingProduct = true;
      })
      .addCase(editProduct.fulfilled, (state, action) => {
        state.isEditingProduct = false;
        const index = state.myProducts.findIndex(p => p._id === action.payload._id);
        if (index !== -1) {
          state.myProducts[index] = action.payload;
        }
      })
      .addCase(editProduct.rejected, (state) => {
        state.isEditingProduct = false;
      })
      // Delete Product
      .addCase(deleteProduct.pending, (state) => {
        state.isDeletingProduct = true;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.isDeletingProduct = false;
        state.myProducts = state.myProducts.filter(p => p._id !== action.payload);
      })
      .addCase(deleteProduct.rejected, (state) => {
        state.isDeletingProduct = false;
      });
  },
});

export default productSlice.reducer;