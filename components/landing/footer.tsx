"use client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
    ArrowRight,
    ShieldCheck,
    Facebook,
    Twitter,
    Instagram,
    Linkedin,
    Youtube,
    Mail,
    Phone,
    MapPin,
    Clock,
    CheckCircle
} from "lucide-react";
import { TbDental } from "react-icons/tb";
import Link from "next/link";


function Footer() {
    return (
        <div className="overflow-hidden">
            {/* CTA Section */}
            <section className="relative py-24 bg-gradient-to-b from-white to-blue-50">
                {/* Animated background elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(59,130,246,0.15)_1px,transparent_0)] [background-size:20px_20px]"></div>
                    <motion.div
                        className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-blue-200 opacity-40 blur-3xl"
                        animate={{
                            scale: [1, 1.2, 1],
                            x: [0, 20, 0],
                            y: [0, -30, 0]
                        }}
                        transition={{
                            duration: 15,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                    <motion.div
                        className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-blue-300 opacity-30 blur-3xl"
                        animate={{
                            scale: [1, 1.3, 1],
                            x: [0, -30, 0],
                            y: [0, 40, 0]
                        }}
                        transition={{
                            duration: 20,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 2
                        }}
                    />
                </div>

                <div className="container mx-auto px-4 md:px-6 relative z-10">
                    <div className="max-w-5xl mx-auto">
                        <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl shadow-xl overflow-hidden">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                                <div className="p-8 md:p-12 text-white">
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5 }}
                                        viewport={{ once: true, margin: "-100px" }}
                                    >
                                        <Badge className="mb-4 bg-white/20 text-white border-white/30 backdrop-blur-sm">
                                            <ShieldCheck className="w-4 h-4 mr-2" />
                                            Join 10,000+ Dental Professionals
                                        </Badge>
                                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                                            Elevate Your <span className="text-blue-100">Dental Practice</span> Today
                                        </h2>
                                        <p className="text-blue-100 mb-8 text-lg">
                                            Subscribe to our newsletter for exclusive offers, product updates, and expert dental practice tips.
                                        </p>
                                    </motion.div>

                                    <motion.div
                                        className="flex flex-col sm:flex-row gap-4"
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: 0.2 }}
                                        viewport={{ once: true, margin: "-100px" }}
                                    >
                                        <div className="relative w-full">
                                            <Input
                                                placeholder="Enter your email"
                                                className="pr-32 h-14 rounded-full bg-white/10 backdrop-blur-sm border border-white/30 text-white placeholder:text-blue-100 shadow-lg"
                                            />
                                            <Button className="absolute right-1 top-1 rounded-full h-12 px-6 bg-white text-blue-600 hover:bg-blue-50">
                                                Subscribe <ArrowRight className="w-4 h-4 ml-2" />
                                            </Button>
                                        </div>
                                    </motion.div>

                                    <motion.div
                                        className="mt-8 flex flex-wrap gap-4"
                                        initial={{ opacity: 0 }}
                                        whileInView={{ opacity: 1 }}
                                        transition={{ duration: 0.5, delay: 0.4 }}
                                        viewport={{ once: true, margin: "-100px" }}
                                    >
                                        {[
                                            { icon: <CheckCircle className="w-4 h-4" />, text: "No spam, ever" },
                                            { icon: <CheckCircle className="w-4 h-4" />, text: "Exclusive offers" },
                                            { icon: <CheckCircle className="w-4 h-4" />, text: "Unsubscribe anytime" }
                                        ].map((item, index) => (
                                            <div key={index} className="flex items-center gap-2 text-blue-100 text-sm">
                                                {item.icon}
                                                <span>{item.text}</span>
                                            </div>
                                        ))}
                                    </motion.div>
                                </div>

                                <div className="bg-blue-700/30 backdrop-blur-sm p-8 md:p-12 flex items-center justify-center relative overflow-hidden">
                                    {/* Decorative elements */}
                                    <div className="absolute top-0 right-0 w-40 h-40 bg-blue-400/30 rounded-full blur-3xl"></div>
                                    <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-300/30 rounded-full blur-3xl"></div>

                                    <div className="relative z-10 w-full max-w-xs">
                                        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                                            <div className="flex items-center gap-4 mb-6">
                                                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                                                    <TbDental className="h-6 w-6 text-white" />
                                                </div>
                                                <div>
                                                    <h3 className="text-white font-bold">Dental Camp Pro</h3>
                                                    <p className="text-blue-100 text-sm">Premium membership</p>
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                {[
                                                    "Priority customer support",
                                                    "Exclusive product discounts",
                                                    "Free shipping on all orders",
                                                    "Early access to new products"
                                                ].map((benefit, idx) => (
                                                    <div key={idx} className="flex items-center gap-3">
                                                        <CheckCircle className="h-5 w-5 text-green-400" />
                                                        <span className="text-white text-sm">{benefit}</span>
                                                    </div>
                                                ))}
                                            </div>

                                            <Button className="w-full mt-6 bg-white text-blue-600 hover:bg-blue-50 rounded-lg" asChild>
                                                <Link href="/pro-membership">
                                                    Learn More
                                                </Link>
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Footer */}
            <footer className="bg-blue-900 text-white py-20 relative overflow-hidden">
                {/* Floating elements */}
                <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-blue-800 opacity-20 blur-3xl"></div>
                <div className="absolute top-40 right-20 w-64 h-64 rounded-full bg-blue-700 opacity-10 blur-3xl"></div>

                <div className="container mx-auto px-4 md:px-6 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
                        {/* Brand column */}
                        <div className="lg:col-span-4">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/10">
                                    <TbDental className="h-6 w-6 text-white" />
                                </div>
                                <span className="font-bold text-2xl text-white">
                                    Dental Camp
                                </span>
                            </div>
                            <p className="text-blue-100 mb-8 text-lg">
                                Empowering dental professionals with premium equipment and innovative solutions since 2010.
                            </p>

                            {/* Contact information */}
                            <div className="space-y-4 mb-8">
                                <div className="flex items-start gap-3">
                                    <MapPin className="h-5 w-5 text-blue-300 mt-0.5" />
                                    <p className="text-blue-100">
                                        123 Dental Plaza, Suite 500<br />
                                        Boston, MA 02110
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Phone className="h-5 w-5 text-blue-300" />
                                    <p className="text-blue-100">(800) 555-DENTAL</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Mail className="h-5 w-5 text-blue-300" />
                                    <p className="text-blue-100">info@dentalcamp.com</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Clock className="h-5 w-5 text-blue-300" />
                                    <p className="text-blue-100">Mon-Fri: 8am-6pm ET</p>
                                </div>
                            </div>

                            {/* Social Media */}
                            <div>
                                <p className="text-white font-semibold mb-3">Follow Us</p>
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
                                            className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors"
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
                                            { name: "Dental Chairs", href: "/products/chairs" },
                                            { name: "Imaging Systems", href: "/products/imaging" },
                                            { name: "Sterilization", href: "/products/sterilization" },
                                            { name: "Instruments", href: "/products/instruments" },
                                            { name: "Consumables", href: "/products/consumables" },
                                            { name: "View All Products", href: "/products" }
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
                                        <h3 className="font-bold text-lg mb-6 text-white relative inline-block">
                                            {column.title}
                                            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-400"></span>
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
                                                        className="text-blue-100 hover:text-white transition-colors flex items-center group"
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
                            <div className="mt-16 border-t border-blue-800/50 pt-8">
                                <p className="text-white font-semibold mb-4 text-center">Trusted Partners & Certifications</p>
                                <div className="flex flex-wrap justify-center gap-6 items-center">
                                    {[
                                        "ADA Approved",
                                        "FDA Registered",
                                        "ISO 13485",
                                        "CE Certified",
                                        "HIPAA Compliant"
                                    ].map((badge, idx) => (
                                        <div key={idx} className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg text-sm text-white">
                                            {badge}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom bar */}
                    <div className="border-t border-blue-800/50 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
                        <p className="text-blue-200 text-sm mb-4 md:mb-0">
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
                                    className="text-blue-200 hover:text-white text-sm transition-colors"
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

export default Footer;