"use client";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { 
    Star, 
    Quote, 
    Users, 
    MapPin, 
    Award,
    ChevronLeft,
    ChevronRight,
    Play,
    Sparkles
} from "lucide-react";
import { TbDental } from "react-icons/tb";
import { useState, useEffect } from "react";
import Image from "next/image";

function ModernTestimonialsSection() {
    const [currentTestimonial, setCurrentTestimonial] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    const testimonials = [
        {
            id: 1,
            name: "Dr. Ahmed Ben Ali",
            title: "Chirurgien-Dentiste",
            clinic: "Clinique Dentaire Moderne",
            location: "Tunis, Tunisie",
            rating: 5,
            testimonial: "Dental Camp a révolutionné notre pratique. Les équipements sont d'une qualité exceptionnelle et le service client est remarquable. Nous recommandons vivement leurs produits à tous nos confrères.",
            image: "/api/placeholder/80/80",
            speciality: "Implantologie",
            experience: "15+ ans",
            highlight: "Équipements de qualité exceptionnelle"
        },
        {
            id: 2,
            name: "Dr. Fatima Mansouri",
            title: "Orthodontiste",
            clinic: "Cabinet d'Orthodontie Avancée",
            location: "Sfax, Tunisie",
            rating: 5,
            testimonial: "L'accompagnement de l'équipe Dental Camp est exceptionnel. De la formation à la maintenance, tout est parfaitement organisé. Nos patients bénéficient maintenant de soins de très haute qualité.",
            image: "/api/placeholder/80/80",
            speciality: "Orthodontie",
            experience: "12+ ans",
            highlight: "Accompagnement exceptionnel"
        },
        {
            id: 3,
            name: "Dr. Mohamed Trabelsi",
            title: "Parodontiste",
            clinic: "Centre de Parodontologie",
            location: "Sousse, Tunisie",
            rating: 5,
            testimonial: "Innovation, fiabilité et performance : Dental Camp réunit tous les critères que nous recherchons. Leurs équipements nous permettent d'offrir des traitements de pointe à nos patients.",
            image: "/api/placeholder/80/80",
            speciality: "Parodontologie",
            experience: "18+ ans",
            highlight: "Innovation et performance"
        },
        {
            id: 4,
            name: "Dr. Leila Hamdi",
            title: "Endodontiste",
            clinic: "Clinique Spécialisée",
            location: "Monastir, Tunisie",
            rating: 5,
            testimonial: "Le support technique 24/7 est un véritable atout. Nous n'avons jamais eu de problème non résolu rapidement. C'est un partenariat de confiance qui dure depuis des années.",
            image: "/api/placeholder/80/80",
            speciality: "Endodontie",
            experience: "10+ ans",
            highlight: "Support technique 24/7"
        }
    ];

    const stats = [
        { number: "500+", label: "Professionnels", icon: <Users className="h-5 w-5" /> },
        { number: "98%", label: "Satisfaction", icon: <Star className="h-5 w-5" /> },
        { number: "15+", label: "Années", icon: <Award className="h-5 w-5" /> },
        { number: "24/7", label: "Support", icon: <TbDental className="h-5 w-5" /> }
    ];

    useEffect(() => {
        if (!isAutoPlaying) return;
        
        const interval = setInterval(() => {
            setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
        }, 5000);
        
        return () => clearInterval(interval);
    }, [isAutoPlaying, testimonials.length]);

    const nextTestimonial = () => {
        setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
        setIsAutoPlaying(false);
    };

    const prevTestimonial = () => {
        setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
        setIsAutoPlaying(false);
    };

    const currentData = testimonials[currentTestimonial];

    return (
        <section className="py-20 bg-gradient-to-br from-blue-50 via-white to-blue-100 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0">
                <div className="absolute top-20 left-20 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 right-20 w-40 h-40 bg-blue-400/20 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-blue-300/20 rounded-full blur-3xl"></div>
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
                    <Badge className="mb-4 bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200 backdrop-blur-sm">
                        <Quote className="h-4 w-4 mr-2" />
                        Témoignages clients
                        <Sparkles className="h-3 w-3 ml-2 text-blue-500" />
                    </Badge>

                    <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
                        Ce que disent nos clients
                    </h2>

                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Découvrez pourquoi plus de 500 professionnels de santé 
                        nous font confiance pour leurs équipements dentaires.
                    </p>
                </motion.div>

                {/* Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    viewport={{ once: true }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
                >
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="text-center bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-blue-200"
                        >
                            <div className="flex justify-center mb-3 text-blue-400">
                                {stat.icon}
                            </div>
                            <div className="text-3xl font-bold text-gray-800 mb-2">
                                {stat.number}
                            </div>
                            <div className="text-gray-600 font-medium">
                                {stat.label}
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Main Testimonial */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="relative"
                >
                    <Card className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border-0 overflow-hidden">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                            {/* Content */}
                            <div className="p-8 lg:p-12">
                                {/* Quote Icon */}
                                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6">
                                    <Quote className="h-8 w-8 text-white" />
                                </div>

                                {/* Rating */}
                                <div className="flex items-center gap-2 mb-6">
                                    {[...Array(currentData.rating)].map((_, i) => (
                                        <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                                    ))}
                                    <span className="text-gray-600 ml-2 font-medium">
                                        {currentData.rating}.0/5
                                    </span>
                                </div>

                                {/* Testimonial */}
                                <blockquote className="text-xl text-gray-700 leading-relaxed mb-8 font-medium">
                                    "{currentData.testimonial}"
                                </blockquote>

                                {/* Highlight */}
                                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 mb-8">
                                    <div className="flex items-center gap-3">
                                        <Sparkles className="h-5 w-5 text-purple-600" />
                                        <span className="font-semibold text-gray-900">
                                            {currentData.highlight}
                                        </span>
                                    </div>
                                </div>

                                {/* Author Info */}
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                                        <TbDental className="h-8 w-8 text-blue-600" />
                                    </div>
                                    <div>
                                        <div className="font-bold text-gray-900 text-lg">
                                            {currentData.name}
                                        </div>
                                        <div className="text-blue-600 font-semibold">
                                            {currentData.title}
                                        </div>
                                        <div className="text-gray-600 text-sm">
                                            {currentData.clinic}
                                        </div>
                                        <div className="flex items-center gap-1 text-gray-500 text-sm mt-1">
                                            <MapPin className="h-3 w-3" />
                                            {currentData.location}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Side Info */}
                            <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-8 lg:p-12 text-white flex flex-col justify-center">
                                <div className="space-y-8">
                                    <div>
                                        <h3 className="text-2xl font-bold mb-4">
                                            Profil Professionnel
                                        </h3>
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3">
                                                <Award className="h-5 w-5 text-blue-200" />
                                                <div>
                                                    <div className="font-semibold">Spécialité</div>
                                                    <div className="text-blue-100">{currentData.speciality}</div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Users className="h-5 w-5 text-blue-200" />
                                                <div>
                                                    <div className="font-semibold">Expérience</div>
                                                    <div className="text-blue-100">{currentData.experience}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                                        <div className="flex items-center gap-3 mb-3">
                                            <Play className="h-5 w-5" />
                                            <span className="font-semibold">Témoignage Vidéo</span>
                                        </div>
                                        <p className="text-blue-100 text-sm">
                                            Regardez le témoignage complet de {currentData.name.split(' ')[1]}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Navigation */}
                    <div className="flex items-center justify-between mt-8">
                        <button
                            onClick={prevTestimonial}
                            className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300"
                        >
                            <ChevronLeft className="h-6 w-6" />
                        </button>

                        <div className="flex gap-3">
                            {testimonials.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => {
                                        setCurrentTestimonial(index);
                                        setIsAutoPlaying(false);
                                    }}
                                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                        index === currentTestimonial 
                                            ? 'bg-white scale-125' 
                                            : 'bg-white/40 hover:bg-white/60'
                                    }`}
                                />
                            ))}
                        </div>

                        <button
                            onClick={nextTestimonial}
                            className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300"
                        >
                            <ChevronRight className="h-6 w-6" />
                        </button>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

export default ModernTestimonialsSection;
