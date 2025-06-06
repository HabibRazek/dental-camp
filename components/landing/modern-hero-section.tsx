"use client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
    ArrowRight, 
    Play, 
    Star, 
    Users, 
    Award, 
    Zap,
    ShieldCheck,
    Sparkles
} from "lucide-react";
import { TbDental } from "react-icons/tb";
import Image from "next/image";
// import dentalEquipmentImage from "@/public/images/dental-equipment.jpg";
import { useState, useEffect } from "react";

function ModernHeroSection() {
    const [mounted, setMounted] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        setMounted(true);
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % 3);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    const heroSlides = [
        {
            title: "Équipements Dentaires",
            subtitle: "de Nouvelle Génération",
            description: "Découvrez notre gamme complète d'équipements dentaires innovants, conçus pour optimiser votre pratique et améliorer l'expérience patient.",
            cta: "Explorer le Catalogue",
            image: "/api/placeholder/600/500"
        },
        {
            title: "Technologie Avancée",
            subtitle: "pour Professionnels",
            description: "Des solutions technologiques de pointe qui révolutionnent les soins dentaires avec précision, efficacité et confort.",
            cta: "Voir les Innovations",
            image: "/api/placeholder/600/500"
        },
        {
            title: "Service Excellence",
            subtitle: "& Support 24/7",
            description: "Un accompagnement personnalisé avec notre équipe d'experts, formation incluse et support technique permanent.",
            cta: "Nous Contacter",
            image: "/api/placeholder/600/500"
        }
    ];

    const stats = [
        { number: "500+", label: "Clients Satisfaits", icon: <Users className="h-5 w-5" /> },
        { number: "15+", label: "Années d'Expérience", icon: <Award className="h-5 w-5" /> },
        { number: "1000+", label: "Produits Disponibles", icon: <Zap className="h-5 w-5" /> },
        { number: "98%", label: "Taux de Satisfaction", icon: <Star className="h-5 w-5" /> }
    ];

    const floatingElements = [
        { id: 1, icon: <TbDental className="h-8 w-8" />, delay: 0, x: "10%", y: "20%" },
        { id: 2, icon: <ShieldCheck className="h-6 w-6" />, delay: 0.5, x: "85%", y: "15%" },
        { id: 3, icon: <Sparkles className="h-7 w-7" />, delay: 1, x: "15%", y: "80%" },
        { id: 4, icon: <Award className="h-6 w-6" />, delay: 1.5, x: "90%", y: "75%" }
    ];

    return (
        <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-white via-blue-50 to-blue-100">
            {/* Animated Background */}
            <div className="absolute inset-0">
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-50/30 to-blue-100/30"></div>
                
                {/* Animated Particles */}
                {mounted && (
                    <div className="absolute inset-0">
                        {[...Array(20)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute w-2 h-2 bg-blue-300/40 rounded-full"
                                initial={{ 
                                    x: Math.random() * window.innerWidth,
                                    y: Math.random() * window.innerHeight,
                                    opacity: 0
                                }}
                                animate={{
                                    y: [null, -100],
                                    opacity: [0, 1, 0]
                                }}
                                transition={{
                                    duration: Math.random() * 3 + 2,
                                    repeat: Infinity,
                                    delay: Math.random() * 2
                                }}
                            />
                        ))}
                    </div>
                )}

                {/* Floating Elements */}
                {mounted && floatingElements.map((element) => (
                    <motion.div
                        key={element.id}
                        className="absolute text-blue-400/50"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ 
                            opacity: 1, 
                            scale: 1,
                            y: [0, -20, 0],
                            rotate: [0, 5, -5, 0]
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            delay: element.delay
                        }}
                        style={{
                            left: element.x,
                            top: element.y
                        }}
                    >
                        {element.icon}
                    </motion.div>
                ))}
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-screen py-20">
                    {/* Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-gray-800 space-y-8"
                    >
                        {/* Badge */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.6 }}
                        >
                            <Badge className="bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200 backdrop-blur-sm">
                                <TbDental className="h-4 w-4 mr-2" />
                                <span className="font-semibold">Innovation Dentaire</span>
                                <Sparkles className="h-3 w-3 ml-2 text-blue-500" />
                            </Badge>
                        </motion.div>

                        {/* Title */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.8 }}
                        >
                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                                {heroSlides[currentSlide].title}
                                <span className="block bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">
                                    {heroSlides[currentSlide].subtitle}
                                </span>
                            </h1>
                        </motion.div>

                        {/* Description */}
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6, duration: 0.8 }}
                            className="text-xl text-gray-600 leading-relaxed max-w-2xl"
                        >
                            {heroSlides[currentSlide].description}
                        </motion.p>

                        {/* CTA Buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8, duration: 0.8 }}
                            className="flex flex-col sm:flex-row gap-4"
                        >
                            <Button
                                size="lg"
                                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-4 rounded-xl shadow-lg hover:shadow-blue-300/50 transition-all duration-300 group"
                            >
                                <span className="font-semibold">{heroSlides[currentSlide].cta}</span>
                                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                            </Button>
                            
                            <Button
                                size="lg"
                                variant="outline"
                                className="border-blue-300 text-blue-600 hover:bg-blue-50 backdrop-blur-sm px-8 py-4 rounded-xl group"
                            >
                                <Play className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
                                <span className="font-semibold">Voir la Démo</span>
                            </Button>
                        </motion.div>

                        {/* Stats */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1, duration: 0.8 }}
                            className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-8"
                        >
                            {stats.map((stat, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 1.2 + index * 0.1, duration: 0.5 }}
                                    className="text-center bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-blue-200"
                                >
                                    <div className="flex justify-center mb-2 text-blue-400">
                                        {stat.icon}
                                    </div>
                                    <div className="text-2xl font-bold text-gray-800 mb-1">
                                        {stat.number}
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        {stat.label}
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.div>

                    {/* Image */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="relative"
                    >
                        <div className="relative">
                            {/* Main Image */}
                            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                                <div className="w-full h-[500px] bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                                    <div className="text-center text-blue-600">
                                        <TbDental className="h-24 w-24 mx-auto mb-4 opacity-70" />
                                        <p className="text-lg font-semibold">Équipements Dentaires Modernes</p>
                                    </div>
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-t from-blue-200/30 to-transparent"></div>
                            </div>

                            {/* Floating Cards */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 1.2, duration: 0.6 }}
                                className="absolute -top-6 -left-6 bg-white rounded-2xl p-4 shadow-xl"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                                        <ShieldCheck className="h-6 w-6 text-blue-500" />
                                    </div>
                                    <div>
                                        <div className="font-bold text-gray-900">Certifié CE</div>
                                        <div className="text-sm text-gray-600">Qualité Garantie</div>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 1.4, duration: 0.6 }}
                                className="absolute -bottom-6 -right-6 bg-white rounded-2xl p-4 shadow-xl"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                                        <Award className="h-6 w-6 text-blue-500" />
                                    </div>
                                    <div>
                                        <div className="font-bold text-gray-900">Support 24/7</div>
                                        <div className="text-sm text-gray-600">Assistance Expert</div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>

                {/* Slide Indicators */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5, duration: 0.5 }}
                    className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-3"
                >
                    {heroSlides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentSlide(index)}
                            className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                index === currentSlide
                                    ? 'bg-blue-500 scale-125'
                                    : 'bg-blue-300 hover:bg-blue-400'
                            }`}
                        />
                    ))}
                </motion.div>
            </div>
        </section>
    );
}

export default ModernHeroSection;
