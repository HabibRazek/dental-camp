"use client";
import { motion } from "framer-motion";

import {
    ArrowRight,
    Facebook,
    Twitter,
    Instagram,
    Linkedin,
    Youtube,
    Mail,
    Phone,
    MapPin,
    Clock,
    Heart,
    Star,
    Shield,
    Award
} from "lucide-react";
import { TbDental } from "react-icons/tb";
import Link from "next/link";
import { useState, useEffect } from "react";

interface Category {
    id: string;
    name: string;
    slug: string;
    isActive: boolean;
}

function Footer() {
    const [categories, setCategories] = useState<Category[]>([]);

    // Fetch categories for footer navigation
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch('/api/categories?isActive=true');
                if (response.ok) {
                    const data = await response.json();
                    setCategories(data.categories?.slice(0, 6) || []); // Limit to 6 categories
                }
            } catch {
                // Failed to fetch categories
            }
        };

        fetchCategories();
    }, []);

    return (
        <div className="bg-white">


            {/* Main Footer */}
            <footer className="bg-white py-8 sm:py-12 lg:py-16 border-t border-gray-100">
                <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-6 sm:gap-8">
                        {/* Brand column */}
                        <div className="sm:col-span-2 lg:col-span-4">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                                viewport={{ once: true }}
                            >
                                <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                                    <div className="p-1.5 sm:p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg sm:rounded-xl shadow-lg">
                                        <TbDental className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                                    </div>
                                    <span className="font-bold text-lg sm:text-xl lg:text-2xl text-gray-800">
                                        Dental Camp
                                    </span>
                                </div>
                                <p className="text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base lg:text-lg leading-relaxed">
                                    Empowering dental professionals with premium equipment and innovative solutions since 2010.
                                </p>

                                {/* Contact information */}
                                <div className="space-y-4 mb-8">
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-gray-100 rounded-lg">
                                            <MapPin className="h-4 w-4 text-gray-600" />
                                        </div>
                                        <p className="text-gray-600">
                                            Rue Korbus 8058<br />
                                            Mrezga Hammamet Nord<br />
                                            Nabeul Tunisia
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-gray-100 rounded-lg">
                                            <Phone className="h-4 w-4 text-gray-600" />
                                        </div>
                                        <div className="text-gray-600">
                                            <p>+216 51 407 444</p>
                                            <p>+216 53 761 761</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-gray-100 rounded-lg">
                                            <Mail className="h-4 w-4 text-gray-600" />
                                        </div>
                                        <div className="text-gray-600">
                                            <p>Contact@medicalponos.com</p>
                                            <p>Commande@medicalponos.com</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-gray-100 rounded-lg">
                                            <Clock className="h-4 w-4 text-gray-600" />
                                        </div>
                                        <p className="text-gray-600">Mon-Fri: 8am-6pm ET</p>
                                    </div>
                                </div>

                                {/* Social Media */}
                                <div>
                                    <p className="text-gray-800 font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Follow Us</p>
                                    <div className="flex gap-2 sm:gap-3">
                                        {[
                                            { icon: <Facebook className="h-4 w-4 sm:h-5 sm:w-5" />, href: "#" },
                                            { icon: <Twitter className="h-4 w-4 sm:h-5 sm:w-5" />, href: "#" },
                                            { icon: <Instagram className="h-4 w-4 sm:h-5 sm:w-5" />, href: "#" },
                                            { icon: <Linkedin className="h-4 w-4 sm:h-5 sm:w-5" />, href: "#" },
                                            { icon: <Youtube className="h-4 w-4 sm:h-5 sm:w-5" />, href: "#" }
                                        ].map((social, idx) => (
                                            <Link
                                                key={idx}
                                                href={social.href}
                                                className="bg-blue-50 hover:bg-blue-500 hover:text-white text-blue-600 p-2 sm:p-3 rounded-lg sm:rounded-xl transition-all duration-300 hover:scale-110 hover:shadow-lg"
                                            >
                                                {social.icon}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Navigation columns */}
                        <div className="lg:col-span-8">
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                                {[
                                    {
                                        title: "Products",
                                        links: [
                                            ...categories.map(category => ({
                                                name: category.name,
                                                href: `/catalog?category=${category.slug}`
                                            })),
                                            { name: "View All Products", href: "/catalog" }
                                        ],
                                    },
                                    {
                                        title: "Company",
                                        links: [
                                            { name: "About Us", href: "/about" },
                                            { name: "Our Mission", href: "/mission" },
                                            { name: "Leadership", href: "/leadership" },
                                            { name: "Careers", href: "/careers" },
                                            { name: "Newsroom", href: "/news" },
                                            { name: "Contact", href: "/contact" }
                                        ],
                                    },
                                    {
                                        title: "Resources",
                                        links: [
                                            { name: "Learning Center", href: "/resources/learning" },
                                            { name: "Product Guides", href: "/resources/guides" },
                                            { name: "Case Studies", href: "/resources/case-studies" },
                                            { name: "Webinars", href: "/resources/webinars" },
                                            { name: "FAQs", href: "/faqs" },
                                            { name: "Support", href: "/support" }
                                        ],
                                    },
                                ].map((column, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.6, delay: index * 0.1 }}
                                        viewport={{ once: true }}
                                    >
                                        <h3 className="font-bold text-lg mb-6 text-gray-800 relative">
                                            {column.title}
                                            <span className="absolute bottom-0 left-0 w-8 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"></span>
                                        </h3>
                                        <ul className="space-y-3">
                                            {column.links.map((link, linkIndex) => (
                                                <motion.li
                                                    key={linkIndex}
                                                    whileHover={{ x: 5 }}
                                                    transition={{ type: "spring", stiffness: 300 }}
                                                >
                                                    <Link
                                                        href={link.href}
                                                        className="text-gray-600 hover:text-blue-600 transition-colors flex items-center group"
                                                    >
                                                        <ArrowRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-all text-blue-500" />
                                                        {link.name}
                                                    </Link>
                                                </motion.li>
                                            ))}
                                        </ul>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Trust badges */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        viewport={{ once: true }}
                        className="mt-16 border-t border-gray-100 pt-8"
                    >
                        <p className="text-gray-800 font-semibold mb-6 text-center">Trusted Partners & Certifications</p>
                        <div className="flex flex-wrap justify-center gap-4 items-center">
                            {[
                                { name: "ADA Approved", icon: <Award className="w-4 h-4" /> },
                                { name: "FDA Registered", icon: <Shield className="w-4 h-4" /> },
                                { name: "ISO 13485", icon: <Star className="w-4 h-4" /> },
                                { name: "CE Certified", icon: <Heart className="w-4 h-4" /> },
                                { name: "HIPAA Compliant", icon: <Shield className="w-4 h-4" /> }
                            ].map((badge, idx) => (
                                <motion.div
                                    key={idx}
                                    whileHover={{ scale: 1.05 }}
                                    className="bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 px-4 py-3 rounded-xl text-sm text-gray-700 hover:text-blue-700 transition-all duration-300 flex items-center gap-2 shadow-sm hover:shadow-md"
                                >
                                    {badge.icon}
                                    {badge.name}
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Bottom bar */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                        viewport={{ once: true }}
                        className="border-t border-gray-100 mt-8 sm:mt-10 lg:mt-12 pt-6 sm:pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0"
                    >
                        <p className="text-gray-500 text-xs sm:text-sm text-center sm:text-left">
                            © {new Date().getFullYear()} Dental Camp Inc. All rights reserved.
                        </p>
                        <div className="flex flex-wrap justify-center gap-x-4 sm:gap-x-6 gap-y-2">
                            {[
                                { name: "Terms of Service", href: "/terms" },
                                { name: "Privacy Policy", href: "/privacy" },
                                { name: "Cookie Policy", href: "/cookies" },
                                { name: "Accessibility", href: "/accessibility" },
                                { name: "Sitemap", href: "/sitemap" }
                            ].map((link, idx) => (
                                <Link
                                    key={idx}
                                    href={link.href}
                                    className="text-gray-500 hover:text-blue-600 text-sm transition-colors"
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </footer>
        </div>
    );
}

export default Footer;
