import React, { useState } from 'react';
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
import { addProduct } from '@/store/productSlice';
import { CATEGORIES } from '@/types';

export type AddProductFormData = {
  name: string;
  price: number;
  description: string;
  category: typeof CATEGORIES[number];
  image?: string;
};

const addProductSchema = z.object({
  name: z.string().min(3, 'Name should contain at least 3 characters'),
  price: z.number().min(0, 'Price should be greater than 0'),
  description: z.string().min(10, 'Description should contain at least 10 characters'),
  category: z.enum(CATEGORIES),
  image: z.string().optional(),
});

interface AddProductModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddProductModal: React.FC<AddProductModalProps> = ({ open, onOpenChange }) => {
  const dispatch = useAppDispatch();
  const isAdding = useAppSelector((state) => state.product.isAddingProduct);

  const form = useForm<AddProductFormData>({
    resolver: zodResolver(addProductSchema),
    defaultValues: {
      name: '',
      price: 0,
      description: '',
      category: CATEGORIES[0],
      image: undefined,
    },
  });

  const [imagePreview, setImagePreview] = useState<string | undefined>();

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

  const handleSubmit: SubmitHandler<AddProductFormData> = (data) => {
    dispatch(addProduct(data)).then(() => {
      onOpenChange(false);
      form.reset();
      setImagePreview(undefined);
    });
  };

  const handleOpenChange = (newOpen: boolean) => {
    onOpenChange(newOpen);
    if (!newOpen) {
      form.reset();
      setImagePreview(undefined);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[80vh] overflow-y-auto !w-[95vw] !max-w-none sm:!w-[80vw] lg:!w-[1000px]">
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isAdding} placeholder='Enter product name'/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      placeholder='Enter product price'
                      onChange={(e) => field.onChange(parseFloat(e.target.value) )}
                      disabled={isAdding}
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
                    <Textarea {...field} disabled={isAdding} placeholder='Enter product description' />
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
                    disabled={isAdding}
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
                <Input type="file" accept="image/*" onChange={handleImageChange} disabled={isAdding} />
              </FormControl>
              {imagePreview && (
                <img src={imagePreview} alt="Preview" width={200} height={200} className="mt-2 rounded" />
              )}
              <FormMessage />
            </FormItem>
            <Button type="submit" disabled={isAdding} className="w-full">
              {isAdding ? 'Adding Product...' : 'Add Product'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddProductModal;