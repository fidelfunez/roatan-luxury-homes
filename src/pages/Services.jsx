import React, { useState, useEffect } from 'react';
import { Briefcase, Gavel, Home, TrendingUp, Anchor, Users, ArrowRight, Star, CheckCircle, Clock, Phone, Mail, Shield, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { getContentField, getWebsiteContent } from '@/lib/contentUtils';

const Services = () => {
  const [content, setContent] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load website content
    const loadContent = () => {
      try {
        const websiteContent = getWebsiteContent();
        setContent(websiteContent);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading content:', error);
        setIsLoading(false);
      }
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
    try {
      const value = content[page]?.[section]?.[field];
      
      // If the value is empty, null, undefined, or not a string, return the default
      if (!value || typeof value !== 'string' || value.trim() === '') {
        return getContentField(page, section, field);
      }
      
      return value;
    } catch (error) {
      console.error('Error getting content:', error);
      return getContentField(page, section, field);
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading services...</p>
        </div>
      </div>
    );
  }

  const servicesList = [
    {
      slug: "property-sales-acquisition",
      icon: <Home className="w-12 h-12 text-primary" />,
      title: getContent('property-sales-acquisition', '', 'title') || "Property Sales & Acquisition",
      description: getContent('property-sales-acquisition', '', 'description') || "Expert assistance for buying or selling residential homes, luxury villas, condos, and commercial properties. We guide you through every step, from market analysis to closing.",
      imageUrl: "/Photos/property-sales-acquisition-header.jpg",
      features: ["Market Analysis", "Negotiation Support", "Closing Assistance"],
      badge: "Most Popular",
      badgeColor: "from-yellow-400 to-orange-500"
    },
    {
      slug: "legal-guidance-due-diligence",
      icon: <Gavel className="w-12 h-12 text-primary" />,
      title: getContent('legal-guidance-due-diligence', '', 'title') || "Legal Guidance & Assistance",
      description: getContent('legal-guidance-due-diligence', '', 'description') || "Navigating Honduran property law can be complex. We connect you with trusted legal professionals for due diligence, title searches, and contract reviews.",
      imageUrl: "/Photos/legal-assistance-header.jpg",
      features: ["Title Searches", "Contract Review", "Legal Compliance"],
      badge: "Essential",
      badgeColor: "from-blue-400 to-blue-600"
    },
    {
      slug: "relocation-assistance",
      icon: <Users className="w-12 h-12 text-primary" />,
      title: getContent('relocation-assistance', '', 'title') || "Relocation Assistance",
      description: getContent('relocation-assistance', '', 'description') || "Moving to Roatán? We offer comprehensive relocation support, including advice on residency, banking, schools, and settling into island life.",
      imageUrl: "/Photos/relocation-assistance-header.jpg",
      features: ["Residency Guidance", "School Information", "Local Integration"],
      badge: "New Service",
      badgeColor: "from-green-400 to-green-600"
    },
    {
      slug: "land-development-investment",
      icon: <TrendingUp className="w-12 h-12 text-primary" />,
      title: getContent('land-development-investment', '', 'title') || "Development & Investment",
      description: getContent('land-development-investment', '', 'description') || "Identifying prime land for development, connecting with architects and builders, and advising on investment strategies for maximum returns.",
      imageUrl: "/Photos/land-development-header.jpeg",
      features: ["Site Selection", "Investment Analysis", "Development Planning"],
      badge: "Premium",
      badgeColor: "from-purple-400 to-purple-600"
    },
    {
      slug: "vacation-rental-management",
      icon: <Anchor className="w-12 h-12 text-primary" />,
      title: getContent('vacation-rental-management', '', 'title') || "Vacation Rental Management",
      description: getContent('vacation-rental-management', '', 'description') || "Turn your Roatán property into a profitable investment with our professional vacation rental management services, handling bookings, maintenance, and guest services.",
      imageUrl: "/Photos/vacation-rental-h.jpeg",
      features: ["Booking Management", "Property Maintenance", "Guest Services"],
      badge: "High Demand",
      badgeColor: "from-pink-400 to-pink-600"
    },
    {
      slug: "commercial-real-estate",
      icon: <Briefcase className="w-12 h-12 text-primary" />,
      title: getContent('commercial-real-estate', '', 'title') || "Commercial Real Estate",
      description: getContent('commercial-real-estate', '', 'description') || "Specialized services for businesses looking to establish or expand in Roatán, including office spaces, retail locations, and hospitality ventures.",
      imageUrl: "/Photos/commercial-real-estate-header.jpg",
      features: ["Business Location", "Market Research", "Investment Strategy"],
      badge: "Specialized",
      badgeColor: "from-indigo-400 to-indigo-600"
    }
  ];

  return (
    <div className="space-y-16 md:space-y-24">
      {/* Enhanced Hero Section */}
      <section className="text-center py-16 md:py-20 relative overflow-hidden rounded-xl">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src="/Photos/turtle-ocean-optimized.jpg" 
            alt="Turtle in Caribbean ocean" 
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/50"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-white text-sm font-medium mb-4 drop-shadow-md">
              <Award className="w-4 h-4" />
              <span>Comprehensive Real Estate Solutions</span>
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white drop-shadow-lg mb-4">{getContent('services', 'hero', 'title')}</h1>
          <p className="text-lg md:text-xl text-white/95 max-w-3xl mx-auto mb-8 drop-shadow-md">
            {getContent('services', 'hero', 'subtitle')}
          </p>
          
          {/* Service Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { number: getContent('services', 'hero', 'stat1Number'), label: getContent('services', 'hero', 'stat1Label') },
              { number: getContent('services', 'hero', 'stat2Number'), label: getContent('services', 'hero', 'stat2Label') },
              { number: getContent('services', 'hero', 'stat3Number'), label: getContent('services', 'hero', 'stat3Label') },
              { number: getContent('services', 'hero', 'stat4Number'), label: getContent('services', 'hero', 'stat4Label') }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-primary">{stat.number}</div>
                <div className="text-sm text-white">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Services Grid */}
      <section className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {servicesList.map((service, index) => (
            <div 
              key={service.title} 
              className="h-full group"
            >
              <Card className="bg-card rounded-xl shadow-md overflow-hidden hover:shadow-lg flex flex-col h-full group border border-border/50">
                <Link to={`/services/${service.slug}`} className="flex flex-col h-full">
                  <CardHeader className="p-0 relative">
                    <div className="relative aspect-w-16 aspect-h-9">
                      <img   
                        alt={service.title + " service visual"} 
                        className="object-cover w-full h-full"
                        src={service.imageUrl} 
                        loading="lazy" />
                      
                      {/* Service Badge - Removed for cleaner look */}
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6 flex-grow">
                    <div className="flex items-center gap-3 mb-3">
                      {service.icon}
                      <CardTitle className="text-xl sm:text-2xl font-semibold text-primary line-clamp-2">{service.title}</CardTitle>
                    </div>
                    <CardDescription className="text-muted-foreground flex-grow mb-4 line-clamp-3">{service.description}</CardDescription>
                    
                    {/* Service Features */}
                    <div className="space-y-2 mb-4">
                      {service.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CheckCircle className="w-4 h-4 text-primary" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 sm:p-6 bg-slate-50 dark:bg-slate-800/50 mt-auto">
                    <Button variant="link" className="text-primary p-0 group-hover:underline font-semibold text-sm sm:text-base">
                      Learn More <ArrowRight className="ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                  </CardFooter>
                </Link>
              </Card>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="relative w-full">
        <img src="/Photos/boat-ocean-optimized.jpg" alt="Boat on Caribbean ocean" className="absolute inset-0 w-full h-full object-cover rounded-2xl" loading="lazy" />
        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-primary/60 via-turquoise-dark/60 to-primary/40 rounded-2xl" />
        <div className="relative container mx-auto px-4 z-10 p-8 md:p-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 drop-shadow-lg">{getContent('services', 'whyChooseUs', 'title')}</h2>
            <p className="text-lg text-white/95 max-w-3xl mx-auto drop-shadow-md">
              {getContent('services', 'whyChooseUs', 'subtitle')}
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Shield className="w-8 h-8 text-white" />,
                title: getContent('services', 'whyChooseUs', 'feature1Title'),
                description: getContent('services', 'whyChooseUs', 'feature1Desc')
              },
              {
                icon: <Users className="w-8 h-8 text-white" />,
                title: getContent('services', 'whyChooseUs', 'feature2Title'),
                description: getContent('services', 'whyChooseUs', 'feature2Desc')
              },
              {
                icon: <Award className="w-8 h-8 text-white" />,
                title: getContent('services', 'whyChooseUs', 'feature3Title'),
                description: getContent('services', 'whyChooseUs', 'feature3Desc')
              },
              {
                icon: <Phone className="w-8 h-8 text-white" />,
                title: getContent('services', 'whyChooseUs', 'feature4Title'),
                description: getContent('services', 'whyChooseUs', 'feature4Desc')
              }
            ].map((item, index) => (
              <div 
                key={index}
                className="text-center"
              >
                <div className="mb-4 flex justify-center">{item.icon}</div>
                <h3 className="text-lg font-semibold text-white mb-2 drop-shadow-md">{item.title}</h3>
                <p className="text-white/90 text-sm drop-shadow-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="bg-sandy-light py-16 md:py-20 rounded-xl shadow-inner">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-primary mb-6">{getContent('services', 'cta', 'title')}</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            {getContent('services', 'cta', 'subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground transform hover:scale-105 transition-transform duration-300 bg-white/80 backdrop-blur-sm font-semibold shadow-lg">
              <Link to="/contact">Contact Us Today</Link>
            </Button>
            <Button size="lg" asChild variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground transform hover:scale-105 transition-transform duration-300 bg-white/80 backdrop-blur-sm font-semibold shadow-lg">
              <Link to="/properties">View Properties</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
