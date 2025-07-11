import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';

const Layout = ({ children }) => {
  // If the first child is a hero section, render it outside the container
  let hero = null;
  let rest = children;
  if (Array.isArray(children) && children[0]?.props?.className?.includes('hero-full-bleed')) {
    hero = children[0];
    rest = children.slice(1);
  }
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-sandy-light via-white to-turquoise-light">
      <Header />
      {hero}
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pt-24 sm:pt-28 md:pt-32">
        {rest}
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Layout;