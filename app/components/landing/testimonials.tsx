"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import { motion } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

const testimonials = [
    {
        name: "Dr. John",
        role: "Medical Specialist",
        feedback:
            "The quality of medical equipment from MediCare has exceeded my expectations. The diagnostic tools are precise, reliable, and have significantly improved our patient care capabilities.",
        img: "/placeholder.svg?height=48&width=48&text=1",
    },
    {
        name: "Dr. Alice",
        role: "Cardiologist",
        feedback:
            "MediCare has transformed the way we handle patient diagnostics. Reliable, fast, and top-notch support.",
        img: "/placeholder.svg?height=48&width=48&text=2",
    },
    {
        name: "Dr. Sam",
        role: "Pediatrician",
        feedback:
            "Fantastic tools for pediatric care. I highly recommend MediCare to every clinic out there!",
        img: "/placeholder.svg?height=48&width=48&text=3",
    },
    {
        name: "Dr. Lila",
        role: "Neurologist",
        feedback:
            "MediCare’s equipment has brought immense value to our neurological diagnostics.",
        img: "/placeholder.svg?height=48&width=48&text=4",
    },
    {
        name: "Dr. Mike",
        role: "Surgeon",
        feedback:
            "From surgical instruments to patient monitors, everything is top tier!",
        img: "/placeholder.svg?height=48&width=48&text=5",
    },
];

function Testimonials() {
    const containerRef = useRef(null);

    return (
        <section className=" mx-auto py-24 bg-white overflow-hidden">
            <div className="px-4 md:px-8">
                <div className="text-center mb-16">
                    <Badge className="mb-4 text-sm px-3 py-1 rounded-full bg-blue-100 text-blue-600">
                        Testimonials
                    </Badge>
                    <h2 className="text-4xl font-bold text-slate-800">
                        What Our Customers Say
                    </h2>
                    <p className="text-slate-500 mt-3 max-w-xl mx-auto">
                        Real experiences from healthcare professionals and patients.
                    </p>
                </div>

                <div className="relative">
                    <motion.div
                        ref={containerRef}
                        className="flex gap-6"
                        initial={{ x: 0 }}
                        animate={{ x: ["0%", "-100%"] }}
                        transition={{
                            repeat: Infinity,
                            ease: "linear",
                            duration: 30,
                        }}
                    >
                        {[...testimonials, ...testimonials].map((item, idx) => (
                            <div
                                key={idx}
                                className="min-w-[300px] md:min-w-[400px] snap-center"
                            >
                                <Card className="h-full p-6 shadow-md border border-slate-100 transition-all hover:shadow-xl bg-white rounded-2xl">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-12 h-12 rounded-full bg-slate-200 overflow-hidden relative">
                                            <Image
                                                src={item.img}
                                                alt={item.name}
                                                fill
                                                className="object-cover rounded-full"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-slate-800">
                                                {item.name}
                                            </h4>
                                            <p className="text-sm text-slate-500">{item.role}</p>
                                        </div>
                                        <div className="flex items-center space-x-0.5">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <Star
                                                    key={star}
                                                    className="h-4 w-4 fill-yellow-400 text-yellow-400"
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-slate-600 leading-relaxed text-sm">{`“${item.feedback}”`}</p>
                                </Card>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

export default Testimonials;
