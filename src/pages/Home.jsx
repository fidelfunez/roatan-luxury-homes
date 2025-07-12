import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { MapPin, Home as HomeIconLucide, DollarSign, ArrowRight, Users, Award, MessageCircle, Star, CheckCircle, Clock, Phone, Mail, Search, Filter, BedDouble, Bath, CarFront } from 'lucide-react';
import NewsletterSignup from '@/components/NewsletterSignup';
import OptimizedImage from '@/components/OptimizedImage';
import { getProperties } from '@/lib/supabaseUtils';
import { getContentField, getWebsiteContent } from '@/lib/contentUtils';

const Home = () => {
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [content, setContent] = useState({});

  useEffect(() => {
    const loadFeaturedProperties = async () => {
      try {
        const allProperties = await getProperties();
        // Show up to 3 properties as featured, or show empty state
        const featured = allProperties.slice(0, 3);
        setFeaturedProperties(featured);
      } catch (error) {
        console.error('Error loading featured properties:', error);
        setFeaturedProperties([]);
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



  return (
    <div className="space-y-4 md:space-y-8">
      {/* Enhanced Hero Section - Compact & Full Width */}
      <section className="hero-full-bleed relative py-12 md:py-16 lg:py-20 flex items-center justify-center text-center overflow-hidden w-full lg:w-screen lg:left-1/2 lg:right-1/2 lg:-translate-x-1/2 lg:mx-0">
        {/* Desktop Background */}
        <div className="hidden lg:block absolute inset-0 w-full">
          <OptimizedImage 
            alt="Tropical Caribbean beach background" 
            className="w-full h-full object-cover" 
            src="/Photos/hero-banner-optimized.jpg" 
            loading="eager" 
            fetchpriority="high"
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
          <div className="lg:hidden space-y-4 mb-8">
            <Button size="lg" asChild variant="outline" className="border-white text-white hover:bg-white hover:text-primary shadow-md w-full bg-white/20 backdrop-blur-sm font-semibold">
              <Link to="/properties">View Properties <ArrowRight className="ml-2 h-5 w-5" /></Link>
            </Button>
            <Button size="lg" asChild variant="outline" className="border-white text-white hover:bg-white hover:text-primary shadow-md w-full bg-white/20 backdrop-blur-sm font-semibold">
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
          
          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center gap-6 text-white/90 text-sm lg:text-base">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>{getContent('home', 'hero', 'trustIndicator1')}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>{getContent('home', 'hero', 'trustIndicator2')}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>{getContent('home', 'hero', 'trustIndicator3')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Welcome Text Section */}
      <section className="container mx-auto px-4 py-8 md:py-12 lg:py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-primary">{getContent('home', 'welcome', 'title')}</h2>
          <p className="text-lg lg:text-xl text-muted-foreground mb-0">
            {getContent('home', 'welcome', 'description')}
          </p>
        </div>
      </section>

      {/* Features & Image Section */}
      <section className="container mx-auto px-4 py-8 md:py-12 lg:py-16">
        <div className="lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center">
          {/* Desktop: Left - Feature Cards */}
          <div className="hidden lg:grid lg:grid-cols-1 gap-6">
            {[
              { icon: <HomeIconLucide className="w-8 h-8 text-primary" />, title: getContent('home', 'welcome', 'feature1Title'), description: getContent('home', 'welcome', 'feature1Desc') },
              { icon: <Users className="w-8 h-8 text-primary" />, title: getContent('home', 'welcome', 'feature2Title'), description: getContent('home', 'welcome', 'feature2Desc') },
              { icon: <Award className="w-8 h-8 text-primary" />, title: getContent('home', 'welcome', 'feature3Title'), description: getContent('home', 'welcome', 'feature3Desc') },
            ].map((item, index) => (
              <div key={item.title} className="flex items-start gap-4 p-4 bg-card rounded-xl shadow-md hover:shadow-lg border border-border/50">
                <div className="flex-shrink-0">{item.icon}</div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-foreground">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
          
          {/* Desktop: Right Image */}
          <div className="hidden lg:block">
            <div className="relative">
              <img 
                src="/Photos/roatan-island-optimized.jpg" 
                alt="Roatán Island" 
                className="rounded-2xl shadow-2xl w-full h-96 object-cover"
              />
              <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-sm rounded-xl px-4 py-3 shadow-lg">
                <div className="text-sm font-semibold text-primary">{getContent('home', 'featuredLocation', 'startingPrice')}</div>
              </div>
            </div>
          </div>
          
          {/* Mobile: Centered Layout */}
          <div className="lg:hidden">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              {[
                { icon: <HomeIconLucide className="w-12 h-12 text-primary mx-auto mb-4" />, title: getContent('home', 'welcome', 'feature1Title'), description: getContent('home', 'welcome', 'feature1Desc') },
                { icon: <Users className="w-12 h-12 text-primary mx-auto mb-4" />, title: getContent('home', 'welcome', 'feature2Title'), description: getContent('home', 'welcome', 'feature2Desc') },
                { icon: <Award className="w-12 h-12 text-primary mx-auto mb-4" />, title: getContent('home', 'welcome', 'feature3Title'), description: getContent('home', 'welcome', 'feature3Desc') },
              ].map((item, index) => (
                <div 
                  key={item.title} 
                  className="p-6 bg-card rounded-xl shadow-md hover:shadow-lg border border-border/50"
                >
                  {item.icon}
                  <h3 className="text-xl font-semibold mb-2 text-foreground">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Featured Properties Section - Desktop Larger Cards */}
      <section className="container mx-auto px-4 py-8 md:py-12 lg:py-16">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-4 text-primary">
          {featuredProperties.length > 0 ? 'Featured Properties' : 'Our Properties'}
        </h2>
        <p className="text-lg lg:text-xl text-center text-muted-foreground mb-12 max-w-4xl mx-auto">
          {featuredProperties.length > 0 
            ? "Discover our handpicked selection of exceptional properties in Roatán's most desirable locations."
            : "We're working on adding amazing properties to our portfolio. Contact us to learn about upcoming listings or to list your property."
          }
        </p>
        
        {featuredProperties.length > 0 ? (
          <>
            {/* Desktop: Larger Grid */}
            <div className="hidden lg:grid lg:grid-cols-3 gap-8">
              {featuredProperties.map((property, index) => (
                <div key={property.id} className="group">
                  <Card className="overflow-hidden shadow-lg hover:shadow-xl border border-border/50 h-full">
                    <div className="relative h-64 overflow-hidden">
                      <img 
                        alt={property.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                        src={property.image || "https://images.unsplash.com/photo-1582407947304-fd86f028f716?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cmVhbCUyMGVzdGF0ZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60"} 
                        loading="lazy" 
                      />
                      {property.type && (
                        <div className="absolute top-4 left-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                          {property.type}
                        </div>
                      )}
                      {index === 0 && (
                        <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                          Featured
                        </div>
                      )}
                    </div>
                    <CardContent className="p-8">
                      <CardTitle className="text-2xl mb-3">{property.title}</CardTitle>
                      <div className="flex items-center text-muted-foreground mb-4">
                        <MapPin className="w-5 h-5 mr-2" />
                        <span className="text-lg">{property.location}</span>
                      </div>
                      <p className="text-muted-foreground mb-6 text-lg line-clamp-3">{property.description}</p>
                      
                      {/* Property Details */}
                      <div className="flex items-center gap-6 mb-6 text-sm text-muted-foreground">
                        {property.beds && (
                          <div className="flex items-center gap-2">
                            <BedDouble className="w-5 h-5 text-primary" />
                            <span>{property.beds} beds</span>
                          </div>
                        )}
                        {property.baths && (
                          <div className="flex items-center gap-2">
                            <Bath className="w-5 h-5 text-primary" />
                            <span>{property.baths} baths</span>
                          </div>
                        )}
                        {property.area && (
                          <div className="flex items-center gap-2">
                            <CarFront className="w-5 h-5 text-primary" />
                            <span>{property.area} sq ft</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-primary font-bold text-xl">
                          <DollarSign className="w-5 h-5 mr-2" />
                          {property.price ? property.price.toLocaleString() : 'Contact for price'}
                        </div>
                        <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
                          <Link to={`/properties/${property.id}`}>
                            View Details 
                            <ArrowRight className="ml-2 h-5 w-5" />
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
            
            {/* Mobile: Compact Grid */}
            <div className="lg:hidden grid md:grid-cols-3 gap-8">
              {featuredProperties.map((property, index) => (
                <div key={property.id} className="group">
                  <Card className="overflow-hidden shadow-md hover:shadow-lg border border-border/50">
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        alt={property.title} 
                        className="w-full h-full object-cover" 
                        src={property.image || "https://images.unsplash.com/photo-1582407947304-fd86f028f716?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cmVhbCUyMGVzdGF0ZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60"} 
                        loading="lazy" 
                      />
                      {property.type && (
                        <div className="absolute top-4 left-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                          {property.type}
                        </div>
                      )}
                      {index === 0 && (
                        <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                          Featured
                        </div>
                      )}
                    </div>
                    <CardContent className="p-6">
                      <CardTitle className="text-xl mb-2">{property.title}</CardTitle>
                      <div className="flex items-center text-muted-foreground mb-3">
                        <MapPin className="w-4 h-4 mr-1" />
                        {property.location}
                      </div>
                      <p className="text-muted-foreground mb-4 line-clamp-2">{property.description}</p>
                      
                      {/* Property Details */}
                      <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                        {property.beds && (
                          <div className="flex items-center gap-1">
                            <span>🛏️</span>
                            <span>{property.beds} beds</span>
                          </div>
                        )}
                        {property.baths && (
                          <div className="flex items-center gap-1">
                            <span>🚿</span>
                            <span>{property.baths} baths</span>
                          </div>
                        )}
                        {property.area && (
                          <div className="flex items-center gap-1">
                            <span>📐</span>
                            <span>{property.area} sq ft</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-primary font-bold">
                          <DollarSign className="w-4 h-4 mr-1" />
                          {property.price ? property.price.toLocaleString() : 'Contact for price'}
                        </div>
                        <Button asChild size="sm" className="bg-primary hover:bg-primary/90">
                          <Link to={`/properties/${property.id}`}>View Details <ArrowRight className="ml-1 h-4 w-4" /></Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-12">
              <Button asChild size="lg" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground text-lg px-8 py-4 bg-white/80 backdrop-blur-sm font-semibold shadow-lg">
                <Link to="/properties">
                  <Filter className="mr-2 h-5 w-5" />
                  View All Properties 
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="text-6xl mb-4">🏠</div>
              <h3 className="text-xl font-semibold mb-4">No Properties Listed Yet</h3>
              <p className="text-muted-foreground mb-6">
                Our team is working on adding amazing properties to our portfolio. Contact us to learn about upcoming listings or to list your property.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild variant="outline">
                  <Link to="/contact">Contact Us</Link>
                </Button>
                <Button asChild>
                  <Link to="/submit-property">List Your Property</Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Testimonials Section */}
      <section className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-4 text-primary">{getContent('home', 'testimonials', 'title')}</h2>
        <p className="text-lg lg:text-xl text-center text-muted-foreground mb-12 max-w-4xl mx-auto">
          {getContent('home', 'testimonials', 'subtitle')}
        </p>
        
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              name: getContent('home', 'testimonials', 'testimonial1Name'),
              location: getContent('home', 'testimonials', 'testimonial1Location'),
              text: getContent('home', 'testimonials', 'testimonial1Text'),
              rating: 5
            },
            {
              name: getContent('home', 'testimonials', 'testimonial2Name'),
              location: getContent('home', 'testimonials', 'testimonial2Location'),
              text: getContent('home', 'testimonials', 'testimonial2Text'),
              rating: 5
            },
            {
              name: getContent('home', 'testimonials', 'testimonial3Name'),
              location: getContent('home', 'testimonials', 'testimonial3Location'),
              text: getContent('home', 'testimonials', 'testimonial3Text'),
              rating: 5
            }
          ].map((testimonial, index) => (
            <div 
              key={index}
              className="bg-card p-6 lg:p-8 rounded-xl shadow-md border border-border/50"
            >
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-muted-foreground mb-4 italic text-lg">{testimonial.text}</p>
              <div>
                <div className="font-semibold text-foreground text-lg">{testimonial.name}</div>
                <div className="text-sm text-muted-foreground">{testimonial.location}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="container mx-auto px-4">
        <div className="relative rounded-xl p-8 md:p-12 lg:p-16 text-center text-white overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0">
            <img 
              src="/Photos/boat-ocean-optimized.jpg" 
              alt="Boat on Caribbean ocean" 
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/60 via-turquoise-dark/60 to-primary/40"></div>
          </div>
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-white drop-shadow-lg">{getContent('home', 'cta', 'title')}</h2>
            <p className="text-lg lg:text-xl mb-8 text-white/95 max-w-3xl mx-auto drop-shadow-md">{getContent('home', 'cta', 'subtitle')}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild variant="outline" className="border-white text-white hover:bg-white hover:text-primary shadow-md text-lg px-8 py-4 bg-white/20 backdrop-blur-sm font-semibold">
                <Link to="/properties">
                  <HomeIconLucide className="mr-2 h-5 w-5" />
                  Browse Properties
                </Link>
              </Button>
              <Button size="lg" asChild variant="outline" className="border-white text-white hover:bg-white hover:text-primary shadow-md text-lg px-8 py-4 bg-white/20 backdrop-blur-sm font-semibold">
                <Link to="/contact">
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Get in Touch
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4">
        <NewsletterSignup />
      </section>
    </div>
  );
};

export default Home;