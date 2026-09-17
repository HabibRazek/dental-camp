import React from 'react'
import Header from './header'
import HeroWrapper from './hero-wrapper'
import AboutWrapper from './about-wrapper'
import ProductGridWrapper from './product-grid-wrapper'
import FeaturedProductsWrapper from './featured-products-wrapper'
import FeaturesWrapper from './features-wrapper'
import PartnerWrapper from './partner-wrapper'
import TestimonialsWrapper from './testimonials-wrapper'
import ContactWrapper from './contact-wrapper'
import Footer from './footer';

const Landing = () => {

    return (
        <>
            <Header />
            <HeroWrapper />
            <AboutWrapper />
            <FeaturedProductsWrapper />
            <ProductGridWrapper />
            <FeaturesWrapper />
            <PartnerWrapper />
            <TestimonialsWrapper />
            <div id="contact">
                <ContactWrapper />
            </div>
            <Footer />
        </>
    )
}

export default Landing