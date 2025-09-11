import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, ImageIcon, Calendar } from 'lucide-react';
import { type ProductType } from '@/types';
import { formatDate, formatTime } from '@/lib/utils';

interface ProductCardProps {
  product: ProductType;
  isAdmin?: boolean;
  onEdit?: (product: ProductType) => void;
  onDelete?: (product: ProductType) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, isAdmin = false, onEdit, onDelete }) => {
  return (
    <Card className="h-full flex flex-col group overflow-hidden p-0 pb-4  transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-black/10 dark:hover:shadow-white/10 border-border/50  bg-gradient-to-br from-orange-50/80 via-amber-50/60 to-yellow-50/40 dark:from-orange-950/30 dark:via-amber-950/20 dark:to-yellow-950/10 backdrop-blur-sm hover:border-orange-200 dark:hover:border-orange-400">

      {/* Image Section - No space above */}
     <div className="m-0 p-0">
  {product.image ? (
    <img
      src={product.image}
      alt={product.name}
      className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
    />
  ) : (
    <div className="w-full h-64 bg-gradient-to-br from-orange-200 via-amber-200 to-yellow-200 flex items-center justify-center">
      <div className="flex flex-col items-center justify-center text-muted-foreground">
        <ImageIcon className="h-8 w-8 mb-2 opacity-60" />
        <span className="text-sm font-medium">No Image</span>
      </div>
    </div>
  )}
</div>
      {/* Header Section - Name & Badge */}
      <CardHeader className="px-5">
        <div className=" flex flex-col gap-y-2 2xl:flex 2xl:flex-row 2xl:justify-between 2xl:items-center">
          <CardTitle
            className="text-lg font-semibold leading-tight group-hover:text-primary transition-colors duration-200 truncate tracking-tight"
            style={{
              background: 'linear-gradient(135deg, oklch(0.646 0.176 41.116) 0%, oklch(0.769 0.188 70.08) 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            {product.name}
          </CardTitle>
          <Badge
            variant="secondary"
            className="shrink-0 bg-secondary/80 text-secondary-foreground font-medium px-2 py-1 text-xs border border-border/50"
          >
            {product.category}
          </Badge>
        </div>
      </CardHeader>

      {/* Content Section - Description (flexible height) */}
      <CardContent className="px-5 flex-1 flex flex-col">
        <CardDescription className="line-clamp-4 text-muted-foreground leading-relaxed flex-1">
          {product.description}
        </CardDescription>
      </CardContent>

      {/* Price Section - Always at bottom */}
      <div className=''>
        <div className="px-5 flex justify-between">
        <p
          className="text-2xl font-bold"
          style={{
            background: 'linear-gradient(135deg, oklch(0.646 0.176 41.116) 0%, oklch(0.769 0.188 70.08) 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          ₹{product.price.toLocaleString('en-IN')}
        </p>

        <div>
          <p className="text-muted-foreground text-sm mt-2">
            <span className='flex items-center gap-x-1'>
              <Calendar className="w-4 h-4 mr-1" />
            {formatDate(product.createdAt as string)} {","} {formatTime(product.createdAt as string)}
            </span>
          </p>
        </div>
        </div>
        {/* Admin Controls */}
     <div>
       {isAdmin && (
        <CardFooter className="px-5 justify-end items-center pt-4">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => onEdit?.(product)}
              className="h-9 w-9 border-border/60 hover:border-primary/50 hover:bg-primary/10 hover:text-primary transition-all duration-200"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="destructive"
              size="icon"
              onClick={() => onDelete?.(product)}
              className="cursor-pointer h-9 w-9 bg-destructive/10 border border-destructive/20 text-destructive dark:text-foreground hover:bg-destructive/20 dark:hover:bg-destructive/80  transition-all duration-200"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardFooter>
      )}
     </div>
      </div>


    </Card>
  );
};

export default ProductCard;