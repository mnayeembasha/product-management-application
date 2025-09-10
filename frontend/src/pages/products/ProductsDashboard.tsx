import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchProducts } from '@/store/productSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Filter, Search, X } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { useDebounce } from '@/hooks/useDebounce';
import { CATEGORIES } from '@/types';
import { useNavigate } from 'react-router-dom';

const ProductsDashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { products, isFetchingProducts } = useAppSelector((state) => state.product);
  const authUser = useAppSelector((state) => state.auth.authUser);

  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('oldest');
  const [category, setCategory] = useState('all');

  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    dispatch(fetchProducts({ search: debouncedSearch, sort, category }));
  }, [debouncedSearch, sort, category, dispatch]);

  const handleClearFilters = () => {
    setSearch('');
    setSort('latest');
    setCategory('all');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <div className="container mx-auto px-4 py-8 lg:px-16">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
        <h1 className="text-3xl font-bold">Products</h1>
        {!authUser && (
          <div className="flex items-center space-x-2">
            <p>Login to upload your products</p>
            <Button onClick={handleLogin}>Login</Button>
          </div>
        )}
      </div>
      <div className="flex flex-col items-center space-y-4 mb-6">
        {/* Search, Sort, and Clear Filters on one line */}
       <div className="flex flex-col md:flex-row items-center justify-center w-full gap-4">
  {/* Search Input with Icon */}
  <div className="relative w-full md:max-w-sm ">
    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
    <Input
      placeholder="Search products..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="pl-10  w-full"
    />
  </div>

  {/* Sort Dropdown with Filter Icon */}
<div className="relative w-full md:w-[200px]">
  <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
  <Select value={sort} onValueChange={setSort}>
    <SelectTrigger className="pl-10 w-full">
      <SelectValue placeholder="Sort by" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="oldest">Oldest</SelectItem>
      <SelectItem value="latest">Latest</SelectItem>
      <SelectItem value="price_asc">Price: Low to High</SelectItem>
      <SelectItem value="price_desc">Price: High to Low</SelectItem>
    </SelectContent>
  </Select>
</div>

   <div className="lg:hidden w-full md:max-w-sm">
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className='w-full md:max-w-sm'>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

  {/* Clear Filters Button */}
<Button
  variant="outline"
  onClick={handleClearFilters}
  className="w-full md:w-auto relative"
>
  {/* <X className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" /> */}
  <span className=''>Clear Filters</span>
</Button>

</div>

        {/* Categories on the next line */}
        <div className="flex flex-col items-center w-full">
          <div className="hidden lg:flex flex-wrap justify-center gap-2">
            <Badge
              variant={category === 'all' ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => setCategory('all')}
            >
              All
            </Badge>
            {CATEGORIES.map((cat) => (
              <Badge
                key={cat}
                variant={category === cat ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => setCategory(cat)}
              >
                {cat}
              </Badge>
            ))}
          </div>

        </div>
      </div>
      {isFetchingProducts ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-80 w-full" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <p className="text-center text-muted-foreground">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductsDashboard;