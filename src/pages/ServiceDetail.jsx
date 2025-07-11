import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Mail, ArrowRight } from 'lucide-react';
import { getContentField, getWebsiteContent } from '@/lib/contentUtils';

const servicesData = {
  "property-sales-acquisition": {
    title: "Property Sales & Acquisition",
    longDescription: "Our expert team provides comprehensive support for buying or selling properties in Roatán. We handle everything from initial market analysis, property viewings, negotiation, to the final closing stages. Whether you're looking for a luxury beachfront villa, a cozy condo, a plot of land to build your dream home, or a commercial investment, we leverage our extensive network and local knowledge to find the perfect match for your needs. We ensure a transparent and smooth transaction process, guiding you every step of the way.",
    imageUrl: "/Photos/property-sales-acquisition.jpeg",
    relatedServices: ["legal-guidance-due-diligence", "relocation-assistance"]
  },
  "legal-guidance-due-diligence": {
            title: "Legal Guidance & Assistance",
    longDescription: "Navigating the legal landscape of Honduran real estate can be challenging. We connect you with highly reputable and experienced legal professionals specializing in property law. They will conduct thorough due diligence, including title searches, verification of property boundaries, and ensuring there are no outstanding liens or encumbrances. Our legal partners will also assist with contract review and preparation, ensuring your interests are protected throughout the transaction.",
    imageUrl: "/Photos/legal-assistance.jpg",
    relatedServices: ["property-sales-acquisition", "land-development-investment"]
  },
  "relocation-assistance": {
    title: "Relocation Assistance",
    longDescription: "Making the move to Roatán is an exciting adventure, and we're here to make your transition as smooth as possible. Our relocation assistance services cover a wide range of needs, from providing information on residency requirements and visa processes, to helping you set up bank accounts, find schools for your children, and connect with essential local services. We can also offer insights into island life, community groups, and cultural nuances to help you feel at home quickly.",
    imageUrl: "/Photos/relocation assistance.jpg",
    relatedServices: ["property-sales-acquisition", "vacation-rental-management"]
  },
  "land-development-investment": {
    title: "Land Development & Investment",
    longDescription: "Roatán offers significant opportunities for land development and real estate investment. We assist clients in identifying prime parcels of land suitable for residential, commercial, or mixed-use development. Our team can connect you with trusted local architects, engineers, and construction companies. We also provide market analysis and investment strategy advice to help you maximize your returns and navigate the development process efficiently.",
    imageUrl: "/Photos/land-development.jpg",
    relatedServices: ["property-sales-acquisition", "legal-guidance-due-diligence"]
  },
  "vacation-rental-management": {
    title: "Vacation Rental Management",
    longDescription: "Turn your Roatán property into a lucrative income source with our professional vacation rental management services. We handle all aspects of managing your rental, including marketing and listing on popular platforms, managing bookings and guest communication, coordinating check-ins/check-outs, and overseeing cleaning and maintenance. Our goal is to maximize your occupancy rates and rental income while ensuring your property is well-maintained and your guests have an exceptional experience.",
    imageUrl: "/Photos/vacation-rental.jpg",
    relatedServices: ["property-sales-acquisition", "relocation-assistance"]
  },
  "commercial-real-estate": {
    title: "Commercial Real Estate",
    longDescription: "For businesses looking to establish or expand their presence in Roatán, we offer specialized commercial real estate services. We can help you find suitable office spaces, retail locations, warehouses, or properties for hospitality ventures like hotels and restaurants. Our team understands the local commercial market dynamics and can assist with site selection, lease negotiation, and connecting you with relevant business support services.",
    imageUrl: "/Photos/commercial-real-estate.jpg",
    relatedServices: ["land-development-investment", "legal-guidance-due-diligence"]
  }
};

const getServiceName = (slug) => servicesData[slug]?.title || "Service";

const ServiceDetail = () => {
  const { slug } = useParams();
  const service = servicesData[slug];
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
    // For individual service pages, content is stored directly under the page key
    const value = section === '' 
      ? content[page]?.[field]
      : content[page]?.[section]?.[field];
    
    // If the value is empty, null, undefined, or not a string, return the default
    if (!value || typeof value !== 'string' || value.trim() === '') {
      return getContentField(page, section, field);
    }
    
    return value;
  };

  if (!service) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold text-destructive mb-4">Service Not Found</h1>
        <p className="text-muted-foreground mb-8">The service you are looking for does not exist or may have been moved.</p>
        <Button asChild>
          <Link to="/services"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Services</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Button variant="outline" asChild>
          <Link to="/services" className="text-primary hover:text-primary/80">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to All Services
          </Link>
        </Button>
      </div>

      <div className="bg-card p-6 sm:p-8 md:p-12 rounded-xl shadow-lg">
        <div className="service-title-container">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-primary mb-6 md:mb-8">
            {getContent(slug, '', 'title') || service.title}
          </h1>
        </div>
        
        <div className="grid md:grid-cols-5 gap-8 md:gap-12">
          <div className="md:col-span-3 space-y-6">
            <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden shadow-md">
              <img  
                alt={`Detailed view of ${service.title} service`} 
                className="object-cover w-full h-full"
                src={service.imageUrl} 
                loading="lazy" />
            </div>
            <div className="service-description-container">
              <p className="text-lg leading-relaxed text-foreground whitespace-pre-line">
                {getContent(slug, '', 'description') || service.longDescription}
              </p>
            </div>
          </div>

          <aside className="md:col-span-2 space-y-8">
            <div className="bg-sandy-light p-6 rounded-lg shadow-md">
              <h3 className="text-2xl font-semibold text-primary mb-4">Interested in this Service?</h3>
              <div className="service-cta-container">
                <p className="text-muted-foreground mb-6">
                  {getContent(slug, '', 'ctaText') || `Let's discuss how we can assist you with ${service.title.toLowerCase()}. Contact us today for a personalized consultation.`}
                </p>
              </div>
              <Button size="lg" asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                <Link to="/contact">
                  <Mail className="mr-2 h-5 w-5" /> Contact Us
                </Link>
              </Button>
            </div>

            {service.relatedServices && service.relatedServices.length > 0 && (
              <div className="bg-turquoise-light/20 p-6 rounded-lg shadow-md">
                <h3 className="text-2xl font-semibold text-primary mb-4">Related Services</h3>
                <ul className="space-y-3">
                  {service.relatedServices.map(relatedSlug => (
                    <li key={relatedSlug}>
                      <Button variant="link" asChild className="p-0 text-foreground hover:text-primary hover:underline flex items-center">
                        <Link to={`/services/${relatedSlug}`}>
                          <ArrowRight className="w-3 h-3 mr-1" />
                          {getServiceName(relatedSlug)}
                        </Link>
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetail;