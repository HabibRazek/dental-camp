"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  Grid3X3,
  List,
  Heart,
  ShoppingCart,
  Tag,
  TrendingUp,
  Award,
  Zap,
  Eye,
  X,
  Sparkles,
  Grid2X2,
  LayoutGrid,
  Filter,
  SlidersHorizontal,
  Target,
  Package
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import Header from "@/components/landing/header";
import Footer from "@/components/landing/footer";
import { formatCurrency } from "@/lib/utils";
import { SectionLoader } from "@/components/ui/loader";
import { useCart } from "@/contexts/CartContext";

// Types
interface Product {
  id: string;
  name: string;
  price: number;
  comparePrice?: number;
  thumbnail: string;
  images?: string[];
  description?: string;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  stockQuantity: number;
  status: string;
  slug: string;
  featured?: boolean;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  _count: {
    products: number;
  };
}

// Enhanced Product Card Component
const InnovativeProductCard = ({ product }: { product: Product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const { addItem } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.thumbnail || "/images/dental-equipment.jpg",
      slug: product.slug,
      stockQuantity: product.stockQuantity
    };

    addItem(cartItem);
    // Don't show toast here - CartContext will handle it
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -12 }}
      transition={{ duration: 0.4, type: "spring", stiffness: 300 }}
      className="group relative"

    >
      <Card className="h-[380px] sm:h-[420px] lg:h-[460px] overflow-hidden border border-gray-200 hover:border-blue-300 transition-all duration-300 hover:shadow-lg bg-white rounded-xl flex flex-col">
        {/* Image Container with Floating Elements */}
        <div className="relative aspect-[4/3] bg-gradient-to-br from-blue-50 to-gray-100 p-2 sm:p-3 flex items-center justify-center">
          {/* Floating Badges */}
          <AnimatePresence>
            {product.featured && (
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 180 }}
                className="absolute top-2 left-2 z-10"
              >
                <Badge className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 shadow-lg px-2 py-1 rounded-full text-xs">
                  <Award className="w-3 h-3 mr-1" />
                  Featured
                </Badge>
              </motion.div>
            )}

            {product.comparePrice && (
              <motion.div
                initial={{ scale: 0, x: 50 }}
                animate={{ scale: 1, x: 0 }}
                className="absolute top-2 right-2 z-10"
              >
                <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 shadow-lg px-2 py-1 rounded-full text-xs">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Sale
                </Badge>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Product Image */}
          <div className="relative w-full h-full">
            <Image
              src={product.thumbnail || "/images/dental-equipment.jpg"}
              alt={product.name}
              fill
              className={`object-contain transition-all duration-700 ${isHovered ? "scale-105" : "scale-100"
                } ${imageLoaded ? "opacity-100" : "opacity-0"}`}
              onLoad={() => setImageLoaded(true)}
            />


          </div>

          {/* Floating Action Buttons - Positioned to not block image */}
          <div className="absolute bottom-2 right-2 flex items-center gap-1.5 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300">
            {/* Heart icon hidden on mobile, visible on desktop */}
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400 }}
              className="hidden sm:block"
            >
              <Button
                size="sm"
                variant="secondary"
                className="rounded-full bg-white/95 backdrop-blur-sm hover:bg-white shadow-lg border-0 h-8 w-8 p-0 flex items-center justify-center"
                onClick={() => {
                  setIsWishlisted(!isWishlisted);
                  toast.success(isWishlisted ? "Removed from wishlist" : "Added to wishlist");
                }}
              >
                <Heart className={`w-3 h-3 ${isWishlisted ? "fill-red-500 text-red-500" : "text-gray-600"}`} />
              </Button>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <Button
                size="sm"
                variant="secondary"
                className="rounded-full bg-white/95 backdrop-blur-sm hover:bg-white shadow-lg border-0 h-7 w-7 sm:h-8 sm:w-8 p-0 flex items-center justify-center"
                asChild
              >
                <Link href={`/products/${product.slug}`}>
                  <Eye className="w-3 h-3 text-gray-600" />
                </Link>
              </Button>
            </motion.div>
          </div>

          {/* Stock Indicator */}
          <div className="absolute bottom-2 left-2">
            <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm ${product.stockQuantity > 0
                ? "bg-green-100/90 text-green-700"
                : "bg-red-100/90 text-red-700"
              }`}>
              <div className={`w-2 h-2 rounded-full ${product.stockQuantity > 0 ? "bg-green-500" : "bg-red-500"
                }`} />
              {product.stockQuantity > 0 ? "In Stock" : "Out of Stock"}
            </div>
          </div>
        </div>

        {/* Content */}
        <CardContent className="p-3 sm:p-4 flex flex-col flex-grow">
          {/* Category */}
          {product.category && (
            <span className="text-xs sm:text-sm text-blue-600 font-medium mb-2">{product.category.name}</span>
          )}

          {/* Title */}
          <h3 className="font-semibold text-sm sm:text-base text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors leading-tight mb-3">
            {product.name}
          </h3>

          {/* Price */}
          <div className="mb-4 flex-grow">
            <div className="flex items-baseline gap-2">
              <span className="text-lg sm:text-xl font-bold text-gray-900">
                {formatCurrency(product.price)}
              </span>
              {product.comparePrice && (
                <span className="text-sm text-gray-500 line-through">
                  {formatCurrency(product.comparePrice)}
                </span>
              )}
            </div>
            {product.comparePrice && (
              <p className="text-green-600 font-medium text-sm mt-1">
                Save {formatCurrency(product.comparePrice - product.price)}
              </p>
            )}
          </div>

          {/* Quick Add Button - Compact like home page */}
          <Button
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium py-1.5 sm:py-2 px-2 sm:px-3 rounded-lg transition-all duration-300 text-xs sm:text-sm mt-auto min-h-[32px] sm:min-h-[36px] shadow-sm hover:shadow-md"
            disabled={product.stockQuantity === 0}
            onClick={handleAddToCart}
          >
            <ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 flex-shrink-0" />
            <span className="font-medium">
              {product.stockQuantity === 0 ? "Rupture de stock" : "Ajouter au panier"}
            </span>
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default function CatalogPage() {
  // Cart functionality
  const { addItem } = useCart();

  // State management
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterLoading, setFilterLoading] = useState(false);
  const [paginationLoading, setPaginationLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000]);
  const [gridCols, setGridCols] = useState(3);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [featuredOnly, setFeaturedOnly] = useState(false);

  // Fetch products function
  const fetchProducts = useCallback(async (isFilterChange = false, isPaginationChange = false) => {
    if (isPaginationChange) {
      setPaginationLoading(true);
    } else if (isFilterChange) {
      setFilterLoading(true);
    } else {
      setLoading(true);
    }

    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "12",
        search: searchQuery,
        category: selectedCategory,
        sortBy,
        sortOrder,
        minPrice: priceRange[0].toString(),
        maxPrice: priceRange[1].toString(),
        inStock: inStockOnly.toString(),
        featured: featuredOnly.toString(),
      });

      const response = await fetch(`/api/products/public?${params}`);
      const data = await response.json();

      if (data.success) {
        setProducts(data.products);
        setTotalPages(data.pagination.totalPages);
      }
    } catch {
      toast.error("Échec du chargement des produits");
    } finally {
      setLoading(false);
      setFilterLoading(false);
      setPaginationLoading(false);
    }
  }, [currentPage, searchQuery, selectedCategory, sortBy, sortOrder, priceRange, inStockOnly, featuredOnly]);

  // Immediate filter loading + debounced fetch
  useEffect(() => {
    // Show loading immediately
    setFilterLoading(true);

    const timeoutId = setTimeout(() => {
      fetchProducts(true); // Mark as filter change
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [searchQuery, selectedCategory, sortBy, sortOrder, priceRange, inStockOnly, featuredOnly]);

  // Initial data fetch
  useEffect(() => {
    setPageLoading(true);
    fetchProducts();
    fetchCategories();
    // Simulate minimum loading time for better UX
    setTimeout(() => setPageLoading(false), 800);
  }, []); // Initial load only

  // Page change effect
  useEffect(() => {
    if (currentPage > 1) { // Don't trigger on initial load
      fetchProducts(false, true); // Mark as pagination change
    }
  }, [currentPage]);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories?includeProducts=false");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data.categories) {
        setCategories(data.categories);
      }
    } catch {
      toast.error("Failed to fetch categories");
    }
  };

  const getGridColumns = () => {
    switch (gridCols) {
      case 2: return "grid-cols-2 sm:grid-cols-2";
      case 3: return "grid-cols-2 sm:grid-cols-2 lg:grid-cols-3";
      case 4: return "grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";
      default: return "grid-cols-2 sm:grid-cols-2 lg:grid-cols-3";
    }
  };

  return (
    <>
      {/* Page Loading Overlay */}
      {pageLoading && (
        <div className="fixed inset-0 bg-white/95 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="text-center">
            <SectionLoader size="lg" />
            <p className="mt-4 text-lg font-medium text-gray-700">Loading products...</p>
            <p className="text-sm text-gray-500">Please wait while we fetch the latest products</p>
          </div>
        </div>
      )}

      <Header />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 pt-24">
        {/* Hero Section with Search */}
        <motion.section
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative py-20 px-4 overflow-hidden"
        >
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              animate={{
                rotate: [0, 360],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-blue-600/20 rounded-full blur-3xl"
            />
            <motion.div
              animate={{
                rotate: [360, 0],
                scale: [1.2, 1, 1.2],
              }}
              transition={{
                duration: 25,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-blue-400/20 to-blue-600/20 rounded-full blur-3xl"
            />
          </div>

          <div className="relative max-w-7xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-6"
            >
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-blue-600 bg-clip-text text-transparent">
                Équipements Dentaires Professionnels
              </h1>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Découvrez notre collection complète d'équipements et fournitures dentaires de haute qualité
              </p>
            </motion.div>

            {/* Enhanced Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-12 max-w-2xl mx-auto"
            >
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-300" />
                <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-200/50 backdrop-blur-sm">
                  <div className="flex items-center p-2">
                    <div className="flex-1 flex items-center">
                      <Search className="w-6 h-6 text-gray-400 ml-4" />
                      <Input
                        placeholder="Search for dental equipment, tools, or supplies..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="border-0 bg-transparent text-lg placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0"
                      />
                    </div>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        size="lg"
                        className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0 rounded-xl px-8"
                      >
                        Search
                      </Button>
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            {/* Innovative Sidebar Filters */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className={`${showFilters ? 'block' : 'hidden'} lg:block w-full lg:w-80 space-y-6`}
            >
              <div className="lg:sticky lg:top-8 space-y-6">
                {/* Filter Header */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200/50 p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                      <SlidersHorizontal className="w-5 h-5 text-blue-600" />
                      Smart Filters
                    </h2>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedCategory("all");
                        setPriceRange([0, 50000]);
                        setInStockOnly(false);
                        setFeaturedOnly(false);
                        setSearchQuery("");
                      }}
                      className="text-blue-500 hover:text-blue-600"
                    >
                      Clear All
                    </Button>
                  </div>

                  {/* Categories */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                      <Tag className="w-4 h-4 text-blue-500" />
                      Categories
                    </h3>
                    <div className="space-y-2">
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          variant={selectedCategory === "all" ? "default" : "ghost"}
                          className={`w-full justify-start ${selectedCategory === "all"
                              ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                              : "hover:bg-blue-50"
                            }`}
                          onClick={() => setSelectedCategory("all")}
                        >
                          All Products
                          <Badge variant="secondary" className="ml-auto">
                            {products.length}
                          </Badge>
                        </Button>
                      </motion.div>
                      {categories.map((category) => (
                        <motion.div
                          key={category.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Button
                            variant={selectedCategory === category.slug ? "default" : "ghost"}
                            className={`w-full justify-start ${selectedCategory === category.slug
                                ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                                : "hover:bg-blue-50"
                              }`}
                            onClick={() => setSelectedCategory(category.slug)}
                          >
                            {category.name}
                            <Badge variant="secondary" className="ml-auto">
                              {category._count.products}
                            </Badge>
                          </Button>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Price Range */}
                  <div className="space-y-4 pt-6 border-t border-gray-200">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                      <Target className="w-4 h-4 text-blue-500" />
                      Price Range
                    </h3>
                    <div className="space-y-4">
                      <Slider
                        value={priceRange}
                        onValueChange={(value) => {
                          setPriceRange(value as [number, number]);
                          setFilterLoading(true);
                        }}
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
                        <span>{priceRange[0] || 0} TND</span>
                        <span>{priceRange[1] || 50000} TND</span>
                      </div>
                    </div>
                  </div>

                  {/* Quick Filters */}
                  <div className="space-y-4 pt-6 border-t border-gray-200">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                      <Zap className="w-4 h-4 text-blue-500" />
                      Quick Filters
                    </h3>
                    <div className="space-y-1">
                      <motion.label
                        className="flex items-center cursor-pointer group py-1 px-1 rounded-md hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 transition-all duration-200"
                        whileHover={{ scale: 1.01, x: 2 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        <Checkbox
                          checked={inStockOnly}
                          onCheckedChange={(checked) => {
                            setInStockOnly(checked === true);
                            setFilterLoading(true);
                          }}
                          className="mr-2 flex-shrink-0"
                        />
                        <div className="flex items-center gap-1 min-w-0">
                          <Package className="w-2 h-2 text-green-600 flex-shrink-0" />
                          <span className="text-xs font-semibold text-gray-700 group-hover:text-green-700 transition-colors">In Stock Only</span>
                        </div>
                      </motion.label>

                      <motion.label
                        className="flex items-center cursor-pointer group py-1 px-1 rounded-md hover:bg-gradient-to-r hover:from-yellow-50 hover:to-amber-50 transition-all duration-200"
                        whileHover={{ scale: 1.01, x: 2 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        <Checkbox
                          checked={featuredOnly}
                          onCheckedChange={(checked) => {
                            setFeaturedOnly(checked === true);
                            setFilterLoading(true);
                          }}
                          className="mr-2 flex-shrink-0"
                        />
                        <div className="flex items-center gap-1 min-w-0">
                          <Award className="w-2 h-2 text-yellow-600 flex-shrink-0" />
                          <span className="text-xs font-semibold text-gray-700 group-hover:text-yellow-700 transition-colors">Featured Products</span>
                        </div>
                      </motion.label>
                    </div>
                  </div>

                </div>
              </div>
            </motion.div>

            {/* Products Section */}
            <div className="flex-1">
              {/* Top Controls */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-white rounded-2xl shadow-lg border border-gray-200/50 p-4 sm:p-6 mb-6 lg:mb-8"
              >
                <div className="flex flex-col sm:flex-row lg:flex-row gap-4 items-start sm:items-center justify-between">
                  {/* Results Info */}
                  <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-blue-500" />
                      {products.length} Product{products.length !== 1 ? 's' : ''} Found
                    </h2>
                    {searchQuery && (
                      <Badge className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 border-0">
                        &ldquo;{searchQuery}&rdquo;
                      </Badge>
                    )}
                    {selectedCategory !== "all" && (
                      <Badge className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border-0">
                        {categories.find(c => c.slug === selectedCategory)?.name}
                      </Badge>
                    )}
                  </div>

                  {/* Controls */}
                  <div className="flex gap-2 sm:gap-3 flex-wrap w-full sm:w-auto justify-start sm:justify-end">
                    {/* Mobile Filter Toggle */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowFilters(!showFilters)}
                      className="lg:hidden"
                    >
                      <Filter className="w-4 h-4 mr-2" />
                      Filters
                    </Button>

                    {/* Sort */}
                    <Select value={`${sortBy}-${sortOrder}`} onValueChange={(value) => {
                      const [field, order] = value.split('-');
                      setSortBy(field);
                      setSortOrder(order);
                    }}>
                      <SelectTrigger className="w-full sm:w-48">
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
                    <div className="hidden sm:flex border border-gray-200 rounded-lg overflow-hidden">
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
              <div className="relative">
                {/* Filter Loading Overlay */}
                {filterLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.1 }}
                    className="absolute inset-0 bg-white/95 backdrop-blur-md z-50 flex items-center justify-center rounded-2xl border border-gray-200"
                    style={{ minHeight: '400px' }}
                  >
                    <div className="text-center">
                      <SectionLoader size="lg" />
                      <p className="mt-4 text-sm font-medium text-gray-700">Updating filters...</p>
                    </div>
                  </motion.div>
                )}

                {/* Pagination Loading Overlay */}
                {paginationLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.1 }}
                    className="absolute inset-0 bg-white/95 backdrop-blur-md z-50 flex items-center justify-center rounded-2xl border border-gray-200"
                    style={{ minHeight: '400px' }}
                  >
                    <div className="text-center">
                      <SectionLoader size="lg" />
                      <p className="mt-4 text-sm font-medium text-gray-700">Loading page...</p>
                    </div>
                  </motion.div>
                )}

                {loading ? (
                  <SectionLoader size="lg" />
                ) : products.length > 0 ? (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${viewMode}-${gridCols}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4 }}
                    className={`grid gap-4 sm:gap-5 lg:gap-6 xl:gap-8 ${viewMode === "list"
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
                        <InnovativeProductCard product={product} />
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
                      className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center"
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
                          setCurrentPage(1);
                        }}
                        className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                      >
                        <X className="mr-2 h-4 w-4" />
                        Clear All Filters
                      </Button>
                    </motion.div>
                  </div>
                </motion.div>
              )}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="flex justify-center mt-12"
                >
                  <div className="flex items-center gap-1 sm:gap-2 justify-center overflow-x-auto pb-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setPaginationLoading(true);
                        setCurrentPage(currentPage - 1);
                      }}
                      disabled={currentPage === 1 || paginationLoading}
                      className="hover:bg-blue-50 flex-shrink-0 text-xs sm:text-sm px-2 sm:px-4"
                    >
                      <span className="hidden sm:inline">Previous</span>
                      <span className="sm:hidden">Prev</span>
                    </Button>

                    {(() => {
                      const maxVisiblePages = 5;
                      let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
                      let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

                      // Adjust startPage if we're near the end
                      if (endPage - startPage + 1 < maxVisiblePages) {
                        startPage = Math.max(1, endPage - maxVisiblePages + 1);
                      }

                      const pages = [];
                      for (let i = startPage; i <= endPage; i++) {
                        pages.push(
                          <Button
                            key={i}
                            variant={currentPage === i ? "default" : "outline"}
                            onClick={() => {
                              if (i !== currentPage) {
                                setPaginationLoading(true);
                                setCurrentPage(i);
                              }
                            }}
                            disabled={paginationLoading}
                            className={`flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 p-0 text-xs sm:text-sm ${
                              currentPage === i ? "bg-gradient-to-r from-blue-500 to-blue-600" : "hover:bg-blue-50"
                            }`}
                          >
                            {i}
                          </Button>
                        );
                      }
                      return pages;
                    })()}

                    <Button
                      variant="outline"
                      onClick={() => {
                        setPaginationLoading(true);
                        setCurrentPage(currentPage + 1);
                      }}
                      disabled={currentPage === totalPages || paginationLoading}
                      className="hover:bg-blue-50 flex-shrink-0 text-xs sm:text-sm px-2 sm:px-4"
                    >
                      <span className="hidden sm:inline">Next</span>
                      <span className="sm:hidden">Next</span>
                    </Button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>


      </div>

      {/* Mobile Bottom Padding to prevent content from being hidden */}
      <div className="h-4 sm:hidden"></div>

      <Footer />
    </>
  );
}
