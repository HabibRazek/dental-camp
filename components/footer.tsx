"use client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
            {/* Newsletter Section */}
            <motion.section
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="bg-gradient-to-r from-blue-50/30 via-white to-blue-50/30 py-16 border-t border-blue-100/50"
            >
                <div className="max-w-6xl mx-auto px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        viewport={{ once: true }}
                        className="mb-8"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                            Stay Updated with Latest Dental Equipment
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Get exclusive offers, new product announcements, and expert tips delivered to your inbox.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        viewport={{ once: true }}
                        className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto mb-6"
                    >
                        <Input
                            type="email"
                            placeholder="Enter your email"
                            className="flex-1 px-6 py-3 rounded-full border border-blue-200 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent shadow-sm"
                        />
                        <Button className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-full font-medium transition-all duration-300 hover:scale-105 shadow-lg">
                            Subscribe
                        </Button>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        viewport={{ once: true }}
                        className="flex items-center justify-center gap-6 text-gray-500 text-sm"
                    >
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                            <span>No spam ever</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                            <span>Exclusive offers</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                            <span>Unsubscribe anytime</span>
                        </div>
                    </motion.div>
                </div>
            </motion.section>

            {/* Main Footer */}
            <footer className="bg-white py-16 border-t border-gray-100">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
                        {/* Brand column */}
                        <div className="lg:col-span-4">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                                viewport={{ once: true }}
                            >
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg">
                                        <TbDental className="h-6 w-6 text-white" />
                                    </div>
                                    <span className="font-bold text-2xl text-gray-800">
                                        Dental Camp
                                    </span>
                                </div>
                                <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                                    Empowering dental professionals with premium equipment and innovative solutions since 2010.
                                </p>

                                {/* Contact information */}
                                <div className="space-y-4 mb-8">
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-gray-100 rounded-lg">
                                            <MapPin className="h-4 w-4 text-gray-600" />
                                        </div>
                                        <p className="text-gray-600">
                                            123 Dental Plaza, Suite 500<br />
                                            Boston, MA 02110
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-gray-100 rounded-lg">
                                            <Phone className="h-4 w-4 text-gray-600" />
                                        </div>
                                        <p className="text-gray-600">(800) 555-DENTAL</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-gray-100 rounded-lg">
                                            <Mail className="h-4 w-4 text-gray-600" />
                                        </div>
                                        <p className="text-gray-600">info@dentalcamp.com</p>
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
                                    <p className="text-gray-800 font-semibold mb-4">Follow Us</p>
                                    <div className="flex gap-3">
                                        {[
                                            { icon: <Facebook className="h-5 w-5" />, href: "#" },
                                            { icon: <Twitter className="h-5 w-5" />, href: "#" },
                                            { icon: <Instagram className="h-5 w-5" />, href: "#" },
                                            { icon: <Linkedin className="h-5 w-5" />, href: "#" },
                                            { icon: <Youtube className="h-5 w-5" />, href: "#" }
                                        ].map((social, idx) => (
                                            <Link
                                                key={idx}
                                                href={social.href}
                                                className="bg-blue-50 hover:bg-blue-500 hover:text-white text-blue-600 p-3 rounded-xl transition-all duration-300 hover:scale-110 hover:shadow-lg"
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
                        className="border-t border-gray-100 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center"
                    >
                        <p className="text-gray-500 text-sm mb-4 md:mb-0">
                            © {new Date().getFullYear()} Dental Camp Inc. All rights reserved.
                        </p>
                        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
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
