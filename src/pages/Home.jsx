import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { MapPin, Home as HomeIconLucide, DollarSign, ArrowRight, Users, Award, MessageCircle, Star, CheckCircle, Clock, Phone, Mail, Search, Filter, BedDouble, Bath, CarFront, Shield, Building2 } from 'lucide-react';
import NewsletterSignup from '@/components/NewsletterSignup';
import { getProperties } from '@/lib/supabaseUtils';
import { getContentField, getWebsiteContent } from '@/lib/contentUtils';

const Home = () => {
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState({});

  useEffect(() => {
    const loadFeaturedProperties = async () => {
      try {
        setLoading(true);
        const allProperties = await getProperties();
        // Show up to 3 properties as featured, or show empty state
        const featured = allProperties.slice(0, 3);
        setFeaturedProperties(featured);
      } catch (error) {
        console.error('Error loading featured properties:', error);
        setFeaturedProperties([]);
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedProperties();
    
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

  const formatPrice = (price) => {
    if (!price) return 'Price on request';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="space-y-4 md:space-y-8">
      {/* Enhanced Hero Section - Compact & Full Width */}
      <section className="hero-full-bleed relative py-12 md:py-16 lg:py-20 flex items-center justify-center text-center overflow-hidden w-full lg:w-screen lg:left-1/2 lg:right-1/2 lg:-translate-x-1/2 lg:mx-0">
        {/* Desktop Background */}
        <div className="hidden lg:block absolute inset-0 w-full">
          <img 
            alt="Tropical Caribbean beach background" 
            className="w-full h-full object-cover" 
            src="/Photos/hero-banner-optimized.jpg" 
            loading="eager" 
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-turquoise-dark/80 to-primary/70"></div>
        </div>
        
        {/* Mobile Background */}
        <div className="lg:hidden absolute inset-0 w-full bg-gradient-to-br from-turquoise-dark via-primary to-turquoise-light"></div>
        
        <div className="relative z-10 w-full px-4 sm:px-6 lg:px-0 mx-auto max-w-7xl">
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-white text-sm font-medium mb-4">
              <Star className="w-4 h-4" />
              <span>Trusted by 500+ Clients</span>
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 leading-tight tracking-tight">
            {getContent('home', 'hero', 'title')}
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl text-white/90 mb-10 max-w-4xl mx-auto">
            {getContent('home', 'hero', 'subtitle')}
          </p>
          
          {/* Desktop Hero Actions */}
          <div className="hidden lg:flex items-center justify-center space-x-6 mb-12">
            <Button size="lg" asChild variant="outline" className="border-white text-white hover:bg-white hover:text-primary shadow-lg text-lg px-8 py-4 bg-white/20 backdrop-blur-sm font-semibold">
              <Link to="/properties">
                <Search className="mr-2 h-5 w-5" />
                Browse Properties
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" asChild variant="outline" className="border-white text-white hover:bg-white hover:text-primary shadow-lg text-lg px-8 py-4 bg-white/20 backdrop-blur-sm font-semibold">
              <Link to="/contact">
                <Phone className="mr-2 h-5 w-5" />
                Contact Us
              </Link>
            </Button>
          </div>
          
          {/* Mobile Hero Actions */}
          <div className="lg:hidden flex flex-col space-y-4 mb-8">
            <Button size="lg" asChild variant="outline" className="border-white text-white hover:bg-white hover:text-primary shadow-lg text-lg px-6 py-4 bg-white/20 backdrop-blur-sm font-semibold">
              <Link to="/properties">
                <Search className="mr-2 h-5 w-5" />
                Browse Properties
              </Link>
            </Button>
            <Button size="lg" asChild variant="outline" className="border-white text-white hover:bg-white hover:text-primary shadow-lg text-lg px-6 py-4 bg-white/20 backdrop-blur-sm font-semibold">
              <Link to="/contact">
                <Phone className="mr-2 h-5 w-5" />
                Contact Us
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Properties Section */}
      {!loading && featuredProperties.length > 0 && (
        <section className="container mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              {getContent('home', 'featured', 'title')}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {getContent('home', 'featured', 'subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProperties.map((property) => (
              <Card key={property.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={property.image || 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cmVhbCUyMGVzdGF0ZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60'}
                    alt={property.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute top-4 left-4">
                    <div className="flex items-center space-x-2 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
                      <HomeIconLucide className="w-4 h-4" />
                      <span className="text-xs font-medium text-gray-700">
                        {property.type || 'Property'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <CardContent className="p-6">
                  <h3 className="font-semibold text-xl mb-2 line-clamp-2">
                    {property.title}
                  </h3>
                  
                  <div className="flex items-center text-sm text-gray-600 mb-3">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span className="line-clamp-1">{property.location}</span>
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-bold text-xl text-primary">
                      {formatPrice(property.price)}
                    </span>
                    {property.beds && property.baths && (
                      <div className="text-sm text-gray-600">
                        {property.beds} bed • {property.baths} bath
                      </div>
                    )}
                  </div>
                  
                  {property.description && (
                    <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                      {property.description}
                    </p>
                  )}
                </CardContent>
                
                <CardFooter className="p-6 pt-0">
                  <Button asChild className="w-full">
                    <Link to={`/properties/${property.id}`}>
                      View Details
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button asChild variant="outline" size="lg">
              <Link to="/properties">
                View All Properties
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </section>
      )}

      {/* Services Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            {getContent('home', 'services', 'title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {getContent('home', 'services', 'subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: "Property Sales & Acquisition",
              description: "Expert guidance through every step of buying and selling luxury properties in the Caribbean.",
              icon: <HomeIconLucide className="w-8 h-8" />,
              href: "/services/property-sales-acquisition",
              color: "bg-blue-500 hover:bg-blue-600"
            },
            {
              title: "Vacation Rental Management",
              description: "Maximize your rental income with our comprehensive property management services.",
              icon: <Clock className="w-8 h-8" />,
              href: "/services/vacation-rental",
              color: "bg-green-500 hover:bg-green-600"
            },
            {
              title: "Land Development",
              description: "Transform raw land into profitable investments with our development expertise.",
              icon: <Award className="w-8 h-8" />,
              href: "/services/land-development",
              color: "bg-orange-500 hover:bg-orange-600"
            },
            {
              title: "Commercial Real Estate",
              description: "Strategic commercial property investments for businesses and investors.",
              icon: <Building2 className="w-8 h-8" />,
              href: "/services/commercial-real-estate",
              color: "bg-purple-500 hover:bg-purple-600"
            },
            {
              title: "Relocation Assistance",
              description: "Smooth transition services for individuals and families moving to the Caribbean.",
              icon: <Users className="w-8 h-8" />,
              href: "/services/relocation-assistance",
              color: "bg-pink-500 hover:bg-pink-600"
            },
            {
              title: "Legal Assistance",
              description: "Expert legal guidance for all your real estate transactions and investments.",
              icon: <Shield className="w-8 h-8" />,
              href: "/services/legal-assistance",
              color: "bg-indigo-500 hover:bg-indigo-600"
            }
          ].map((service, index) => (
            <Card key={service.title} className="group hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className={`w-16 h-16 rounded-lg ${service.color} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  {service.icon}
                </div>
                
                <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
                <p className="text-muted-foreground mb-4">{service.description}</p>
                
                <Button asChild variant="outline" className="w-full">
                  <Link to={service.href}>
                    Learn More
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Newsletter Section */}
      <NewsletterSignup />

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary to-primary/80 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Find Your Dream Property?</h2>
          <p className="text-xl mb-8 opacity-90">
            Let us help you discover the perfect Caribbean paradise
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary" className="text-lg py-6 px-8">
              <Link to="/contact">
                <Phone className="w-5 h-5 mr-2" />
                Contact Us
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-lg py-6 px-8 border-white text-white hover:bg-white hover:text-primary">
              <Link to="/submit-property">
                <HomeIconLucide className="w-5 h-5 mr-2" />
                Submit Property
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;