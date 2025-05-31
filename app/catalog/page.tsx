"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
 
  Grid3X3,
  List,
  Star,
  Heart,
  ShoppingCart,

  Tag,
  TrendingUp,
  Award,
  Zap,
  Eye,
  GitCompare,
  X,
  
  Sparkles,
  Grid2X2,
  LayoutGrid,
  
  Phone,
  Mail,
  
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { TbDental } from "react-icons/tb";
import Header from "@/components/landing/header";
import { useCallback } from "react";

interface Product {
  id: string;
  name: string;
  description: string | null;
  slug: string;
  price: number;
  comparePrice: number | null;
  stockQuantity: number;
  images: string[];
  thumbnail: string | null;
  isFeatured: boolean;
  category?: {
    id: string;
    name: string;
    slug: string;
  } | null;
  createdAt: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function CatalogPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Enhanced filter state
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [compareProducts, setCompareProducts] = useState<Product[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000]);
  const [gridCols, setGridCols] = useState(3);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [minRating, setMinRating] = useState(0);

  // Fetch products
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "12",
        ...(selectedCategory !== "all" && { category: selectedCategory }),
        ...(searchQuery && { search: searchQuery }),
        sortBy,
        sortOrder,
      });

      const response = await fetch(`/api/products/public?${params}`);
      if (response.ok) {
        const data = await response.json();
        setProducts(data.products || []);
        setTotalPages(data.pagination?.totalPages || 1);
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  }, [currentPage, selectedCategory, searchQuery, sortBy, sortOrder]);

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories");
      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories || []);
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [currentPage, selectedCategory, searchQuery, sortBy, sortOrder, fetchProducts]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchProducts();
  };

  const getCategoryIcon = (slug: string) => {
    switch (slug) {
      case 'equipment': return <Zap className="h-4 w-4" />;
      case 'diagnostic': return <TrendingUp className="h-4 w-4" />;
      case 'sterilization': return <Award className="h-4 w-4" />;
      case 'instruments': return <Tag className="h-4 w-4" />;
      default: return <ShoppingCart className="h-4 w-4" />;
    }
  };

  // Innovative helper functions
  const toggleWishlist = (productId: string) => {
    setWishlist(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const toggleCompare = (product: Product) => {
    setCompareProducts(prev => {
      const exists = prev.find(p => p.id === product.id);
      if (exists) {
        return prev.filter(p => p.id !== product.id);
      } else if (prev.length < 3) {
        return [...prev, product];
      } else {
        toast.error("You can compare up to 3 products");
        return prev;
      }
    });
  };

  const getGridColumns = () => {
    switch (gridCols) {
      case 2: return "grid-cols-1 sm:grid-cols-2";
      case 3: return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
      case 4: return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";
      default: return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
    }
  };

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setPriceRange([0, 50000]);
    setInStockOnly(false);
    setFeaturedOnly(false);
    setMinRating(0);
    setCurrentPage(1);
  };

  const EnhancedProductCard = ({ product }: { product: Product }) => {
    const discount = product.comparePrice
      ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
      : 0;
    const isInStock = product.stockQuantity > 0;
    const isInWishlist = wishlist.includes(product.id);
    const isInCompare = compareProducts.find(p => p.id === product.id);
    const rating = 4.5 + Math.random() * 0.5;

    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -4 }}
        transition={{ duration: 0.3 }}
        className="group relative h-full"
      >
        <Card className="h-full flex flex-col overflow-hidden bg-white border border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300 rounded-2xl">
          {/* Image Section */}
          <div className="relative aspect-[4/3] overflow-hidden bg-gray-50 rounded-t-2xl">
            <Image
              src={product.thumbnail || product.images?.[0] || "/images/dental-equipment.jpg"}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />

            {/* Floating Actions */}
            <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.preventDefault();
                  toggleWishlist(product.id);
                  toast.success(isInWishlist ? "Removed from wishlist" : "Added to wishlist");
                }}
                className={`p-2 rounded-full backdrop-blur-sm shadow-lg transition-colors ${
                  isInWishlist
                    ? "bg-red-500 text-white"
                    : "bg-white/90 text-gray-600 hover:text-red-500"
                }`}
              >
                <Heart className={`h-4 w-4 ${isInWishlist ? "fill-current" : ""}`} />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.preventDefault();
                  setQuickViewProduct(product);
                }}
                className="p-2 rounded-full bg-white/90 backdrop-blur-sm text-gray-600 hover:text-blue-600 shadow-lg transition-colors"
              >
                <Eye className="h-4 w-4" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.preventDefault();
                  toggleCompare(product);
                }}
                className={`p-2 rounded-full backdrop-blur-sm shadow-lg transition-colors ${
                  isInCompare
                    ? "bg-blue-500 text-white"
                    : "bg-white/90 text-gray-600 hover:text-blue-600"
                }`}
              >
                <GitCompare className="h-4 w-4" />
              </motion.button>
            </div>

            {/* Status Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {product.isFeatured && (
                <Badge className="bg-blue-600 text-white shadow-sm rounded-full px-3 py-1">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Featured
                </Badge>
              )}
              {discount > 0 && (
                <Badge className="bg-red-500 text-white shadow-sm rounded-full px-3 py-1">
                  -{discount}%
                </Badge>
              )}
            </div>


          </div>

          {/* Content Section */}
          <CardContent className="p-6 flex-1 flex flex-col">
            <div className="space-y-4 flex-1 flex flex-col">
              {/* Category */}
              {product.category && (
                <div className="flex items-center gap-2">
                  <ShoppingCart className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-600 capitalize">{product.category.name}</span>
                </div>
              )}

              {/* Title */}
              <Link href={`/products/${product.slug}`}>
                <h3 className="font-bold text-lg text-gray-900 hover:text-blue-600 transition-colors line-clamp-2 leading-tight min-h-[3.5rem]">
                  {product.name}
                </h3>
              </Link>

              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(rating)
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600 font-medium">
                  {rating.toFixed(1)} ({Math.floor(Math.random() * 50) + 10})
                </span>
              </div>

              {/* Spacer to push price and button to bottom */}
              <div className="flex-1"></div>

              {/* Price and Add to Cart */}
              <div className="space-y-3 mt-auto">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-gray-900">
                        {product.price.toLocaleString()} TND TTC
                      </span>
                      {product.comparePrice && (
                        <span className="text-sm text-gray-500 line-through">
                          {product.comparePrice.toLocaleString()} TND TTC
                        </span>
                      )}
                    </div>
                    {discount > 0 && (
                      <p className="text-sm text-green-600 font-medium">
                        Save {(product.comparePrice! - product.price).toLocaleString()} TND
                      </p>
                    )}
                  </div>

                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    isInStock
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}>
                    {isInStock ? "In Stock" : "Out of Stock"}
                  </div>
                </div>

                {/* Add to Cart Button */}
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-sm rounded-xl py-3 font-medium"
                  onClick={() => toast.success("Added to cart")}
                  disabled={!isInStock}
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Add to Cart
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16 pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Professional Dental Equipment
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
              Discover our comprehensive collection of high-quality dental equipment and supplies.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <form onSubmit={handleSearch} className="relative">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    placeholder="Search for dental equipment, tools, or supplies..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 pr-4 py-4 text-lg bg-white border-0 rounded-xl shadow-lg"
                  />
                  <Button
                    type="submit"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 rounded-lg"
                  >
                    Search
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content with Sidebar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:w-80 flex-shrink-0"
          >
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 sticky top-24">
              <div className="space-y-6">
                {/* Filter Header */}
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">Filters</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAllFilters}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    Clear All
                  </Button>
                </div>

                {/* Categories */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900">Categories</h3>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <Checkbox
                        checked={selectedCategory === "all"}
                        onCheckedChange={(checked) => checked && setSelectedCategory("all")}
                        className="mr-3"
                      />
                      <span className="text-sm">All Categories</span>
                    </label>
                    {categories.map((category) => (
                      <label key={category.id} className="flex items-center">
                        <Checkbox
                          checked={selectedCategory === category.slug}
                          onCheckedChange={(checked) => checked && setSelectedCategory(category.slug)}
                          className="mr-3"
                        />
                        <div className="flex items-center gap-2">
                          {getCategoryIcon(category.slug)}
                          <span className="text-sm">{category.name}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900">Price Range</h3>
                  <div className="space-y-4">
                    <Slider
                      value={priceRange}
                      onValueChange={(value) => setPriceRange(value as [number, number])}
                      max={50000}
                      min={0}
                      step={100}
                      className="w-full"
                    />
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        placeholder="Min"
                        value={priceRange[0]}
                        onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                        className="w-full"
                      />
                      <span className="text-gray-500">-</span>
                      <Input
                        type="number"
                        placeholder="Max"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                        className="w-full"
                      />
                    </div>
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>{priceRange[0].toLocaleString()} TND</span>
                      <span>{priceRange[1].toLocaleString()} TND</span>
                    </div>
                  </div>
                </div>

                {/* Availability */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900">Availability</h3>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <Checkbox
                        checked={inStockOnly}
                        onCheckedChange={(checked) => setInStockOnly(checked === true)}
                        className="mr-3"
                      />
                      <span className="text-sm">In Stock Only</span>
                    </label>
                    <label className="flex items-center">
                      <Checkbox
                        checked={featuredOnly}
                        onCheckedChange={(checked) => setFeaturedOnly(checked === true)}
                        className="mr-3"
                      />
                      <span className="text-sm">Featured Products</span>
                    </label>
                  </div>
                </div>

                {/* Rating */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900">Rating</h3>
                  <div className="space-y-2">
                    {[4, 3, 2, 1].map((rating) => (
                      <label key={rating} className="flex items-center">
                        <Checkbox
                          checked={minRating === rating}
                          onCheckedChange={(checked) => setMinRating(checked ? rating : 0)}
                          className="mr-3"
                        />
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
                              }`}
                            />
                          ))}
                          <span className="text-sm ml-2">& up</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Top Controls */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8"
            >
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                {/* Results Info */}
                <div className="flex items-center gap-4">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {products.length} Product{products.length !== 1 ? 's' : ''} Found
                  </h2>
                  {searchQuery && (
                    <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                      &ldquo;{searchQuery}&rdquo;
                    </Badge>
                  )}
                  {selectedCategory !== "all" && (
                    <Badge variant="secondary" className="bg-green-50 text-green-700">
                      {categories.find(c => c.slug === selectedCategory)?.name}
                    </Badge>
                  )}
                </div>

                {/* Sort & View Controls */}
                <div className="flex gap-3">
                  {/* Sort */}
                  <Select value={`${sortBy}-${sortOrder}`} onValueChange={(value) => {
                    const [field, order] = value.split('-');
                    setSortBy(field);
                    setSortOrder(order);
                  }}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="createdAt-desc">Newest First</SelectItem>
                      <SelectItem value="price-asc">Price: Low to High</SelectItem>
                      <SelectItem value="price-desc">Price: High to Low</SelectItem>
                      <SelectItem value="name-asc">Name: A to Z</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Grid Size Control */}
                  <div className="flex border border-gray-200 rounded-lg overflow-hidden">
                    {[2, 3, 4].map((size) => (
                      <Button
                        key={size}
                        variant={gridCols === size ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setGridCols(size)}
                        className="rounded-none border-0"
                      >
                        {size === 2 && <Grid2X2 className="h-4 w-4" />}
                        {size === 3 && <Grid3X3 className="h-4 w-4" />}
                        {size === 4 && <LayoutGrid className="h-4 w-4" />}
                      </Button>
                    ))}
                  </div>

                  {/* View Mode */}
                  <div className="flex border border-gray-200 rounded-lg overflow-hidden">
                    <Button
                      variant={viewMode === "grid" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("grid")}
                      className="rounded-none border-0"
                    >
                      <Grid3X3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("list")}
                      className="rounded-none border-0"
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Products Grid */}
            {loading ? (
              <div className={`grid gap-6 ${getGridColumns()}`}>
                {Array.from({ length: 12 }).map((_, i) => (
                  <Card key={i} className="h-96 animate-pulse">
                    <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                    <CardContent className="p-4 space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : products.length > 0 ? (
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${viewMode}-${gridCols}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                  className={`grid gap-6 ${
                    viewMode === "list"
                      ? "grid-cols-1"
                      : getGridColumns()
                  }`}
                >
                  {products.map((product, index) => (
                    <motion.div
                      key={product.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{
                        duration: 0.3,
                        delay: index * 0.05,
                        type: "spring",
                        stiffness: 300
                      }}
                    >
                      <EnhancedProductCard product={product} />
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-20"
          >
            <div className="max-w-md mx-auto">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center"
              >
                <Search className="h-16 w-16 text-blue-500" />
              </motion.div>
              <motion.h3
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-2xl font-bold text-gray-900 mb-3"
              >
                No products found
              </motion.h3>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-gray-600 mb-8 leading-relaxed"
              >
                We couldn&apos;t find any products matching your criteria. Try adjusting your search or filters to discover our amazing dental equipment.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("all");
                    setPriceRange([0, 50000]);
                    setInStockOnly(false);
                    setFeaturedOnly(false);
                    setMinRating(0);
                    setCurrentPage(1);
                  }}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <X className="mr-2 h-4 w-4" />
                  Clear All Filters
                </Button>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex justify-center mt-12"
          >
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = i + 1;
                return (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                );
              })}
              
              <Button
                variant="outline"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </motion.div>
        )}

        {/* Quick View Modal */}
        <AnimatePresence>
          {quickViewProduct && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
              onClick={() => setQuickViewProduct(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex flex-col lg:flex-row">
                  {/* Image Section */}
                  <div className="lg:w-1/2 relative">
                    <div className="aspect-square relative">
                      <Image
                        src={quickViewProduct.thumbnail || quickViewProduct.images?.[0] || "/images/dental-equipment.jpg"}
                        alt={quickViewProduct.name}
                        fill
                        className="object-cover"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-4 right-4 bg-white/80 hover:bg-white"
                        onClick={() => setQuickViewProduct(null)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="lg:w-1/2 p-8">
                    <div className="space-y-6">
                      {/* Category */}
                      {quickViewProduct.category && (
                        <div className="flex items-center gap-2 text-sm">
                          <div className="p-1 bg-blue-100 rounded-full">
                            {getCategoryIcon(quickViewProduct.category.slug)}
                          </div>
                          <span className="font-medium text-blue-600">{quickViewProduct.category.name}</span>
                        </div>
                      )}

                      {/* Title */}
                      <h2 className="text-3xl font-bold text-gray-900">
                        {quickViewProduct.name}
                      </h2>

                      {/* Rating */}
                      <div className="flex items-center gap-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-5 w-5 ${
                                i < 4 ? "text-yellow-400 fill-current" : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-lg font-medium text-gray-700">4.5</span>
                        <span className="text-gray-500">(24 reviews)</span>
                      </div>

                      {/* Price */}
                      <div className="space-y-2">
                        <div className="flex items-baseline gap-3">
                          <span className="text-4xl font-bold text-gray-900">
                            ${quickViewProduct.price.toLocaleString()}
                          </span>
                          {quickViewProduct.comparePrice && (
                            <span className="text-xl text-gray-500 line-through">
                              ${quickViewProduct.comparePrice.toLocaleString()}
                            </span>
                          )}
                        </div>
                        {quickViewProduct.comparePrice && (
                          <p className="text-green-600 font-medium">
                            Save ${(quickViewProduct.comparePrice - quickViewProduct.price).toLocaleString()}
                          </p>
                        )}
                      </div>

                      {/* Description */}
                      {quickViewProduct.description && (
                        <p className="text-gray-600 leading-relaxed">
                          {quickViewProduct.description}
                        </p>
                      )}

                      {/* Stock Status */}
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${
                          quickViewProduct.stockQuantity > 0 ? "bg-green-500" : "bg-red-500"
                        }`} />
                        <span className={`font-medium ${
                          quickViewProduct.stockQuantity > 0 ? "text-green-600" : "text-red-600"
                        }`}>
                          {quickViewProduct.stockQuantity > 0
                            ? `${quickViewProduct.stockQuantity} units in stock`
                            : "Out of stock"
                          }
                        </span>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3 pt-4">
                        <Button
                          className="flex-1 bg-blue-600 hover:bg-blue-700"
                          disabled={quickViewProduct.stockQuantity === 0}
                          onClick={() => {
                            toast.success("Added to cart");
                            setQuickViewProduct(null);
                          }}
                        >
                          <ShoppingCart className="mr-2 h-5 w-5" />
                          Add to Cart
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            toggleWishlist(quickViewProduct.id);
                            toast.success("Added to wishlist");
                          }}
                        >
                          <Heart className={`h-5 w-5 ${
                            wishlist.includes(quickViewProduct.id) ? "fill-current text-red-500" : ""
                          }`} />
                        </Button>
                        <Button
                          variant="outline"
                          asChild
                        >
                          <Link href={`/products/${quickViewProduct.slug}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Compare Bar */}
        <AnimatePresence>
          {compareProducts.length > 0 && (
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="fixed bottom-6 left-6 right-6 bg-white rounded-2xl shadow-2xl border border-gray-200 p-4 z-40"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <GitCompare className="h-5 w-5 text-blue-600" />
                    <span className="font-semibold text-gray-900">
                      Compare Products ({compareProducts.length}/3)
                    </span>
                  </div>
                  <div className="flex gap-2">
                    {compareProducts.map((product) => (
                      <div key={product.id} className="relative">
                        <div className="w-12 h-12 rounded-lg overflow-hidden border-2 border-blue-200">
                          <Image
                            src={product.thumbnail || product.images?.[0] || "/images/dental-equipment.jpg"}
                            alt={product.name}
                            width={48}
                            height={48}
                            className="object-cover"
                          />
                        </div>
                        <button
                          onClick={() => toggleCompare(product)}
                          className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setCompareProducts([])}
                  >
                    Clear All
                  </Button>
                  <Button
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={() => toast.success("Compare feature coming soon!")}
                  >
                    Compare Now
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Enhanced Footer */}
      <footer className="bg-gray-900 text-white">
        {/* Newsletter Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-white mb-4">
                Stay Updated with Latest Dental Equipment
              </h3>
              <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
                Get exclusive offers, new product announcements, and expert tips delivered to your inbox.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-white/10 border-white/20 text-white placeholder:text-blue-100"
                />
                <Button className="bg-white text-blue-600 hover:bg-blue-50">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center">
                  <TbDental className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">DentalCamp</h2>
                  <p className="text-gray-400 text-sm">Professional Equipment</p>
                </div>
              </div>
              <p className="text-gray-300 leading-relaxed mb-6">
                Your trusted partner for high-quality dental equipment and supplies.
                We provide innovative solutions to enhance your practice and patient care.
              </p>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-gray-300">
                  <Phone className="h-5 w-5 text-blue-400" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-300">
                  <Mail className="h-5 w-5 text-blue-400" />
                  <span>info@dentalcamp.com</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
              <ul className="space-y-3">
                <li><Link href="/" className="text-gray-300 hover:text-white transition-colors">Home</Link></li>
                <li><Link href="/catalog" className="text-gray-300 hover:text-white transition-colors">Catalog</Link></li>
                <li><Link href="/about" className="text-gray-300 hover:text-white transition-colors">About</Link></li>
                <li><Link href="/contact" className="text-gray-300 hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="text-lg font-semibold mb-6">Support</h3>
              <ul className="space-y-3">
                <li><Link href="/help" className="text-gray-300 hover:text-white transition-colors">Help Center</Link></li>
                <li><Link href="/shipping" className="text-gray-300 hover:text-white transition-colors">Shipping Info</Link></li>
                <li><Link href="/returns" className="text-gray-300 hover:text-white transition-colors">Returns</Link></li>
                <li><Link href="/warranty" className="text-gray-300 hover:text-white transition-colors">Warranty</Link></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm">
                © 2024 DentalCamp. All rights reserved.
              </p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <Link href="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Privacy Policy
                </Link>
                <Link href="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Terms of Service
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
