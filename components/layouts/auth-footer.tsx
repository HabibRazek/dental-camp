"use client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
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

function AuthFooter() {
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
            } catch (error) {
                console.error('Failed to fetch categories:', error);
            }
        };

        fetchCategories();
    }, []);

    return (
        <div className="overflow-hidden">
            {/* Main Footer */}
            <footer className="bg-white text-gray-800 py-20 relative overflow-hidden border-t border-gray-200">
                <div className="container mx-auto px-4 md:px-6 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
                        {/* Brand column */}
                        <div className="lg:col-span-4">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-blue-100 rounded-lg border border-blue-200">
                                    <TbDental className="h-6 w-6 text-blue-600" />
                                </div>
                                <span className="font-bold text-2xl text-gray-900">
                                    Dental Camp
                                </span>
                            </div>
                            <p className="text-gray-600 mb-8 text-lg">
                                Empowering dental professionals with premium equipment and innovative solutions since 2010.
                            </p>

                            {/* Contact information */}
                            <div className="space-y-4 mb-8">
                                <div className="flex items-start gap-3">
                                    <MapPin className="h-5 w-5 text-blue-600 mt-0.5" />
                                    <p className="text-gray-600">
                                        123 Dental Plaza, Suite 500<br />
                                        Boston, MA 02110
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Phone className="h-5 w-5 text-blue-600" />
                                    <p className="text-gray-600">(800) 555-DENTAL</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Mail className="h-5 w-5 text-blue-600" />
                                    <p className="text-gray-600">info@dentalcamp.com</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Clock className="h-5 w-5 text-blue-600" />
                                    <p className="text-gray-600">Mon-Fri: 8am-6pm ET</p>
                                </div>
                            </div>

                            {/* Social Media */}
                            <div>
                                <p className="text-gray-900 font-semibold mb-3">Follow Us</p>
                                <div className="flex gap-4">
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
                                            className="bg-gray-100 hover:bg-blue-100 p-2 rounded-full transition-colors text-gray-600 hover:text-blue-600"
                                        >
                                            {social.icon}
                                        </Link>
                                    ))}
                                </div>
                            </div>
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
                                        transition={{ duration: 0.3, delay: index * 0.1 }}
                                        viewport={{ once: true, margin: "-100px" }}
                                    >
                                        <h3 className="font-bold text-lg mb-6 text-gray-900 relative inline-block">
                                            {column.title}
                                            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600"></span>
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
                                                        <ArrowRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-all" />
                                                        {link.name}
                                                    </Link>
                                                </motion.li>
                                            ))}
                                        </ul>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Trust badges */}
                            <div className="mt-16 border-t border-gray-200 pt-8">
                                <p className="text-gray-900 font-semibold mb-4 text-center">Trusted Partners & Certifications</p>
                                <div className="flex flex-wrap justify-center gap-6 items-center">
                                    {[
                                        "ADA Approved",
                                        "FDA Registered",
                                        "ISO 13485",
                                        "CE Certified",
                                        "HIPAA Compliant"
                                    ].map((badge, idx) => (
                                        <div key={idx} className="bg-gray-100 px-4 py-2 rounded-lg text-sm text-gray-700 border border-gray-200">
                                            {badge}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom bar */}
                    <div className="border-t border-gray-200 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
                        <p className="text-gray-600 text-sm mb-4 md:mb-0">
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
                                    className="text-gray-600 hover:text-blue-600 text-sm transition-colors"
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default AuthFooter;
