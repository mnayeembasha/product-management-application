import React, { useState, useEffect } from 'react';
import { z } from 'zod';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { editProduct } from '@/store/productSlice';
import { CATEGORIES, type ProductType } from '@/types';

export type EditProductFormData = {
  price: number;
  description: string;
  category: typeof CATEGORIES[number];
  image?: string;
};

const editProductSchema = z.object({
  price: z.number().min(0, 'Price should be greater than 0'),
  description: z.string().min(10, 'Description should contain at least 10 characters'),
  category: z.enum(CATEGORIES),
  image: z.string().optional(),
});

interface EditProductModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: ProductType | null;
}

const EditProductModal: React.FC<EditProductModalProps> = ({ open, onOpenChange, product }) => {
  const dispatch = useAppDispatch();
  const isEditing = useAppSelector((state) => state.product.isEditingProduct);

  const safeCategory = product?.category && CATEGORIES.includes(product.category as typeof CATEGORIES[number])
    ? (product.category as typeof CATEGORIES[number])
    : CATEGORIES[0];

  const form = useForm<EditProductFormData>({
    resolver: zodResolver(editProductSchema),
    defaultValues: {
      price: product?.price ?? 0,
      description: product?.description ?? '',
      category: safeCategory,
      image: product?.image ?? undefined,
    },
  });

  const [imagePreview, setImagePreview] = useState<string | undefined>(product?.image);

  // Update form when product changes
  useEffect(() => {
    if (product) {
      const safeCat = product.category && CATEGORIES.includes(product.category as typeof CATEGORIES[number])
        ? (product.category as typeof CATEGORIES[number])
        : CATEGORIES[0];

      form.reset({
        price: product.price,
        description: product.description,
        category: safeCat,
        image: product.image ?? undefined,
      });
      setImagePreview(product.image);
    }
  }, [product, form]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        form.setError('image', { message: 'Image size exceeds 5MB' });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        form.setValue('image', base64);
        setImagePreview(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit: SubmitHandler<EditProductFormData> = (data) => {
    if (product?._id) {
      dispatch(editProduct({ id: product._id, data })).then((result) => {
        if (editProduct.fulfilled.match(result)) {
          onOpenChange(false);
        }
      });
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    onOpenChange(newOpen);
    if (!newOpen) {
      // Reset form when closing
      if (product) {
        const safeCat = product.category && CATEGORIES.includes(product.category as typeof CATEGORIES[number])
          ? (product.category as typeof CATEGORIES[number])
          : CATEGORIES[0];

        form.reset({
          price: product.price,
          description: product.description,
          category: safeCat,
          image: product.image ?? undefined,
        });
        setImagePreview(product.image);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      disabled={isEditing}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} disabled={isEditing} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(value as typeof CATEGORIES[number])}
                    defaultValue={field.value}
                    disabled={isEditing}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormItem>
              <FormLabel>Image</FormLabel>
              <FormControl>
                <Input type="file" accept="image/*" onChange={handleImageChange} disabled={isEditing} />
              </FormControl>
              {imagePreview && (
                <img src={imagePreview} alt="Preview" width={200} height={200} className="mt-2 rounded" />
              )}
              <FormMessage />
            </FormItem>
            <Button type="submit" disabled={isEditing} className="w-full">
              {isEditing ? 'Updating Product...' : 'Update Product'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProductModal;