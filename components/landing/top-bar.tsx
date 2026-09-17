"use client";
import { motion } from "framer-motion";
import { Phone, Mail, Clock, Facebook, Instagram, Linkedin } from "lucide-react";
import Link from "next/link";

function TopBar() {
    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-professional-blue fixed top-0 left-0 right-0 text-white py-2 w-full z-40 hidden md:block"
        >
            <div className=" max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-4">
                    {/* Left side - Contact Info */}
                    <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-6 text-xs sm:text-sm">
                        <div className="flex items-center gap-2">
                            <Phone className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span className="font-medium">+216 XX XXX XXX</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Mail className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span className="font-medium">contact@dentalcamp.tn</span>
                        </div>
                        <div className="hidden md:flex items-center gap-2">
                            <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span className="font-medium">Lun-Ven: 8h-18h</span>
                        </div>
                    </div>

                    {/* Right side - Social Media & Quick Links */}
                    <div className="flex items-center gap-3 sm:gap-4">
                        {/* Social Media Links */}
                        <div className="flex items-center gap-2">
                            <Link 
                                href="#" 
                                className="hover:text-blue-200 transition-colors duration-200"
                                aria-label="Facebook"
                            >
                                <Facebook className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Link>
                            <Link 
                                href="#" 
                                className="hover:text-blue-200 transition-colors duration-200"
                                aria-label="Instagram"
                            >
                                <Instagram className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Link>
                            <Link 
                                href="#" 
                                className="hover:text-blue-200 transition-colors duration-200"
                                aria-label="LinkedIn"
                            >
                                <Linkedin className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Link>
                        </div>

                        {/* Quick Links */}
                        <div className="hidden sm:flex items-center gap-3 text-xs border-l border-blue-400 pl-3">
                            <Link 
                                href="/about" 
                                className="hover:text-blue-200 transition-colors duration-200 font-medium"
                            >
                                À propos
                            </Link>
                            <Link 
                                href="/contact" 
                                className="hover:text-blue-200 transition-colors duration-200 font-medium"
                            >
                                Contact
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

export default TopBar;
