'use client'
import { useState } from "react";
import React from 'react'
import Header from './header'
import HeroSection from './hero-section'
import ProductsSection from "./products-section";
import Features from "./features";

const Landing = () => {
    const [cursorPosition] = useState({ x: 50, y: 50 });

    return (
        <div style={{
            background: `radial-gradient(circle at ${cursorPosition.x}% ${cursorPosition.y}%, #f0f9ff, #e0f2fe, #bae6fd)`,
        }} >
            <Header />
            <HeroSection />
            <ProductsSection />
            <Features />
        </div>
    )
}

export default Landing