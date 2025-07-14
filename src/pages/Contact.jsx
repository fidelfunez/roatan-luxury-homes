import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Mail, Phone, MapPin, MessageSquare, Send, Clock, Star, CheckCircle, Users, Award, Shield, ArrowRight, MessageCircle } from 'lucide-react';
import NewsletterSignup from '@/components/NewsletterSignup';
import { getContentField, getWebsiteContent } from '@/lib/contentUtils';

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    console.log("Form data submitted:", formData);
    toast({
      title: "Message Sent!",
      description: "Thank you for contacting us. We'll get back to you shortly.",
      variant: "default",
    });
    setFormData({ name: '', email: '', subject: '', message: '' });
    setIsSubmitting(false);
  };
  
  const phoneNumber = "+50412345678"; // Replace with actual number
  const whatsappMessage = "Hello! I'm interested in properties in Roatán and would like to chat.";
  const whatsappUrl = `https://wa.me/${phoneNumber.replace(/\D/g, '')}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="space-y-16 md:space-y-24">
      {/* Enhanced Hero Section */}
      <section className="hero-full-bleed text-center py-12 md:py-16 lg:py-20 relative overflow-hidden rounded-xl bg-gradient-to-br from-teal-400 via-cyan-500 to-blue-600 min-h-[400px] md:min-h-[500px] lg:min-h-[600px] flex items-center" style={{ background: 'linear-gradient(to bottom right, #2dd4bf, #06b6d4, #2563eb)' }}>
        {/* Background Image with Color-Matched Placeholder */}
        <div className="absolute inset-0">
          <img 
            src="/Photos/reef-ocean-optimized.jpg" 
            alt="Reef in Caribbean ocean" 
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/65 to-black/55"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-white text-sm font-medium mb-4 drop-shadow-md">
              <MessageSquare className="w-4 h-4" />
              <span>We're Here to Help</span>
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white drop-shadow-lg mb-4">{getContent('contact', 'hero', 'title')}</h1>
          <p className="text-lg md:text-xl lg:text-2xl text-white/95 max-w-4xl mx-auto mb-8 drop-shadow-md">
            {getContent('contact', 'hero', 'subtitle')}
          </p>
          
          {/* Contact Stats - Desktop Enhanced */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              { number: '24/7', label: 'Support Available', icon: <Clock className="w-6 h-6 text-white" /> },
              { number: '< 2hrs', label: 'Response Time', icon: <MessageCircle className="w-6 h-6 text-white" /> },
              { number: '500+', label: 'Happy Clients', icon: <Users className="w-6 h-6 text-white" /> },
              { number: '15+', label: 'Years Experience', icon: <Award className="w-6 h-6 text-white" /> }
            ].map((stat, index) => {
              // Get dynamic content for this stat
              const dynamicNumber = getContent('contact', 'hero', `stat${index + 1}Number`) || stat.number;
              const dynamicLabel = getContent('contact', 'hero', `stat${index + 1}Label`) || stat.label;
              
              return (
                              <div key={index} className="text-center p-4 bg-white/10 backdrop-blur-sm rounded-xl shadow-md border border-white/20">
                  <div className="flex justify-center mb-2">{stat.icon}</div>
                  <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-white">{dynamicNumber}</div>
                  <div className="text-sm text-white/80">{dynamicLabel}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Contact Section - Redesigned Layout */}
      <section className="container mx-auto px-4">
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Desktop: Contact Info - 1/3 Width (LEFT) */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-sandy-light to-turquoise-light p-6 lg:p-8 rounded-xl shadow-2xl border border-border/50 h-full">
              <h3 className="text-2xl font-bold text-primary mb-6">Contact Information</h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-white/50 rounded-lg">
                  <div className="p-2 bg-primary/20 rounded-lg">
                    <Phone className="w-5 h-5 text-primary" />
              </div>
              <div>
                    <h4 className="font-semibold text-foreground mb-1">Phone</h4>
                    <p className="text-muted-foreground">{getContent('contact', 'contactInfo', 'phone')}</p>
                    <p className="text-xs text-muted-foreground mt-1">Call us anytime</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-white/50 rounded-lg">
                  <div className="p-2 bg-primary/20 rounded-lg">
                    <Mail className="w-5 h-5 text-primary" />
              </div>
              <div>
                    <h4 className="font-semibold text-foreground mb-1">Email</h4>
                    <p className="text-muted-foreground">{getContent('contact', 'contactInfo', 'email')}</p>
                    <p className="text-xs text-muted-foreground mt-1">We respond within 24 hours</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-white/50 rounded-lg">
                  <div className="p-2 bg-primary/20 rounded-lg">
                    <MapPin className="w-5 h-5 text-primary" />
              </div>
              <div>
                    <h4 className="font-semibold text-foreground mb-1">Office</h4>
                    <p className="text-muted-foreground">{getContent('contact', 'contactInfo', 'address')}</p>
                    <p className="text-xs text-muted-foreground mt-1">Visit us by appointment</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-white/50 rounded-lg">
                  <div className="p-2 bg-primary/20 rounded-lg">
                    <Clock className="w-5 h-5 text-primary" />
              </div>
              <div>
                    <h4 className="font-semibold text-foreground mb-1">Office Hours</h4>
                    <p className="text-muted-foreground text-sm">{getContent('contact', 'contactInfo', 'officeHours')}</p>
                    <p className="text-xs text-muted-foreground mt-1">{getContent('contact', 'contactInfo', 'emergencyContact')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop: Contact Form - 2/3 Width (RIGHT) */}
          <div className="lg:col-span-2">
            <div className="bg-card p-8 lg:p-12 rounded-xl shadow-2xl border border-border/50 h-full">
              <div className="mb-8">
                <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-3">Send Us a Message</h2>
                <p className="text-lg text-muted-foreground">Fill out the form below and we'll get back to you within 24 hours.</p>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name" className="text-foreground text-sm font-medium">Full Name</Label>
                    <Input 
                      type="text" 
                      id="name" 
                      name="name" 
                      value={formData.name} 
                      onChange={handleChange} 
                      placeholder="John Doe" 
                      required 
                      className="mt-2 bg-background/70 focus:bg-background text-base" 
                    />
                </div>
                <div>
                    <Label htmlFor="email" className="text-foreground text-sm font-medium">Email Address</Label>
                    <Input 
                      type="email" 
                      id="email" 
                      name="email" 
                      value={formData.email} 
                      onChange={handleChange} 
                      placeholder="you@example.com" 
                      required 
                      className="mt-2 bg-background/70 focus:bg-background text-base" 
                    />
                </div>
              </div>

                <div>
                  <Label htmlFor="subject" className="text-foreground text-sm font-medium">Subject</Label>
                  <Input 
                    type="text" 
                    id="subject" 
                    name="subject" 
                    value={formData.subject} 
                    onChange={handleChange} 
                    placeholder="Inquiry about beachfront properties" 
                    required 
                    className="mt-2 bg-background/70 focus:bg-background text-base" 
                  />
              </div>

                <div>
                  <Label htmlFor="message" className="text-foreground text-sm font-medium">Message</Label>
                  <Textarea 
                    id="message" 
                    name="message" 
                    value={formData.message} 
                    onChange={handleChange} 
                    placeholder="Tell us more about your needs..." 
                    rows={6} 
                    required 
                    className="mt-2 bg-background/70 focus:bg-background text-base" 
                  />
              </div>

                <div className="pt-4">
                  <Button 
                    type="submit" 
                    size="lg" 
                    variant="outline"
                    className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground text-lg py-4 flex items-center bg-white/80 backdrop-blur-sm font-semibold shadow-lg" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <div className="w-6 h-6 border-2 border-transparent border-t-white rounded-full mr-3 animate-spin" />
                    ) : (
                      <Send className="w-6 h-6 mr-3" />
                    )}
                    {isSubmitting ? 'Sending Message...' : 'Send Message'}
                  </Button>
                </div>
              </form>
                </div>
              </div>
            </div>

        {/* WhatsApp Section - Moved Below */}
        <div className="mt-8 lg:mt-12">
          <div className="bg-gradient-to-r from-green-500 to-teal-500 p-6 lg:p-8 rounded-xl text-white relative overflow-hidden shadow-lg max-w-2xl mx-auto">
              <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10 text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                  <MessageSquare className="w-8 h-8" />
                <h3 className="text-xl lg:text-2xl font-semibold">WhatsApp Chat</h3>
                </div>
              <p className="mb-6 opacity-90 text-base">Get instant responses to your questions via WhatsApp.</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 text-sm opacity-75">
                <div className="flex items-center justify-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>Instant responses</span>
                  </div>
                <div className="flex items-center justify-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>Photo sharing</span>
                  </div>
                <div className="flex items-center justify-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>Voice messages</span>
                  </div>
                </div>
              <Button asChild variant="outline" className="border-white text-white hover:bg-white hover:text-green-600 shadow-md text-base py-3 px-8 bg-white/20 backdrop-blur-sm font-semibold">
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                  <MessageSquare className="w-5 h-5 mr-2" />
                    Chat on WhatsApp
                  </a>
                </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section - Enhanced */}
      <section className="relative w-full">
        <img src="/Photos/boat-ocean-optimized.jpg" alt="Boat on Caribbean ocean" className="absolute inset-0 w-full h-full object-cover rounded-2xl" loading="lazy" />
        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-primary/60 via-turquoise-dark/60 to-primary/40 rounded-2xl" />
        <div className="relative container mx-auto px-4 z-10 p-8 md:p-12 lg:p-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 drop-shadow-lg">{getContent('contact', 'whyChooseUs', 'title')}</h2>
            <p className="text-lg lg:text-xl text-white/95 max-w-4xl mx-auto drop-shadow-md">
              {getContent('contact', 'whyChooseUs', 'subtitle')}
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Shield className="w-8 h-8 text-white" />,
                title: getContent('contact', 'whyChooseUs', 'feature1Title'),
                description: getContent('contact', 'whyChooseUs', 'feature1Desc')
              },
              {
                icon: <Users className="w-8 h-8 text-white" />,
                title: getContent('contact', 'whyChooseUs', 'feature2Title'),
                description: getContent('contact', 'whyChooseUs', 'feature2Desc')
              },
              {
                icon: <Award className="w-8 h-8 text-white" />,
                title: getContent('contact', 'whyChooseUs', 'feature3Title'),
                description: getContent('contact', 'whyChooseUs', 'feature3Desc')
              },
              {
                icon: <Star className="w-8 h-8 text-white" />,
                title: getContent('contact', 'whyChooseUs', 'feature4Title'),
                description: getContent('contact', 'whyChooseUs', 'feature4Desc')
              }
            ].map((item, index) => (
              <div 
                key={index}
                className="text-center p-6 bg-white/20 backdrop-blur-sm rounded-xl shadow-md border border-white/30"
              >
                <div className="mb-4 flex justify-center">{item.icon}</div>
                <h3 className="text-lg lg:text-xl font-semibold text-white mb-3 drop-shadow-md">{item.title}</h3>
                <p className="text-white/90 text-sm lg:text-base drop-shadow-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="container mx-auto px-4">
        <NewsletterSignup />
      </section>
    </div>
  );
};

export default Contact;