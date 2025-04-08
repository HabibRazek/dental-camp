"use client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, ShieldCheck, Star, Truck } from "lucide-react";
import { TbDental, TbDentalOff } from "react-icons/tb";
import Image from "next/image";
import dentalEquipmentImage from "@/public/images/dental-equipment.jpg";

function HeroSection() {
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

    return (
        <section className="relative min-h-screen flex items-center py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
            {/* Blue radial gradient background */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-50 via-blue-100 to-white opacity-70"></div>
            
            {/* Decorative subtle grid pattern */}
            <div className="absolute inset-0 bg-[url('/images/dental-pattern.svg')] opacity-10"></div>
            
            <div className="container mx-auto relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Content Section */}
                    <div className="space-y-6 max-w-xl mx-auto lg:mx-0">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Badge className="mb-4 bg-blue-100 text-blue-600 hover:bg-blue-200">
                                <TbDental className="h-4 w-4 mr-2" />
                                Dental Professionals&lsquo; Choice
                            </Badge>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-gray-900">
                                Premium Dental Supplies,
                                <motion.span 
                                    className="block mt-2 bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.3, duration: 1 }}
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
                                Equip your practice with industry-leading instruments, materials, 
                                and technology trusted by dental professionals worldwide.
                            </motion.p>
                        </motion.div>

                        <motion.div
                            className="flex flex-wrap gap-4 mt-8"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <Button 
                                size="lg" 
                                className="rounded-full gap-2 bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-blue-200 transition-all"
                            >
                                Browse Catalog
                                <ArrowRight className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="lg"
                                className="rounded-full gap-2 border-blue-300 text-blue-600 hover:bg-blue-50"
                            >
                                <TbDentalOff className="h-4 w-4" />
                                Practice Solutions
                            </Button>
                        </motion.div>

                        <motion.div
                            className="flex flex-wrap items-center gap-6 mt-12"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                        >
                            <div className="flex items-center gap-2">
                                <div className="flex -space-x-3">
                                    {[1, 2, 3, 4].map((i) => (
                                        <motion.div
                                            key={i}
                                            className="w-10 h-10 rounded-full border-2 border-white bg-blue-100 flex items-center justify-center"
                                            initial={{ x: -20 * i, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            transition={{ delay: 0.1 * i, duration: 0.5 }}
                                        >
                                            <TbDental className="h-5 w-5 text-blue-600" />
                                        </motion.div>
                                    ))}
                                </div>
                                <div>
                                    <div className="flex items-center">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className="h-4 w-4 fill-blue-400 text-blue-400"
                                            />
                                        ))}
                                    </div>
                                    <p className="text-sm text-blue-600">Trusted by 5,000+ Practices</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Image Section */}
                    <motion.div
                        className="relative"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.7 }}
                    >
                        <div className="relative z-10 bg-white rounded-2xl shadow-xl overflow-hidden aspect-video border-4 border-blue-100">
                            <Image
                                src={dentalEquipmentImage}
                                alt="Professional dental equipment and supplies"
                                className="w-full h-full object-cover"
                                priority
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-blue-900/70 via-transparent to-transparent p-6 flex flex-col justify-end">
                                <h3 className="text-white font-bold text-xl">Dental Operatory Package</h3>
                                <p className="text-blue-100 text-sm">Complete setup for modern practices</p>
                            </div>
                        </div>

                        {/* Floating features */}
                        {features.map((feature, i) => (
                            <motion.div
                                key={i}
                                className={`absolute ${feature.position} bg-white rounded-xl shadow-lg p-3 w-40 z-20 border border-blue-100`}
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: feature.delay, duration: 0.5 }}
                                whileHover={{ scale: 1.05 }}
                            >
                                <div className="flex items-center gap-2">
                                    <div className={`w-8 h-8 rounded-full ${feature.bg} flex items-center justify-center`}>
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

            {/* Scroll indicator */}
            <motion.div
                className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
            >
                <p className="text-sm text-blue-600 mb-2">Explore Our Products</p>
                <div className="w-6 h-10 rounded-full border-2 border-blue-200 flex items-center justify-center">
                    <motion.div
                        className="w-1.5 h-1.5 bg-blue-400 rounded-full"
                        animate={{ y: [0, 4, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                    />
                </div>
            </motion.div>
        </section>
    );
}

export default HeroSection;