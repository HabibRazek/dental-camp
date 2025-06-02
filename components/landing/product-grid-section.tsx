"use client";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
    ArrowRight,
    Heart,
    Scissors,
    Zap,
    Shield,
    Microscope,
    Syringe,
    Package,
    Loader2
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import dentalequipment from "@/public/images/dental-equipment.jpg";
import { useState, useEffect } from "react";

// Icon mapping for categories
const iconMap: { [key: string]: React.ReactNode } = {
    'heart': <Heart className="h-6 w-6" />,
    'scissors': <Scissors className="h-6 w-6" />,
    'zap': <Zap className="h-6 w-6" />,
    'shield': <Shield className="h-6 w-6" />,
    'microscope': <Microscope className="h-6 w-6" />,
    'syringe': <Syringe className="h-6 w-6" />,
    'package': <Package className="h-6 w-6" />,
    'tool': <Package className="h-6 w-6" />,
    'fingerprint': <Package className="h-6 w-6" />,
};

interface Category {
    id: string;
    name: string;
    description: string | null;
    slug: string;
    icon: string | null;
    image: string | null;
    color: string | null;
    isActive: boolean;
    _count: {
        products: number;
    };
}

function ProductGridSection() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch('/api/categories/public');

            if (!response.ok) {
                throw new Error('Failed to fetch categories');
            }

            const data = await response.json();

            if (data.success && data.categories) {
                setCategories(data.categories);
            } else {
                throw new Error('Invalid response format');
            }
        } catch (err) {
            console.error('Error fetching categories:', err);
            setError('Failed to load categories');

            // Set mock data as fallback
            setCategories([
                {
                    id: '1',
                    name: 'Composite & Adhésif',
                    description: 'Matériaux de restauration dentaire de haute qualité',
                    slug: 'composite-adhesif',
                    icon: 'heart',
                    image: null,
                    color: '#3B82F6',
                    isActive: true,
                    _count: { products: 24 }
                },
                {
                    id: '2',
                    name: 'Instruments Dentaires',
                    description: 'Instruments de précision pour tous vos besoins',
                    slug: 'instruments',
                    icon: 'scissors',
                    image: null,
                    color: '#60A5FA',
                    isActive: true,
                    _count: { products: 45 }
                },
                {
                    id: '3',
                    name: 'Équipement Médical',
                    description: 'Technologies avancées pour votre cabinet',
                    slug: 'equipement',
                    icon: 'zap',
                    image: null,
                    color: '#93C5FD',
                    isActive: true,
                    _count: { products: 18 }
                },
                {
                    id: '4',
                    name: 'Stérilisation',
                    description: 'Solutions complètes d\'hygiène et stérilisation',
                    slug: 'sterilisation',
                    icon: 'shield',
                    image: null,
                    color: '#BFDBFE',
                    isActive: true,
                    _count: { products: 32 }
                },
                {
                    id: '5',
                    name: 'Diagnostic',
                    description: 'Outils de diagnostic de pointe',
                    slug: 'diagnostic',
                    icon: 'microscope',
                    image: null,
                    color: '#DBEAFE',
                    isActive: true,
                    _count: { products: 28 }
                },
                {
                    id: '6',
                    name: 'Anesthésie',
                    description: 'Produits anesthésiques et accessoires',
                    slug: 'anesthesie',
                    icon: 'syringe',
                    image: null,
                    color: '#EFF6FF',
                    isActive: true,
                    _count: { products: 15 }
                }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const getIcon = (iconName: string | null) => {
        if (!iconName) return <Package className="h-8 w-8" />;
        return iconMap[iconName.toLowerCase()] || <Package className="h-8 w-8" />;
    };

    const getImage = (imageUrl: string | null) => {
        return imageUrl || dentalequipment;
    };

    // Loading state
    if (loading) {
        return (
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <Badge className="mb-4 bg-blue-100 text-blue-700">
                            Nos produits
                        </Badge>
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                            Catégories de produits
                        </h2>
                    </div>
                    <div className="flex items-center justify-center min-h-[400px]">
                        <div className="text-center">
                            <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
                            <p className="text-gray-600">Chargement des catégories...</p>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    // Error state
    if (error) {
        return (
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <p className="text-red-600 mb-4">Erreur: {error}</p>
                        <Button onClick={fetchCategories} variant="outline">
                            Réessayer
                        </Button>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-20 bg-gradient-to-br from-blue-50 to-white">
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
                        Nos produits
                    </Badge>

                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                        Catégories de produits
                    </h2>

                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Découvrez notre large gamme d'équipements médicaux et dentaires
                        de haute qualité, adaptés à tous vos besoins professionnels.
                    </p>
                </motion.div>

                {/* Categories Grid - Innovative 5-column layout */}
                {categories.length === 0 ? (
                    <div className="text-center py-12">
                        <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 text-lg">Aucune catégorie disponible pour le moment.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {categories.map((category, index) => (
                            <motion.div
                                key={category.id}
                                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                                transition={{
                                    duration: 0.6,
                                    delay: index * 0.1,
                                    type: "spring",
                                    stiffness: 100
                                }}
                                viewport={{ once: true }}
                                className="group"
                            >
                                <Card className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border-0 group-hover:-translate-y-3 group-hover:rotate-1 h-full">
                                    {/* Gradient Background */}
                                    <div
                                        className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500"
                                        style={{
                                            background: `linear-gradient(135deg, ${category.color || '#3B82F6'}, ${category.color || '#3B82F6'}80)`
                                        }}
                                    />

                                    {/* Image */}
                                    <div className="relative h-32 overflow-hidden">
                                        <Image
                                            src={getImage(category.image)}
                                            alt={category.name}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-125"
                                        />
                                        <div
                                            className="absolute inset-0 opacity-30"
                                            style={{
                                                background: `linear-gradient(135deg, ${category.color || '#3B82F6'}20, ${category.color || '#3B82F6'}40)`
                                            }}
                                        />

                                        {/* Floating Icon */}
                                        <div
                                            className="absolute top-3 left-3 w-10 h-10 rounded-xl flex items-center justify-center shadow-lg backdrop-blur-sm border border-white/20 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500"
                                            style={{
                                                background: `linear-gradient(135deg, ${category.color || '#3B82F6'}15, ${category.color || '#3B82F6'}25)`
                                            }}
                                        >
                                            <div style={{ color: category.color || '#3B82F6' }}>
                                                {getIcon(category.icon)}
                                            </div>
                                        </div>

                                        {/* Product Count - Floating Badge */}
                                        <div
                                            className="absolute top-3 right-3 px-2 py-1 rounded-lg text-xs font-bold text-white shadow-lg backdrop-blur-sm border border-white/20 group-hover:scale-105 transition-all duration-300"
                                            style={{
                                                background: `linear-gradient(135deg, ${category.color || '#3B82F6'}, ${category.color || '#3B82F6'}CC)`
                                            }}
                                        >
                                            {category._count.products}
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-4 relative z-10 flex flex-col h-[calc(100%-8rem)]">
                                        <h3
                                            className="text-sm font-bold mb-2 group-hover:scale-105 transition-all duration-300 line-clamp-2 leading-tight"
                                            style={{ color: category.color || '#1F2937' }}
                                        >
                                            {category.name}
                                        </h3>
                                        <p className="text-gray-600 text-xs mb-3 line-clamp-2 leading-relaxed flex-grow">
                                            {category.description || "Découvrez nos produits de qualité"}
                                        </p>

                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="w-full justify-between text-xs font-medium group-hover:translate-x-1 transition-all duration-300 hover:scale-105 p-2 h-8"
                                            style={{ color: category.color || '#3B82F6' }}
                                            asChild
                                        >
                                            <Link href={`/catalog?category=${category.slug}`}>
                                                Voir produits
                                                <ArrowRight className="ml-1 h-3 w-3 group-hover:translate-x-1 transition-transform duration-300" />
                                            </Link>
                                        </Button>
                                    </div>

                                    {/* Hover effect overlay */}
                                    <div
                                        className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none"
                                        style={{
                                            background: `radial-gradient(circle at center, ${category.color || '#3B82F6'}40, transparent 70%)`
                                        }}
                                    />
                                </Card>
                            </motion.div>
                        ))}
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
                        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                        asChild
                    >
                        <Link href="/catalog">
                            Voir tous les produits
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                    </Button>
                </motion.div>
            </div>
        </section>
    );
}

export default ProductGridSection;
