"use client";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import {
    Star,
    CheckCircle
} from "lucide-react";

function ModernTestimonialsSection() {
    const testimonials = [
        {
            id: 1,
            name: "Mahdi Mhadhbi",
            date: "31 Janvier 2025",
            rating: 5,
            testimonial: "Une entreprise fiable proposant des produits médicaux de haute qualité. Le service client est réactif, à l'écoute et très professionnel. La livraison est...",
            verified: true,
            avatar: "/api/placeholder/40/40"
        },
        {
            id: 2,
            name: "Dr. Sarah Ben Ali",
            date: "28 Janvier 2025",
            rating: 5,
            testimonial: "Excellente qualité des équipements dentaires. L'équipe est très professionnelle et le service après-vente est remarquable. Je recommande vivement.",
            verified: true,
            avatar: "/api/placeholder/40/40"
        },
        {
            id: 3,
            name: "Dr. Ahmed Trabelsi",
            date: "25 Janvier 2025",
            rating: 5,
            testimonial: "Partenaire de confiance depuis 3 ans. Produits de qualité, livraison rapide et support technique excellent. Une référence dans le domaine.",
            verified: true,
            avatar: "/api/placeholder/40/40"
        }
    ];

    return (
        <section className="py-20 bg-gray-50">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Professional Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="mb-16"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Ils Nous Font
                        <span className="text-blue-600 block">Confiance</span>
                    </h2>

                    <p className="text-lg text-gray-600 max-w-3xl leading-relaxed">
                        Découvrez les avis et expériences de nos clients satisfaits. Ils partagent ici leurs histoires et témoignages sur
                        nos équipements et services, afin de vous aider à faire le meilleur choix. Parce que votre confiance est notre
                        priorité, lisez les retours qui témoignent de la qualité et du professionnalisme de notre équipe.
                    </p>
                </motion.div>

                {/* Google Reviews Style Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="bg-gradient-to-b from-blue-500 via-white to-transparent rounded-3xl p-8 md:p-12 text-center mb-12"
                >
                    <div className="mb-6">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">EXCELLENT</h3>
                        <div className="flex justify-center items-center gap-1 mb-2">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className="h-6 w-6 text-yellow-400 fill-current" />
                            ))}
                        </div>
                        <p className="text-gray-700 font-medium">Basée sur 14 avis</p>
                    </div>

                    <div className="flex justify-center">
                        <span className="text-2xl font-bold text-gray-900">Google</span>
                    </div>
                </motion.div>

                {/* Testimonials Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {testimonials.map((testimonial, index) => (
                        <motion.div
                            key={testimonial.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                        >
                            <Card className="p-6 h-full bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
                                {/* Header */}
                                <div className="flex items-start gap-3 mb-4">
                                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                                        <span className="text-sm font-semibold text-gray-600">
                                            {testimonial.name.charAt(0)}
                                        </span>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            {/* Google Icon SVG */}
                                            <svg width="16" height="16" viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0">
                                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                            </svg>
                                            <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                                        </div>
                                        <p className="text-sm text-gray-500">{testimonial.date}</p>
                                    </div>
                                </div>

                                {/* Rating */}
                                <div className="flex items-center gap-1 mb-4">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                                    ))}
                                    {testimonial.verified && (
                                        <CheckCircle className="h-4 w-4 text-blue-500 ml-2" />
                                    )}
                                </div>

                                {/* Testimonial */}
                                <p className="text-gray-700 text-sm leading-relaxed">
                                    {testimonial.testimonial}
                                </p>

                            
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default ModernTestimonialsSection;
