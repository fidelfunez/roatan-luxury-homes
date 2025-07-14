import React, { useState, useEffect } from 'react';
import { Users, Target, Award, ShieldCheck, HeartHandshake as Handshake, ArrowRight, Star, CheckCircle, MessageSquare, Phone, Mail, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { getContentField, getWebsiteContent } from '@/lib/contentUtils';

const About = () => {
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

  // Team members with static data - content will be loaded dynamically
  const teamMembers = [
    { name: 'Alice Johnson', role: 'Lead Agent & Founder', image: "team-member-1", bio: 'With over 15 years of experience in Roatán real estate, Alice is passionate about connecting clients with their dream properties and ensuring a seamless transaction process.' },
    { name: 'Bob Williams', role: 'Sales Specialist', image: "team-member-2", bio: 'Bob\'s deep knowledge of the local market and dedication to client satisfaction make him an invaluable asset to buyers and sellers alike.' },
    { name: 'Carol Davis', role: 'Client Relations Manager', image: "team-member-3", bio: 'Carol ensures every client receives personalized attention and support throughout their real estate journey, making complex processes feel simple.' },
  ];

  return (
    <div className="space-y-16 md:space-y-24">
      {/* Enhanced Hero Section */}
      <section className="hero-full-bleed text-center py-12 md:py-16 lg:py-20 relative overflow-hidden rounded-xl bg-gradient-to-br from-sandy-light via-turquoise-light to-blue-500 min-h-[400px] md:min-h-[500px] lg:min-h-[600px] flex items-center" style={{ background: 'linear-gradient(to bottom right, #f4f1eb, #06b6d4, #3b82f6)' }}>
        {/* Background Image with Color-Matched Placeholder */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
            alt="Caribbean luxury real estate" 
            className="w-full h-full object-cover"
            loading="eager"
            fetchpriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/50"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-white text-sm font-medium mb-4 drop-shadow-md">
              <Star className="w-4 h-4" />
              <span>Your Trusted Real Estate Partner</span>
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white drop-shadow-lg mb-4">{getContent('about', 'company', 'title')}</h1>
          <p className="text-lg md:text-xl lg:text-2xl text-white/95 max-w-4xl mx-auto mb-8 drop-shadow-md">
            {getContent('about', 'company', 'subtitle')}
          </p>
          
          {/* Company Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              { number: "15+", label: "Years Experience", icon: <Award className="w-6 h-6 text-white" /> },
              { number: "500+", label: "Properties Sold", icon: <CheckCircle className="w-6 h-6 text-white" /> },
              { number: "98%", label: "Client Satisfaction", icon: <Star className="w-6 h-6 text-white" /> },
              { number: "24/7", label: "Support Available", icon: <MessageSquare className="w-6 h-6 text-white" /> }
            ].map((stat, index) => (
              <div key={index} className="text-center p-4 bg-white/10 backdrop-blur-sm rounded-xl shadow-md border border-white/20 hover:bg-white/15 transition-all duration-300">
                <div className="flex justify-center mb-2">{stat.icon}</div>
                <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-white">{stat.number}</div>
                <div className="text-sm text-white/80">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Mission Section */}
      <section className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
                <Target className="w-4 h-4" />
                Our Mission
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-primary leading-tight">
                {getContent('about', 'company', 'missionTitle')}
              </h2>
              <div className="space-y-4 text-lg text-foreground leading-relaxed">
                <p className="drop-shadow-sm">
                  {getContent('about', 'company', 'missionText')}
                </p>
                <p className="drop-shadow-sm">
                  {getContent('about', 'company', 'missionText2')}
                </p>
              </div>
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button asChild size="lg" className="group">
                <Link to="/properties">
                  View Properties
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/contact">
                  Get in Touch
                </Link>
              </Button>
            </div>
          </div>
          <div className="relative group">
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-turquoise-dark/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <img  
              src="https://images.unsplash.com/photo-1518428988489-54770498c006" 
              alt="Scenic view of Roatan with team members" 
              className="relative rounded-2xl shadow-2xl w-full h-auto object-cover aspect-[4/3] group-hover:scale-[1.02] transition-transform duration-500"
              loading="lazy" />
          </div>
        </div>
      </section>

      {/* Enhanced Why Choose Us Section */}
      <section className="bg-gradient-to-br from-sandy-light via-turquoise-light/30 to-blue-50 py-16 md:py-20 rounded-2xl shadow-inner">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Star className="w-4 h-4" />
              Why Choose Us
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">{getContent('about', 'whyChooseUs', 'title')}</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover what makes Caribbean Lux Realty the premier choice for your real estate needs in Roatán.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {[
              { 
                icon: <Award className="w-12 h-12 text-turquoise-dark" />, 
                title: 'Local Expertise', 
                description: 'Unmatched knowledge of Roatán\'s neighborhoods, market trends, and legalities.',
                color: "from-yellow-400/20 to-orange-400/20"
              },
              { 
                icon: <ShieldCheck className="w-12 h-12 text-turquoise-dark" />, 
                title: 'Trusted & Transparent', 
                description: 'We operate with the highest ethical standards, ensuring clarity and honesty in all dealings.',
                color: "from-blue-400/20 to-indigo-400/20"
              },
              { 
                icon: <Handshake className="w-12 h-12 text-turquoise-dark" />, 
                title: 'Client-Centric Approach', 
                description: 'Your needs are our priority. We offer personalized service tailored to your unique goals.',
                color: "from-green-400/20 to-emerald-400/20"
              },
            ].map((item, index) => {
              // Get dynamic content for this feature
              const dynamicTitle = getContent('about', 'whyChooseUs', `feature${index + 1}Title`) || item.title;
              const dynamicDescription = getContent('about', 'whyChooseUs', `feature${index + 1}Desc`) || item.description;
              
              return (
              <div 
                key={item.title} 
                className={`p-8 bg-card rounded-2xl shadow-lg text-center hover:shadow-xl border border-border/50 transition-all duration-300 hover:-translate-y-1 group bg-gradient-to-br ${item.color}`}
              >
                <div className="flex justify-center mb-6">
                  <div className="p-4 bg-white/80 rounded-2xl shadow-md group-hover:scale-110 transition-transform duration-300">
                    {item.icon}
                  </div>
                </div>
                <h3 className="text-xl md:text-2xl font-bold mb-4 text-foreground">{dynamicTitle}</h3>
                <p className="text-muted-foreground leading-relaxed">{dynamicDescription}</p>
              </div>
            );
          })}
          </div>
        </div>
      </section>

      {/* Enhanced Team Section */}
      <section className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Users className="w-4 h-4" />
            Meet Our Team
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">{getContent('about', 'team', 'title')}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our experienced team is dedicated to providing exceptional service and making your real estate dreams a reality.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {teamMembers.map((member, index) => {
            // Get dynamic content for this team member
            const dynamicName = getContent('about', 'team', `member${index + 1}Name`) || member.name;
            const dynamicRole = getContent('about', 'team', `member${index + 1}Role`) || member.role;
            const dynamicBio = getContent('about', 'team', `member${index + 1}Bio`) || member.bio;
            
            return (
              <div 
                key={dynamicName} 
                className="bg-card rounded-2xl shadow-lg p-8 text-center hover:shadow-xl border border-border/50 transition-all duration-300 hover:-translate-y-2 group"
              >
                <div className="relative w-32 h-32 rounded-full mx-auto mb-6 overflow-hidden border-4 border-primary shadow-lg group-hover:scale-105 transition-transform duration-300">
                  <img  
                    src="https://images.unsplash.com/photo-1544212408-c711b7c19b92" 
                    alt={dynamicName} 
                    className="object-cover w-full h-full"
                    loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                
                <h3 className="text-xl md:text-2xl font-bold text-foreground mb-2">{dynamicName}</h3>
                <p className="text-primary font-semibold mb-4 text-lg">{dynamicRole}</p>
                <p className="text-muted-foreground leading-relaxed mb-6">{dynamicBio}</p>
              
              {/* Contact Options */}
              <div className="flex flex-col gap-3">
                <Button asChild variant="outline" size="sm" className="group">
                  <Link to="/contact">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Contact {member.name.split(' ')[0]}
                  </Link>
                </Button>
                <div className="flex justify-center gap-3 text-muted-foreground">
                  <button className="p-2 hover:text-primary transition-colors" title="Email">
                    <Mail className="w-4 h-4" />
                  </button>
                  <button className="p-2 hover:text-primary transition-colors" title="Phone">
                    <Phone className="w-4 h-4" />
                  </button>
                  <button className="p-2 hover:text-primary transition-colors" title="Location">
                    <MapPin className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="bg-gradient-to-r from-primary to-turquoise-dark rounded-2xl p-8 md:p-12 text-center text-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Start Your Journey?</h2>
          <p className="text-lg md:text-xl text-white/90 mb-8">
            Let us help you find your perfect property in paradise. Contact us today for a personalized consultation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary shadow-lg text-lg px-8 py-4 bg-white/20 backdrop-blur-sm font-semibold group">
              <Link to="/properties">
                Browse Properties
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary shadow-lg text-lg px-8 py-4 bg-white/20 backdrop-blur-sm font-semibold">
              <Link to="/contact">
                Schedule Consultation
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;