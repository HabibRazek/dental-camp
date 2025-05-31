'use client'
import React from 'react'
import Header from './header'
import HeroSection from './hero-section'
import ProductsSection from "./products-section";
import Features from "./features";
import Testimonials from "./testimonials";
import Footer from '../footer';

const Landing = () => {

    return (

        <>
            <Header />
            <HeroSection />
            <ProductsSection />
            <Features />
            <Testimonials />
            <Footer />
        </>
    )
}

export default Landing