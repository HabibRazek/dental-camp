"use client";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
    Stethoscope, 
    Award, 
    Users, 
    TrendingUp,
    ArrowRight
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
// import dentalequipment from "@/public/images/dental-equipment.jpg";

function AboutSection() {
    const stats = [
        { number: "15+", label: "Années d'expérience", icon: <Award className="h-5 w-5" /> },
        { number: "500+", label: "Clients satisfaits", icon: <Users className="h-5 w-5" /> },
        { number: "1000+", label: "Produits disponibles", icon: <TrendingUp className="h-5 w-5" /> }
    ];

    return (
        <section className="py-20 bg-gradient-to-br from-white to-blue-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    {/* Text Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="space-y-8"
                    >
                        <div>
                            <Badge className="mb-4 bg-blue-100 text-blue-700 hover:bg-blue-200">
                                <Stethoscope className="h-4 w-4 mr-2" />
                                À propos de nous
                            </Badge>
                            
                            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                                Votre partenaire de confiance en équipements médicaux
                            </h2>
                            
                            <p className="text-lg text-gray-600 leading-relaxed mb-6">
                                Depuis plus de 15 ans, nous nous engageons à fournir aux professionnels de santé 
                                les équipements médicaux et dentaires de la plus haute qualité. Notre expertise 
                                et notre service client exceptionnel font de nous le choix privilégié des 
                                praticiens en Tunisie et dans la région.
                            </p>
                            
                            <p className="text-gray-600 leading-relaxed">
                                Nous proposons une gamme complète d'instruments, d'équipements de diagnostic, 
                                de solutions de stérilisation et de consommables médicaux, tous certifiés 
                                et conformes aux normes internationales les plus strictes.
                            </p>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-6">
                            {stats.map((stat, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                    className="text-center"
                                >
                                    <div className="flex justify-center mb-2 text-blue-600">
                                        {stat.icon}
                                    </div>
                                    <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                                        {stat.number}
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        {stat.label}
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* CTA Button */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            viewport={{ once: true }}
                        >
                            <Button
                                size="lg"
                                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                                asChild
                            >
                                <Link href="/about">
                                    En savoir plus
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Link>
                            </Button>
                        </motion.div>
                    </motion.div>

                    {/* Image */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        viewport={{ once: true }}
                        className="relative"
                    >
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                            <div className="w-full h-[400px] bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                                <div className="text-center text-white">
                                    <Stethoscope className="h-20 w-20 mx-auto mb-4 opacity-50" />
                                    <p className="text-lg font-semibold">Équipements Médicaux de Qualité</p>
                                </div>
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 to-transparent"></div>
                        </div>
                        
                        {/* Floating Card */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.6 }}
                            viewport={{ once: true }}
                            className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-xl p-6 border border-gray-100"
                        >
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                    <Award className="h-6 w-6 text-blue-600" />
                                </div>
                                <div>
                                    <div className="font-semibold text-gray-900">Certifié CE & ISO</div>
                                    <div className="text-sm text-gray-600">Qualité garantie</div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

export default AboutSection;
