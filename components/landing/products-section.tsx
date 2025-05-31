"use client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, Heart, Star, ShoppingCart, TrendingUp, Award, Zap, Tag } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import dentalequipment from "@/public/images/dental-equipment.jpg";
import Link from "next/link";

interface Product {
  id: string;
  name: string;
  description: string | null;
  slug: string;
  price: number;
  thumbnail: string | null;
  images: string[];
  isFeatured: boolean;
  isActive: boolean;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  category?: {
    id: string;
    name: string;
    slug: string;
  } | null;
  createdAt: string;
  updatedAt: string;
}



function ProductsSection() {
    const [activeCategory, setActiveCategory] = useState("all");
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([
        { id: "all", name: "All Products", icon: <ShoppingCart className="h-4 w-4 mr-2" /> },
        { id: "equipment", name: "Equipment", icon: <Zap className="h-4 w-4 mr-2" /> },
        { id: "diagnostic", name: "Diagnostic", icon: <TrendingUp className="h-4 w-4 mr-2" /> },
        { id: "sterilization", name: "Sterilization", icon: <Award className="h-4 w-4 mr-2" /> },
        { id: "instruments", name: "Instruments", icon: <Tag className="h-4 w-4 mr-2" /> },
        { id: "consumables", name: "Consumables", icon: <ShoppingCart className="h-4 w-4 mr-2" /> }
    ]);
    const sectionRef = useRef<HTMLDivElement>(null);

    // Fetch products from API
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('/api/products/public');
                if (response.ok) {
                    const data = await response.json();
                    const publishedProducts = data.products?.filter((p: Product) =>
                        p.status === 'PUBLISHED' && p.isActive
                    ) || [];

                    if (publishedProducts.length > 0) {
                        setProducts(publishedProducts.slice(0, 6)); // Show only first 6 for landing page

                        // Update categories based on actual product categories
                        const uniqueCategories = Array.from(
                            new Set(publishedProducts.map((p: Product) => p.category?.slug).filter(Boolean))
                        );

                        const dynamicCategories = [
                            { id: "all", name: "All Products", icon: <ShoppingCart className="h-4 w-4 mr-2" /> },
                            ...uniqueCategories.map(slug => {
                                const product = publishedProducts.find((p: Product) => p.category?.slug === slug);
                                return {
                                    id: slug as string,
                                    name: (product?.category?.name || slug) as string,
                                    icon: getCategoryIcon(slug as string)
                                };
                            })
                        ];
                        setCategories(dynamicCategories);
                    } else {
                        // No products found
                        setProducts([]);
                    }
                } else {
                    // API failed
                    setProducts([]);
                }
            } catch (error) {
                console.error('Failed to fetch products:', error);
                // API failed
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    // Helper function to get category icons
    const getCategoryIcon = (slug: string) => {
        switch (slug) {
            case 'equipment': return <Zap className="h-4 w-4 mr-2" />;
            case 'diagnostic': return <TrendingUp className="h-4 w-4 mr-2" />;
            case 'sterilization': return <Award className="h-4 w-4 mr-2" />;
            case 'instruments': return <Tag className="h-4 w-4 mr-2" />;
            case 'consumables': return <ShoppingCart className="h-4 w-4 mr-2" />;
            default: return <ShoppingCart className="h-4 w-4 mr-2" />;
        }
    };

    // Transform products for display
    const displayProducts = products.map(product => ({
        ...product,
        // Add fallback properties for compatibility with existing UI
        rating: 4.5 + Math.random() * 0.5, // Random rating between 4.5-5.0
        isNew: new Date(product.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // New if created in last 30 days
        isBestseller: product.isFeatured,
        image: product.thumbnail || product.images?.[0] || dentalequipment,
        features: product.description?.split('.').slice(0, 3).map(f => f.trim()).filter(Boolean) || ['High quality', 'Professional grade', 'Reliable'],
        categorySlug: product.category?.slug || 'general',
        categoryName: product.category?.name || 'General'
    }));

    const filteredProducts = activeCategory === "all"
        ? displayProducts
        : displayProducts.filter(product => product.categorySlug === activeCategory);

    return (
        <section ref={sectionRef} className="py-24 md:py-32 px-4 sm:px-6 lg:px-8 bg-white relative">
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-blue-50 to-transparent"></div>
                <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-blue-50 to-transparent"></div>
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true, margin: "-100px" }}
                    className="text-center mb-16"
                >
                    <Badge className="mb-4 bg-blue-100 text-blue-600 hover:bg-blue-200 shadow-sm">
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Premium Dental Products
                    </Badge>

                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                        Professional Dental Equipment
                    </h2>

                    <div className="w-24 h-1.5 bg-gradient-to-r from-blue-500 to-blue-600 mx-auto mb-8 rounded-full"></div>

                    <p className="text-xl text-gray-600 max-w-3xl mx-auto font-medium">
                        Discover our selection of high-quality dental equipment and supplies for your practice
                    </p>
                </motion.div>

                {/* Featured product highlight */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    viewport={{ once: true, margin: "-100px" }}
                    className="mb-20 bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl overflow-hidden shadow-xl"
                >
                    <div className="grid grid-cols-1 lg:grid-cols-2">
                        <div className="p-8 md:p-12 text-white">
                            <Badge className="mb-4 bg-white/20 text-white border-white/30">
                                <TrendingUp className="h-4 w-4 mr-2" />
                                Featured Product
                            </Badge>
                            <h3 className="text-3xl font-bold mb-4">Advanced Digital X-Ray System</h3>
                            <p className="text-blue-100 mb-6">
                                State-of-the-art digital imaging with reduced radiation exposure and instant results. Perfect for modern dental practices focused on patient safety and diagnostic precision.
                            </p>
                            <div className="flex flex-wrap gap-4 mb-8">
                                {["Low radiation", "HD imaging", "Cloud storage", "Instant results"].map((feature, idx) => (
                                    <span key={idx} className="bg-white/10 text-white text-sm px-3 py-1 rounded-full">
                                        {feature}
                                    </span>
                                ))}
                            </div>
                            <div className="flex items-center gap-6">
                                <div>
                                    <p className="text-blue-100 text-sm">Starting at</p>
                                    <p className="text-3xl font-bold">$12,499.99</p>
                                </div>
                                <Button
                                    className="bg-white text-blue-600 hover:bg-blue-50 rounded-full shadow-md"
                                    asChild
                                >
                                    <Link href="/catalog">
                                        Learn More
                                        <ChevronRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                            </div>
                        </div>
                        <div className="relative h-64 lg:h-auto">
                            <Image
                                src={dentalequipment}
                                alt="Digital X-Ray System"
                                fill
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/50 to-transparent"></div>
                        </div>
                    </div>
                </motion.div>

                {/* Category filters */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    viewport={{ once: true, margin: "-100px" }}
                    className="flex flex-wrap justify-center gap-3 mb-16"
                >
                    {categories.map((category) => (
                        <Button
                            key={category.id}
                            variant={activeCategory === category.id ? "default" : "outline"}
                            className={`rounded-full px-6 py-2 transition-all ${activeCategory === category.id
                                ? "bg-blue-600 hover:bg-blue-700 shadow-md"
                                : "hover:bg-blue-50 border-blue-200 text-blue-600"
                                }`}
                            onClick={() => setActiveCategory(category.id)}
                        >
                            {category.icon}
                            {category.name}
                        </Button>
                    ))}
                </motion.div>

                {/* Product grid */}
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {Array.from({ length: 6 }).map((_, index) => (
                            <div key={index} className="animate-pulse">
                                <div className="bg-gray-200 aspect-[4/3] rounded-2xl mb-4"></div>
                                <div className="space-y-2">
                                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                    <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredProducts.map((product, index) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true, margin: "-50px" }}
                            whileHover={{ y: -5 }}
                            className="group"
                        >
                            <Card className="h-full overflow-hidden border border-gray-200 hover:border-blue-300 transition-all duration-300 hover:shadow-xl bg-white">
                                <div className="relative aspect-[4/3] overflow-hidden">
                                    <Image
                                        src={product.image}
                                        alt={product.name}
                                        width={400}
                                        height={300}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        priority={index < 3}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                    <div className="absolute bottom-0 left-0 w-full p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                        <p className="text-white text-sm mb-3 line-clamp-2">{product.description}</p>
                                        <Button
                                            className="shadow-md w-full text-xs py-1.5"
                                            size="sm"
                                            variant="default"
                                            asChild
                                        >
                                            <Link href={`/products/${product.slug}`}>
                                                View Details
                                                <ChevronRight className="ml-1 h-3 w-3" />
                                            </Link>
                                        </Button>
                                    </div>

                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="absolute top-4 right-4 bg-white/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 h-9 w-9 rounded-full shadow-sm hover:bg-white"
                                    >
                                        <Heart className="h-4 w-4 text-blue-600" />
                                    </Button>

                                    {/* Badges */}
                                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                                        {product.isNew && (
                                            <Badge className="bg-blue-600 hover:bg-blue-700">
                                                New
                                            </Badge>
                                        )}
                                        {product.isBestseller && (
                                            <Badge className="bg-amber-500 hover:bg-amber-600">
                                                <Star className="h-3 w-3 mr-1 fill-white" />
                                                Bestseller
                                            </Badge>
                                        )}
                                    </div>
                                </div>

                                <div className="p-5">
                                    <div className="flex justify-between items-start gap-3 mb-3">
                                        <div>
                                            <h3 className="font-bold text-lg text-gray-900 mb-1 group-hover:text-blue-600 transition-colors duration-300">
                                                {product.name}
                                            </h3>
                                            <p className="text-sm text-blue-600 font-medium capitalize">
                                                {product.categoryName}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Features */}
                                    <div className="mb-4">
                                        <div className="flex flex-wrap gap-2">
                                            {product.features.map((feature, idx) => (
                                                <span key={idx} className="inline-block text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                                                    {feature}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                                        <div className="font-bold text-lg text-gray-900">
                                            ${product.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                        </div>
                                        <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-lg">
                                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                            <span className="text-sm font-medium text-gray-700">
                                                {product.rating}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <div className="max-w-md mx-auto">
                            <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">No products available</h3>
                            <p className="text-gray-600 mb-6">
                                We're currently updating our product catalog. Please check back soon!
                            </p>
                            <Button asChild>
                                <Link href="/contact">Contact Us</Link>
                            </Button>
                        </div>
                    </div>
                )}

                {/* Call to action */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    viewport={{ once: true, margin: "-100px" }}
                    className="mt-20 text-center"
                >
                    <div className="bg-blue-50 rounded-2xl p-8 md:p-12 max-w-4xl mx-auto shadow-sm border border-blue-100">
                        <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                            Explore Our Complete Product Range
                        </h3>
                        <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                            Browse our full catalog of premium dental equipment, instruments, and supplies. Special pricing available for bulk orders and practice setups.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Button
                                size="lg"
                                className="rounded-full gap-2 bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-800 hover:to-blue-700 shadow-lg hover:shadow-blue-200/50 transition-all"
                                asChild
                            >
                                <Link href="/catalog">
                                    View Full Catalog
                                    <ChevronRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                            <Button
                                variant="outline"
                                size="lg"
                                className="rounded-full gap-2 border-blue-300 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                                asChild
                            >
                                <Link href="/contact">
                                    Request Custom Quote
                                </Link>
                            </Button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

export default ProductsSection;