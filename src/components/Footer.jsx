import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input'; 
import { Label } from '@/components/ui/label';
import { Facebook, Instagram, Linkedin, Twitter, Youtube, Mail, MapPin, Phone } from 'lucide-react';
import Logo from './Logo';
import { getContentField, getWebsiteContent } from '@/lib/contentUtils';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [content, setContent] = useState({});

  useEffect(() => {
    // Load website content
    const loadContent = () => {
      const websiteContent = getWebsiteContent();
      setContent(websiteContent);
    };
    
    loadContent();
    
    // Listen for content updates
    const handleContentUpdate = () => {
      loadContent();
    };
    
    window.addEventListener('websiteContentUpdated', handleContentUpdate);
    
    return () => {
      window.removeEventListener('websiteContentUpdated', handleContentUpdate);
    };
  }, []);

  // Helper function to get content with fallback
  const getContent = (page, section, field) => {
    const value = content[page]?.[section]?.[field];
    
    // If the value is empty, null, or undefined, return the default
    if (!value || value.trim() === '') {
      return getContentField(page, section, field);
    }
    
    return value;
  };

  const footerSections = [
    {
      title: 'Explore',
      links: [
        { label: 'Home', to: '/' },
        { label: 'Properties', to: '/properties' },
        { label: 'Services', to: '/services' },
        { label: 'Blog', to: '/blog' },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'About Us', to: '/about' },
        { label: 'Contact Us', to: '/contact' },
        { label: 'Testimonials', to: '/#testimonials' }, 
        { label: 'Privacy Policy', to: '/privacy-policy' },
      ],
    },
  ];

  const socialLinks = [
    { icon: <Facebook className="h-6 w-6" />, href: '#', label: 'Facebook' },
    { icon: <Instagram className="h-6 w-6" />, href: '#', label: 'Instagram' },
    { icon: <Twitter className="h-6 w-6" />, href: '#', label: 'Twitter' },
    { icon: <Linkedin className="h-6 w-6" />, href: '#', label: 'LinkedIn' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <footer className="relative text-foreground py-12 border-t-2 border-primary/30 overflow-hidden">
      {/* Background Image */}
      <img 
        src="/Photos/sand-optimized.jpg" 
        alt="Caribbean sand" 
        className="absolute inset-0 w-full h-full object-cover"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-sandy-dark/80 via-sandy-DEFAULT/70 to-sandy-light/60"></div>
      <div className="absolute inset-0 bg-white/40"></div>
      <div className="relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
            <div className="space-y-4">
              <Logo className="text-lg" textClassName="text-lg" />
              <p className="text-sm text-muted-foreground">{getContent('footer', 'companyInfo', 'description')}</p>
              <div className="space-y-2 text-sm">
                <p className="flex items-center"><MapPin className="w-4 h-4 mr-2 text-primary" /> {getContent('footer', 'companyInfo', 'address')}</p>
                <p className="flex items-center"><Phone className="w-4 h-4 mr-2 text-primary" /> {getContent('footer', 'companyInfo', 'phone')}</p>
                <p className="flex items-center"><Mail className="w-4 h-4 mr-2 text-primary" /> {getContent('footer', 'companyInfo', 'email')}</p>
              </div>
            </div>

            {footerSections.map((section, index) => (
              <div key={section.title}>
                <p className="font-semibold text-lg text-primary mb-4">
                  {index === 0 ? getContent('footer', 'links', 'exploreTitle') : getContent('footer', 'links', 'companyTitle')}
                </p>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        to={link.to}
                        className="text-sm hover:text-primary hover:underline transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            
            <div>
              <p className="font-semibold text-lg text-primary mb-4">{getContent('footer', 'newsletter', 'title')}</p>
              <p className="text-sm text-muted-foreground mb-3">{getContent('footer', 'newsletter', 'description')}</p>
              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <Label htmlFor="footer-email" className="sr-only">Email address</Label>
                  <Input type="email" id="footer-email" placeholder={getContent('footer', 'newsletter', 'placeholder')} className="bg-white/80 focus:bg-white" />
                </div>
                <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                  {getContent('footer', 'newsletter', 'buttonText')}
                </Button>
              </form>
            </div>
          </div>

          <div className="border-t border-primary/20 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-muted-foreground">&copy; {currentYear} {getContent('footer', 'links', 'copyright')}</p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;