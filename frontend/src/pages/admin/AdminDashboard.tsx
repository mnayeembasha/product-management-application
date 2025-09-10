import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchMyProducts } from '@/store/productSlice';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import ProductCard from '@/components/ProductCard';
import AddProductModal from '@/components/AddProductModal';
import EditProductModal from '@/components/EditProductModal';
import DeleteConfirmDialog from '@/components/DeleteConfirmDialog';
import { type ProductType } from '@/types';
import { Plus } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { myProducts, isFetchingMyProducts } = useAppSelector((state) => state.product);

  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(null);

  useEffect(() => {
    dispatch(fetchMyProducts());
  }, [dispatch]);

  const handleEdit = (product: ProductType) => {
    setSelectedProduct(product);
    setEditOpen(true);
  };

  const handleDelete = (product: ProductType) => {
    setSelectedProduct(product);
    setDeleteOpen(true);
  };

  return (
    <div className="container mx-auto py-8 px-4 lg:px-16">
      <div className="flex justify-between flex-wrap gap-y-4 items-center mb-6">
        <h1 className="text-3xl font-bold">My Products</h1>
        <Button
          onClick={() => setAddOpen(true)}
          className="flex items-center gap-2 px-4 py-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </Button>
      </div>
      {isFetchingMyProducts ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-80 w-full" />
          ))}
        </div>
      ) : myProducts.length === 0 ? (
        <p className="text-center text-muted-foreground">No products yet. Add one!</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {myProducts.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              isAdmin={true}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
      <AddProductModal open={addOpen} onOpenChange={setAddOpen} />
      <EditProductModal open={editOpen} onOpenChange={setEditOpen} product={selectedProduct} />
      <DeleteConfirmDialog open={deleteOpen} onOpenChange={setDeleteOpen} product={selectedProduct} />
    </div>
  );
};

export default AdminDashboard;