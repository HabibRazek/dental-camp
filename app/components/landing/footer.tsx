"use client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ArrowRight, ShieldCheck, Truck, Headset, Award } from "lucide-react";
import { TbDental } from "react-icons/tb";


function Footer() {
    return (
        <div className="overflow-hidden">
            {/* CTA Section */}
            <section className="relative container mx-auto py-20">
                {/* Animated background elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(59,130,246,0.15)_1px,transparent_0)] [background-size:20px_20px] dark:opacity-20"></div>
                    <motion.div
                        className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-blue-200 dark:bg-blue-800 opacity-40 blur-3xl"
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
                        className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-blue-300 dark:bg-blue-700 opacity-30 blur-3xl"
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

                <div className="container px-4 md:px-6 relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            viewport={{ once: true, margin: "-100px" }}
                        >
                            <Badge className="mb-4 bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600">
                                <ShieldCheck className="w-4 h-4 mr-2" />
                                Trusted by 10,000+ Professionals
                            </Badge>
                            <h2 className="text-3xl md:text-5xl font-bold text-blue-900 dark:text-white mb-6">
                                Elevate Your <span className="text-blue-600 dark:text-blue-400">Healthcare Practice</span> Today
                            </h2>
                            <p className="text-blue-700 dark:text-blue-200 mb-8 max-w-3xl mx-auto text-lg">
                                Join the leading network of healthcare professionals who rely on MediCare for premium
                                equipment, cutting-edge technology, and unparalleled support.
                            </p>
                        </motion.div>

                        <motion.div
                            className="flex flex-col sm:flex-row gap-4 justify-center"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            viewport={{ once: true, margin: "-100px" }}
                        >
                            <div className="relative w-full max-w-lg mx-auto">
                                <Input
                                    placeholder="Enter your email"
                                    className="pr-32 h-14 rounded-full bg-white dark:bg-blue-950 shadow-lg border border-blue-200 dark:border-blue-700 text-base"
                                />
                                <Button className="absolute right-1 top-1 rounded-full h-12 px-6 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600">
                                    Get Started <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            </div>
                        </motion.div>

                        <motion.div
                            className="mt-8 flex flex-wrap justify-center gap-4 max-w-2xl mx-auto"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            viewport={{ once: true }}
                        >
                            {[
                                { icon: <Truck className="w-5 h-5" />, text: "Fast Delivery" },
                                { icon: <Headset className="w-5 h-5" />, text: "24/7 Support" },
                                { icon: <Award className="w-5 h-5" />, text: "Certified Quality" }
                            ].map((item, index) => (
                                <div key={index} className="flex items-center justify-center gap-2 text-blue-700 dark:text-blue-900 text-sm px-4 py-2 bg-white/50 dark:bg-blue-800/30 rounded-full">
                                    {item.icon}
                                    <span>{item.text}</span>
                                </div>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Main Footer */}
            {/* Main Footer */}
            <footer className=" text-white py-16 relative overflow-hidden">
                {/* Floating elements */}
                <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-blue-800 opacity-20 blur-3xl"></div>

                <div className="container mx-auto px-4 md:px-6 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
                        {/* Brand column */}
                        <div className="lg:col-span-2">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-blue-600 rounded-lg">
                                    <TbDental className="h-6 w-6 text-white" />
                                </div>
                                <span className="font-bold text-2xl bg-gradient-to-r from-blue-400 to-blue-900 bg-clip-text text-transparent">
                                    Dental Camp
                                </span>
                            </div>
                            <p className="text-blue-900 mb-6 text-lg">
                                Empowering healthcare professionals with premium equipment and innovative solutions since 2010.
                            </p>
                            
                        </div>

                        {/* Navigation columns */}
                        {[
                            {
                                title: "Products",
                                links: [
                                    "Diagnostic Equipment",
                                    "Surgical Instruments",
                                    "Dental Solutions",
                                    "Patient Monitoring",
                                    "Rehabilitation",
                                    "View All Products"
                                ],
                            },
                            {
                                title: "Company",
                                links: [
                                    "About Us",
                                    "Our Mission",
                                    "Leadership",
                                    "Careers",
                                    "Newsroom",
                                    "Contact"
                                ],
                            },
                            {
                                title: "Resources",
                                links: [
                                    "Learning Center",
                                    "Product Guides",
                                    "Case Studies",
                                    "Webinars",
                                    "FAQs",
                                    "Support"
                                ],
                            },
                        ].map((column, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                                viewport={{ once: true }}
                            >
                                <h3 className="font-bold text-lg mb-6 text-blue-600 relative inline-block">
                                    {column.title}
                                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500"></span>
                                </h3>
                                <ul className="space-y-3">
                                    {column.links.map((link, linkIndex) => (
                                        <motion.li
                                            key={linkIndex}
                                            whileHover={{ x: 5 }}
                                            transition={{ type: "spring", stiffness: 300 }}
                                        >
                                            <a
                                                href="#"
                                                className="text-blue-900 hover:text-blue-600 transition-colors flex items-center group"
                                            >
                                                <ArrowRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-all" />
                                                {link}
                                            </a>
                                        </motion.li>
                                    ))}
                                </ul>
                            </motion.div>
                        ))}
                    </div>

                    {/* Trust badges - responsive grid */}
                    {/* Bottom bar */}
                    <div className="border-t border-blue-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
                        <p className="text-blue-900 text-sm mb-4 md:mb-0">
                            © {new Date().getFullYear()} MediCare Inc. All rights reserved.
                        </p>
                        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
                            <a
                                href="#"
                                className="text-blue-900 hover:text-blue-600 text-sm transition-colors"
                            >
                                Terms of Service
                            </a>
                            <a
                                href="#"
                                className="text-blue-900 hover:text-blue-600 text-sm transition-colors"
                            >
                                Privacy Policy
                            </a>
                            <a
                                href="#"
                                className="text-blue-900 hover:text-blue-600 text-sm transition-colors"
                            >
                                Cookie Policy
                            </a>
                            <a
                                href="#"
                                className="text-blue-900 hover:text-blue-600 text-sm transition-colors"
                            >
                                Accessibility
                            </a>
                            <a
                                href="#"
                                className="text-blue-900 hover:text-blue-600 text-sm transition-colors"
                            >
                                Sitemap
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default Footer;