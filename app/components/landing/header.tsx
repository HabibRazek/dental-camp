import { Button } from "@/components/ui/button";
import { Heart, Search } from "lucide-react";
import { TbDental } from "react-icons/tb";

function Header() {
    return (
        <header className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 bg-white/80 backdrop-blur-md rounded-full shadow-lg px-6 py-3 flex items-center justify-between w-[90%] max-w-5xl transition-all duration-300">
            <div className="flex items-center gap-3">
                <TbDental className="h-6 w-6 text-primary" />
                <span className="font-bold text-lg tracking-wide text-gray-800">Dental Camp</span>
            </div>

            <nav className="hidden md:flex items-center space-x-2">
                {["Home", "About", "Our Products", "Contact", "FAQs"].map((item) => (
                    <Button 
                        key={item} 
                        variant="ghost" 
                        className="rounded-full text-sm px-4 py-2 text-gray-700 hover:bg-blue-100 hover:text-blue-600 transition duration-200 ease-in-out"
                    >
                        {item}
                    </Button>
                ))}
            </nav>

            <div className="flex items-center gap-2">
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
                <Button className="rounded-full bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 transition duration-200 ease-in-out">
                    Sign In
                </Button>
            </div>
        </header>
    );
}

export default Header;
