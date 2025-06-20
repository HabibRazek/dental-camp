"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  Star, 
  Heart, 
  Share2, 
  ShoppingCart, 
  Package, 
  Truck, 
  Shield, 
  CheckCircle,
  Info,
  Tag,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Header from "@/components/landing/header";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/utils";
import { PageLoader } from "@/components/ui/loader";
import { useCart } from "@/contexts/CartContext";

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
  tags: string[];
  weight: number | null;
  dimensions: any;
  isFeatured: boolean;
  category?: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
  } | null;
  createdAt: string;
  updatedAt: string;
}

export default function ProductPage() {
  const params = useParams();
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;
  const { addItem } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/slug/${slug}`);
        if (response.ok) {
          const data = await response.json();
          setProduct(data.product);
          setRelatedProducts(data.relatedProducts || []);
        } else {
          toast.error("Product not found");
        }
      } catch (error) {
        console.error("Failed to fetch product:", error);
        toast.error("Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchProduct();
    }
  }, [slug]);

  const handleAddToCart = () => {
    if (!product) return;

    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.thumbnail || product.images?.[0] || "/images/dental-equipment.jpg",
      slug: product.slug,
      stockQuantity: product.stockQuantity
    };

    // Add the item with the specified quantity in a single call
    addItem(cartItem, quantity);

    // Don't show toast here - CartContext will handle it
  };

  const handleAddToWishlist = () => {
    toast.success("Ajouté à la liste de souhaits");
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product?.name,
        text: product?.description || "",
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Lien copié dans le presse-papiers");
    }
  };

  if (loading) {
    return <PageLoader />;
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Produit non trouvé</h1>
          <Link href="/catalog">
            <Button>Parcourir les produits</Button>
          </Link>
        </div>
      </div>
    );
  }

  const images = product.images.length > 0 ? product.images : [product.thumbnail].filter(Boolean);
  const currentImage = images[selectedImageIndex] || "/images/dental-equipment.jpg";
  const isInStock = product.stockQuantity > 0;
  const isLowStock = product.stockQuantity <= 10 && product.stockQuantity > 0;
  const discount = product.comparePrice ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      <Header />

      {/* Breadcrumb */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 pt-20 sm:pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/catalog">
            <Button variant="ghost" className="hover:bg-blue-50 text-blue-600">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Catalog
            </Button>
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 pb-24 lg:pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Images */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative aspect-square rounded-xl lg:rounded-2xl overflow-hidden bg-white border border-gray-200">
                <Image
                  src={currentImage}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />
                {product.isFeatured && (
                  <Badge className="absolute top-2 sm:top-4 left-2 sm:left-4 bg-blue-600 text-xs sm:text-sm">
                    <Star className="h-3 w-3 mr-1 fill-white" />
                    Featured
                  </Badge>
                )}
                {discount > 0 && (
                  <Badge className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-red-500 text-xs sm:text-sm">
                    -{discount}%
                  </Badge>
                )}
              </div>

              {/* Thumbnail Images */}
              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImageIndex === index
                          ? "border-blue-600 ring-2 ring-blue-200"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <Image
                        src={image || "/images/dental-equipment.jpg"}
                        alt={`${product.name} ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          {/* Product Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-4 lg:space-y-6"
          >
            {/* Category & Title */}
            <div>
              {product.category && (
                <Link href={`/categories/${product.category.slug}`}>
                  <Badge variant="outline" className="mb-3 hover:bg-blue-50">
                    {product.category.name}
                  </Badge>
                </Link>
              )}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>
              
              {/* Stock Status */}
              <div className="flex items-center gap-2 mb-4">
                {isInStock ? (
                  <>
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-green-600 font-medium">
                      {isLowStock ? `Only ${product.stockQuantity} left in stock` : "In Stock"}
                    </span>
                  </>
                ) : (
                  <>
                    <Package className="h-5 w-5 text-red-600" />
                    <span className="text-red-600 font-medium">Out of Stock</span>
                  </>
                )}
              </div>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-3">
                <span className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {formatCurrency(product.price)}
                </span>
                {product.comparePrice && (
                  <span className="text-lg sm:text-xl text-gray-500 line-through">
                    {formatCurrency(product.comparePrice)}
                  </span>
                )}
              </div>
              {discount > 0 && (
                <p className="text-green-600 font-medium">
                  Vous économisez {formatCurrency(product.comparePrice! - product.price)} ({discount}% de réduction)
                </p>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-600 leading-relaxed">{product.description}</p>
              </div>
            )}

            {/* Tags */}
            {product.tags.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Features</h3>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="bg-blue-50 text-blue-700">
                      <Tag className="h-3 w-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity & Actions */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <label className="text-sm font-medium text-gray-700">Quantity:</label>
                <div className="flex items-center border border-gray-300 rounded-lg w-fit">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 hover:bg-gray-50 transition-colors min-h-[44px] min-w-[44px]"
                    disabled={!isInStock}
                  >
                    -
                  </button>
                  <span className="px-4 py-2 border-x border-gray-300 min-w-[60px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 hover:bg-gray-50 transition-colors min-h-[44px] min-w-[44px]"
                    disabled={!isInStock}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Mobile-First Button Layout */}
              <div className="space-y-3">
                {/* Primary Add to Cart Button - Compact like home page */}
                <Button
                  onClick={handleAddToCart}
                  disabled={!isInStock}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium py-1.5 sm:py-2 rounded-lg transition-all duration-300 shadow-sm hover:shadow-md min-h-[32px] sm:min-h-[36px]"
                >
                  <ShoppingCart className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="text-xs sm:text-sm">
                    {isInStock ? "Ajouter au panier" : "Rupture de stock"}
                  </span>
                </Button>

                {/* Secondary Actions - Side by side on mobile */}
                <div className="flex gap-3">
                  <Button
                    onClick={handleAddToWishlist}
                    variant="outline"
                    size="lg"
                    className="flex-1 border-gray-300 hover:bg-gray-50"
                  >
                    <Heart className="h-5 w-5 mr-2 sm:mr-0" />
                    <span className="sm:hidden">Favoris</span>
                  </Button>
                  <Button
                    onClick={handleShare}
                    variant="outline"
                    size="lg"
                    className="flex-1 border-gray-300 hover:bg-gray-50"
                  >
                    <Share2 className="h-5 w-5 mr-2 sm:mr-0" />
                    <span className="sm:hidden">Partager</span>
                  </Button>
                </div>
              </div>
            </div>

            {/* Product Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
              <Card className="text-center p-4">
                <Truck className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">Livraison gratuite</p>
                <p className="text-xs text-gray-600">Pour les commandes de plus de 500€</p>
              </Card>
              <Card className="text-center p-4">
                <Shield className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">Garantie</p>
                <p className="text-xs text-gray-600">Couverture de 2 ans</p>
              </Card>
              <Card className="text-center p-4">
                <Zap className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">Livraison rapide</p>
                <p className="text-xs text-gray-600">2-3 jours ouvrables</p>
              </Card>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Mobile Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg lg:hidden z-50">
        <div className="flex gap-3 max-w-md mx-auto">
          <div className="flex items-center border border-gray-300 rounded-lg">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="px-3 py-2 hover:bg-gray-50 transition-colors min-h-[44px] min-w-[44px]"
              disabled={!isInStock}
            >
              -
            </button>
            <span className="px-3 py-2 border-x border-gray-300 min-w-[50px] text-center text-sm">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="px-3 py-2 hover:bg-gray-50 transition-colors min-h-[44px] min-w-[44px]"
              disabled={!isInStock}
            >
              +
            </button>
          </div>
          <Button
            onClick={handleAddToCart}
            disabled={!isInStock}
            className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium shadow-sm hover:shadow-md min-h-[36px] py-2 rounded-lg transition-all duration-300"
          >
            <ShoppingCart className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
            <span className="truncate text-xs sm:text-sm">
              {isInStock ? "Ajouter au panier" : "Rupture de stock"}
            </span>
          </Button>
        </div>
      </div>

      {/* Add bottom padding to prevent content from being hidden behind sticky bar on mobile */}
      <div className="h-20 lg:hidden"></div>
    </div>
  );
}
