"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  ChevronDown,
  ChevronUp,
  Search,
  HelpCircle,
  Phone,
  Mail,
  MessageSquare,
  Clock,
  Shield,
  Package,
  CreditCard,
  Truck,
  ArrowRight
} from "lucide-react";
import { TbDental } from "react-icons/tb";
import Link from "next/link";
import Header from "@/components/landing/header";
import Footer from "@/components/landing/footer";

export default function FAQsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [openItems, setOpenItems] = useState<number[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", name: "Toutes les questions", icon: <HelpCircle className="h-5 w-5" /> },
    { id: "products", name: "Produits", icon: <Package className="h-5 w-5" /> },
    { id: "orders", name: "Commandes", icon: <CreditCard className="h-5 w-5" /> },
    { id: "shipping", name: "Livraison", icon: <Truck className="h-5 w-5" /> },
    { id: "support", name: "Support", icon: <MessageSquare className="h-5 w-5" /> },
    { id: "security", name: "Sécurité", icon: <Shield className="h-5 w-5" /> }
  ];

  const faqs = [
    {
      id: 1,
      category: "products",
      question: "Quels types d'équipements dentaires proposez-vous ?",
      answer: "Nous proposons une gamme complète d'équipements dentaires incluant : instruments de diagnostic, équipements de stérilisation, matériaux de restauration, instruments chirurgicaux, équipements d'imagerie, mobilier dentaire, et consommables. Tous nos produits sont certifiés CE et conformes aux normes internationales."
    },
    {
      id: 2,
      category: "products",
      question: "Vos produits sont-ils garantis ?",
      answer: "Oui, tous nos produits bénéficient d'une garantie constructeur. La durée varie selon le type d'équipement : 1 an pour les instruments, 2-3 ans pour les équipements électroniques, et jusqu'à 5 ans pour les gros équipements. Nous proposons également des extensions de garantie."
    },
    {
      id: 3,
      category: "orders",
      question: "Comment passer une commande ?",
      answer: "Vous pouvez passer commande de plusieurs façons : directement sur notre site web en ajoutant les produits à votre panier, par téléphone en contactant notre équipe commerciale, ou par email en nous envoyant votre liste de produits. Nous acceptons les commandes des professionnels de santé uniquement."
    },
    {
      id: 4,
      category: "orders",
      question: "Quels sont les moyens de paiement acceptés ?",
      answer: "Nous acceptons plusieurs moyens de paiement : virement bancaire, chèque d'entreprise, carte bancaire (pour les petites commandes), et paiement à crédit pour nos clients professionnels établis. Un acompte peut être demandé pour les grosses commandes."
    },
    {
      id: 5,
      category: "shipping",
      question: "Quels sont les délais de livraison ?",
      answer: "Les délais de livraison varient selon les produits : 2-5 jours ouvrables pour les produits en stock en Tunisie, 1-2 semaines pour les produits importés d'Europe, et 2-4 semaines pour les équipements sur commande spéciale. Nous vous informons du délai exact lors de la confirmation de commande."
    },
    {
      id: 6,
      category: "shipping",
      question: "Livrez-vous dans toute la Tunisie ?",
      answer: "Oui, nous livrons dans toute la Tunisie. Nous avons des partenaires logistiques dans toutes les régions. La livraison est gratuite pour les commandes supérieures à 500 DT. Pour les équipements lourds, nous proposons un service d'installation sur site."
    },
    {
      id: 7,
      category: "support",
      question: "Proposez-vous une formation sur vos équipements ?",
      answer: "Absolument ! Nous proposons des formations complètes sur tous nos équipements : formation initiale lors de l'installation, sessions de perfectionnement, support technique à distance, et documentation complète en français. Nos techniciens sont certifiés par les fabricants."
    },
    {
      id: 8,
      category: "support",
      question: "Quel est votre service après-vente ?",
      answer: "Notre service après-vente comprend : maintenance préventive, réparations sur site ou en atelier, pièces de rechange d'origine, support technique téléphonique, et contrats de maintenance personnalisés. Nous intervenons dans les 24-48h selon l'urgence."
    },
    {
      id: 9,
      category: "security",
      question: "Comment protégez-vous mes données personnelles ?",
      answer: "Nous respectons strictement la réglementation sur la protection des données. Vos informations sont cryptées, stockées de manière sécurisée, et ne sont jamais partagées avec des tiers. Vous pouvez consulter notre politique de confidentialité pour plus de détails."
    },
    {
      id: 10,
      category: "products",
      question: "Proposez-vous des démonstrations de produits ?",
      answer: "Oui, nous organisons régulièrement des démonstrations dans nos showrooms ou directement dans votre cabinet. Vous pouvez également assister à nos journées portes ouvertes ou demander une démonstration personnalisée pour des équipements spécifiques."
    }
  ];

  const toggleItem = (id: number) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-24 sm:pt-32 pb-16 sm:pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-blue-100/30" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_50%)]" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <Badge className="mb-6 bg-blue-100 text-blue-700 px-4 py-2">
              <HelpCircle className="h-4 w-4 mr-2" />
              Questions fréquentes
            </Badge>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Comment pouvons-nous
              <span className="block text-blue-600 font-extrabold">
                vous aider ?
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
              Trouvez rapidement les réponses à vos questions sur nos produits,
              services et processus de commande.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Rechercher une question..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-4 py-3 sm:py-4 text-base sm:text-lg border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-0"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 sm:py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                className={`rounded-full px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base transition-all duration-300 ${
                  selectedCategory === category.id
                    ? "bg-blue-600 text-white shadow-lg"
                    : "hover:bg-blue-50 hover:border-blue-300"
                }`}
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.icon}
                <span className="ml-2 hidden sm:inline">{category.name}</span>
                <span className="ml-2 sm:hidden">{category.name.split(' ')[0]}</span>
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-12 sm:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredFaqs.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <HelpCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Aucune question trouvée
              </h3>
              <p className="text-gray-600">
                Essayez de modifier votre recherche ou sélectionnez une autre catégorie.
              </p>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {filteredFaqs.map((faq, index) => (
                <motion.div
                  key={faq.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="border border-gray-200/60 shadow-sm bg-white hover:shadow-lg hover:border-blue-300/50 transition-all duration-300 rounded-xl overflow-hidden">
                    <CardContent className="p-0">
                      <button
                        onClick={() => toggleItem(faq.id)}
                        className="w-full p-4 sm:p-6 text-left flex items-center justify-between hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-blue-100/30 transition-all duration-300"
                      >
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 pr-4">
                          {faq.question}
                        </h3>
                        {openItems.includes(faq.id) ? (
                          <ChevronUp className="h-5 w-5 text-blue-600 flex-shrink-0" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-gray-400 flex-shrink-0" />
                        )}
                      </button>
                      
                      <AnimatePresence>
                        {openItems.includes(faq.id) && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className="px-4 sm:px-6 pb-4 sm:pb-6 pt-0">
                              <div className="border-t border-blue-100/50 pt-4 bg-gradient-to-r from-blue-50/30 to-blue-100/20 rounded-b-lg -mx-4 sm:-mx-6 px-4 sm:px-6">
                                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                                  {faq.answer}
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-12 sm:py-20 bg-gradient-to-br from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-6">
              Vous ne trouvez pas votre réponse ?
            </h2>
            <p className="text-lg sm:text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Notre équipe d'experts est là pour vous aider. Contactez-nous pour obtenir
              une réponse personnalisée à vos questions.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-12">
              <div className="text-center">
                <div className="w-12 sm:w-16 h-12 sm:h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Phone className="h-6 sm:h-8 w-6 sm:w-8 text-white" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-white mb-2">Téléphone</h3>
                <p className="text-blue-100 text-sm sm:text-base">+216 71 123 456</p>
                <p className="text-blue-100 text-xs sm:text-sm">Lun-Ven 8h-18h</p>
              </div>

              <div className="text-center">
                <div className="w-12 sm:w-16 h-12 sm:h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Mail className="h-6 sm:h-8 w-6 sm:w-8 text-white" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-white mb-2">Email</h3>
                <p className="text-blue-100 text-sm sm:text-base">contact@dentalcamp.tn</p>
                <p className="text-blue-100 text-xs sm:text-sm">Réponse sous 24h</p>
              </div>

              <div className="text-center">
                <div className="w-12 sm:w-16 h-12 sm:h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="h-6 sm:h-8 w-6 sm:w-8 text-white" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-white mb-2">Chat en ligne</h3>
                <p className="text-blue-100 text-sm sm:text-base">Support instantané</p>
                <p className="text-blue-100 text-xs sm:text-sm">Lun-Ven 9h-17h</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100 px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold text-sm sm:text-base"
                asChild
              >
                <Link href="/#contact">
                  Nous contacter
                  <ArrowRight className="ml-2 h-4 sm:h-5 w-4 sm:w-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold text-sm sm:text-base"
                asChild
              >
                <Link href="/about">
                  En savoir plus
                  <TbDental className="ml-2 h-4 sm:h-5 w-4 sm:w-5" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
