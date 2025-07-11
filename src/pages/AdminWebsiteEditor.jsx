import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { 
  Edit, 
  Save, 
  Eye, 
  EyeOff, 
  RotateCcw, 
  CheckCircle, 
  AlertCircle,
  FileText,
  Home,
  Users,
  Briefcase,
  MessageSquare,
  Settings,
  Globe,
  Image,
  Type,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Star,
  Award,
  Shield,
  TrendingUp,
  RefreshCw,
  Download,
  Upload,
  Trash2
} from 'lucide-react';
import { getWebsiteContent, saveWebsiteContent, resetToDefaults, getDefaultContent } from '@/lib/contentUtils';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const AdminWebsiteEditor = () => {
  const { toast } = useToast();
  const [currentPage, setCurrentPage] = useState('home');
  const [editingSection, setEditingSection] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [content, setContent] = useState({});
  const [originalContent, setOriginalContent] = useState({});
  const [hasChanges, setHasChanges] = useState(false);

  // Load content from localStorage on component mount
  useEffect(() => {
    loadContent();
  }, []);



  const loadContent = () => {
    const stored = getWebsiteContent();
    setContent(stored);
    setOriginalContent(stored);
    setHasChanges(false);
  };

  const saveContent = () => {
    try {
      if (saveWebsiteContent(content)) {
        setOriginalContent(content);
        setHasChanges(false);
        
        toast({
          title: "Content Saved! ✅",
          description: "Your website content has been updated successfully.",
          variant: "default",
        });
      } else {
        throw new Error('Save failed');
      }
    } catch (error) {
      console.error('AdminWebsiteEditor: Save error:', error);
      toast({
        title: "Save Failed ❌",
        description: "There was an error saving your content. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleContentChange = (page, section, field, value) => {
    setContent(prev => {
      // Handle individual service pages that don't have sections
      if (section === '') {
        return {
          ...prev,
          [page]: {
            ...prev[page],
            [field]: value
          }
        };
      }
      
      // Handle regular pages with sections
      return {
        ...prev,
        [page]: {
          ...prev[page],
          [section]: {
            ...prev[page]?.[section],
            [field]: value
          }
        }
      };
    });
    setHasChanges(true);
  };

  const resetToOriginal = () => {
    if (resetToDefaults()) {
      loadContent();
      toast({
        title: "Content Reset",
        description: "Content has been reset to default values.",
        variant: "default",
      });
    } else {
      toast({
        title: "Reset Failed ❌",
        description: "There was an error resetting the content. Please try again.",
        variant: "destructive",
      });
    }
  };

  const exportContent = () => {
    const dataStr = JSON.stringify(content, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'website-content-backup.json';
    link.click();
    URL.revokeObjectURL(url);
    toast({
      title: "Content Exported! 📁",
      description: "Your website content has been downloaded as a backup file.",
      variant: "default",
    });
  };

  const importContent = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const imported = JSON.parse(e.target.result);
          setContent(imported);
          setHasChanges(true);
          toast({
            title: "Content Imported! 📥",
            description: "Your website content has been imported successfully.",
            variant: "default",
          });
        } catch (error) {
          toast({
            title: "Import Failed ❌",
            description: "The file format is invalid. Please try again.",
            variant: "destructive",
          });
        }
      };
      reader.readAsText(file);
    }
  };

  const pages = [
    {
      id: 'home',
      title: 'Home Page',
      icon: <Home className="w-5 h-5" />,
      description: 'Edit hero section, welcome text, and featured content',
      sections: [
        {
          id: 'hero',
          title: 'Hero Section',
          icon: <Star className="w-4 h-4" />,
          fields: [
            { key: 'title', label: 'Main Title', type: 'text', placeholder: 'Discover Your Dream Property in the Caribbean' },
            { key: 'subtitle', label: 'Subtitle', type: 'textarea', placeholder: 'Explore exclusive listings for luxury homes...' },
            { key: 'trustIndicator1', label: 'Trust Indicator 1', type: 'text', placeholder: '15+ Years Experience' },
            { key: 'trustIndicator2', label: 'Trust Indicator 2', type: 'text', placeholder: '500+ Properties Sold' },
            { key: 'trustIndicator3', label: 'Trust Indicator 3', type: 'text', placeholder: '24/7 Support' }
          ]
        },
        {
          id: 'welcome',
          title: 'Welcome Section',
          icon: <Globe className="w-4 h-4" />,
          fields: [
            { key: 'title', label: 'Section Title', type: 'text', placeholder: 'Welcome to Paradise' },
            { key: 'description', label: 'Description', type: 'textarea', placeholder: 'The Caribbean, a collection of jewels...' },
            { key: 'feature1Title', label: 'Feature 1 Title', type: 'text', placeholder: 'Expert Guidance' },
            { key: 'feature1Desc', label: 'Feature 1 Description', type: 'textarea', placeholder: 'Navigating the Caribbean market...' },
            { key: 'feature2Title', label: 'Feature 2 Title', type: 'text', placeholder: 'Client Focused' },
            { key: 'feature2Desc', label: 'Feature 2 Description', type: 'textarea', placeholder: 'Your dreams are our priority...' },
            { key: 'feature3Title', label: 'Feature 3 Title', type: 'text', placeholder: 'Prime Locations' },
            { key: 'feature3Desc', label: 'Feature 3 Description', type: 'textarea', placeholder: 'Access to exclusive listings...' }
          ]
        },
        {
          id: 'featuredLocation',
          title: 'Featured Location',
          icon: <MapPin className="w-4 h-4" />,
          fields: [
            { key: 'title', label: 'Location Title', type: 'text', placeholder: 'Featured Location: Roatán' },
            { key: 'description', label: 'Location Description', type: 'textarea', placeholder: 'Discover the pristine beauty of Roatán...' },
            { key: 'feature1', label: 'Feature 1', type: 'text', placeholder: 'World-class diving and snorkeling' },
            { key: 'feature2', label: 'Feature 2', type: 'text', placeholder: 'Pristine beaches and coral reefs' },
            { key: 'feature3', label: 'Feature 3', type: 'text', placeholder: 'Luxury amenities and modern conveniences' },
            { key: 'startingPrice', label: 'Starting Price', type: 'text', placeholder: 'Starting from $450,000' }
          ]
        },
        {
          id: 'testimonials',
          title: 'Testimonials',
          icon: <Star className="w-4 h-4" />,
          fields: [
            { key: 'title', label: 'Section Title', type: 'text', placeholder: 'What Our Clients Say' },
            { key: 'subtitle', label: 'Subtitle', type: 'textarea', placeholder: 'Don\'t just take our word for it...' },
            { key: 'testimonial1Name', label: 'Testimonial 1 Name', type: 'text', placeholder: 'Sarah & Mike' },
            { key: 'testimonial1Location', label: 'Testimonial 1 Location', type: 'text', placeholder: 'Roatán Beach Villa' },
            { key: 'testimonial1Text', label: 'Testimonial 1 Text', type: 'textarea', placeholder: 'Caribbean Lux made our dream...' },
            { key: 'testimonial2Name', label: 'Testimonial 2 Name', type: 'text', placeholder: 'David Rodriguez' },
            { key: 'testimonial2Location', label: 'Testimonial 2 Location', type: 'text', placeholder: 'West Bay Condo' },
            { key: 'testimonial2Text', label: 'Testimonial 2 Text', type: 'textarea', placeholder: 'Professional, responsive...' },
            { key: 'testimonial3Name', label: 'Testimonial 3 Name', type: 'text', placeholder: 'Emma Thompson' },
            { key: 'testimonial3Location', label: 'Testimonial 3 Location', type: 'text', placeholder: 'Sandy Bay Home' },
            { key: 'testimonial3Text', label: 'Testimonial 3 Text', type: 'textarea', placeholder: 'From the first consultation...' }
          ]
        },
        {
          id: 'cta',
          title: 'Call to Action',
          icon: <MessageSquare className="w-4 h-4" />,
          fields: [
            { key: 'title', label: 'Section Title', type: 'text', placeholder: 'Ready to Find Your Paradise?' },
            { key: 'subtitle', label: 'Subtitle', type: 'textarea', placeholder: 'Let\'s start your journey...' }
          ]
        }
      ]
    },
    {
      id: 'about',
      title: 'About Page',
      icon: <Users className="w-5 h-5" />,
      description: 'Edit company information, mission, and team details',
      sections: [
        {
          id: 'company',
          title: 'Company Information',
          icon: <Award className="w-4 h-4" />,
          fields: [
            { key: 'title', label: 'Page Title', type: 'text', placeholder: 'About Roatán Realty' },
            { key: 'subtitle', label: 'Subtitle', type: 'textarea', placeholder: 'Your trusted partners in navigating...' },
            { key: 'missionTitle', label: 'Mission Title', type: 'text', placeholder: 'Our Mission' },
            { key: 'missionText', label: 'Mission Text', type: 'textarea', placeholder: 'At Roatán Realty, our mission is...' },
            { key: 'missionText2', label: 'Mission Text (continued)', type: 'textarea', placeholder: 'We believe in building lasting relationships...' }
          ]
        },
        {
          id: 'whyChooseUs',
          title: 'Why Choose Us',
          icon: <Shield className="w-4 h-4" />,
          fields: [
            { key: 'title', label: 'Section Title', type: 'text', placeholder: 'Why Choose Us?' },
            { key: 'feature1Title', label: 'Feature 1 Title', type: 'text', placeholder: 'Local Expertise' },
            { key: 'feature1Desc', label: 'Feature 1 Description', type: 'textarea', placeholder: 'Unmatched knowledge of Roatán\'s neighborhoods...' },
            { key: 'feature2Title', label: 'Feature 2 Title', type: 'text', placeholder: 'Trusted & Transparent' },
            { key: 'feature2Desc', label: 'Feature 2 Description', type: 'textarea', placeholder: 'We operate with the highest ethical standards...' },
            { key: 'feature3Title', label: 'Feature 3 Title', type: 'text', placeholder: 'Client-Centric Approach' },
            { key: 'feature3Desc', label: 'Feature 3 Description', type: 'textarea', placeholder: 'Your needs are our priority...' }
          ]
        },
        {
          id: 'team',
          title: 'Team Members',
          icon: <Users className="w-4 h-4" />,
          fields: [
            { key: 'title', label: 'Section Title', type: 'text', placeholder: 'Meet Our Team' },
            { key: 'member1Name', label: 'Member 1 Name', type: 'text', placeholder: 'Alice Johnson' },
            { key: 'member1Role', label: 'Member 1 Role', type: 'text', placeholder: 'Lead Agent & Founder' },
            { key: 'member1Bio', label: 'Member 1 Bio', type: 'textarea', placeholder: 'With over 15 years of experience...' },
            { key: 'member2Name', label: 'Member 2 Name', type: 'text', placeholder: 'Bob Williams' },
            { key: 'member2Role', label: 'Member 2 Role', type: 'text', placeholder: 'Sales Specialist' },
            { key: 'member2Bio', label: 'Member 2 Bio', type: 'textarea', placeholder: 'Bob\'s deep knowledge of the local market...' },
            { key: 'member3Name', label: 'Member 3 Name', type: 'text', placeholder: 'Carol Davis' },
            { key: 'member3Role', label: 'Member 3 Role', type: 'text', placeholder: 'Client Relations Manager' },
            { key: 'member3Bio', label: 'Member 3 Bio', type: 'textarea', placeholder: 'Carol ensures every client receives...' }
          ]
        }
      ]
    },
    {
      id: 'services',
      title: 'Services Page',
      icon: <Briefcase className="w-5 h-5" />,
      description: 'Edit service descriptions and features',
      sections: [
        {
          id: 'hero',
          title: 'Hero Section',
          icon: <Star className="w-4 h-4" />,
          fields: [
            { key: 'title', label: 'Page Title', type: 'text', placeholder: 'Our Services' },
            { key: 'subtitle', label: 'Subtitle', type: 'textarea', placeholder: 'Comprehensive real estate solutions...' },
            { key: 'stat1Number', label: 'Stat 1 Number', type: 'text', placeholder: '500+' },
            { key: 'stat1Label', label: 'Stat 1 Label', type: 'text', placeholder: 'Properties Sold' },
            { key: 'stat2Number', label: 'Stat 2 Number', type: 'text', placeholder: '15+' },
            { key: 'stat2Label', label: 'Stat 2 Label', type: 'text', placeholder: 'Years Experience' },
            { key: 'stat3Number', label: 'Stat 3 Number', type: 'text', placeholder: '100%' },
            { key: 'stat3Label', label: 'Stat 3 Label', type: 'text', placeholder: 'Client Satisfaction' },
            { key: 'stat4Number', label: 'Stat 4 Number', type: 'text', placeholder: '24/7' },
            { key: 'stat4Label', label: 'Stat 4 Label', type: 'text', placeholder: 'Support Available' }
          ]
        },
        {
          id: 'whyChooseUs',
          title: 'Why Choose Us',
          icon: <Shield className="w-4 h-4" />,
          fields: [
            { key: 'title', label: 'Section Title', type: 'text', placeholder: 'Why Choose Caribbean Lux Realty?' },
            { key: 'subtitle', label: 'Subtitle', type: 'textarea', placeholder: 'We combine local expertise with international standards...' },
            { key: 'feature1Title', label: 'Feature 1 Title', type: 'text', placeholder: 'Trusted Expertise' },
            { key: 'feature1Desc', label: 'Feature 1 Description', type: 'textarea', placeholder: '15+ years of experience in Caribbean real estate...' },
            { key: 'feature2Title', label: 'Feature 2 Title', type: 'text', placeholder: 'Personalized Service' },
            { key: 'feature2Desc', label: 'Feature 2 Description', type: 'textarea', placeholder: 'Dedicated support throughout your entire real estate journey...' },
            { key: 'feature3Title', label: 'Feature 3 Title', type: 'text', placeholder: 'Quality Assurance' },
            { key: 'feature3Desc', label: 'Feature 3 Description', type: 'textarea', placeholder: 'Rigorous due diligence and quality standards...' },
            { key: 'feature4Title', label: 'Feature 4 Title', type: 'text', placeholder: '24/7 Support' },
            { key: 'feature4Desc', label: 'Feature 4 Description', type: 'textarea', placeholder: 'Round-the-clock assistance for all your real estate needs...' }
          ]
        },
        {
          id: 'cta',
          title: 'Call to Action',
          icon: <MessageSquare className="w-4 h-4" />,
          fields: [
            { key: 'title', label: 'Section Title', type: 'text', placeholder: 'Ready to Get Started?' },
            { key: 'subtitle', label: 'Subtitle', type: 'textarea', placeholder: 'Contact us today to discuss your real estate needs...' }
          ]
        }
      ]
    },
    {
      id: 'properties',
      title: 'Properties Page',
      icon: <Home className="w-5 h-5" />,
      description: 'Edit properties page hero section',
      sections: [
        {
          id: 'hero',
          title: 'Hero Section',
          icon: <Star className="w-4 h-4" />,
          fields: [
            { key: 'title', label: 'Page Title', type: 'text', placeholder: 'Explore Our Properties' },
            { key: 'subtitle', label: 'Subtitle', type: 'textarea', placeholder: 'Find your perfect piece of the Caribbean...' },
            { key: 'badge', label: 'Badge Text', type: 'text', placeholder: 'Premium Caribbean Properties' }
          ]
        }
      ]
    },
    {
      id: 'property-sales-acquisition',
      title: 'Property Sales & Acquisition',
      icon: <Home className="w-5 h-5" />,
      description: 'Edit property sales service details',
      sections: [
        {
          id: '',
          title: 'Service Details',
          icon: <FileText className="w-4 h-4" />,
          fields: [
            { key: 'title', label: 'Service Title', type: 'text', placeholder: 'Property Sales & Acquisition' },
            { key: 'description', label: 'Service Description', type: 'textarea', placeholder: 'Our expert team provides comprehensive support...' },
            { key: 'ctaText', label: 'Call to Action Text', type: 'textarea', placeholder: 'Let\'s discuss how we can assist you...' }
          ]
        }
      ]
    },
    {
      id: 'legal-guidance-due-diligence',
              title: 'Legal Guidance & Assistance',
      icon: <Shield className="w-5 h-5" />,
      description: 'Edit legal guidance service details',
      sections: [
        {
          id: '',
          title: 'Service Details',
          icon: <FileText className="w-4 h-4" />,
          fields: [
            { key: 'title', label: 'Service Title', type: 'text', placeholder: 'Legal Guidance & Assistance' },
            { key: 'description', label: 'Service Description', type: 'textarea', placeholder: 'Navigating the legal landscape of Honduran real estate...' },
            { key: 'ctaText', label: 'Call to Action Text', type: 'textarea', placeholder: 'Let\'s discuss how we can assist you...' }
          ]
        }
      ]
    },
    {
      id: 'relocation-assistance',
      title: 'Relocation Assistance',
      icon: <Users className="w-5 h-5" />,
      description: 'Edit relocation assistance service details',
      sections: [
        {
          id: '',
          title: 'Service Details',
          icon: <FileText className="w-4 h-4" />,
          fields: [
            { key: 'title', label: 'Service Title', type: 'text', placeholder: 'Relocation Assistance' },
            { key: 'description', label: 'Service Description', type: 'textarea', placeholder: 'Making the move to Roatán is an exciting adventure...' },
            { key: 'ctaText', label: 'Call to Action Text', type: 'textarea', placeholder: 'Let\'s discuss how we can assist you...' }
          ]
        }
      ]
    },
    {
      id: 'land-development-investment',
      title: 'Land Development & Investment',
      icon: <TrendingUp className="w-5 h-5" />,
      description: 'Edit land development service details',
      sections: [
        {
          id: '',
          title: 'Service Details',
          icon: <FileText className="w-4 h-4" />,
          fields: [
            { key: 'title', label: 'Service Title', type: 'text', placeholder: 'Land Development & Investment' },
            { key: 'description', label: 'Service Description', type: 'textarea', placeholder: 'Roatán offers significant opportunities for land development...' },
            { key: 'ctaText', label: 'Call to Action Text', type: 'textarea', placeholder: 'Let\'s discuss how we can assist you...' }
          ]
        }
      ]
    },
    {
      id: 'vacation-rental-management',
      title: 'Vacation Rental Management',
      icon: <Home className="w-5 h-5" />,
      description: 'Edit vacation rental management service details',
      sections: [
        {
          id: '',
          title: 'Service Details',
          icon: <FileText className="w-4 h-4" />,
          fields: [
            { key: 'title', label: 'Service Title', type: 'text', placeholder: 'Vacation Rental Management' },
            { key: 'description', label: 'Service Description', type: 'textarea', placeholder: 'Turn your Roatán property into a lucrative income source...' },
            { key: 'ctaText', label: 'Call to Action Text', type: 'textarea', placeholder: 'Let\'s discuss how we can assist you...' }
          ]
        }
      ]
    },
    {
      id: 'commercial-real-estate',
      title: 'Commercial Real Estate',
      icon: <Briefcase className="w-5 h-5" />,
      description: 'Edit commercial real estate service details',
      sections: [
        {
          id: '',
          title: 'Service Details',
          icon: <FileText className="w-4 h-4" />,
          fields: [
            { key: 'title', label: 'Service Title', type: 'text', placeholder: 'Commercial Real Estate' },
            { key: 'description', label: 'Service Description', type: 'textarea', placeholder: 'For businesses looking to establish or expand...' },
            { key: 'ctaText', label: 'Call to Action Text', type: 'textarea', placeholder: 'Let\'s discuss how we can assist you...' }
          ]
        }
      ]
    },
    {
      id: 'contact',
      title: 'Contact Page',
      icon: <MessageSquare className="w-5 h-5" />,
      description: 'Edit contact information and office details',
      sections: [
        {
          id: 'hero',
          title: 'Hero Section',
          icon: <Star className="w-4 h-4" />,
          fields: [
            { key: 'title', label: 'Page Title', type: 'text', placeholder: 'Get in Touch' },
            { key: 'subtitle', label: 'Subtitle', type: 'textarea', placeholder: 'We\'re here to help you with all your Roatán real estate needs...' },
            { key: 'stat1Number', label: 'Stat 1 Number', type: 'text', placeholder: '24/7' },
            { key: 'stat1Label', label: 'Stat 1 Label', type: 'text', placeholder: 'Support Available' },
            { key: 'stat2Number', label: 'Stat 2 Number', type: 'text', placeholder: '< 2hrs' },
            { key: 'stat2Label', label: 'Stat 2 Label', type: 'text', placeholder: 'Response Time' },
            { key: 'stat3Number', label: 'Stat 3 Number', type: 'text', placeholder: '500+' },
            { key: 'stat3Label', label: 'Stat 3 Label', type: 'text', placeholder: 'Happy Clients' },
            { key: 'stat4Number', label: 'Stat 4 Number', type: 'text', placeholder: '15+' },
            { key: 'stat4Label', label: 'Stat 4 Label', type: 'text', placeholder: 'Years Experience' }
          ]
        },
        {
          id: 'contactInfo',
          title: 'Contact Information',
          icon: <Phone className="w-4 h-4" />,
          fields: [
            { key: 'phone', label: 'Phone Number', type: 'text', placeholder: '+50412345678' },
            { key: 'email', label: 'Email Address', type: 'text', placeholder: 'info@caribbeanluxrealty.com' },
            { key: 'address', label: 'Office Address', type: 'textarea', placeholder: 'Main Street, Luxury Cay, Caribbean' },
            { key: 'officeHours', label: 'Office Hours', type: 'text', placeholder: 'Monday - Friday: 9:00 AM - 6:00 PM' },
            { key: 'emergencyContact', label: 'Emergency Contact', type: 'text', placeholder: 'Available 24/7 for urgent inquiries' }
          ]
        },
        {
          id: 'whyChooseUs',
          title: 'Why Choose Us',
          icon: <Shield className="w-4 h-4" />,
          fields: [
            { key: 'title', label: 'Section Title', type: 'text', placeholder: 'Why Choose Caribbean Lux Realty?' },
            { key: 'subtitle', label: 'Subtitle', type: 'textarea', placeholder: 'We combine local expertise with international standards...' },
            { key: 'feature1Title', label: 'Feature 1 Title', type: 'text', placeholder: 'Trusted Expertise' },
            { key: 'feature1Desc', label: 'Feature 1 Description', type: 'textarea', placeholder: '15+ years of experience in Caribbean real estate...' },
            { key: 'feature2Title', label: 'Feature 2 Title', type: 'text', placeholder: 'Personalized Service' },
            { key: 'feature2Desc', label: 'Feature 2 Description', type: 'textarea', placeholder: 'Dedicated support throughout your entire real estate journey...' },
            { key: 'feature3Title', label: 'Feature 3 Title', type: 'text', placeholder: 'Quality Assurance' },
            { key: 'feature3Desc', label: 'Feature 3 Description', type: 'textarea', placeholder: 'Rigorous due diligence and quality standards...' },
            { key: 'feature4Title', label: 'Feature 4 Title', type: 'text', placeholder: 'Client Satisfaction' },
            { key: 'feature4Desc', label: 'Feature 4 Description', type: 'textarea', placeholder: '500+ satisfied clients with 100% satisfaction rate...' }
          ]
        }
      ]
    },
    {
      id: 'footer',
      title: 'Footer',
      icon: <Settings className="w-5 h-5" />,
      description: 'Edit footer content and contact information',
      sections: [
        {
          id: 'companyInfo',
          title: 'Company Information',
          icon: <Globe className="w-4 h-4" />,
          fields: [
            { key: 'description', label: 'Company Description', type: 'textarea', placeholder: 'Your trusted partner for finding exceptional properties in the Caribbean.' },
            { key: 'address', label: 'Address', type: 'text', placeholder: 'Main Street, Luxury Cay, Caribbean' },
            { key: 'phone', label: 'Phone Number', type: 'text', placeholder: '+1 (555) LUX-REALTY' },
            { key: 'email', label: 'Email Address', type: 'text', placeholder: 'info@caribbeanluxrealty.com' }
          ]
        },
        {
          id: 'newsletter',
          title: 'Newsletter Section',
          icon: <Mail className="w-4 h-4" />,
          fields: [
            { key: 'title', label: 'Section Title', type: 'text', placeholder: 'Stay Updated' },
            { key: 'description', label: 'Description', type: 'textarea', placeholder: 'Subscribe to our newsletter for the latest luxury properties and news.' },
            { key: 'placeholder', label: 'Email Placeholder', type: 'text', placeholder: 'Enter your email' },
            { key: 'buttonText', label: 'Button Text', type: 'text', placeholder: 'Subscribe' }
          ]
        }
      ]
    }
  ];

  const currentPageData = pages.find(page => page.id === currentPage);

  const renderField = (field, value, onChange) => {
    const commonProps = {
      value: value || '',
      onChange: (e) => onChange(e.target.value),
      placeholder: field.placeholder,
      className: "w-full"
    };

    const getDefaultValue = () => {
      const defaultContent = getDefaultContent();
      // Handle individual service pages that don't have sections
      if (editingSection === '') {
        return defaultContent[currentPage]?.[field.key] || field.placeholder;
      }
      return defaultContent[currentPage]?.[editingSection]?.[field.key] || field.placeholder;
    };

    if (field.type === 'textarea') {
      return (
        <div className="space-y-2">
          <Textarea
            {...commonProps}
            rows={4}
            className="w-full resize-none"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => onChange(getDefaultValue())}
            className="text-xs"
          >
            <RotateCcw className="w-3 h-3 mr-1" />
            Restore Default
          </Button>
        </div>
      );
    }

    return (
      <div className="space-y-2">
        <Input {...commonProps} />
        <Button
          variant="outline"
          size="sm"
          onClick={() => onChange(getDefaultValue())}
          className="text-xs"
        >
          <RotateCcw className="w-3 h-3 mr-1" />
          Restore Default
        </Button>
      </div>
    );
  };

  return (
    <motion.div 
      className="container mx-auto px-4 py-8"
      initial="hidden"
      animate="visible"
      variants={fadeIn}
    >
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-primary mb-2">Website Content Editor</h1>
            <p className="text-muted-foreground">Edit your website content easily - no technical knowledge required.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={loadContent}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" onClick={exportContent}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <input
              type="file"
              accept=".json"
              onChange={importContent}
              className="hidden"
              id="import-content"
            />
            <Button variant="outline" asChild>
              <label htmlFor="import-content">
                <Upload className="w-4 h-4 mr-2" />
                Import
              </label>
            </Button>
            {hasChanges && (
              <Button variant="outline" onClick={resetToOriginal}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
            )}
            <Button variant="outline" onClick={() => {
              localStorage.removeItem('caribbeanLuxRealty_websiteContent');
              loadContent();
              toast({
                title: "Content Cleared! 🗑️",
                description: "All custom content has been cleared. Default content is now active.",
                variant: "default",
              });
            }}>
              <Trash2 className="w-4 h-4 mr-2" />
              Clear All
            </Button>
            <Button onClick={saveContent} disabled={!hasChanges}>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>
      </div>

      {/* Page Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {pages.map((page) => (
          <Card 
            key={page.id}
            className={`cursor-pointer transition-all hover:shadow-lg ${
              currentPage === page.id ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => {
              setCurrentPage(page.id);
              // Auto-select the first section for individual service pages
              const selectedPage = pages.find(p => p.id === page.id);
              if (selectedPage && selectedPage.sections.length === 1 && selectedPage.sections[0].id === '') {
                setEditingSection('');
              } else {
                setEditingSection(null);
              }
            }}
          >
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                {page.icon}
                <h3 className="font-semibold text-primary">{page.title}</h3>
              </div>
              <p className="text-sm text-muted-foreground">{page.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Content Editor */}
      {currentPageData && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sections List */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {currentPageData.icon}
                  {currentPageData.title} Sections
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {currentPageData.sections.map((section) => (
                    <Button
                      key={section.id}
                      variant={editingSection === section.id ? "default" : "outline"}
                      className="w-full justify-start"
                      onClick={() => setEditingSection(section.id)}
                    >
                      {section.icon}
                      <span className="ml-2">{section.title}</span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Editor */}
          <div className="lg:col-span-2">
            {editingSection !== null && editingSection !== undefined ? (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      {currentPageData.sections.find(s => s.id === editingSection)?.icon}
                      Edit {currentPageData.sections.find(s => s.id === editingSection)?.title}
                    </CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowPreview(!showPreview)}
                    >
                      {showPreview ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                      {showPreview ? 'Hide Preview' : 'Show Preview'}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {(() => {
                      const currentSection = currentPageData.sections.find(s => s.id === editingSection);
                      if (!currentSection) {
                        return null;
                      }
                      
                      return currentSection.fields.map((field) => (
                        <div key={field.key}>
                          <Label htmlFor={field.key} className="text-sm font-medium">
                            {field.label}
                          </Label>
                          {renderField(
                            field,
                            editingSection === '' 
                              ? content[currentPage]?.[field.key] || ''
                              : content[currentPage]?.[editingSection]?.[field.key] || '',
                            (value) => handleContentChange(currentPage, editingSection, field.key, value)
                          )}
                        </div>
                      ));
                    })()}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Select a Section</h3>
                  <p className="text-muted-foreground">
                    Choose a section from the left to start editing your website content.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}

      {/* Changes Indicator */}
      {hasChanges && (
        <div className="fixed bottom-4 right-4 bg-yellow-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>You have unsaved changes</span>
          <Button size="sm" onClick={saveContent} className="ml-2">
            <Save className="w-4 h-4 mr-1" />
            Save
          </Button>
        </div>
      )}
    </motion.div>
  );
};

export default AdminWebsiteEditor; 