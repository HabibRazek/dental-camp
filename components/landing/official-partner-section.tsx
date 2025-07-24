"use client";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
    Award,
    ExternalLink,
    Star,
    Shield,
    CheckCircle,
    Globe
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

function OfficialPartnerSection() {
    return (
        <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-blue-50 via-white to-gray-50 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-30">
                <div className="absolute top-20 left-20 w-32 h-32 bg-blue-100 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 right-20 w-40 h-40 bg-blue-50 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-blue-100 rounded-full blur-2xl"></div>
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="text-center mb-12 sm:mb-16"
                >
                    <Badge className="mb-6 bg-blue-100 text-blue-700 px-6 py-3 text-base font-bold">
                        <Award className="h-5 w-5 mr-3" />
                        Partenaire Officiel
                    </Badge>
                    
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                        Notre Partenaire de
                        <span className="block bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                            Confiance Premium
                        </span>
                    </h2>
                    
                    <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        En collaboration avec Point Implant, nous vous offrons l&apos;excellence en matière d&apos;implantologie dentaire
                    </p>
                </motion.div>

                {/* Partner Card */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    viewport={{ once: true }}
                    className="max-w-4xl mx-auto"
                >
                    <Card className="overflow-hidden border-0 shadow-2xl bg-white/80 backdrop-blur-sm hover:shadow-3xl transition-all duration-500 group">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                            {/* Left Side - Partner Info */}
                            <div className="p-8 sm:p-12 flex flex-col justify-center">
                                <div className="mb-8">
                                    <Image
                                        src="/point-implant-logo.png"
                                        alt="Point Implant - Partenaire Officiel"
                                        width={200}
                                        height={100}
                                        className="h-16 w-auto object-contain mb-6 group-hover:scale-105 transition-transform duration-300"
                                    />
                                    
                                    <div className="flex items-center gap-2 mb-4">
                                        <Shield className="h-5 w-5 text-blue-600" />
                                        <span className="text-blue-600 font-semibold">Partenaire Officiel Premium</span>
                                    </div>
                                    
                                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                                        Point Implant
                                    </h3>
                                    
                                    <p className="text-gray-600 leading-relaxed mb-6">
                                        Leader européen en implantologie dentaire, Point Implant propose des solutions innovantes 
                                        et des formations de haute qualité pour les professionnels dentaires.
                                    </p>
                                </div>

                                {/* Partnership Benefits */}
                                <div className="space-y-3 mb-8">
                                    {[
                                        "Implants de qualité premium",
                                        "Formation professionnelle certifiée",
                                        "Support technique expert",
                                        "Innovation technologique"
                                    ].map((benefit, index) => (
                                        <div key={index} className="flex items-center gap-3">
                                            <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                                            <span className="text-gray-700">{benefit}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* CTA Button */}
                                <Button
                                    asChild
                                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 w-fit"
                                >
                                    <Link 
                                        href="https://www.pointimplant.com/" 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2"
                                    >
                                        <Globe className="h-5 w-5" />
                                        Visiter Point Implant
                                        <ExternalLink className="h-4 w-4" />
                                    </Link>
                                </Button>
                            </div>

                            {/* Right Side - Visual */}
                            <div className="relative bg-gradient-to-br from-blue-500 to-blue-700 p-8 sm:p-12 flex items-center justify-center">
                                {/* Decorative Elements */}
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-transparent"></div>
                                <div className="absolute top-4 right-4 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
                                <div className="absolute bottom-4 left-4 w-16 h-16 bg-white/10 rounded-full blur-lg"></div>
                                
                                {/* Content */}
                                <div className="relative text-center text-white">
                                    <div className="bg-white/20 rounded-full p-6 mb-6 mx-auto w-fit backdrop-blur-sm">
                                        <Award className="h-12 w-12 text-white" />
                                    </div>
                                    
                                    <h4 className="text-2xl font-bold mb-4">
                                        Excellence Certifiée
                                    </h4>
                                    
                                    <div className="flex items-center justify-center gap-1 mb-4">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                                        ))}
                                    </div>
                                    
                                    <p className="text-blue-100 leading-relaxed">
                                        Partenariat stratégique pour l&apos;excellence en implantologie dentaire
                                    </p>
                                    
                                    <div className="mt-6 grid grid-cols-2 gap-4 text-center">
                                        <div>
                                            <div className="text-2xl font-bold">15+</div>
                                            <div className="text-sm text-blue-200">Années d&apos;expérience</div>
                                        </div>
                                        <div>
                                            <div className="text-2xl font-bold">1000+</div>
                                            <div className="text-sm text-blue-200">Professionnels formés</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </motion.div>
            </div>
        </section>
    );
}

export default OfficialPartnerSection;
