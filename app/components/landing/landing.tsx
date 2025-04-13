'use client'
import React from 'react'
import Header from './header'
import HeroSection from './hero-section'
import ProductsSection from "./products-section";
import Features from "./features";
import Testimonials from "./testimonials";
import Footer from './footer';

const Landing = () => {

    return (
        <div style={{
            background: `linear-gradient(to bottom, 
                rgba(186, 230, 253, 1) 0%, 
                rgba(224, 242, 254, 0.8) 50%, 
                rgba(240, 249, 255, 0.6) 100%)`,
            minHeight: '100vh',
            width: '100%'
        }}>
            <Header />
            <HeroSection />
            <ProductsSection />
            <Features />
            <Testimonials />
            <Footer />
        </div>
    )
}

export default Landing