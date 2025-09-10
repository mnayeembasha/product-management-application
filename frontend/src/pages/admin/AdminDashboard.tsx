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
  const {authUser} = useAppSelector((state) => state.auth);

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
   <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
  {/* Left: Page Title */}
  <h1 className="text-3xl font-bold tracking-tight">My Products</h1>

  {/* Right: User Info + Button */}
  <div className="flex items-center gap-4">
    {authUser && (
      <div className="flex items-center gap-2 bg-muted/40 px-3 py-1.5 rounded-full">
        <img
          src={authUser.profilePic}
          alt={authUser.fullName}
          className="w-8 h-8 rounded-full border border-border shadow-sm"
        />
        <span className="text-sm font-medium text-muted-foreground">
          {authUser.fullName}
        </span>
      </div>
    )}

    <Button
      onClick={() => setAddOpen(true)}
      className="flex items-center gap-2 px-4 py-2 shadow-md rounded-xl"
    >
      <Plus className="w-4 h-4" />
      <span>Add Product</span>
    </Button>
  </div>
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