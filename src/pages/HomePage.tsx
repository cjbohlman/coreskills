import React from 'react';
import { Layout } from '../components/layout/Layout';
import { HeroSection } from '../components/home/HeroSection';
import { FeaturesSection } from '../components/home/FeaturesSection';
import { TestimonialsSection } from '../components/home/TestimonialsSection';
import { CtaSection } from '../components/home/CtaSection';

const HomePage: React.FC = () => {
  return (
    <Layout>
      <HeroSection />
      <FeaturesSection />
      <TestimonialsSection />
      <CtaSection />
    </Layout>
  );
};

export default HomePage;