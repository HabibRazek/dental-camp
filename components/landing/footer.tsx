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
    Clock,
    Heart,
    Star,
    Shield,
    Award
} from "lucide-react";
import { TbDental } from "react-icons/tb";
import Link from "next/link";
import Image from "next/image";
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
        <div className="bg-professional-light relative overflow-hidden">
            {/* Subtle Background Pattern */}
            <div className="absolute inset-0 opacity-30">
                <div className="absolute top-10 left-10 w-20 h-20 bg-blue-100 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 right-20 w-32 h-32 bg-blue-50 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-blue-100 rounded-full blur-2xl"></div>
            </div>

            {/* Enhanced Professional Footer */}
            <footer className="relative bg-gradient-to-br from-gray-50 via-white to-blue-50/30 py-12 sm:py-16 lg:py-20 border-t border-blue-200">
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
                                {/* Main Logo */}
                                <div className="flex items-center mb-6 sm:mb-8">
                                    <Image
                                        src="/dental-camp-logo.png"
                                        alt="Dental Camp Logo"
                                        width={150}
                                        height={150}
                                        className="h-16 sm:h-20 lg:h-24 w-auto object-contain"
                                    />
                                </div>


                                {/* Contact information */}
                                <div className="space-y-4 mb-8">
                                    <div className="flex items-start gap-3 group">
                                        <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors duration-300">
                                            <Phone className="h-4 w-4 text-blue-600" />
                                        </div>
                                        <div className="text-gray-600">
                                            <p className="font-medium text-gray-700 mb-1">Phone</p>
                                            <p className="hover:text-blue-600 transition-colors cursor-pointer">+216 51 407 444</p>
                                            <p className="hover:text-blue-600 transition-colors cursor-pointer">+216 53 761 761</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3 group">
                                        <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors duration-300">
                                            <Mail className="h-4 w-4 text-blue-600" />
                                        </div>
                                        <div className="text-gray-600">
                                            <p className="font-medium text-gray-700 mb-1">Email</p>
                                            <p className="hover:text-blue-600 transition-colors cursor-pointer">Contact@medicalponos.com</p>
                                            <p className="hover:text-blue-600 transition-colors cursor-pointer">Commande@medicalponos.com</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3 group">
                                        <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors duration-300">
                                            <Clock className="h-4 w-4 text-blue-600" />
                                        </div>
                                        <div className="text-gray-600">
                                            <p className="font-medium text-gray-700 mb-1">Business Hours</p>
                                            <p>Mon-Fri: 8am-6pm ET</p>
                                        </div>
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
                                            { name: "Contact", href: "/contact" }
                                        ],
                                    },
                                    {
                                        title: "Resources",
                                        links: [
                                            { name: "Learning Center", href: "/resources/learning" },
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

                    {/* Professional Trust Indicators */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        viewport={{ once: true }}
                        className="border-t border-gray-100 mt-8 sm:mt-10 lg:mt-12 pt-6 sm:pt-8 mb-6 sm:mb-8"
                    >
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                            {[
                                {
                                    icon: <Shield className="h-5 w-5 text-blue-600" />,
                                    title: "Certified Quality",
                                    subtitle: "CE Marked Products"
                                },
                                {
                                    icon: <Award className="h-5 w-5 text-blue-600" />,
                                    title: "15+ Years",
                                    subtitle: "Industry Experience"
                                },
                                {
                                    icon: <Heart className="h-5 w-5 text-blue-600" />,
                                    title: "500+ Clients",
                                    subtitle: "Satisfied Customers"
                                },
                                {
                                    icon: <Star className="h-5 w-5 text-blue-600" />,
                                    title: "98% Rating",
                                    subtitle: "Customer Satisfaction"
                                }
                            ].map((item, index) => (
                                <div key={index} className="text-center group">
                                    <div className="bg-blue-50 rounded-lg p-3 mb-2 mx-auto w-fit group-hover:bg-blue-100 transition-colors duration-300">
                                        {item.icon}
                                    </div>
                                    <p className="font-semibold text-gray-800 text-sm">{item.title}</p>
                                    <p className="text-xs text-gray-600">{item.subtitle}</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Enhanced Bottom bar */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                        viewport={{ once: true }}
                        className="border-t border-gray-200 pt-6 sm:pt-8"
                    >
                        <div className="flex flex-col lg:flex-row justify-between items-center gap-4 lg:gap-0">
                            {/* Copyright and Company Info */}
                            <div className="text-center lg:text-left">
                                <p className="text-gray-600 text-sm font-medium mb-1">
                                    © {new Date().getFullYear()} Dental Camp Inc. All rights reserved.
                                </p>
                                <p className="text-gray-500 text-xs">
                                    Professional dental equipment supplier since 2008
                                </p>
                            </div>

                            {/* Legal Links */}
                            <div className="flex flex-wrap justify-center gap-x-4 sm:gap-x-6 gap-y-2">
                                {[
                                    { name: "Terms of Service", href: "/terms" },
                                    { name: "Privacy Policy", href: "/privacy" },
                                    { name: "Cookie Policy", href: "/cookies" },
                                    { name: "Accessibility", href: "/accessibility" }
                                ].map((link, idx) => (
                                    <Link
                                        key={idx}
                                        href={link.href}
                                        className="text-gray-500 hover:text-blue-600 text-sm transition-colors duration-300 hover:underline"
                                    >
                                        {link.name}
                                    </Link>
                                ))}
                            </div>

                            {/* Professional Badge */}
                            <div className="flex items-center gap-2 bg-gradient-to-r from-blue-50 to-blue-100 px-4 py-2 rounded-full">
                                <TbDental className="h-4 w-4 text-blue-600" />
                                <span className="text-blue-700 text-sm font-medium">Trusted by Professionals</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </footer>
        </div>
    );
}

export default Footer;
