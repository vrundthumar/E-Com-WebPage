import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, ChevronDown } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { ProductCard } from '@/components/products/ProductCard';
import { ProductFilters } from '@/components/products/ProductFilters';
import { ProductSkeleton } from '@/components/products/ProductSkeleton';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { Product, ProductCategory, ProductSize } from '@/types';

type SortOption = 'newest' | 'price-asc' | 'price-desc' | 'popular';

export default function Products() {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);

  const [selectedCategories, setSelectedCategories] = useState<ProductCategory[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<ProductSize[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 20000]);
  const [gender, setGender] = useState<'all' | 'men' | 'women'>('all');
  const [sortBy, setSortBy] = useState<SortOption>('newest');

  const searchQuery = searchParams.get('search') || '';
  const genderParam = searchParams.get('gender');

  useEffect(() => {
    if (genderParam === 'men' || genderParam === 'women') {
      setGender(genderParam);
    }
  }, [genderParam]);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      const { data, error } = await supabase.from('products').select('*');
      if (!error && data) {
        setProducts(data as Product[]);
      }
      setLoading(false);
    }
    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(query) || p.description?.toLowerCase().includes(query));
    }

    if (gender !== 'all') {
      result = result.filter(p => p.gender === gender);
    }

    if (selectedCategories.length > 0) {
      result = result.filter(p => selectedCategories.includes(p.category));
    }

    if (selectedSizes.length > 0) {
      result = result.filter(p => p.sizes.some(s => selectedSizes.includes(s)));
    }

    if (selectedColors.length > 0) {
      result = result.filter(p => p.colors.some(c => selectedColors.includes(c.toLowerCase())));
    }

    result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      default:
        result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    return result;
  }, [products, searchQuery, gender, selectedCategories, selectedSizes, selectedColors, priceRange, sortBy]);

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedSizes([]);
    setSelectedColors([]);
    setPriceRange([0, 20000]);
    setGender('all');
  };

return (
    <Layout>
      <div className="pt-16 sm:pt-20 md:pt-24">
        <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8">
          <div className="flex flex-col md:flex-row gap-4 md:gap-8">
            {/* Desktop Filters */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <ProductFilters
                selectedCategories={selectedCategories}
                setSelectedCategories={setSelectedCategories}
                selectedSizes={selectedSizes}
                setSelectedSizes={setSelectedSizes}
                selectedColors={selectedColors}
                setSelectedColors={setSelectedColors}
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                maxPrice={20000}
                gender={gender}
                setGender={setGender}
                onClear={clearFilters}
              />
            </aside>

            {/* Products Grid */}
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div>
                  <h1 className="font-display text-xl sm:text-2xl md:text-3xl font-semibold">
                    {gender === 'men' ? "Men's Collection" : gender === 'women' ? "Women's Collection" : 'All Products'}
                  </h1>
                  <p className="text-muted-foreground text-sm mt-0.5 sm:mt-1">{filteredProducts.length} products</p>
                </div>

                <div className="flex items-center gap-2 sm:gap-3">
                  {/* Mobile Filter */}
                  <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
                    <SheetTrigger asChild>
                      <Button variant="outline" size="sm" className="lg:hidden h-9 text-xs sm:text-sm">
                        <SlidersHorizontal className="h-4 w-4 mr-1.5 sm:mr-2" />
                        Filters
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-[85%] sm:max-w-md p-4 sm:p-6">
                      <ProductFilters
                        selectedCategories={selectedCategories}
                        setSelectedCategories={setSelectedCategories}
                        selectedSizes={selectedSizes}
                        setSelectedSizes={setSelectedSizes}
                        selectedColors={selectedColors}
                        setSelectedColors={setSelectedColors}
                        priceRange={priceRange}
                        setPriceRange={setPriceRange}
                        maxPrice={20000}
                        gender={gender}
                        setGender={setGender}
                        onClear={clearFilters}
                        isMobile
                        onClose={() => setFilterOpen(false)}
                      />
                    </SheetContent>
                  </Sheet>

                  <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
                    <SelectTrigger className="w-[120px] sm:w-[160px] h-9 text-xs sm:text-sm">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest</SelectItem>
                      <SelectItem value="popular">Popular</SelectItem>
                      <SelectItem value="price-asc">Price: Low to High</SelectItem>
                      <SelectItem value="price-desc">Price: High to Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                {loading ? (
                  <ProductSkeleton count={8} />
                ) : filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))
                ) : (
                  <div className="col-span-full text-center py-12 sm:py-16">
                    <p className="text-muted-foreground text-sm sm:text-base">No products found matching your criteria.</p>
                    <Button variant="outline" onClick={clearFilters} className="mt-4 text-sm">
                      Clear Filters
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
