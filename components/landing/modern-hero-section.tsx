"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    ArrowRight,
    Star,
    Users,
    Award,
    Zap,
    ShieldCheck,
    Sparkles
} from "lucide-react";
import { TbDental } from "react-icons/tb";
import Image from "next/image";
import Link from "next/link";

function ModernHeroSection() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Static hero content - no more slider
    const heroContent = {
        title: "Technologie Avancée",
        subtitle: "pour Professionnels",
        description: "Des solutions technologiques de pointe qui révolutionnent les soins dentaires avec précision, efficacité et confort.",
        cta: "Voir les Innovations",
        image: "/api/placeholder/600/500"
    };

    // Dynamic stats - will be loaded from API
    const [stats, setStats] = useState([
        { number: "500+", label: "Clients Satisfaits", icon: <Users className="h-5 w-5" /> },
        { number: "15+", label: "Années d'Expérience", icon: <Award className="h-5 w-5" /> },
        { number: "1000+", label: "Produits Disponibles", icon: <Zap className="h-5 w-5" /> },
        { number: "98%", label: "Taux de Satisfaction", icon: <Star className="h-5 w-5" /> }
    ])

    // Load real stats from analytics API
    useEffect(() => {
        const loadStats = async () => {
            try {
                const response = await fetch('/api/analytics?timeRange=all')
                if (response.ok) {
                    const data = await response.json()
                    setStats([
                        {
                            number: `${data.totalCustomers}+`,
                            label: "Clients Satisfaits",
                            icon: <Users className="h-5 w-5" />
                        },
                        {
                            number: "15+",
                            label: "Années d'Expérience",
                            icon: <Award className="h-5 w-5" />
                        },
                        {
                            number: `${data.totalProducts}+`,
                            label: "Produits Disponibles",
                            icon: <Zap className="h-5 w-5" />
                        },
                        {
                            number: "98%",
                            label: "Taux de Satisfaction",
                            icon: <Star className="h-5 w-5" />
                        }
                    ])
                }
            } catch (error) {
                console.error('Failed to load stats:', error)
                // Keep default stats on error
            }
        }

        loadStats()
    }, [])

    const floatingElements = [
        { id: 1, icon: <TbDental className="h-8 w-8" />, delay: 0, x: "10%", y: "20%" },
        { id: 2, icon: <ShieldCheck className="h-6 w-6" />, delay: 0.5, x: "85%", y: "15%" },
        { id: 3, icon: <Sparkles className="h-7 w-7" />, delay: 1, x: "15%", y: "80%" },
        { id: 4, icon: <Award className="h-6 w-6" />, delay: 1.5, x: "90%", y: "75%" }
    ];

    return (
        <section className="relative min-h-screen flex items-center overflow-hidden bg-professional-light">
            {/* Professional Video Background */}
            <div className="absolute inset-0">
                <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{ filter: 'brightness(0.4) contrast(1.1)' }}
                >
                    <source src="https://www.pointimplant.com/img/mainvideo2.mp4" type="video/mp4" />
                    {/* Fallback for browsers that don't support video */}
                    <div className="absolute inset-0 "></div>
                </video>

                {/* Minimal dark overlay for text readability only */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/15"></div>
                
                {/* Dynamic Animated Particles */}
                {mounted && (
                    <div className="absolute inset-0">
                        {[...Array(20)].map((_, i) => {
                            // Create consistent but varied particle behavior based on index
                            const seed = i * 137.508 // Golden angle for distribution
                            const x = (seed % window.innerWidth)
                            const y = (seed * 1.618 % window.innerHeight)
                            const duration = 2 + (i % 4) // Duration between 2-5 seconds
                            const delay = (i * 0.3) % 4 // Staggered delays

                            return (
                                <motion.div
                                    key={i}
                                    className="absolute w-2 h-2 bg-blue-300/40 rounded-full"
                                    initial={{
                                        x: x,
                                        y: y,
                                        opacity: 0
                                    }}
                                    animate={{
                                        y: [null, y - 100],
                                        opacity: [0, 1, 0]
                                    }}
                                    transition={{
                                        duration: duration,
                                        repeat: Infinity,
                                        delay: delay,
                                        ease: "easeInOut"
                                    }}
                                />
                            )
                        })}
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
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-screen pt-32 sm:pt-36 md:pt-40 pb-12 sm:pb-16 lg:pb-20">
                    {/* Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-gray-800 space-y-6 lg:space-y-8"
                    >
                        {/* Enhanced Professional Badge */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.6 }}
                        >
                            <Badge className="bg-white/95 backdrop-blur-md text-blue-800 border-white/30 hover:bg-white shadow-professional px-6 py-3 text-base font-bold">
                                <TbDental className="h-5 w-5 mr-3 text-blue-600" />
                                <span className="text-blue-800">Innovation Dentaire Professionnelle</span>
                                <Sparkles className="h-4 w-4 ml-3 text-blue-600" />
                            </Badge>
                        </motion.div>

                        {/* Enhanced Professional Title */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.8 }}
                        >
                            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight text-white">
                                {heroContent.title}
                                <span className="block text-blue-300 mt-2">
                                    {heroContent.subtitle}
                                </span>
                            </h1>
                        </motion.div>

                        {/* Description */}
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6, duration: 0.8 }}
                            className="text-lg sm:text-xl text-white leading-relaxed max-w-2xl"
                        >
                            {heroContent.description}
                        </motion.p>

                        {/* Enhanced Professional CTA Buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8, duration: 0.8 }}
                            className="flex flex-col sm:flex-row gap-6"
                        >
                            <Link href="/catalog">
                                <Button
                                    size="lg"
                                    className="gradient-bg-blue hover:shadow-professional-hover text-white px-10 py-5 rounded-2xl shadow-professional transition-all duration-500 group font-bold text-lg"
                                >
                                    <span className="font-bold">{heroContent.cta}</span>
                                    <ArrowRight className="ml-3 h-6 w-6 transition-transform group-hover:translate-x-2" />
                                </Button>
                            </Link>
                        </motion.div>

                        {/* Enhanced Professional Stats */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1, duration: 0.8 }}
                            className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 pt-8 lg:pt-12"
                        >
                            {stats.map((stat, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 1.2 + index * 0.1, duration: 0.5 }}
                                    className="text-center bg-white/95 backdrop-blur-md rounded-2xl p-4 lg:p-6 border-white/30 shadow-professional hover:shadow-professional-hover transition-all duration-300"
                                >
                                    <div className="flex justify-center mb-3 text-blue-600">
                                        {stat.icon}
                                    </div>
                                    <div className="text-2xl lg:text-3xl font-bold text-blue-700 mb-2">
                                        {stat.number}
                                    </div>
                                    <div className="text-sm lg:text-base text-gray-700 font-medium">
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
                            {/* Professional Hero Image */}
                            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                                <Image
                                    src="/hero-image.png"
                                    alt="Équipements Dentaires Professionnels"
                                    width={600}
                                    height={500}
                                    className="w-full h-[300px] sm:h-[400px] lg:h-[500px] object-cover"
                                    priority
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 via-transparent to-blue-600/10"></div>
                            </div>

                            {/* Floating Cards */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 1.2, duration: 0.6 }}
                                className="absolute -top-4 -left-4 lg:-top-6 lg:-left-6 bg-white rounded-2xl p-3 lg:p-4 shadow-xl"
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
                                className="absolute -bottom-4 -right-4 lg:-bottom-6 lg:-right-6 bg-white rounded-2xl p-3 lg:p-4 shadow-xl"
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


            </div>
        </section>
    );
}

export default ModernHeroSection;
