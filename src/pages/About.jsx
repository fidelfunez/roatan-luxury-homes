import React, { useState, useEffect } from 'react';
import { Users, Target, Award, ShieldCheck, HeartHandshake as Handshake } from 'lucide-react';
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

  const teamMembers = [
    { name: getContent('about', 'team', 'member1Name'), role: getContent('about', 'team', 'member1Role'), image: "team-member-1", bio: getContent('about', 'team', 'member1Bio') },
    { name: getContent('about', 'team', 'member2Name'), role: getContent('about', 'team', 'member2Role'), image: "team-member-2", bio: getContent('about', 'team', 'member2Bio') },
    { name: getContent('about', 'team', 'member3Name'), role: getContent('about', 'team', 'member3Role'), image: "team-member-3", bio: getContent('about', 'team', 'member3Bio') },
  ];

  return (
    <div className="space-y-16 md:space-y-24">
      <section className="text-center py-16 md:py-20 bg-gradient-to-b from-primary/10 via-transparent to-transparent rounded-xl">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-primary mb-4 drop-shadow-sm">{getContent('about', 'company', 'title')}</h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto drop-shadow-sm">
            {getContent('about', 'company', 'subtitle')}
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <img  
              src="https://images.unsplash.com/photo-1518428988489-54770498c006" 
              alt="Scenic view of Roatan with team members" 
              className="rounded-xl shadow-lg w-full h-auto object-cover aspect-[4/3]"
              loading="lazy" />
          </div>
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-primary flex items-center">
              <Target className="w-8 h-8 mr-3 text-turquoise-dark" /> {getContent('about', 'company', 'missionTitle')}
            </h2>
            <p className="text-lg text-foreground">
              {getContent('about', 'company', 'missionText')}
            </p>
            <p className="text-lg text-foreground">
              {getContent('about', 'company', 'missionText2')}
            </p>
          </div>
        </div>
      </section>

      <section className="bg-sandy-light py-16 md:py-20 rounded-xl shadow-inner">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-primary">{getContent('about', 'whyChooseUs', 'title')}</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <Award className="w-10 h-10 text-turquoise-dark" />, title: getContent('about', 'whyChooseUs', 'feature1Title'), description: getContent('about', 'whyChooseUs', 'feature1Desc') },
              { icon: <ShieldCheck className="w-10 h-10 text-turquoise-dark" />, title: getContent('about', 'whyChooseUs', 'feature2Title'), description: getContent('about', 'whyChooseUs', 'feature2Desc') },
              { icon: <Handshake className="w-10 h-10 text-turquoise-dark" />, title: getContent('about', 'whyChooseUs', 'feature3Title'), description: getContent('about', 'whyChooseUs', 'feature3Desc') },
            ].map((item, index) => (
              <div 
                key={item.title} 
                className="p-6 bg-card rounded-xl shadow-md text-center hover:shadow-lg border border-border/50"
              >
                <div className="flex justify-center mb-4">{item.icon}</div>
                <h3 className="text-xl font-semibold mb-2 text-foreground">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-primary flex items-center justify-center">
          <Users className="w-10 h-10 mr-3 text-turquoise-dark" /> {getContent('about', 'team', 'title')}
        </h2>
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {teamMembers.map((member, index) => (
            <div 
              key={member.name} 
              className="bg-card rounded-xl shadow-md p-6 text-center hover:shadow-lg border border-border/50"
            >
              <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-full mx-auto mb-4 overflow-hidden border-4 border-primary">
                <img  
                  src="https://images.unsplash.com/photo-1544212408-c711b7c19b92" 
                  alt={member.name} 
                  className="object-cover w-full h-full"
                  loading="lazy" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-1">{member.name}</h3>
              <p className="text-primary font-medium mb-3 text-sm sm:text-base">{member.role}</p>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">{member.bio}</p>
              <Button asChild variant="outline" size="sm">
                <Link to="/contact">
                  Contact {member.name}
                </Link>
              </Button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default About;