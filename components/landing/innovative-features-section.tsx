"use client";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { 
    Zap, 
    Shield, 
    Award, 
    Headphones, 
    Truck, 
    Users,
    ArrowRight,
    CheckCircle,
    Sparkles,
    Clock,
    Globe,
    Heart
} from "lucide-react";
import { TbDental } from "react-icons/tb";
import { useState, useEffect } from "react";

function InnovativeFeaturesSection() {
    const [activeFeature, setActiveFeature] = useState(0);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const interval = setInterval(() => {
            setActiveFeature((prev) => (prev + 1) % 6);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const mainFeatures = [
        {
            icon: <TbDental className="h-8 w-8" />,
            title: "Équipements Innovants",
            description: "Technologies de pointe pour des soins dentaires d'excellence",
            details: "Découvrez notre gamme d'équipements dernière génération, conçus pour optimiser votre pratique et améliorer l'expérience patient.",
            color: "blue",
            stats: "500+ Produits"
        },
        {
            icon: <Shield className="h-8 w-8" />,
            title: "Qualité Certifiée",
            description: "Tous nos produits sont certifiés CE et ISO",
            details: "Conformité aux normes européennes les plus strictes, garantissant sécurité et performance pour vos patients.",
            color: "purple",
            stats: "100% Certifié"
        },
        {
            icon: <Headphones className="h-8 w-8" />,
            title: "Support Expert",
            description: "Assistance technique 24/7 par nos spécialistes",
            details: "Notre équipe d'experts vous accompagne à chaque étape, de l'installation à la maintenance de vos équipements.",
            color: "indigo",
            stats: "24/7 Disponible"
        },
        {
            icon: <Truck className="h-8 w-8" />,
            title: "Livraison Rapide",
            description: "Livraison express partout en Tunisie",
            details: "Service de livraison optimisé pour recevoir vos commandes dans les meilleurs délais, partout sur le territoire.",
            color: "blue",
            stats: "24-48h"
        },
        {
            icon: <Award className="h-8 w-8" />,
            title: "Garantie Étendue",
            description: "Jusqu'à 5 ans de garantie sur nos équipements",
            details: "Protection complète de votre investissement avec notre garantie étendue et service après-vente premium.",
            color: "purple",
            stats: "5 Ans Max"
        },
        {
            icon: <Users className="h-8 w-8" />,
            title: "Formation Incluse",
            description: "Formation personnalisée pour votre équipe",
            details: "Sessions de formation adaptées à vos besoins pour maîtriser parfaitement vos nouveaux équipements.",
            color: "indigo",
            stats: "Formation Pro"
        }
    ];

    const trustBadges = [
        { icon: <CheckCircle className="h-6 w-6" />, text: "Certifié CE" },
        { icon: <Shield className="h-6 w-6" />, text: "ISO 9001" },
        { icon: <Award className="h-6 w-6" />, text: "15+ Ans" },
        { icon: <Globe className="h-6 w-6" />, text: "International" },
        { icon: <Heart className="h-6 w-6" />, text: "98% Satisfaction" }
    ];

    const getColorClasses = (color: string) => {
        const colors = {
            blue: {
                bg: "bg-blue-500",
                light: "bg-blue-100",
                text: "text-blue-600",
                border: "border-blue-200",
                gradient: "from-blue-500 to-blue-600"
            },
            purple: {
                bg: "bg-purple-500",
                light: "bg-purple-100",
                text: "text-purple-600",
                border: "border-purple-200",
                gradient: "from-purple-500 to-purple-600"
            },
            indigo: {
                bg: "bg-indigo-500",
                light: "bg-indigo-100",
                text: "text-indigo-600",
                border: "border-indigo-200",
                gradient: "from-indigo-500 to-indigo-600"
            }
        };
        return colors[color as keyof typeof colors] || colors.blue;
    };

    return (
        <section className="py-20 bg-gradient-to-br from-white to-blue-50 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute top-20 left-20 w-32 h-32 bg-blue-500 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 right-20 w-40 h-40 bg-blue-400 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-blue-300 rounded-full blur-3xl"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <Badge className="mb-4 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 hover:from-blue-200 hover:to-blue-300">
                        <Sparkles className="h-4 w-4 mr-2" />
                        Pourquoi nous choisir
                    </Badge>
                    
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                        L'excellence à votre service
                    </h2>
                    
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Découvrez les avantages qui font de nous le partenaire privilégié 
                        des professionnels de santé en Tunisie et dans la région.
                    </p>
                </motion.div>

                {/* Trust Badges */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    viewport={{ once: true }}
                    className="flex flex-wrap justify-center gap-6 mb-16"
                >
                    {trustBadges.map((badge, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg border border-gray-200"
                        >
                            <div className="text-blue-600">
                                {badge.icon}
                            </div>
                            <span className="font-semibold text-gray-700">{badge.text}</span>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Main Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {mainFeatures.map((feature, index) => {
                        const colorClasses = getColorClasses(feature.color);
                        const isActive = activeFeature === index;
                        
                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="group cursor-pointer"
                                onMouseEnter={() => setActiveFeature(index)}
                            >
                                <Card className={`p-8 h-full transition-all duration-500 border-2 ${
                                    isActive 
                                        ? `${colorClasses.border} shadow-2xl scale-105 bg-white` 
                                        : 'border-gray-200 shadow-lg hover:shadow-xl bg-white/80 backdrop-blur-sm'
                                } group-hover:scale-105`}>
                                    {/* Icon */}
                                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 ${
                                        isActive 
                                            ? `bg-gradient-to-br ${colorClasses.gradient} text-white shadow-lg` 
                                            : `${colorClasses.light} ${colorClasses.text} group-hover:bg-gradient-to-br group-hover:${colorClasses.gradient} group-hover:text-white`
                                    }`}>
                                        {feature.icon}
                                    </div>

                                    {/* Content */}
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <h3 className={`text-xl font-bold transition-colors ${
                                                isActive ? colorClasses.text : 'text-gray-900 group-hover:' + colorClasses.text
                                            }`}>
                                                {feature.title}
                                            </h3>
                                            <Badge className={`${colorClasses.light} ${colorClasses.text} text-xs`}>
                                                {feature.stats}
                                            </Badge>
                                        </div>
                                        
                                        <p className="text-gray-600 font-medium">
                                            {feature.description}
                                        </p>
                                        
                                        <p className="text-sm text-gray-500 leading-relaxed">
                                            {feature.details}
                                        </p>

                                        {/* Action */}
                                        <div className={`flex items-center gap-2 text-sm font-semibold transition-colors ${
                                            isActive ? colorClasses.text : 'text-gray-400 group-hover:' + colorClasses.text
                                        }`}>
                                            <span>En savoir plus</span>
                                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                        </div>
                                    </div>

                                    {/* Active Indicator */}
                                    {isActive && (
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className={`absolute top-4 right-4 w-3 h-3 rounded-full ${colorClasses.bg}`}
                                        />
                                    )}
                                </Card>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Bottom CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                    viewport={{ once: true }}
                    className="text-center mt-16"
                >
                    <Card className="p-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-3xl shadow-2xl max-w-4xl mx-auto">
                        <div className="flex items-center justify-center gap-4 mb-6">
                            <Clock className="h-8 w-8" />
                            <h3 className="text-2xl font-bold">
                                Prêt à transformer votre pratique ?
                            </h3>
                        </div>
                        <p className="text-blue-100 mb-6 text-lg">
                            Rejoignez plus de 500 professionnels qui nous font confiance pour leurs équipements dentaires.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="bg-white text-blue-600 px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                            >
                                Demander un Devis
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="border-2 border-white/30 text-white px-8 py-3 rounded-xl font-semibold hover:bg-white/10 transition-all duration-300"
                            >
                                Voir le Catalogue
                            </motion.button>
                        </div>
                    </Card>
                </motion.div>
            </div>
        </section>
    );
}

export default InnovativeFeaturesSection;
