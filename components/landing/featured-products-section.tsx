"use client";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
    ShoppingCart,
    ArrowRight,
    Package,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
// import dentalequipment from "@/public/images/dental-equipment.jpg";
import { useState, useEffect } from "react";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/utils";

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
    slug: string;
    stockQuantity: number;
    category?: {
        id: string;
        name: string;
        slug: string;
    };
}

function FeaturedProductsSection() {
    const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
    const [error, setError] = useState<string | null>(null);
    const { addItem } = useCart();

    useEffect(() => {
        fetchFeaturedProducts();
    }, []);

    const fetchFeaturedProducts = async () => {
        try {
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
                    slug: 'composite-dentaire-premium',
                    stockQuantity: 25,
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
                    slug: 'kit-instruments-chirurgicaux',
                    stockQuantity: 15,
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
                    slug: 'lampe-led-polymerisation',
                    stockQuantity: 8,
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
                    slug: 'autoclave-classe-b',
                    stockQuantity: 5,
                    category: {
                        id: '4',
                        name: 'Stérilisation',
                        slug: 'sterilisation'
                    }
                }
            ]);
        }
    };

    const getProductImage = (product: Product) => {
        return product.thumbnail || product.images[0] || "/api/placeholder/400/300";
    };

    const formatPrice = (price: string) => {
        return formatCurrency(parseFloat(price));
    };









    // Enhanced Professional Error state
    if (error) {
        return (
            <section className="py-24 bg-professional-light">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <div className="glass-effect rounded-3xl p-12 shadow-professional max-w-md mx-auto">
                            <p className="text-red-600 mb-6 text-lg font-medium">Erreur: {error}</p>
                            <Button
                                onClick={fetchFeaturedProducts}
                                className="gradient-bg-blue text-white px-8 py-3 rounded-2xl font-bold"
                            >
                                Réessayer
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-20 bg-white relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Professional Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <Badge className="mb-6 bg-blue-50 text-blue-700 hover:bg-blue-100 px-4 py-2 text-sm font-medium">
                        <Package className="h-4 w-4 mr-2" />
                        Produits vedettes
                    </Badge>

                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                        Nos meilleures
                        <span className="text-blue-600 block">ventes</span>
                    </h2>

                    <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                        Découvrez les produits les plus appréciés par nos clients professionnels.
                        Qualité garantie et livraison rapide.
                    </p>
                </motion.div>

                {/* Minimalist Products Grid */}
                {featuredProducts.length === 0 ? (
                    <div className="text-center py-16">
                        <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 text-lg">Aucun produit vedette disponible pour le moment.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {featuredProducts.slice(0, 4).map((product, index) => {
                            return (
                                <motion.div
                                    key={product.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                    className="group"
                                >
                                    <Card className="h-full bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 group-hover:border-blue-300 flex flex-col overflow-hidden">
                                        {/* Professional Image Section */}
                                        <div className="relative aspect-[4/3] bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
                                            <Image
                                                src={getProductImage(product)}
                                                alt={product.name}
                                                fill
                                                className="object-contain p-6 transition-transform duration-300 group-hover:scale-105"
                                                style={{ objectFit: 'contain' }}
                                            />

                                            {/* Professional badges */}
                                            {index === 0 && (
                                                <div className="absolute top-4 left-4">
                                                    <Badge className="bg-blue-600 text-white px-3 py-1 text-xs font-semibold rounded-full shadow-sm">
                                                        Bestseller
                                                    </Badge>
                                                </div>
                                            )}
                                            {index === 1 && (
                                                <div className="absolute top-4 left-4">
                                                    <Badge className="bg-emerald-600 text-white px-3 py-1 text-xs font-semibold rounded-full shadow-sm">
                                                        Nouveau
                                                    </Badge>
                                                </div>
                                            )}

                                            {/* Price overlay */}
                                            <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg px-3 py-2 shadow-sm">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-lg font-bold text-blue-600">
                                                        {formatPrice(product.price)}
                                                    </span>
                                                    {product.comparePrice && parseFloat(product.comparePrice) > parseFloat(product.price) && (
                                                        <span className="text-sm text-gray-400 line-through">
                                                            {formatPrice(product.comparePrice)}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Professional Content */}
                                        <div className="p-5 flex flex-col flex-grow">
                                            {/* Category tag */}
                                            <div className="mb-3">
                                                <span className="inline-block bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-xs font-medium">
                                                    {product.category?.name || 'Équipement dentaire'}
                                                </span>
                                            </div>

                                            {/* Title */}
                                            <h3 className="text-lg font-semibold mb-3 line-clamp-2 text-gray-900 group-hover:text-blue-600 transition-colors leading-tight">
                                                {product.name}
                                            </h3>

                                            {/* Description */}
                                            <p className="text-sm text-gray-600 mb-4 line-clamp-3 leading-relaxed flex-grow">
                                                {product.description || 'Équipement dentaire professionnel de haute qualité, conçu pour répondre aux besoins des praticiens exigeants. Garantie de performance et de durabilité.'}
                                            </p>

                                            {/* Professional Action Button */}
                                            <Button
                                                onClick={(e) => {
                                                    e.stopPropagation();

                                                    const cartItem = {
                                                        id: product.id,
                                                        name: product.name,
                                                        price: parseFloat(product.price),
                                                        image: product.thumbnail || product.images?.[0] || "/images/dental-equipment.jpg",
                                                        slug: product.slug,
                                                        stockQuantity: product.stockQuantity
                                                    };

                                                    addItem(cartItem);
                                                    toast.success(`${product.name} ajouté au panier!`);
                                                }}
                                                className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3 text-sm font-semibold transition-all duration-300 hover:shadow-md transform hover:scale-[1.02] active:scale-[0.98]"
                                            >
                                                <ShoppingCart className="w-4 h-4 mr-2" />
                                                Ajouter au panier
                                            </Button>
                                        </div>

                                    </Card>
                                </motion.div>
                            );
                        })}
                    </div>
                )}

                {/* Enhanced Professional CTA Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    viewport={{ once: true }}
                    className="text-center mt-20"
                >
                    <Button
                        size="lg"
                        className="gradient-bg-blue hover:shadow-professional-hover text-white px-12 py-5 rounded-2xl transition-all duration-500 font-bold text-lg group"
                        asChild
                    >
                        <Link href="/catalog">
                            Voir tous les produits
                            <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-2 transition-transform duration-300" />
                        </Link>
                    </Button>
                </motion.div>
            </div>
        </section>
    );
}

export default FeaturedProductsSection;
