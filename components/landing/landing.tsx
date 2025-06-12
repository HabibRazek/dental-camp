'use client'
import React from 'react'
import Header from './header'
import ModernHeroSection from './modern-hero-section'
import AboutSection from './about-section'
import ProductGridSection from './product-grid-section'
import FeaturedProductsSection from './featured-products-section'
import InnovativeFeaturesSection from './innovative-features-section'
import ModernTestimonialsSection from './modern-testimonials-section'
import InnovativeContactSection from './innovative-contact-section'
import Footer from './footer';

const Landing = () => {

    return (

        <>
            <Header />
            <ModernHeroSection />
            <AboutSection />
            <ProductGridSection />
            <FeaturedProductsSection />
            <InnovativeFeaturesSection />
            <ModernTestimonialsSection />
            <div id="contact">
                <InnovativeContactSection />
            </div>
            <Footer />
        </>
    )
}

export default Landing