"use client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Truck, Smile } from "lucide-react";
import { TbDental } from "react-icons/tb";

const features = [
    {
        title: "Dental Specialists",
        description: "Products approved by leading dental professionals",
        icon: <TbDental className="h-5 w-5" />,
        color: "bg-blue-100 text-blue-600"
    },
    {
        title: "Certified Quality",
        description: "ADA-approved materials meeting strict dental standards",
        icon: <ShieldCheck className="h-5 w-5" />,
        color: "bg-emerald-100 text-emerald-600"
    },
    {
        title: "Clinic Delivery",
        description: "Reliable shipping directly to your practice",
        icon: <Truck className="h-5 w-5" />,
        color: "bg-amber-100 text-amber-600"
    }
];

function Features() {
    return (
        <section className="py-16 md:py-16 bg-white">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <Badge className="mb-4 bg-blue-100 text-blue-600 hover:bg-blue-200">
                        <Smile className="h-4 w-4 mr-2" />
                        Why Dental Professionals Choose Us
                    </Badge>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Premium Dental Solutions
                    </h2>
                    <div className="w-20 h-1 bg-blue-600 mx-auto mb-6"></div>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Trusted by dental clinics nationwide for exceptional equipment and service
                    </p>
                </motion.div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                        >
                            <Card className="h-full p-8 border border-gray-100 hover:shadow-md transition-all">
                                <div className={`w-14 h-14 rounded-lg ${feature.color} flex items-center justify-center mb-5`}>
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    {feature.description}
                                </p>
                                <div className="w-full h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent"></div>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {/* CTA Section */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="mt-20 bg-white rounded-xl shadow-sm border border-gray-100 max-w-4xl mx-auto"
                >
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                        <div className="p-10">
                            <Badge className="mb-4 bg-blue-100 text-blue-600">Practice Support</Badge>
                            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                                Expert Guidance for Your Clinic
                            </h3>
                            <p className="text-gray-600 mb-6">
                                Our dental specialists provide personalized equipment recommendations and setup support.
                            </p>
                            <Button className="rounded-full bg-blue-600 hover:bg-blue-700 px-6 shadow-md">
                                Contact Our Experts
                            </Button>
                        </div>
                        <div className="bg-gray-50 flex items-center justify-center p-10 border-l border-gray-100">
                            <div className="relative w-full max-w-xs">
                                <div className="w-32 h-32 rounded-full bg-blue-600 flex items-center justify-center shadow-lg mx-auto">
                                    <TbDental className="h-12 w-12 text-white" />
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

export default Features;