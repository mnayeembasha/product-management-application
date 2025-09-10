import React from 'react';
import { type ProductType } from '@/types';
import AddProductModal, { type AddProductFormData } from './AddProductModal';
import EditProductModal, { type EditProductFormData } from './EditProductModal';

// Export types for external use
export type { AddProductFormData, EditProductFormData };

// Separate interfaces for type safety
interface AddProductFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isEdit?: false;
}

interface EditProductFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isEdit: true;
  product: ProductType | null;
}

type ProductFormProps = AddProductFormProps | EditProductFormProps;

const ProductForm: React.FC<ProductFormProps> = (props) => {
  if (props.isEdit) {
    return (
      <EditProductModal
        open={props.open}
        onOpenChange={props.onOpenChange}
        product={props.product}
      />
    );
  }

  return (
    <AddProductModal
      open={props.open}
      onOpenChange={props.onOpenChange}
    />
  );
};

export default ProductForm;