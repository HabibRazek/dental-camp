"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart, Search, Menu, X, User, LogOut } from "lucide-react";
import { TbDental } from "react-icons/tb";
import { motion, AnimatePresence } from "framer-motion";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

const navItems = ["Home", "About", "Our Products", "Contact", "FAQs"];

function Header() {
    const [menuOpen, setMenuOpen] = useState(false);
    const { data: session, status } = useSession();

    return (
        <>
            <header className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 bg-white/80 backdrop-blur-md rounded-full shadow-lg px-4 sm:px-6 py-3 flex items-center justify-between w-[90%] max-w-5xl transition-all duration-300">
                {/* Logo Section */}
                <div className="flex items-center gap-2 sm:gap-3">
                    <TbDental className="h-6 w-6 text-primary" />
                    <span className="font-bold text-base sm:text-lg tracking-wide text-gray-800">
                        Dental Camp
                    </span>
                </div>

                {/* Navigation - Desktop */}
                <nav className="hidden md:flex items-center space-x-2">
                    {navItems.map((item) => (
                        <Button
                            key={item}
                            variant="ghost"
                            className="rounded-full text-sm px-4 py-2 text-gray-700 hover:bg-blue-100 hover:text-blue-600 transition duration-200 ease-in-out"
                        >
                            {item}
                        </Button>
                    ))}
                </nav>

                {/* Actions */}
                <div className="flex items-center gap-2">
                    {/* Desktop Icons */}
                    <div className="hidden sm:flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-full hover:bg-blue-100 hover:text-blue-600 transition duration-200 ease-in-out"
                            aria-label="Search"
                        >
                            <Search className="h-5 w-5" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-full hover:bg-blue-100 hover:text-blue-600 transition duration-200 ease-in-out"
                            aria-label="Favorites"
                        >
                            <Heart className="h-5 w-5" />
                        </Button>
                    </div>

                    {/* Authentication */}
                    {status === "loading" ? (
                        <div className="w-20 h-9 bg-gray-200 rounded-full animate-pulse"></div>
                    ) : session ? (
                        <div className="flex items-center gap-2">
                            <Link href="/dashboard">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="rounded-full hover:bg-blue-100 hover:text-blue-600 transition duration-200 ease-in-out"
                                    aria-label="Dashboard"
                                >
                                    <User className="h-5 w-5" />
                                </Button>
                            </Link>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => signOut()}
                                className="rounded-full hover:bg-red-100 hover:text-red-600 transition duration-200 ease-in-out"
                                aria-label="Sign Out"
                            >
                                <LogOut className="h-5 w-5" />
                            </Button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link href="/auth/signin">
                                <Button
                                    variant="ghost"
                                    className="rounded-full text-sm px-4 py-2 text-gray-700 hover:bg-blue-100 hover:text-blue-600 transition duration-200 ease-in-out"
                                >
                                    Sign In
                                </Button>
                            </Link>
                            <Link href="/auth/signup">
                                <Button className="rounded-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm sm:px-5 sm:text-base transition duration-200 ease-in-out">
                                    Sign Up
                                </Button>
                            </Link>
                        </div>
                    )}

                    {/* Burger Menu - Mobile */}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setMenuOpen(true)}
                        className="md:hidden rounded-full hover:bg-blue-100 hover:text-blue-600"
                        aria-label="Menu"
                    >
                        <Menu className="h-6 w-6" />
                    </Button>
                </div>
            </header>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {menuOpen && (
                    <>
                        {/* Overlay */}
                        <motion.div
                            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setMenuOpen(false)}
                        />

                        {/* Slide-in Menu */}
                        <motion.div
                            className="fixed top-0 right-0 w-64 h-full bg-white z-50 shadow-lg p-6 flex flex-col gap-4"
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        >
                            {/* Close Button */}
                            <div className="flex justify-end">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setMenuOpen(false)}
                                    className="rounded-full hover:bg-blue-100"
                                >
                                    <X className="h-6 w-6 text-gray-700" />
                                </Button>
                            </div>

                            {/* Nav Items */}
                            <nav className="flex flex-col space-y-2 mt-4">
                                {navItems.map((item) => (
                                    <Button
                                        key={item}
                                        variant="ghost"
                                        className="justify-start text-gray-800 text-sm hover:bg-blue-100"
                                        onClick={() => setMenuOpen(false)}
                                    >
                                        {item}
                                    </Button>
                                ))}
                            </nav>

                            {/* Mobile Authentication */}
                            <div className="mt-6 pt-4 border-t border-gray-200">
                                {session ? (
                                    <div className="space-y-2">
                                        <Link href="/dashboard">
                                            <Button
                                                variant="ghost"
                                                className="w-full justify-start text-gray-800 text-sm hover:bg-blue-100"
                                                onClick={() => setMenuOpen(false)}
                                            >
                                                <User className="h-4 w-4 mr-2" />
                                                Dashboard
                                            </Button>
                                        </Link>
                                        <Button
                                            variant="ghost"
                                            className="w-full justify-start text-red-600 text-sm hover:bg-red-100"
                                            onClick={() => {
                                                signOut();
                                                setMenuOpen(false);
                                            }}
                                        >
                                            <LogOut className="h-4 w-4 mr-2" />
                                            Sign Out
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        <Link href="/auth/signin">
                                            <Button
                                                variant="ghost"
                                                className="w-full justify-start text-gray-800 text-sm hover:bg-blue-100"
                                                onClick={() => setMenuOpen(false)}
                                            >
                                                Sign In
                                            </Button>
                                        </Link>
                                        <Link href="/auth/signup">
                                            <Button
                                                className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm"
                                                onClick={() => setMenuOpen(false)}
                                            >
                                                Sign Up
                                            </Button>
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}

export default Header;
