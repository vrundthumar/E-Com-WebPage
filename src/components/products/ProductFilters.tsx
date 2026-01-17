import { useState } from 'react';
import { X, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { CATEGORY_LABELS, ProductCategory, ProductSize, SIZE_ORDER } from '@/types';
import { cn } from '@/lib/utils';

interface ProductFiltersProps {
  selectedCategories: ProductCategory[];
  setSelectedCategories: (categories: ProductCategory[]) => void;
  selectedSizes: ProductSize[];
  setSelectedSizes: (sizes: ProductSize[]) => void;
  selectedColors: string[];
  setSelectedColors: (colors: string[]) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  maxPrice: number;
  gender: 'all' | 'men' | 'women';
  setGender: (gender: 'all' | 'men' | 'women') => void;
  onClear: () => void;
  isMobile?: boolean;
  onClose?: () => void;
}

const AVAILABLE_COLORS = [
  { name: 'Black', value: 'black' },
  { name: 'White', value: 'white' },
  { name: 'Navy', value: 'navy' },
  { name: 'Gray', value: 'gray' },
  { name: 'Beige', value: 'beige' },
  { name: 'Brown', value: 'brown' },
  { name: 'Blue', value: 'blue' },
  { name: 'Green', value: 'green' },
  { name: 'Red', value: 'red' },
  { name: 'Pink', value: 'pink' },
];

export function ProductFilters({
  selectedCategories,
  setSelectedCategories,
  selectedSizes,
  setSelectedSizes,
  selectedColors,
  setSelectedColors,
  priceRange,
  setPriceRange,
  maxPrice,
  gender,
  setGender,
  onClear,
  isMobile = false,
  onClose,
}: ProductFiltersProps) {
  const [openSections, setOpenSections] = useState<string[]>(['gender', 'category', 'size', 'price']);

  const toggleSection = (section: string) => {
    setOpenSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section]
    );
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const menCategories = Object.entries(CATEGORY_LABELS).filter(([key]) => key.startsWith('mens_'));
  const womenCategories = Object.entries(CATEGORY_LABELS).filter(([key]) => key.startsWith('womens_'));

  const toggleCategory = (category: ProductCategory) => {
    setSelectedCategories(
      selectedCategories.includes(category)
        ? selectedCategories.filter((c) => c !== category)
        : [...selectedCategories, category]
    );
  };

  const toggleSize = (size: ProductSize) => {
    setSelectedSizes(
      selectedSizes.includes(size)
        ? selectedSizes.filter((s) => s !== size)
        : [...selectedSizes, size]
    );
  };

  const toggleColor = (color: string) => {
    setSelectedColors(
      selectedColors.includes(color)
        ? selectedColors.filter((c) => c !== color)
        : [...selectedColors, color]
    );
  };

  const hasActiveFilters =
    selectedCategories.length > 0 ||
    selectedSizes.length > 0 ||
    selectedColors.length > 0 ||
    priceRange[0] > 0 ||
    priceRange[1] < maxPrice;

  return (
    <div className={cn('space-y-6', isMobile && 'pb-20')}>
      {isMobile && (
        <div className="flex items-center justify-between pb-4 border-b">
          <h2 className="font-display text-xl font-semibold">Filters</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
      )}

      {/* Gender */}
      <Collapsible
        open={openSections.includes('gender')}
        onOpenChange={() => toggleSection('gender')}
      >
        <CollapsibleTrigger className="flex items-center justify-between w-full py-2">
          <span className="font-medium">Gender</span>
          {openSections.includes('gender') ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2 space-y-2">
          {(['all', 'men', 'women'] as const).map((g) => (
            <button
              key={g}
              onClick={() => setGender(g)}
              className={cn(
                'block w-full text-left px-3 py-2 rounded-md text-sm transition-colors',
                gender === g ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
              )}
            >
              {g === 'all' ? 'All' : g === 'men' ? "Men's" : "Women's"}
            </button>
          ))}
        </CollapsibleContent>
      </Collapsible>

      {/* Categories */}
      <Collapsible
        open={openSections.includes('category')}
        onOpenChange={() => toggleSection('category')}
      >
        <CollapsibleTrigger className="flex items-center justify-between w-full py-2">
          <span className="font-medium">Category</span>
          {openSections.includes('category') ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2 space-y-4">
          {(gender === 'all' || gender === 'men') && (
            <div className="space-y-2">
              {gender === 'all' && (
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Men</p>
              )}
              {menCategories.map(([key, label]) => (
                <div key={key} className="flex items-center gap-2">
                  <Checkbox
                    id={key}
                    checked={selectedCategories.includes(key as ProductCategory)}
                    onCheckedChange={() => toggleCategory(key as ProductCategory)}
                  />
                  <Label htmlFor={key} className="text-sm cursor-pointer">
                    {label.replace("Men's ", '')}
                  </Label>
                </div>
              ))}
            </div>
          )}
          {(gender === 'all' || gender === 'women') && (
            <div className="space-y-2">
              {gender === 'all' && (
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mt-4">Women</p>
              )}
              {womenCategories.map(([key, label]) => (
                <div key={key} className="flex items-center gap-2">
                  <Checkbox
                    id={key}
                    checked={selectedCategories.includes(key as ProductCategory)}
                    onCheckedChange={() => toggleCategory(key as ProductCategory)}
                  />
                  <Label htmlFor={key} className="text-sm cursor-pointer">
                    {label.replace("Women's ", '')}
                  </Label>
                </div>
              ))}
            </div>
          )}
        </CollapsibleContent>
      </Collapsible>

      {/* Size */}
      <Collapsible
        open={openSections.includes('size')}
        onOpenChange={() => toggleSection('size')}
      >
        <CollapsibleTrigger className="flex items-center justify-between w-full py-2">
          <span className="font-medium">Size</span>
          {openSections.includes('size') ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2">
          <div className="flex flex-wrap gap-2">
            {SIZE_ORDER.map((size) => (
              <button
                key={size}
                onClick={() => toggleSize(size)}
                className={cn(
                  'px-3 py-1.5 rounded-md text-sm font-medium border transition-colors',
                  selectedSizes.includes(size)
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'border-border hover:border-primary'
                )}
              >
                {size}
              </button>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Price Range */}
      <Collapsible
        open={openSections.includes('price')}
        onOpenChange={() => toggleSection('price')}
      >
        <CollapsibleTrigger className="flex items-center justify-between w-full py-2">
          <span className="font-medium">Price</span>
          {openSections.includes('price') ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-4">
          <Slider
            value={priceRange}
            onValueChange={(value) => setPriceRange(value as [number, number])}
            max={maxPrice}
            step={100}
            className="mb-2"
          />
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{formatPrice(priceRange[0])}</span>
            <span>{formatPrice(priceRange[1])}</span>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Colors */}
      <Collapsible
        open={openSections.includes('color')}
        onOpenChange={() => toggleSection('color')}
      >
        <CollapsibleTrigger className="flex items-center justify-between w-full py-2">
          <span className="font-medium">Color</span>
          {openSections.includes('color') ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2">
          <div className="flex flex-wrap gap-2">
            {AVAILABLE_COLORS.map((color) => (
              <button
                key={color.value}
                onClick={() => toggleColor(color.value)}
                className={cn(
                  'px-3 py-1.5 rounded-md text-sm border transition-colors',
                  selectedColors.includes(color.value)
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'border-border hover:border-primary'
                )}
              >
                {color.name}
              </button>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <Button variant="outline" onClick={onClear} className="w-full">
          Clear All Filters
        </Button>
      )}

      {/* Mobile Apply Button */}
      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t">
          <Button onClick={onClose} className="w-full">
            Apply Filters
          </Button>
        </div>
      )}
    </div>
  );
}
