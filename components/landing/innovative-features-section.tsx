"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
    Shield,
    Award,
    Headphones,
    Truck,
    Users,
    ArrowRight,
    CheckCircle,
    Sparkles,
    Globe,
    Heart
} from "lucide-react";
import { TbDental } from "react-icons/tb";

function InnovativeFeaturesSection() {

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



    return (
        <section className="py-20 bg-white relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Professional Header with Doctor Integration */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    {/* Left Column - Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <Badge className="mb-6 bg-blue-50 text-blue-700 hover:bg-blue-100 px-4 py-2 text-sm font-medium">
                            <Sparkles className="h-4 w-4 mr-2" />
                            Pourquoi nous choisir
                        </Badge>

                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                            L&apos;excellence à votre
                            <span className="text-blue-600 block">service</span>
                        </h2>

                        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                            Découvrez les avantages qui font de nous le partenaire privilégié
                            des professionnels de santé en Tunisie et dans la région.
                        </p>

                        {/* Trust Badges */}
                        <div className="flex flex-wrap gap-4">
                            {trustBadges.slice(0, 3).map((badge, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                    className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2"
                                >
                                    <div className="text-blue-600">
                                        {badge.icon}
                                    </div>
                                    <span className="font-medium text-gray-700 text-sm">{badge.text}</span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Right Column - Doctor Image */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        viewport={{ once: true }}
                        className="relative"
                    >
                        <div className="relative">
                            <Image
                                src="/images/Dr.webp"
                                alt="Professionnel dentaire expert"
                                width={500}
                                height={600}
                                className="w-full h-auto "
                            />
                        </div>
                    </motion.div>
                </div>

                {/* Professional Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {mainFeatures.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="group"
                        >
                            <Card className="p-6 h-full bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 group-hover:border-blue-300">
                                {/* Professional Icon */}
                                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
                                    <div className="text-blue-600">
                                        {feature.icon}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="space-y-3">
                                    <div className="flex items-start justify-between">
                                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                            {feature.title}
                                        </h3>
                                        <Badge className="bg-blue-50 text-blue-700 text-xs font-medium px-2 py-1 rounded-md">
                                            {feature.stats}
                                        </Badge>
                                    </div>

                                    <p className="text-sm text-gray-600 leading-relaxed">
                                        {feature.description}
                                    </p>

                                    <p className="text-xs text-gray-500 leading-relaxed">
                                        {feature.details}
                                    </p>

                                    {/* Simple Action */}
                                    <div className="flex items-center gap-2 text-sm text-blue-600 group-hover:text-blue-700 transition-colors pt-2">
                                        <span>En savoir plus</span>
                                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>


            </div>
        </section>
    );
}

export default InnovativeFeaturesSection;
