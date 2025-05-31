"use client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, ShieldCheck, Truck, Sparkles } from "lucide-react";
import { TbDental, TbDentalOff } from "react-icons/tb";
import Image from "next/image";
import dentalEquipmentImage from "@/public/images/dental-equipment.jpg";
import { useEffect, useState } from "react";

function HeroSection() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const features = [
        {
            icon: <ShieldCheck className="h-4 w-4 text-blue-600" />,
            title: "Certified Quality",
            subtitle: "ADA & CE Approved",
            bg: "bg-blue-100",
            position: "top-0 right-0 lg:-top-10 lg:-right-10",
            delay: 0.8
        },
        {
            icon: <Truck className="h-4 w-4 text-blue-600" />,
            title: "Fast Shipping",
            subtitle: "Next-Day Available",
            bg: "bg-blue-100",
            position: "bottom-0 left-0 lg:-bottom-6 lg:-left-6",
            delay: 1
        }
    ];

    const floatingIcons = [
        { 
            id: 1, 
            left: "20%", 
            top: "15%", 
            icon: <TbDental className="h-8 w-8 lg:h-10 lg:w-10" />,
            rotate: 30,
            yOffset: 15
        },
        { 
            id: 2, 
            left: "80%", 
            top: "10%", 
            icon: <TbDental className="h-8 w-8 lg:h-10 lg:w-10" />,
            rotate: 30,
            yOffset: 15
        },
        { 
            id: 3, 
            left: "40%", 
            top: "70%", 
            icon: <TbDental className="h-8 w-8 lg:h-10 lg:w-10" />,
            rotate: 45,
            yOffset: 20
        }
        
    ];

    return (
        <section className="relative min-h-screen flex items-center py-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-b from-blue-400 to-white">
            {/* Background elements */}
            <div className="absolute inset-0 overflow-hidden">
                {/* Static wave pattern */}
                
                {/* Client-side only floating icons */}
                {mounted && floatingIcons.map((icon) => (
                    <motion.div
                        key={icon.id}
                        className="absolute text-blue-900"
                        initial={{ 
                            y: 0,
                            rotate: icon.rotate,
                            opacity: 0
                        }}
                        animate={{
                            y: [0, icon.yOffset, 0],
                            rotate: [icon.rotate, icon.rotate + 5, icon.rotate],
                            opacity: 1
                        }}
                        transition={{
                            duration: 6 + icon.id,
                            repeat: Infinity,
                            repeatType: "reverse",
                            ease: "easeInOut",
                            delay: icon.id * 0.3
                        }}
                        style={{
                            left: icon.left,
                            top: icon.top,
                        }}
                    >
                        {icon.icon}
                    </motion.div>
                ))}

                
            </div>

            <div className="container mx-auto relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Text Content */}
                    <div className="space-y-6 max-w-xl mx-auto lg:mx-0">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.2, duration: 0.5 }}
                            >
                                <Badge className="mb-4 bg-blue-100 text-blue-600 hover:bg-blue-200 shadow-sm">
                                    <TbDental className="h-4 w-4 mr-2" />
                                    <span className="font-semibold">Dental Professionals&apos; Choice</span>
                                    <motion.span
                                        className="ml-2"
                                        animate={{ scale: [1, 1.2, 1] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                    >
                                        <Sparkles className="h-3 w-3 text-yellow-500" />
                                    </motion.span>
                                </Badge>
                            </motion.div>

                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-gray-900">
                                Premium Dental Supplies,
                                <motion.span
                                    className="block mt-2 bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3, duration: 0.8 }}
                                >
                                    For Exceptional Practices
                                </motion.span>
                            </h1>

                            <motion.p
                                className="mt-4 text-lg text-gray-600"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5, duration: 0.8 }}
                            >
                                Equip your practice with top-tier dental instruments and technology trusted by professionals worldwide.
                            </motion.p>
                        </motion.div>

                        {/* Action Buttons */}
                        <motion.div
                            className="flex flex-wrap gap-4 mt-8"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <Button
                                size="lg"
                                className="rounded-full gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-lg hover:shadow-blue-200/50 transition-all group"
                            >
                                <motion.span
                                    animate={{ x: [0, 4, 0] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="inline-block"
                                >
                                    Browse Catalog
                                </motion.span>
                                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </Button>
                            <Button
                                variant="outline"
                                size="lg"
                                className="rounded-full gap-2 border-blue-300 text-blue-600 hover:bg-blue-50 backdrop-blur-sm bg-white/70"
                            >
                                <TbDentalOff className="h-4 w-4" />
                                Practice Solutions
                            </Button>
                        </motion.div>
                    </div>

                    {/* Image Section */}
                    <motion.div
                        className="relative"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.7 }}
                    >
                        <div className="relative z-10 rounded-2xl shadow-xl overflow-hidden aspect-video border border-white/20">
                            <div className="absolute inset-0 bg-blue-900/10  z-10 pointer-events-none" />
                            <Image
                                src={dentalEquipmentImage}
                                alt="Professional dental equipment and supplies"
                                width={800}
                                height={450}
                                className="w-full h-full object-cover"
                                priority
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 via-blue-800/30 to-transparent p-6 flex flex-col justify-end">
                                <motion.h3 
                                    className="text-white font-bold text-xl"
                                    initial={{ y: 10, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.8, duration: 0.5 }}
                                >
                                    Dental Operatory Package
                                </motion.h3>
                                <motion.p 
                                    className="text-blue-100 text-sm"
                                    initial={{ y: 10, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 1, duration: 0.5 }}
                                >
                                    Complete setup for modern practices
                                </motion.p>
                            </div>
                            
                        </div>

                        {/* Floating Feature Boxes */}
                        {features.map((feature, i) => (
                            <motion.div
                                key={i}
                                className={`absolute ${feature.position} bg-white rounded-xl shadow-lg p-3 w-40 z-20 border border-blue-100/50 backdrop-blur-sm`}
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: feature.delay, duration: 0.5 }}
                                whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.2)" }}
                            >
                                <div className="flex items-center gap-2">
                                    <div className={`w-8 h-8 rounded-full ${feature.bg} flex items-center justify-center shadow-inner`}>
                                        {feature.icon}
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-blue-800">{feature.title}</p>
                                        <p className="text-xs text-blue-600">{feature.subtitle}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

export default HeroSection;