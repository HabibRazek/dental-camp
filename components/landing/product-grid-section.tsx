"use client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

import {
    ArrowRight,
    Heart,
    Scissors,
    Zap,
    Shield,
    Microscope,
    Syringe,
    Package,
    Eye
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import dentalequipment from "@/public/images/dental-equipment.jpg";
import { useState, useEffect } from "react";

// Professional icon mapping for dental categories
const iconMap: { [key: string]: React.ReactNode } = {
    'heart': <Heart className="h-5 w-5" />,
    'scissors': <Scissors className="h-5 w-5" />,
    'zap': <Zap className="h-5 w-5" />,
    'shield': <Shield className="h-5 w-5" />,
    'microscope': <Microscope className="h-5 w-5" />,
    'syringe': <Syringe className="h-5 w-5" />,
    'package': <Package className="h-5 w-5" />,
    'composite': <Heart className="h-5 w-5" />,
    'instruments': <Scissors className="h-5 w-5" />,
    'equipement': <Zap className="h-5 w-5" />,
    'sterilisation': <Shield className="h-5 w-5" />,
    'diagnostic': <Microscope className="h-5 w-5" />,
    'anesthesie': <Syringe className="h-5 w-5" />,
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
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
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
        }
    };

    const getIcon = (iconName: string | null) => {
        if (!iconName) return <Package className="h-8 w-8" />;

        const normalizedName = iconName.toLowerCase().trim();

        // Try exact match first
        if (iconMap[normalizedName]) {
            return iconMap[normalizedName];
        }

        // Try partial matches for better flexibility
        const partialMatches: { [key: string]: React.ReactNode } = {
            'composite': <Heart className="h-8 w-8" />,
            'adhesif': <Heart className="h-8 w-8" />,
            'instrument': <Scissors className="h-8 w-8" />,
            'equipement': <Zap className="h-8 w-8" />,
            'equipment': <Zap className="h-8 w-8" />,
            'steril': <Shield className="h-8 w-8" />,
            'diagnostic': <Microscope className="h-8 w-8" />,
            'anesthes': <Syringe className="h-8 w-8" />,
            'tool': <Scissors className="h-8 w-8" />,
            'medical': <Heart className="h-8 w-8" />,
            'dental': <Heart className="h-8 w-8" />,
        };

        // Check for partial matches
        for (const [key, icon] of Object.entries(partialMatches)) {
            if (normalizedName.includes(key)) {
                return icon;
            }
        }

        // Default fallback
        return <Package className="h-8 w-8" />;
    };





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
        <section className="py-16 bg-white relative overflow-hidden">
            {/* Background with stethoscope image */}
            <div className="absolute top-0 right-0 w-1/2 h-full opacity-10">
                <Image
                    src={dentalequipment}
                    alt="Medical background"
                    fill
                    className="object-cover object-right"
                />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="mb-16"
                >
                    <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
                        Découvrez
                        <br />
                        <span className="text-blue-500">Nos Catégories</span>
                    </h2>

                    <p className="text-lg text-gray-700 max-w-2xl leading-relaxed">
                        Profitez de nos offres exceptionnelles sur une sélection d&apos;équipements médicaux
                        de qualité. Nous proposons des réductions intéressantes sur des produits
                        essentiels pour les professionnels de santé.
                    </p>
                </motion.div>

                {/* Professional Categories Grid */}
                {categories.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="text-center py-20"
                    >
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full blur-3xl opacity-30" />
                            <Package className="relative h-20 w-20 text-gray-400 mx-auto mb-6" />
                        </div>
                        <p className="text-gray-600 text-xl font-medium">Aucune catégorie disponible pour le moment.</p>
                    </motion.div>
                ) : (
                    <div className="flex justify-center w-full">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center max-w-5xl w-full px-4">
                        {/* All cards with same size */}
                        {categories.slice(0, 5).map((category, index) => (
                            <motion.div
                                key={category.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.1 + index * 0.1 }}
                                viewport={{ once: true }}
                                className="group cursor-pointer"
                            >
                                <div className="relative h-80 w-72 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 group-hover:scale-110">
                                    {/* Background Image */}
                                    <Image
                                        src={dentalequipment}
                                        alt={category.name}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                    {/* Blue Gradient Overlay with different intensities */}
                                    <div className={`absolute inset-0 transition-all duration-500 ${
                                        index === 0 ? 'bg-gradient-to-br from-blue-400/80 to-blue-500/90 group-hover:from-blue-300/70 group-hover:to-blue-400/80' :
                                        index === 1 ? 'bg-gradient-to-br from-blue-500/80 to-blue-600/90 group-hover:from-blue-400/70 group-hover:to-blue-500/80' :
                                        index === 2 ? 'bg-gradient-to-br from-blue-600/80 to-blue-700/90 group-hover:from-blue-500/70 group-hover:to-blue-600/80' :
                                        index === 3 ? 'bg-gradient-to-br from-blue-700/80 to-blue-800/90 group-hover:from-blue-600/70 group-hover:to-blue-700/80' :
                                        'bg-gradient-to-br from-blue-800/80 to-blue-900/90 group-hover:from-blue-700/70 group-hover:to-blue-800/80'
                                    }`} />

                                    <div className="relative h-full flex flex-col justify-center items-center text-white p-8">
                                        <motion.div
                                            initial={{ scale: 1 }}
                                            whileHover={{ scale: 1.2 }}
                                            transition={{ duration: 0.3 }}
                                            className="mb-6"
                                        >
                                            {getIcon(category.icon)}
                                        </motion.div>
                                        <p className="text-sm font-medium mb-2 opacity-90">NOS CATÉGORIES</p>
                                        <h3 className="text-xl font-bold mb-6 text-center leading-tight">
                                            {category.name}
                                        </h3>
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="bg-white/20 backdrop-blur-sm border border-white/30 text-white px-6 py-2.5 rounded-lg text-base font-semibold hover:bg-white/30 transition-all duration-300"
                                        >
                                            Découvrez
                                        </motion.button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                        </div>
                    </div>
                )}

                {/* Enhanced CTA Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    viewport={{ once: true }}
                    className="text-center mt-20"
                >
                    <div className="relative">
                        {/* Background Glow */}
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-indigo-600/20 to-purple-600/20 rounded-full blur-3xl scale-150 opacity-30" />

                        {/* CTA Content */}
                        <div className="relative">
                            <motion.p
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.8 }}
                                viewport={{ once: true }}
                                className="text-gray-600 mb-8 text-lg"
                            >
                                Explorez notre catalogue complet de produits dentaires
                            </motion.p>

                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                            >
                                <Button
                                    size="lg"
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200"
                                    asChild
                                >
                                    <Link href="/catalog">
                                        <Eye className="w-5 h-5 mr-2" />
                                        Voir tous les produits
                                        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                                    </Link>
                                </Button>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

export default ProductGridSection;
