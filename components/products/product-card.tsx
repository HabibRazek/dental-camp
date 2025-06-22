"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { 
  Star, 
  Heart, 
  ShoppingCart, 
  Eye,
  Tag,
  TrendingUp,
  Award,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/utils";
import { AddToCartButton } from "@/components/cart/AddToCartButton";

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

interface ProductCardProps {
  product: Product;
  variant?: "default" | "compact" | "featured";
  showQuickActions?: boolean;
  className?: string;
}

export function ProductCard({ 
  product, 
  variant = "default", 
  showQuickActions = true,
  className = "" 
}: ProductCardProps) {
  const discount = product.comparePrice 
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100) 
    : 0;
  const isInStock = product.stockQuantity > 0;
  const isLowStock = product.stockQuantity <= 10 && product.stockQuantity > 0;
  const rating = 4.5 + Math.random() * 0.5; // Mock rating

  const getCategoryIcon = (slug: string) => {
    switch (slug) {
      case 'equipment': return <Zap className="h-4 w-4" />;
      case 'diagnostic': return <TrendingUp className="h-4 w-4" />;
      case 'sterilization': return <Award className="h-4 w-4" />;
      case 'instruments': return <Tag className="h-4 w-4" />;
      default: return <ShoppingCart className="h-4 w-4" />;
    }
  };

  const handleAddToWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toast.success("Added to wishlist");
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // TODO: Implement quick view modal
    toast.info("Quick view coming soon!");
  };

  // Removed unused handleAddToCart function - AddToCartButton handles this

  if (variant === "compact") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`group ${className}`}
      >
        <Link href={`/products/${product.slug}`}>
          <Card className="overflow-hidden border border-gray-200 hover:border-blue-300 transition-all duration-300 hover:shadow-lg">
            <div className="flex">
              <div className="relative w-24 h-24 flex-shrink-0">
                <Image
                  src={product.thumbnail || product.images?.[0] || "/images/dental-equipment.jpg"}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
              <CardContent className="flex-1 p-4">
                <div className="space-y-1">
                  <h3 className="font-semibold text-sm text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
                    {product.name}
                  </h3>
                  {product.category && (
                    <p className="text-xs text-blue-600 font-medium">
                      {product.category.name}
                    </p>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-900">
                      ${product.price.toLocaleString()}
                    </span>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs text-gray-600">
                        {rating.toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </div>
          </Card>
        </Link>
      </motion.div>
    );
  }

  if (variant === "featured") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        whileHover={{ y: -8 }}
        className={`group ${className}`}
      >
        <Card className="h-full overflow-hidden border-2 border-blue-200 hover:border-blue-400 transition-all duration-300 hover:shadow-2xl bg-gradient-to-br from-white to-blue-50">
          <div className="relative aspect-[4/3] overflow-hidden">
            <Image
              src={product.thumbnail || product.images?.[0] || "/images/dental-equipment.jpg"}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            
            {/* Featured Badge */}
            <Badge className="absolute top-4 left-4 bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg">
              <Star className="h-3 w-3 mr-1 fill-white" />
              Featured
            </Badge>

            {/* Discount Badge */}
            {discount > 0 && (
              <Badge className="absolute top-4 right-4 bg-gradient-to-r from-red-500 to-red-600 shadow-lg">
                -{discount}%
              </Badge>
            )}

            {/* Overlay with Actions */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute bottom-4 left-4 right-4 space-y-2">
                <Button
                  className="w-full shadow-lg bg-white text-gray-900 hover:bg-gray-100"
                  size="sm"
                  asChild
                >
                  <Link href={`/products/${product.slug}`}>
                    <Eye className="mr-2 h-4 w-4" />
                    View Details
                  </Link>
                </Button>
                {showQuickActions && (
                  <div className="flex gap-2">
                    <AddToCartButton
                      product={{
                        id: product.id,
                        name: product.name,
                        price: product.price.toString(),
                        thumbnail: product.thumbnail,
                        images: product.images,
                        slug: product.slug,
                        stockQuantity: product.stockQuantity
                      }}
                      variant="icon"
                      size="sm"
                      className="flex-1 shadow-lg"
                    />
                    <Button
                      variant="secondary"
                      size="sm"
                      className="shadow-lg"
                      onClick={handleAddToWishlist}
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <CardContent className="p-6">
            <div className="space-y-4">
              {/* Category */}
              {product.category && (
                <div className="flex items-center gap-2 text-sm text-blue-600">
                  {getCategoryIcon(product.category.slug)}
                  <span className="font-medium">{product.category.name}</span>
                </div>
              )}

              {/* Title */}
              <h3 className="font-bold text-xl text-gray-900 group-hover:text-blue-600 transition-colors duration-300 line-clamp-2">
                {product.name}
              </h3>

              {/* Description */}
              {product.description && (
                <p className="text-gray-600 line-clamp-3 text-sm leading-relaxed">
                  {product.description}
                </p>
              )}

              {/* Price & Rating */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="space-y-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-gray-900">
                      {formatCurrency(product.price)}
                    </span>
                    {product.comparePrice && (
                      <span className="text-sm text-gray-500 line-through">
                        {formatCurrency(product.comparePrice)}
                      </span>
                    )}
                  </div>
                  {discount > 0 && (
                    <p className="text-sm text-green-600 font-medium">
                      Save {formatCurrency(product.comparePrice! - product.price)}
                    </p>
                  )}
                </div>
                
                <div className="flex items-center gap-1 bg-yellow-50 px-3 py-2 rounded-lg border border-yellow-200">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold text-gray-900">
                    {rating.toFixed(1)}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  // Default variant
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
      className={`group ${className}`}
    >
      <Card className="h-[380px] sm:h-[420px] lg:h-[460px] overflow-hidden border border-gray-200 hover:border-blue-300 transition-all duration-300 hover:shadow-xl bg-white">
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={product.thumbnail || product.images?.[0] || "/images/dental-equipment.jpg"}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Quick Action Icons - Top right corner, small and unobtrusive */}
          {showQuickActions && (
            <div className="absolute top-2 right-2 flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300">
              {/* Heart icon hidden on mobile, visible on desktop */}
              <Button
                variant="secondary"
                size="sm"
                className="hidden sm:flex rounded-full bg-white/90 backdrop-blur-sm hover:bg-white shadow-md border-0 h-7 w-7 p-0 items-center justify-center"
                onClick={handleAddToWishlist}
              >
                <Heart className="h-3 w-3 text-gray-600" />
              </Button>
              <Button
                variant="secondary"
                size="sm"
                className="rounded-full bg-white/90 backdrop-blur-sm hover:bg-white shadow-md border-0 h-6 w-6 sm:h-7 sm:w-7 p-0 flex items-center justify-center"
                asChild
              >
                <Link href={`/products/${product.slug}`}>
                  <Eye className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-gray-600" />
                </Link>
              </Button>
            </div>
          )}

          {/* Main Action Button - Bottom overlay */}
          {showQuickActions && (
            <div className="absolute bottom-3 left-3 right-3 transform translate-y-0 sm:translate-y-full sm:group-hover:translate-y-0 transition-transform duration-300">
              <Button
                className="w-full shadow-md bg-white/95 backdrop-blur-sm hover:bg-white text-gray-900 text-xs sm:text-sm flex items-center justify-center py-2"
                size="sm"
                asChild
              >
                <Link href={`/products/${product.slug}`}>
                  <Eye className="mr-1.5 h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">View Details</span>
                  <span className="sm:hidden">Voir</span>
                </Link>
              </Button>
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {product.isFeatured && (
              <Badge className="bg-blue-600 hover:bg-blue-700">
                <Star className="h-3 w-3 mr-1 fill-white" />
                Featured
              </Badge>
            )}
            {discount > 0 && (
              <Badge className="bg-red-500 hover:bg-red-600">
                -{discount}%
              </Badge>
            )}
            {!isInStock && (
              <Badge variant="destructive">
                Out of Stock
              </Badge>
            )}
            {isLowStock && (
              <Badge className="bg-orange-500 hover:bg-orange-600">
                Low Stock
              </Badge>
            )}
          </div>
        </div>

        <CardContent className="p-3 sm:p-4 lg:p-5">
          <div className="space-y-2 sm:space-y-3">
            {/* Category */}
            {product.category && (
              <div className="flex items-center gap-1 text-xs sm:text-sm text-blue-600">
                {getCategoryIcon(product.category.slug)}
                <span className="font-medium">{product.category.name}</span>
              </div>
            )}

            {/* Title */}
            <h3 className="font-bold text-sm sm:text-base lg:text-lg text-gray-900 group-hover:text-blue-600 transition-colors duration-300 line-clamp-2">
              {product.name}
            </h3>

            {/* Description - Hidden on mobile */}
            {product.description && (
              <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 hidden sm:block">
                {product.description}
              </p>
            )}

            {/* Price */}
            <div className="flex items-center justify-between pt-1 sm:pt-2 border-t border-gray-100">
              <div className="space-y-1">
                <div className="flex items-baseline gap-1 sm:gap-2">
                  <span className="text-sm sm:text-lg lg:text-xl font-bold text-gray-900">
                    {formatCurrency(product.price)}
                  </span>
                  {product.comparePrice && (
                    <span className="text-xs sm:text-sm text-gray-500 line-through">
                      {formatCurrency(product.comparePrice)}
                    </span>
                  )}
                </div>
                {discount > 0 && (
                  <p className="text-xs text-green-600 font-medium hidden sm:block">
                    Save {formatCurrency(product.comparePrice! - product.price)}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-1 bg-gray-50 px-1.5 sm:px-2 py-1 rounded-lg">
                <Star className="h-3 w-3 sm:h-4 sm:w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-xs sm:text-sm font-medium text-gray-700">
                  {rating.toFixed(1)}
                </span>
              </div>
            </div>

            {/* Add to Cart Button */}
            <div className="pt-2 sm:pt-3">
              <AddToCartButton
                product={{
                  id: product.id,
                  name: product.name,
                  price: product.price.toString(),
                  thumbnail: product.thumbnail,
                  images: product.images,
                  slug: product.slug,
                  stockQuantity: product.stockQuantity
                }}
                variant="compact"
                size="sm"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
