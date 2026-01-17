import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { Product, ProductSize, SIZE_ORDER } from '@/types';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [selectedSize, setSelectedSize] = useState<ProductSize | ''>('');
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { addToCart, setIsOpen } = useCart();
  const navigate = useNavigate();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(price);
  };

  const discount = product.original_price 
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      navigate('/auth?redirect=' + encodeURIComponent(window.location.pathname));
      return;
    }

    if (!selectedSize) {
      return;
    }

    setIsLoading(true);
    const success = await addToCart(product.id, selectedSize);
    setIsLoading(false);
    
    if (success) {
      setIsOpen(true);
    }
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      navigate('/auth?redirect=' + encodeURIComponent(`/products/${product.id}`));
      return;
    }

    if (!selectedSize) {
      return;
    }

    navigate(`/checkout?product=${product.id}&size=${selectedSize}`);
  };

  const sortedSizes = product.sizes.sort(
    (a, b) => SIZE_ORDER.indexOf(a) - SIZE_ORDER.indexOf(b)
  );

return (
    <div 
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/products/${product.id}`} className="block">
        {/* Image */}
        <div className="relative aspect-[3/4] overflow-hidden rounded-lg sm:rounded-xl bg-muted mb-2 sm:mb-4">
          <img
            src={product.images[0]}
            alt={product.name}
            className={cn(
              'w-full h-full object-cover transition-all duration-500',
              isHovered && product.images[1] ? 'opacity-0' : 'opacity-100'
            )}
            loading="lazy"
          />
          {product.images[1] && (
            <img
              src={product.images[1]}
              alt={product.name}
              className={cn(
                'absolute inset-0 w-full h-full object-cover transition-opacity duration-500',
                isHovered ? 'opacity-100' : 'opacity-0'
              )}
              loading="lazy"
            />
          )}

          {/* Badges */}
          <div className="absolute top-2 sm:top-3 left-2 sm:left-3 flex flex-col gap-1.5 sm:gap-2">
            {discount > 0 && (
              <span className="bg-destructive text-destructive-foreground text-[10px] sm:text-xs font-semibold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded">
                -{discount}%
              </span>
            )}
            {product.featured && (
              <span className="bg-gold text-gold-foreground text-[10px] sm:text-xs font-semibold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded">
                Featured
              </span>
            )}
          </div>

          {/* Wishlist - Desktop only */}
          <button 
            className="absolute top-2 sm:top-3 right-2 sm:right-3 p-1.5 sm:p-2 bg-background/80 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background hidden sm:block"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
            aria-label="Add to wishlist"
          >
            <Heart className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </button>

          {!product.in_stock && (
            <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
              <span className="bg-background px-3 sm:px-4 py-1.5 sm:py-2 rounded text-xs sm:text-sm font-medium">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="space-y-1 sm:space-y-2">
          <h3 className="font-medium text-xs sm:text-sm line-clamp-2 group-hover:underline leading-tight">
            {product.name}
          </h3>
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
            <span className="font-semibold text-sm sm:text-base">{formatPrice(product.price)}</span>
            {product.original_price && (
              <span className="text-xs sm:text-sm text-muted-foreground line-through">
                {formatPrice(product.original_price)}
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Quick Actions - Desktop hover */}
      {product.in_stock && (
        <div 
          className={cn(
            'mt-3 space-y-2 transition-all duration-300 hidden md:block',
            isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
          )}
          onClick={(e) => e.preventDefault()}
        >
          <Select value={selectedSize} onValueChange={(value) => setSelectedSize(value as ProductSize)}>
            <SelectTrigger className="w-full h-9 text-sm">
              <SelectValue placeholder="Select Size" />
            </SelectTrigger>
            <SelectContent>
              {sortedSizes.map((size) => (
                <SelectItem key={size} value={size}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              className="flex-1"
              disabled={!selectedSize || isLoading}
              onClick={handleAddToCart}
            >
              <ShoppingBag className="h-4 w-4 mr-1" />
              Add
            </Button>
            <Button
              size="sm"
              className="flex-1"
              disabled={!selectedSize}
              onClick={handleBuyNow}
            >
              Buy Now
            </Button>
          </div>
        </div>
      )}

      {/* Mobile Actions - Compact design */}
      <div className="mt-2 sm:mt-3 md:hidden" onClick={(e) => e.preventDefault()}>
        {product.in_stock ? (
          <div className="space-y-2">
            <Select value={selectedSize} onValueChange={(value) => setSelectedSize(value as ProductSize)}>
              <SelectTrigger className="w-full h-8 text-xs">
                <SelectValue placeholder="Size" />
              </SelectTrigger>
              <SelectContent>
                {sortedSizes.map((size) => (
                  <SelectItem key={size} value={size}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              size="sm"
              className="w-full h-8 text-xs"
              disabled={!selectedSize || isLoading}
              onClick={handleAddToCart}
            >
              <ShoppingBag className="h-3.5 w-3.5 mr-1" />
              {isLoading ? 'Adding...' : 'Add to Cart'}
            </Button>
          </div>
        ) : (
          <Button size="sm" variant="outline" className="w-full h-8 text-xs" disabled>
            Out of Stock
          </Button>
        )}
      </div>
    </div>
  );
}
