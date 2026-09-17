"use client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Phone,
    Mail,
    MapPin,
    CheckCircle,
    Loader2
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface FormData {
    name: string;
    email: string;
    subject: string;
    message: string;
}

function InnovativeContactSection() {
    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
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

        // Message is optional now, so remove the required validation
        if (formData.message.trim() && formData.message.trim().length < 10) {
            toast.error("Le message doit contenir au moins 10 caractères");
            return;
        }

        setIsSubmitting(true);

        try {
            const requestData = {
                ...formData,
                source: 'landing_page'
            };

            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData),
            });

            const data = await response.json();

            if (response.ok) {
                setIsSubmitted(true);
                toast.success(data.message || "Message envoyé avec succès!");

                // Reset form after 3 seconds
                setTimeout(() => {
                    setIsSubmitted(false);
                    setFormData({
                        name: '',
                        email: '',
                        subject: '',
                        message: ''
                    });
                }, 3000);
            } else {
                // Handle validation errors from API
                if (data.details && Array.isArray(data.details)) {
                    const errorMessages = data.details.map((detail: { field: string; message: string }) =>
                        `${detail.field}: ${detail.message}`
                    ).join(', ');
                    toast.error(`Erreur de validation: ${errorMessages}`);
                } else {
                    toast.error(data.error || "Erreur lors de l'envoi du message");
                }
            }
        } catch (err) {
            console.error('Contact form error:', err);
            toast.error("Erreur de connexion. Veuillez réessayer.");
        } finally {
            setIsSubmitting(false);
        }
    };



    return (
        <section className="py-16 bg-gray-50 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Main Content - Three Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                    {/* First Column - Contact Info */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="bg-white rounded-3xl p-6 shadow-xl"
                    >
                        {/* Header */}
                        <div className="mb-6">
                            <h2 className="text-3xl font-bold text-gray-900 mb-1">
                                Nous
                            </h2>
                            <h2 className="text-3xl font-bold text-blue-500 mb-4">
                                Contacter
                            </h2>
                            <div className="w-12 h-1 bg-blue-500 mb-4"></div>
                        </div>

                        {/* Contact Information */}
                        <div className="space-y-4">
                            {/* Phone */}
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-blue-100 rounded-lg text-blue-600 flex-shrink-0">
                                    <Phone className="h-5 w-5" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 mb-1 text-sm">N° Téléphone</h4>
                                    <p className="text-blue-600 font-medium text-sm">+216 51 407 444</p>
                                    <p className="text-blue-600 font-medium text-sm">+216 53 761 761</p>
                                </div>
                            </div>

                            {/* Email */}
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-blue-100 rounded-lg text-blue-600 flex-shrink-0">
                                    <Mail className="h-5 w-5" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 mb-1 text-sm">E-mail</h4>
                                    <p className="text-blue-600 font-medium text-sm">Contact@dentalcamp.tn</p>
                                    <p className="text-blue-600 font-medium text-sm">Commande@dentalcamp.tn</p>
                                </div>
                            </div>

                            {/* Address */}
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-blue-100 rounded-lg text-blue-600 flex-shrink-0">
                                    <MapPin className="h-5 w-5" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 mb-1 text-sm">Adresse</h4>
                                    <p className="text-blue-600 font-medium text-sm">Rue Korbus 8058</p>
                                    <p className="text-blue-600 font-medium text-sm">Mrezga Hammamet Nord</p>
                                    <p className="text-blue-600 font-medium text-sm">Nabeul Tunisia</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Second Column - Map */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        viewport={{ once: true }}
                        className="bg-white rounded-3xl p-6 shadow-xl"
                    >
                        <div className="rounded-2xl overflow-hidden shadow-lg h-full">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3194.8!2d10.401!3d36.2548!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzbCsDE1JzE3LjMiTiAxMMKwMjQnMDMuNiJF!5e0!3m2!1sen!2stn!4v1234567890"
                                width="100%"
                                height="400"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                className="w-full"
                            ></iframe>
                        </div>
                    </motion.div>
                    {/* Third Column - Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        viewport={{ once: true }}
                        className="bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 rounded-3xl p-6 shadow-xl relative overflow-hidden"
                    >
                        {/* Decorative background elements */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full blur-xl"></div>

                        {isSubmitted ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center py-12 relative z-10"
                            >
                                <CheckCircle className="h-16 w-16 text-white mx-auto mb-4" />
                                <h3 className="text-2xl font-bold text-white mb-2">
                                    Message envoyé !
                                </h3>
                                <p className="text-blue-100">
                                    Nous vous répondrons dans les plus brefs délais.
                                </p>
                            </motion.div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
                                <div>
                                    <label className="block text-white font-medium mb-2 text-sm">
                                        Votre nom
                                    </label>
                                    <Input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                        className="h-11 bg-white/90 backdrop-blur-sm border-0 rounded-xl text-gray-900 placeholder-gray-500 shadow-lg focus:bg-white focus:shadow-xl transition-all duration-300 hover:bg-white/95"
                                        placeholder=""
                                    />
                                </div>

                                <div>
                                    <label className="block text-white font-medium mb-2 text-sm">
                                        Votre e-mail
                                    </label>
                                    <Input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                        className="h-11 bg-white/90 backdrop-blur-sm border-0 rounded-xl text-gray-900 placeholder-gray-500 shadow-lg focus:bg-white focus:shadow-xl transition-all duration-300 hover:bg-white/95"
                                        placeholder=""
                                    />
                                </div>

                                <div>
                                    <label className="block text-white font-medium mb-2 text-sm">
                                        Objet
                                    </label>
                                    <Input
                                        type="text"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleInputChange}
                                        required
                                        className="h-11 bg-white/90 backdrop-blur-sm border-0 rounded-xl text-gray-900 placeholder-gray-500 shadow-lg focus:bg-white focus:shadow-xl transition-all duration-300 hover:bg-white/95"
                                        placeholder=""
                                    />
                                </div>

                                <div>
                                    <label className="block text-white font-medium mb-2 text-sm">
                                        Votre message (facultatif)
                                    </label>
                                    <Textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleInputChange}
                                        rows={5}
                                        className="bg-white/90 backdrop-blur-sm border-0 rounded-xl text-gray-900 placeholder-gray-500 resize-none shadow-lg focus:bg-white focus:shadow-xl transition-all duration-300 hover:bg-white/95"
                                        placeholder=""
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    disabled={isSubmitting || !formData.name.trim() || !formData.email.trim() || !formData.subject.trim()}
                                    className="w-full h-11 bg-blue-900/90 backdrop-blur-sm hover:bg-blue-800 text-white font-semibold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                            Envoi en cours...
                                        </>
                                    ) : (
                                        <>
                                            Envoyer
                                        </>
                                    )}
                                </Button>
                            </form>
                        )}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

export default InnovativeContactSection;
