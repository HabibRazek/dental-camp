"use client";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Award,
    Users,
    TrendingUp,
    ArrowRight,
    Shield
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

function AboutSection() {
    const stats = [
        {
            number: "15+",
            label: "Années d'expertise",
            icon: <Award className="h-5 w-5" />
        },
        {
            number: "300+",
            label: "Dentistes partenaires",
            icon: <Users className="h-5 w-5" />
        },
        {
            number: "500+",
            label: "Équipements installés",
            icon: <TrendingUp className="h-5 w-5" />
        }
    ];

    return (
        <section className="py-16 sm:py-20 lg:py-24 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                    {/* Professional Content Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="space-y-8"
                    >
                        {/* Professional Badge */}
                        <Badge className="bg-blue-600 text-white px-6 py-2 text-sm font-semibold">
                            <Shield className="h-4 w-4 mr-2" />
                            Excellence Professionnelle
                        </Badge>

                        {/* Clean Title */}
                        <div>
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                                Équipements dentaires
                                <span className="text-blue-600 block">de haute précision</span>
                            </h2>

                            <p className="text-lg text-gray-700 leading-relaxed mb-6">
                                Spécialisés dans les technologies dentaires avancées, nous fournissons aux
                                professionnels des équipements certifiés pour l&apos;implantologie et la chirurgie dentaire.
                            </p>

                            <p className="text-base text-gray-600 leading-relaxed">
                                Solutions complètes certifiées CE, conformes aux standards européens
                                les plus exigeants pour votre pratique professionnelle.
                            </p>
                        </div>

                        {/* Professional Stats */}
                        <div className="grid grid-cols-3 gap-6 sm:gap-8">
                            {stats.map((stat, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                    className="text-center bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
                                >
                                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                                        <div className="text-blue-600">
                                            {stat.icon}
                                        </div>
                                    </div>
                                    <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                                        {stat.number}
                                    </div>
                                    <div className="text-sm text-gray-600 font-medium">
                                        {stat.label}
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Professional CTA */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            viewport={{ once: true }}
                        >
                            <Button
                                size="lg"
                                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200"
                                asChild
                            >
                                <Link href="/about">
                                    En savoir plus
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Link>
                            </Button>
                        </motion.div>

                        
                    </motion.div>

                    {/* Professional Image Section */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        viewport={{ once: true }}
                        className="relative"
                    >
                        {/* Clean Image Container */}
                        <div className="relative rounded-2xl overflow-hidden shadow-xl">
                            <Image
                                src="/implant.gif"
                                alt="Équipements Dentaires Professionnels"
                                width={600}
                                height={450}
                                className="w-full h-[350px] sm:h-[450px] object-cover"
                                priority
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                        </div>

                        {/* Professional Certification Badge */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            viewport={{ once: true }}
                            className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-lg p-6 border border-gray-100"
                        >
                            <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <Shield className="h-6 w-6 text-blue-600" />
                                </div>
                                <div>
                                    <div className="font-bold text-gray-900">Certifié CE & ISO</div>
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
