"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart, Search, Menu, X, User, LogOut, ShoppingCart, MoreVertical } from "lucide-react";
import { TbDental } from "react-icons/tb";
import { motion, AnimatePresence } from "framer-motion";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { GoogleSignInClient } from "../auth/google-signin-client";
import { Cart } from "@/components/cart/Cart";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navItems = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Our Products", href: "/catalog" },
    { name: "Contact", href: "/#contact", isScroll: true },
    { name: "FAQs", href: "/faqs" }
];

function Header() {
    const [menuOpen, setMenuOpen] = useState(false);
    const { data: session, status } = useSession();

    const handleNavClick = (href: string, isScroll?: boolean) => {
        if (isScroll && href === "/#contact") {
            // If we're on the home page, scroll to contact
            if (window.location.pathname === "/") {
                const contactElement = document.getElementById("contact");
                if (contactElement) {
                    const offsetTop = contactElement.offsetTop - 100; // Add 100px offset for header
                    window.scrollTo({
                        top: offsetTop,
                        behavior: "smooth"
                    });
                }
            } else {
                // If we're on another page, navigate to home then scroll
                window.location.href = "/#contact";
            }
        }
    };

    return (
        <>
            <header className="fixed top-3 sm:top-6 left-1/2 transform -translate-x-1/2 z-50 bg-white/80 backdrop-blur-md rounded-full shadow-lg px-3 sm:px-4 lg:px-6 py-2 sm:py-3 flex items-center justify-between w-[95%] sm:w-[90%] max-w-5xl transition-all duration-300">
                {/* Logo Section */}
                <Link href="/" className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity">
                    <TbDental className="h-5 sm:h-6 w-5 sm:w-6 text-blue-600" />
                    <span className="font-bold text-sm sm:text-base lg:text-lg tracking-wide text-gray-800">
                        Dental Camp
                    </span>
                </Link>

                {/* Navigation - Desktop */}
                <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
                    {navItems.map((item) => (
                        <div key={item.name}>
                            {item.isScroll ? (
                                <Button
                                    variant="ghost"
                                    className="rounded-full text-xs lg:text-sm px-2 lg:px-3 xl:px-4 py-2 text-gray-700 hover:bg-blue-100 hover:text-blue-600 transition duration-200 ease-in-out"
                                    onClick={() => handleNavClick(item.href, item.isScroll)}
                                >
                                    {item.name}
                                </Button>
                            ) : (
                                <Link href={item.href}>
                                    <Button
                                        variant="ghost"
                                        className="rounded-full text-xs lg:text-sm px-2 lg:px-3 xl:px-4 py-2 text-gray-700 hover:bg-blue-100 hover:text-blue-600 transition duration-200 ease-in-out"
                                    >
                                        {item.name}
                                    </Button>
                                </Link>
                            )}
                        </div>
                    ))}
                </nav>

                {/* Actions */}
                <div className="flex items-center gap-1 sm:gap-2">
                    {/* Desktop Icons */}
                    <div className="hidden sm:flex items-center gap-1 lg:gap-2">
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
                            className="rounded-full hover:bg-blue-100 hover:text-blue-600 transition duration-200 ease-in-out relative"
                            aria-label="Favorites"
                        >
                            <Heart className="h-5 w-5" />
                        </Button>
                        <Cart />
                    </div>

                    {/* User Account */}
                    {status === "loading" ? (
                        <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
                    ) : session ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    className="relative h-10 w-10 rounded-full hover:bg-blue-100 transition duration-200 ease-in-out"
                                >
                                    <Avatar className="h-9 w-9">
                                        <AvatarImage
                                            src={session.user?.image || ""}
                                            alt={session.user?.name || "User"}
                                        />
                                        <AvatarFallback className="bg-blue-600 text-white text-sm">
                                            {session.user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end" forceMount>
                                <DropdownMenuLabel className="font-normal">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium leading-none">
                                            {session.user?.name || "User"}
                                        </p>
                                        <p className="text-xs leading-none text-muted-foreground">
                                            {session.user?.email}
                                        </p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuGroup>
                                    <DropdownMenuItem asChild>
                                        <Link href={session.user.role === 'ADMIN' ? '/dashboard' : '/user/dashboard'}>
                                            <User className="mr-2 h-4 w-4" />
                                            <span>Dashboard</span>
                                        </Link>
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    onClick={() => signOut({ callbackUrl: "/" })}
                                    className="text-red-600 focus:text-red-600"
                                >
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Sign out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link href="/auth/signin">
                                <Button
                                    variant="ghost"
                                    className="rounded-full hover:bg-blue-100 hover:text-blue-600 transition duration-200 ease-in-out flex items-center gap-2 px-4 py-2"
                                >
                                    <User className="h-4 w-4" />
                                    <span className="hidden sm:inline">Sign In</span>
                                </Button>
                            </Link>
                        </div>
                    )}

                    {/* Burger Menu - Mobile */}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setMenuOpen(true)}
                        className="lg:hidden rounded-full hover:bg-blue-100 hover:text-blue-600"
                        aria-label="Menu"
                    >
                        <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
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
                            className="fixed top-0 right-0 w-72 sm:w-80 h-full bg-white z-50 shadow-lg p-4 sm:p-6 flex flex-col gap-4"
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
                                    <div key={item.name}>
                                        {item.isScroll ? (
                                            <Button
                                                variant="ghost"
                                                className="w-full justify-start text-gray-800 text-sm hover:bg-blue-100"
                                                onClick={() => {
                                                    handleNavClick(item.href, item.isScroll);
                                                    setMenuOpen(false);
                                                }}
                                            >
                                                {item.name}
                                            </Button>
                                        ) : (
                                            <Link href={item.href}>
                                                <Button
                                                    variant="ghost"
                                                    className="w-full justify-start text-gray-800 text-sm hover:bg-blue-100"
                                                    onClick={() => setMenuOpen(false)}
                                                >
                                                    {item.name}
                                                </Button>
                                            </Link>
                                        )}
                                    </div>
                                ))}
                            </nav>

                            {/* Mobile Authentication */}
                            <div className="mt-6 pt-4 border-t border-gray-200">
                                {session ? (
                                    <div className="space-y-3">
                                        {/* User Info */}
                                        <div className="flex items-center gap-3 p-2">
                                            <Avatar className="h-10 w-10">
                                                <AvatarImage
                                                    src={session.user?.image || ""}
                                                    alt={session.user?.name || "User"}
                                                />
                                                <AvatarFallback className="bg-blue-600 text-white text-sm">
                                                    {session.user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex flex-col">
                                                <p className="text-sm font-medium text-gray-900">
                                                    {session.user?.name || "User"}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {session.user?.email}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Menu Items */}
                                        <div className="space-y-1">
                                            <Link href={session.user.role === 'ADMIN' ? '/dashboard' : '/user/dashboard'}>
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
                                                    signOut({ callbackUrl: "/" });
                                                    setMenuOpen(false);
                                                }}
                                            >
                                                <LogOut className="h-4 w-4 mr-2" />
                                                Sign Out
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        <GoogleSignInClient
                                            variant="outline"
                                            className="w-full text-sm"
                                        >
                                            Se connecter avec Google
                                        </GoogleSignInClient>
                                        <Link href="/auth/signin">
                                            <Button
                                                variant="ghost"
                                                className="w-full justify-start text-gray-800 text-sm hover:bg-blue-100"
                                                onClick={() => setMenuOpen(false)}
                                            >
                                                <User className="h-4 w-4 mr-2" />
                                                Sign In
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
