"use client";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
    Phone,
    Mail,
    MapPin,
    Clock,
    Send,
    CheckCircle,
    AlertCircle,
    Loader2,
    MessageSquare,
    Headphones,
    Calendar,
    Star,
    Users,
    Award
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface FormData {
    name: string;
    email: string;
    phone: string;
    company: string;
    subject: string;
    message: string;
}

function InnovativeContactSection() {
    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        phone: '',
        company: '',
        subject: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Client-side validation
        if (!formData.name.trim()) {
            toast.error("Le nom est requis");
            return;
        }

        if (!formData.email.trim()) {
            toast.error("L'email est requis");
            return;
        }

        if (!formData.subject.trim()) {
            toast.error("Le sujet est requis");
            return;
        }

        if (!formData.message.trim()) {
            toast.error("Le message est requis");
            return;
        }

        if (formData.message.trim().length < 10) {
            toast.error("Le message doit contenir au moins 10 caractères");
            return;
        }

        setIsSubmitting(true);

        try {
            const requestData = {
                ...formData,
                source: 'landing_page'
            };

            console.log('Sending contact form data:', requestData);

            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData),
            });

            const data = await response.json();
            console.log('Contact API response:', { status: response.status, data });

            if (response.ok) {
                setIsSubmitted(true);
                toast.success(data.message || "Message envoyé avec succès!");

                // Reset form after 3 seconds
                setTimeout(() => {
                    setIsSubmitted(false);
                    setFormData({
                        name: '',
                        email: '',
                        phone: '',
                        company: '',
                        subject: '',
                        message: ''
                    });
                }, 3000);
            } else {
                // Handle validation errors from API
                if (data.details && Array.isArray(data.details)) {
                    const errorMessages = data.details.map((detail: any) =>
                        `${detail.field}: ${detail.message}`
                    ).join(', ');
                    toast.error(`Erreur de validation: ${errorMessages}`);
                } else {
                    toast.error(data.error || "Erreur lors de l'envoi du message");
                }
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            toast.error("Erreur de connexion. Veuillez réessayer.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const contactInfo = [
        {
            icon: <Phone className="h-6 w-6" />,
            title: "Téléphone",
            details: ["+216 51 407 444", "+216 53 761 761"],
            color: "blue"
        },
        {
            icon: <Mail className="h-6 w-6" />,
            title: "Email",
            details: ["contact@dentalcamp.tn", "commande@dentalcamp.tn"],
            color: "green"
        },
        {
            icon: <MapPin className="h-6 w-6" />,
            title: "Adresse",
            details: ["Tunis, Tunisie", "Zone industrielle"],
            color: "purple"
        },
        {
            icon: <Clock className="h-6 w-6" />,
            title: "Horaires",
            details: ["Lun-Ven: 8h-18h", "Sam: 8h-13h"],
            color: "orange"
        }
    ];

    const features = [
        {
            icon: <Headphones className="h-8 w-8" />,
            title: "Support 24/7",
            description: "Assistance technique disponible en permanence"
        },
        {
            icon: <Calendar className="h-8 w-8" />,
            title: "Consultation gratuite",
            description: "Rendez-vous personnalisé pour vos besoins"
        },
        {
            icon: <Award className="h-8 w-8" />,
            title: "Expertise reconnue",
            description: "15+ années d'expérience dans le domaine"
        }
    ];

    const stats = [
        { number: "500+", label: "Clients satisfaits" },
        { number: "24h", label: "Temps de réponse" },
        { number: "98%", label: "Taux de satisfaction" }
    ];

    return (
        <section className="py-20 bg-gradient-to-br from-blue-50 via-white to-blue-100 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute top-20 left-20 w-32 h-32 bg-blue-500 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 right-20 w-40 h-40 bg-blue-400 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-blue-300 rounded-full blur-3xl"></div>
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
                    <Badge className="mb-4 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 hover:from-blue-200 hover:to-blue-300">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Contactez-nous
                    </Badge>
                    
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                        Parlons de vos besoins
                    </h2>
                    
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Notre équipe d'experts est là pour vous accompagner dans tous vos projets. 
                        Contactez-nous pour une consultation personnalisée.
                    </p>
                </motion.div>

                {/* Stats Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    viewport={{ once: true }}
                    className="grid grid-cols-3 gap-8 mb-16"
                >
                    {stats.map((stat, index) => (
                        <div key={index} className="text-center">
                            <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">
                                {stat.number}
                            </div>
                            <div className="text-gray-600 font-medium">
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </motion.div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <Card className="p-8 shadow-2xl border-0 bg-white/80 backdrop-blur-sm rounded-3xl">
                            {isSubmitted ? (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-center py-12"
                                >
                                    <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                        Message envoyé !
                                    </h3>
                                    <p className="text-gray-600">
                                        Nous vous répondrons dans les plus brefs délais.
                                    </p>
                                </motion.div>
                            ) : (
                                <>
                                    <div className="mb-8">
                                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                            Envoyez-nous un message
                                        </h3>
                                        <p className="text-gray-600">
                                            Remplissez le formulaire ci-dessous et nous vous répondrons rapidement.
                                        </p>
                                    </div>

                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                    Nom complet *
                                                </label>
                                                <Input
                                                    type="text"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleInputChange}
                                                    required
                                                    className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl"
                                                    placeholder="Votre nom"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                    Email *
                                                </label>
                                                <Input
                                                    type="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleInputChange}
                                                    required
                                                    className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl"
                                                    placeholder="votre@email.com"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                    Téléphone
                                                </label>
                                                <Input
                                                    type="tel"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleInputChange}
                                                    className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl"
                                                    placeholder="+216 XX XXX XXX"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                    Entreprise
                                                </label>
                                                <Input
                                                    type="text"
                                                    name="company"
                                                    value={formData.company}
                                                    onChange={handleInputChange}
                                                    className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl"
                                                    placeholder="Nom de votre entreprise"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Sujet *
                                            </label>
                                            <Input
                                                type="text"
                                                name="subject"
                                                value={formData.subject}
                                                onChange={handleInputChange}
                                                required
                                                className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl"
                                                placeholder="Sujet de votre message"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Message *
                                            </label>
                                            <Textarea
                                                name="message"
                                                value={formData.message}
                                                onChange={handleInputChange}
                                                required
                                                rows={5}
                                                className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl resize-none"
                                                placeholder="Décrivez vos besoins en détail... (minimum 10 caractères)"
                                            />
                                            <div className="flex justify-between items-center mt-1">
                                                <p className={`text-xs ${
                                                    formData.message.length < 10
                                                        ? 'text-red-500'
                                                        : 'text-gray-500'
                                                }`}>
                                                    {formData.message.length < 10
                                                        ? `${10 - formData.message.length} caractères manquants`
                                                        : 'Minimum atteint ✓'
                                                    }
                                                </p>
                                                <p className="text-xs text-gray-400">
                                                    {formData.message.length}/2000
                                                </p>
                                            </div>
                                        </div>

                                        <Button
                                            type="submit"
                                            disabled={isSubmitting || !formData.name.trim() || !formData.email.trim() || !formData.subject.trim() || formData.message.trim().length < 10}
                                            className="w-full h-12 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                                                    Envoi en cours...
                                                </>
                                            ) : (
                                                <>
                                                    <Send className="h-5 w-5 mr-2" />
                                                    Envoyer le message
                                                </>
                                            )}
                                        </Button>
                                    </form>
                                </>
                            )}
                        </Card>
                    </motion.div>

                    {/* Contact Info & Features */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        viewport={{ once: true }}
                        className="space-y-8"
                    >
                        {/* Contact Information */}
                        <Card className="p-8 shadow-xl border-0 bg-white/80 backdrop-blur-sm rounded-3xl">
                            <h3 className="text-2xl font-bold text-gray-900 mb-6">
                                Informations de contact
                            </h3>

                            <div className="space-y-6">
                                {contactInfo.map((info, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: index * 0.1 }}
                                        viewport={{ once: true }}
                                        className="flex items-start gap-4"
                                    >
                                        <div className={`p-3 rounded-xl ${
                                            info.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                                            info.color === 'green' ? 'bg-blue-100 text-blue-600' :
                                            info.color === 'purple' ? 'bg-blue-200 text-blue-700' :
                                            'bg-orange-100 text-orange-600'
                                        }`}>
                                            {info.icon}
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900 mb-1">
                                                {info.title}
                                            </h4>
                                            {info.details.map((detail, idx) => (
                                                <p key={idx} className={`font-medium ${
                                                    info.color === 'blue' ? 'text-blue-600' :
                                                    info.color === 'green' ? 'text-blue-600' :
                                                    info.color === 'purple' ? 'text-blue-700' :
                                                    'text-orange-600'
                                                }`}>
                                                    {detail}
                                                </p>
                                            ))}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </Card>

                        {/* Features */}
                        <Card className="p-8 shadow-xl border-0 bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl">
                            <h3 className="text-2xl font-bold text-gray-900 mb-6">
                                Pourquoi nous choisir ?
                            </h3>

                            <div className="space-y-6">
                                {features.map((feature, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: 20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.5, delay: index * 0.1 }}
                                        viewport={{ once: true }}
                                        className="flex items-start gap-4"
                                    >
                                        <div className="p-3 bg-white rounded-xl shadow-md text-blue-600">
                                            {feature.icon}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900 mb-2">
                                                {feature.title}
                                            </h4>
                                            <p className="text-gray-600">
                                                {feature.description}
                                            </p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </Card>

                        {/* Testimonial */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            viewport={{ once: true }}
                        >
                            <Card className="p-8 shadow-xl border-0 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-3xl">
                                <div className="flex items-center gap-2 mb-4">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="h-5 w-5 text-yellow-300 fill-current" />
                                    ))}
                                </div>
                                <blockquote className="text-lg font-medium mb-4">
                                    "Service exceptionnel et produits de qualité. L'équipe de Dental Camp
                                    nous accompagne depuis des années avec professionnalisme."
                                </blockquote>
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                                        <Users className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <div className="font-semibold">Dr. Ahmed Ben Ali</div>
                                        <div className="text-blue-100">Clinique Dentaire Moderne</div>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    </motion.div>
                </div>

                {/* Bottom CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    viewport={{ once: true }}
                    className="text-center mt-16"
                >
                    <Card className="p-8 shadow-xl border-0 bg-white/80 backdrop-blur-sm rounded-3xl max-w-4xl mx-auto">
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">
                            Besoin d'une consultation urgente ?
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Notre équipe est disponible pour répondre à vos questions et vous conseiller
                            sur le choix des équipements adaptés à votre pratique.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button
                                size="lg"
                                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                            >
                                <Phone className="h-5 w-5 mr-2" />
                                Appeler maintenant
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-3 rounded-xl transition-all duration-300"
                            >
                                <Calendar className="h-5 w-5 mr-2" />
                                Prendre rendez-vous
                            </Button>
                        </div>
                    </Card>
                </motion.div>
            </div>
        </section>
    );
}

export default InnovativeContactSection;
