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
    Loader2,
    Sparkles,
    TrendingUp,
    Star,
    Eye
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import dentalequipment from "@/public/images/dental-equipment.jpg";
import { useState, useEffect } from "react";

// Enhanced icon mapping for categories with more variety
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
    'sparkles': <Sparkles className="h-6 w-6" />,
    'trending': <TrendingUp className="h-6 w-6" />,
    'star': <Star className="h-6 w-6" />,
    'eye': <Eye className="h-6 w-6" />,
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
        <section className="relative py-24 overflow-hidden">
            {/* Enhanced Background with Gradient Mesh */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_50%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(99,102,241,0.08),transparent_50%)]" />

            {/* Floating Elements */}
            <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200/20 rounded-full blur-xl animate-pulse" />
            <div className="absolute bottom-20 right-10 w-32 h-32 bg-indigo-200/20 rounded-full blur-xl animate-pulse delay-1000" />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Enhanced Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    viewport={{ once: true }}
                    className="text-center mb-20"
                >
                    {/* Animated Badge */}
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        viewport={{ once: true }}
                    >
                        <Badge className="mb-6 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 hover:from-blue-200 hover:to-indigo-200 px-4 py-2 text-sm font-medium border-0 shadow-lg">
                            <Sparkles className="w-4 h-4 mr-2" />
                            Nos produits
                        </Badge>
                    </motion.div>

                    {/* Enhanced Title with Gradient */}
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        viewport={{ once: true }}
                        className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight"
                    >
                        <span className="bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
                            Catégories de
                        </span>
                        <br />
                        <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            produits
                        </span>
                    </motion.h2>

                    {/* Enhanced Description */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        viewport={{ once: true }}
                        className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed"
                    >
                        Découvrez notre large gamme d'équipements médicaux et dentaires
                        de haute qualité, adaptés à tous vos besoins professionnels.
                    </motion.p>

                    {/* Stats Row */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                        viewport={{ once: true }}
                        className="flex flex-wrap justify-center gap-8 mt-12"
                    >
                        <div className="text-center">
                            <div className="text-3xl font-bold text-blue-600">{categories.length}+</div>
                            <div className="text-sm text-gray-500">Catégories</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-indigo-600">
                                {categories.reduce((sum, cat) => sum + cat._count.products, 0)}+
                            </div>
                            <div className="text-sm text-gray-500">Produits</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-purple-600">100%</div>
                            <div className="text-sm text-gray-500">Qualité</div>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Enhanced Categories Grid */}
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {categories.map((category, index) => (
                            <motion.div
                                key={category.id}
                                initial={{ opacity: 0, y: 40, scale: 0.8 }}
                                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                                transition={{
                                    duration: 0.8,
                                    delay: index * 0.15,
                                    type: "spring",
                                    stiffness: 80,
                                    damping: 20
                                }}
                                viewport={{ once: true }}
                                className="group cursor-pointer"
                                whileHover={{ y: -8, scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <Card className="relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-700 overflow-hidden border-0 h-full group-hover:bg-white/90">
                                    {/* Animated Gradient Background */}
                                    <div
                                        className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-all duration-700"
                                        style={{
                                            background: `conic-gradient(from 0deg at 50% 50%, ${category.color || '#3B82F6'}20, transparent, ${category.color || '#3B82F6'}20)`
                                        }}
                                    />

                                    {/* Enhanced Image Section */}
                                    <div className="relative h-48 overflow-hidden">
                                        <Image
                                            src={getImage(category.image)}
                                            alt={category.name}
                                            fill
                                            className="object-cover transition-all duration-1000 group-hover:scale-110 group-hover:rotate-1"
                                        />

                                        {/* Gradient Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />

                                        {/* Floating Elements */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/10" />

                                        {/* Enhanced Icon */}
                                        <motion.div
                                            className="absolute top-4 left-4 w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl backdrop-blur-md border border-white/30"
                                            style={{
                                                background: `linear-gradient(135deg, ${category.color || '#3B82F6'}20, ${category.color || '#3B82F6'}40)`
                                            }}
                                            whileHover={{ scale: 1.1, rotate: 10 }}
                                            transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                        >
                                            <div style={{ color: category.color || '#3B82F6' }} className="drop-shadow-sm">
                                                {getIcon(category.icon)}
                                            </div>
                                        </motion.div>

                                        {/* Enhanced Product Count Badge */}
                                        <motion.div
                                            className="absolute top-4 right-4 px-3 py-2 rounded-xl text-sm font-bold text-white shadow-2xl backdrop-blur-md border border-white/30"
                                            style={{
                                                background: `linear-gradient(135deg, ${category.color || '#3B82F6'}, ${category.color || '#3B82F6'}DD)`
                                            }}
                                            whileHover={{ scale: 1.05 }}
                                            transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                        >
                                            <div className="flex items-center gap-1">
                                                <Star className="w-3 h-3" />
                                                {category._count.products}
                                            </div>
                                        </motion.div>

                                        {/* Trending Badge for Popular Categories */}
                                        {category._count.products > 20 && (
                                            <motion.div
                                                className="absolute bottom-4 left-4 px-2 py-1 rounded-lg text-xs font-medium text-white bg-gradient-to-r from-orange-500 to-red-500 shadow-lg"
                                                initial={{ scale: 0, opacity: 0 }}
                                                whileInView={{ scale: 1, opacity: 1 }}
                                                transition={{ delay: 0.5, type: "spring" }}
                                                viewport={{ once: true }}
                                            >
                                                <div className="flex items-center gap-1">
                                                    <TrendingUp className="w-3 h-3" />
                                                    Populaire
                                                </div>
                                            </motion.div>
                                        )}
                                    </div>

                                    {/* Enhanced Content Section */}
                                    <div className="p-6 relative z-10 flex flex-col h-[calc(100%-12rem)]">
                                        {/* Category Name */}
                                        <motion.h3
                                            className="text-lg font-bold mb-3 line-clamp-2 leading-tight"
                                            style={{ color: category.color || '#1F2937' }}
                                            whileHover={{ scale: 1.02 }}
                                            transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                        >
                                            {category.name}
                                        </motion.h3>

                                        {/* Description */}
                                        <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed flex-grow">
                                            {category.description || "Découvrez nos produits de qualité professionnelle"}
                                        </p>

                                        {/* Enhanced CTA Button */}
                                        <motion.div
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="w-full justify-between text-sm font-semibold rounded-xl p-3 h-auto group-hover:shadow-lg transition-all duration-300"
                                                style={{
                                                    color: category.color || '#3B82F6',
                                                    background: `linear-gradient(135deg, ${category.color || '#3B82F6'}10, ${category.color || '#3B82F6'}05)`
                                                }}
                                                asChild
                                            >
                                                <Link href={`/catalog?category=${category.slug}`}>
                                                    <div className="flex items-center gap-2">
                                                        <Eye className="w-4 h-4" />
                                                        Voir produits
                                                    </div>
                                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                                                </Link>
                                            </Button>
                                        </motion.div>
                                    </div>

                                    {/* Enhanced Hover Effects */}
                                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                                        <div
                                            className="absolute inset-0 opacity-5"
                                            style={{
                                                background: `radial-gradient(circle at 30% 30%, ${category.color || '#3B82F6'}40, transparent 70%)`
                                            }}
                                        />
                                        <div
                                            className="absolute inset-0 opacity-5"
                                            style={{
                                                background: `radial-gradient(circle at 70% 70%, ${category.color || '#3B82F6'}30, transparent 60%)`
                                            }}
                                        />
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
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
                                    className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white px-10 py-4 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-500 text-lg font-semibold border-0"
                                    asChild
                                >
                                    <Link href="/catalog">
                                        <div className="flex items-center gap-3">
                                            <Sparkles className="w-5 h-5" />
                                            Voir tous les produits
                                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                                        </div>
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
