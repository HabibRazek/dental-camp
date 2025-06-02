"use client";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
    Star,
    ShoppingCart,
    Eye,
    Heart,
    ArrowRight,
    CheckCircle,
    Loader2,
    Package,
    ShieldCheck,
    Truck
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
// import dentalequipment from "@/public/images/dental-equipment.jpg";
import { useState, useEffect } from "react";

interface Product {
    id: string;
    name: string;
    description: string | null;
    price: string;
    comparePrice: string | null;
    thumbnail: string | null;
    images: string[];
    isFeatured: boolean;
    status: string;
    category?: {
        id: string;
        name: string;
        slug: string;
    };
}

function FeaturedProductsSection() {
    const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchFeaturedProducts();
    }, []);

    const fetchFeaturedProducts = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch('/api/products/public?featured=true&limit=4');

            if (!response.ok) {
                throw new Error('Failed to fetch featured products');
            }

            const data = await response.json();

            if (data.success && data.products) {
                setFeaturedProducts(data.products);
            } else {
                throw new Error('Invalid response format');
            }
        } catch (err) {
            console.error('Error fetching featured products:', err);
            setError('Failed to load featured products');

            // Set mock data as fallback
            setFeaturedProducts([
                {
                    id: '1',
                    name: 'Composite Dentaire Premium',
                    description: 'Composite haute qualité pour restaurations esthétiques durables',
                    price: '269.99',
                    comparePrice: '329.99',
                    thumbnail: null,
                    images: [],
                    isFeatured: true,
                    status: 'PUBLISHED',
                    category: {
                        id: '1',
                        name: 'Composite & Adhésif',
                        slug: 'composite-adhesif'
                    }
                },
                {
                    id: '2',
                    name: 'Kit Instruments Chirurgicaux',
                    description: 'Set complet d\'instruments en acier inoxydable pour chirurgie',
                    price: '899.99',
                    comparePrice: '1049.99',
                    thumbnail: null,
                    images: [],
                    isFeatured: true,
                    status: 'PUBLISHED',
                    category: {
                        id: '2',
                        name: 'Instruments Dentaires',
                        slug: 'instruments'
                    }
                },
                {
                    id: '3',
                    name: 'Lampe LED Polymérisation',
                    description: 'Lampe LED haute puissance pour polymérisation rapide et efficace',
                    price: '599.99',
                    comparePrice: '749.99',
                    thumbnail: null,
                    images: [],
                    isFeatured: true,
                    status: 'PUBLISHED',
                    category: {
                        id: '3',
                        name: 'Équipement Médical',
                        slug: 'equipement'
                    }
                },
                {
                    id: '4',
                    name: 'Autoclave Classe B',
                    description: 'Stérilisateur professionnel avec cycles automatiques',
                    price: '3899.99',
                    comparePrice: '4499.99',
                    thumbnail: null,
                    images: [],
                    isFeatured: true,
                    status: 'PUBLISHED',
                    category: {
                        id: '4',
                        name: 'Stérilisation',
                        slug: 'sterilisation'
                    }
                }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const getProductImage = (product: Product) => {
        return product.thumbnail || product.images[0] || "/api/placeholder/400/300";
    };

    const formatPrice = (price: string) => {
        return parseFloat(price).toFixed(2);
    };

    const getRandomRating = () => {
        return (4.5 + Math.random() * 0.5).toFixed(1);
    };

    const getRandomReviews = () => {
        return Math.floor(Math.random() * 200) + 50;
    };

    const getBadge = (product: Product, index: number) => {
        if (product.comparePrice && parseFloat(product.comparePrice) > parseFloat(product.price)) {
            return "Promo";
        }
        if (index === 0) return "Bestseller";
        if (index === 1) return "Nouveau";
        return null;
    };

    const getFeatures = (product: Product) => {
        // Generate some default features based on product name/description
        const features = [];
        const name = product.name.toLowerCase();
        const desc = product.description?.toLowerCase() || '';

        if (name.includes('composite') || desc.includes('composite')) {
            features.push("Haute résistance", "Esthétique naturelle", "Facile à polir");
        } else if (name.includes('instrument') || desc.includes('instrument')) {
            features.push("Acier inoxydable", "Stérilisable", "Garantie 2 ans");
        } else if (name.includes('led') || name.includes('lampe')) {
            features.push("LED haute puissance", "Batterie longue durée", "Léger et ergonomique");
        } else {
            features.push("Qualité premium", "Certifié CE", "Livraison rapide");
        }

        return features.slice(0, 3);
    };

    // Loading state
    if (loading) {
        return (
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <Badge className="mb-4 bg-blue-100 text-blue-700">
                            Produits vedettes
                        </Badge>
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                            Nos meilleures ventes
                        </h2>
                    </div>
                    <div className="flex items-center justify-center min-h-[400px]">
                        <div className="text-center">
                            <Loader2 className="h-12 w-12 animate-spin text-green-600 mx-auto mb-4" />
                            <p className="text-gray-600">Chargement des produits vedettes...</p>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    // Error state
    if (error) {
        return (
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <p className="text-red-600 mb-4">Erreur: {error}</p>
                        <Button onClick={fetchFeaturedProducts} variant="outline">
                            Réessayer
                        </Button>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-20 bg-gradient-to-br from-white to-blue-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <Badge className="mb-4 bg-blue-100 text-blue-700 hover:bg-blue-200">
                        Produits vedettes
                    </Badge>

                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                        Nos meilleures ventes
                    </h2>

                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Découvrez les produits les plus appréciés par nos clients professionnels
                    </p>
                </motion.div>

                {/* Products Grid */}
                {featuredProducts.length === 0 ? (
                    <div className="text-center py-12">
                        <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 text-lg">Aucun produit vedette disponible pour le moment.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {featuredProducts.slice(0, 4).map((product, index) => {
                            const badge = getBadge(product, index);
                            const rating = getRandomRating();
                            const reviews = getRandomReviews();
                            const features = getFeatures(product);

                            return (
                                <motion.div
                                    key={product.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                    className="group"
                                >
                                    <Card className="h-full overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 group-hover:scale-[1.02] bg-white relative">
                                        {/* Floating Badge */}
                                        {badge && (
                                            <div className="absolute top-3 left-3 z-10">
                                                <Badge className={`text-xs px-2 py-1 ${
                                                    badge === 'Bestseller' ? 'bg-orange-500 text-white' :
                                                    badge === 'Nouveau' ? 'bg-blue-500 text-white' :
                                                    'bg-red-500 text-white'
                                                }`}>
                                                    {badge}
                                                </Badge>
                                            </div>
                                        )}

                                        {/* Compact Image Section */}
                                        <div className="relative h-40 bg-gradient-to-br from-blue-50 to-blue-100 overflow-hidden">
                                            <Image
                                                src={getProductImage(product)}
                                                alt={product.name}
                                                fill
                                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                                            />

                                            {/* Gradient Overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>

                                            {/* Quick Action Button */}
                                            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                                <Button size="sm" variant="secondary" className="h-7 w-7 p-0 bg-white/90 hover:bg-white rounded-full">
                                                    <Eye className="h-3 w-3" />
                                                </Button>
                                            </div>

                                            {/* Price Tag - Floating */}
                                            <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-sm rounded-lg px-2 py-1 shadow-sm">
                                                <div className="flex items-center gap-1">
                                                    <span className="text-lg font-bold text-gray-900">
                                                        {formatPrice(product.price)} TND TTC
                                                    </span>
                                                    {product.comparePrice && (
                                                        <span className="text-xs text-gray-500 line-through">
                                                            {formatPrice(product.comparePrice)} TND
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Compact Content */}
                                        <div className="p-4">
                                            {/* Category & Rating */}
                                            <div className="flex items-center justify-between mb-2">
                                                <Badge variant="outline" className="text-xs text-blue-600 border-blue-200 px-2 py-0.5">
                                                    {product.category?.name}
                                                </Badge>
                                                <div className="flex items-center gap-1">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            className={`h-3 w-3 ${i < Math.floor(parseFloat(rating)) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                                                        />
                                                    ))}
                                                    <span className="text-xs text-gray-500 ml-1">({reviews})</span>
                                                </div>
                                            </div>

                                            {/* Title - Compact */}
                                            <h3 className="font-bold text-base text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors leading-tight">
                                                {product.name}
                                            </h3>

                                            {/* Description - Single Line */}
                                            <p className="text-gray-600 text-sm mb-3 line-clamp-1">
                                                {product.description}
                                            </p>

                                            {/* Key Features - Compact Icons */}
                                            <div className="flex items-center gap-3 mb-4 text-xs text-gray-500">
                                                <div className="flex items-center gap-1">
                                                    <CheckCircle className="h-3 w-3 text-green-500" />
                                                    <span>Certifié</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <ShieldCheck className="h-3 w-3 text-blue-500" />
                                                    <span>Garantie</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Truck className="h-3 w-3 text-purple-500" />
                                                    <span>Livraison</span>
                                                </div>
                                            </div>

                                            {/* Action Button - Full Width */}
                                            <Button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-sm py-2 rounded-lg transition-all duration-300 group-hover:shadow-lg">
                                                <ShoppingCart className="h-4 w-4 mr-2" />
                                                Ajouter au panier
                                            </Button>
                                        </div>

                                        {/* Hover Effect Border */}
                                        <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-200 rounded-lg transition-colors duration-300 pointer-events-none"></div>
                                    </Card>
                                </motion.div>
                            );
                        })}
                    </div>
                )}

                {/* CTA Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    viewport={{ once: true }}
                    className="text-center mt-16"
                >
                    <Button
                        size="lg"
                        variant="outline"
                        className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-3 rounded-lg transition-all duration-300"
                        asChild
                    >
                        <Link href="/products">
                            Voir tous les produits
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                    </Button>
                </motion.div>
            </div>
        </section>
    );
}

export default FeaturedProductsSection;
