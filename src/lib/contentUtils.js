// Content management utilities for the website editor

const CONTENT_STORAGE_KEY = 'caribbeanLuxRealty_websiteContent';

// Default content structure
const defaultContent = {
  home: {
    hero: {
      title: 'Discover Your Dream Property in the Caribbean',
      subtitle: 'Explore exclusive listings for luxury homes, beachfront properties, and investment opportunities with Caribbean Lux Realty.',
      trustIndicator1: '15+ Years Experience',
      trustIndicator2: '500+ Properties Sold',
      trustIndicator3: '24/7 Support'
    },
    welcome: {
      title: 'Welcome to Paradise 👋🏼',
      description: 'The Caribbean, a collection of jewels, offers unparalleled beauty, vibrant cultures, and welcoming communities. Whether you\'re seeking a vacation home, a permanent residence, or a smart investment, Caribbean Lux Realty is your trusted guide.',
      feature1Title: 'Expert Guidance',
      feature1Desc: 'Navigating the Caribbean market with local expertise and personalized service.',
      feature2Title: 'Client Focused',
      feature2Desc: 'Your dreams are our priority. We listen, advise, and deliver exceptional results.',
      feature3Title: 'Prime Locations',
      feature3Desc: 'Access to exclusive listings in the Caribbean\'s most sought-after destinations.'
    },
    featuredLocation: {
      title: 'Featured Location: Roatán',
      description: 'Discover the pristine beauty of Roatán, where crystal-clear waters meet white sandy beaches. Our exclusive properties offer the perfect blend of luxury and island living.',
      feature1: 'World-class diving and snorkeling',
      feature2: 'Pristine beaches and coral reefs',
      feature3: 'Luxury amenities and modern conveniences',
      startingPrice: 'Starting from $450,000'
    },
    testimonials: {
      title: 'What Our Clients Say',
      subtitle: 'Don\'t just take our word for it. Here\'s what our satisfied clients have to say about their experience.',
      testimonial1Name: 'Sarah & Mike',
      testimonial1Location: 'Roatán Beach Villa',
      testimonial1Text: 'Caribbean Lux made our dream of owning a beachfront property a reality. Their attention to detail were exceptional.',
      testimonial2Name: 'David Rodriguez',
      testimonial2Location: 'West Bay Condo',
      testimonial2Text: 'Professional, responsive, and truly understands the local market. I couldn\'t be happier with my investment property.',
      testimonial3Name: 'Emma Thompson',
      testimonial3Location: 'Sandy Bay Home',
      testimonial3Text: 'From the first consultation to closing, everything was seamless. They really care about their clients\' success.'
    },
    cta: {
      title: 'Ready to Find Your Paradise?',
      subtitle: 'Let\'s start your journey to owning a piece of Caribbean paradise today.'
    }
  },
  about: {
    company: {
      title: 'About Roatán Realty',
      subtitle: 'Your trusted partners in navigating the vibrant Roatán real estate market. We are dedicated to helping you find your piece of paradise.',
      missionTitle: 'Our Mission',
      missionText: 'At Roatán Realty, our mission is to provide exceptional real estate services with integrity, professionalism, and a deep understanding of the local market. We strive to empower our clients—whether U.S. buyers seeking tropical homes or investors looking for lucrative opportunities—to make informed decisions and achieve their property goals in Roatán.',
      missionText2: 'We believe in building lasting relationships based on trust and transparency, ensuring every client feels confident and supported throughout their journey.'
    },
    whyChooseUs: {
      title: 'Why Choose Us?',
      feature1Title: 'Local Expertise',
      feature1Desc: 'Unmatched knowledge of Roatán\'s neighborhoods, market trends, and legalities.',
      feature2Title: 'Trusted & Transparent',
      feature2Desc: 'We operate with the highest ethical standards, ensuring clarity and honesty in all dealings.',
      feature3Title: 'Client-Centric Approach',
      feature3Desc: 'Your needs are our priority. We offer personalized service tailored to your unique goals.'
    },
    team: {
      title: 'Meet Our Team',
      member1Name: 'Alice Johnson',
      member1Role: 'Lead Agent & Founder',
      member1Bio: 'With over 15 years of experience in Roatán real estate, Alice is passionate about connecting clients with their dream properties and ensuring a seamless transaction process.',
      member2Name: 'Bob Williams',
      member2Role: 'Sales Specialist',
      member2Bio: 'Bob\'s deep knowledge of the local market and dedication to client satisfaction make him an invaluable asset to buyers and sellers alike.',
      member3Name: 'Carol Davis',
      member3Role: 'Client Relations Manager',
      member3Bio: 'Carol ensures every client receives personalized attention and support throughout their real estate journey, making complex processes feel simple.'
    }
  },
  services: {
    hero: {
      title: 'Our Services',
      subtitle: 'Comprehensive real estate solutions tailored to your needs in Roatán. From buying your dream home to managing investments, we\'ve got you covered.',
      stat1Number: '500+',
      stat1Label: 'Properties Sold',
      stat2Number: '15+',
      stat2Label: 'Years Experience',
      stat3Number: '100%',
      stat3Label: 'Client Satisfaction',
      stat4Number: '24/7',
      stat4Label: 'Support Available'
    },
    whyChooseUs: {
      title: 'Why Choose Caribbean Lux Realty?',
      subtitle: 'We combine local expertise with international standards to deliver exceptional results for our clients.',
      feature1Title: 'Trusted Expertise',
      feature1Desc: '15+ years of experience in Caribbean real estate with deep local knowledge.',
      feature2Title: 'Personalized Service',
      feature2Desc: 'Dedicated support throughout your entire real estate journey.',
      feature3Title: 'Quality Assurance',
      feature3Desc: 'Rigorous due diligence and quality standards for every transaction.',
      feature4Title: '24/7 Support',
      feature4Desc: 'Round-the-clock assistance for all your real estate needs.'
    },
    cta: {
      title: 'Ready to Get Started?',
      subtitle: 'Contact us today to discuss your real estate needs and discover how we can help you achieve your goals in Roatán.'
    }
  },
  contact: {
    hero: {
      title: 'Get in Touch',
      subtitle: 'We\'re here to help you with all your Roatán real estate needs. Reach out to us today!',
      stat1Number: '24/7',
      stat1Label: 'Support Available',
      stat2Number: '< 2hrs',
      stat2Label: 'Response Time',
      stat3Number: '500+',
      stat3Label: 'Happy Clients',
      stat4Number: '15+',
      stat4Label: 'Years Experience'
    },
    contactInfo: {
      phone: '+50412345678',
      email: 'info@caribbeanluxrealty.com',
      address: 'Main Street, Luxury Cay, Caribbean',
      officeHours: 'Monday - Friday: 9:00 AM - 6:00 PM',
      emergencyContact: 'Available 24/7 for urgent inquiries'
    },
    whyChooseUs: {
      title: 'Why Choose Caribbean Lux Realty?',
      subtitle: 'We combine local expertise with international standards to deliver exceptional results for our clients.',
      feature1Title: 'Trusted Expertise',
      feature1Desc: '15+ years of experience in Caribbean real estate with deep local knowledge.',
      feature2Title: 'Personalized Service',
      feature2Desc: 'Dedicated support throughout your entire real estate journey.',
      feature3Title: 'Quality Assurance',
      feature3Desc: 'Rigorous due diligence and quality standards for every transaction.',
      feature4Title: 'Client Satisfaction',
      feature4Desc: '500+ satisfied clients with 100% satisfaction rate.'
    }
  },
  properties: {
    hero: {
      title: 'Explore Our Properties',
      subtitle: 'Find your perfect piece of the Caribbean. Browse our curated listings of homes, land, and investment opportunities.',
      badge: 'Premium Caribbean Properties'
    }
  },
  'property-sales-acquisition': {
    title: 'Property Sales & Acquisition',
    description: 'Our expert team provides comprehensive support for buying or selling properties in Roatán. We handle everything from initial market analysis, property viewings, negotiation, to the final closing stages. Whether you\'re looking for a luxury beachfront villa, a cozy condo, a plot of land to build your dream home, or a commercial investment, we leverage our extensive network and local knowledge to find the perfect match for your needs. We ensure a transparent and smooth transaction process, guiding you every step of the way.',
    ctaText: 'Let\'s discuss how we can assist you with property sales & acquisition. Contact us today for a personalized consultation.'
  },
  'legal-guidance-due-diligence': {
            title: 'Legal Guidance & Assistance',
    description: 'Navigating the legal landscape of Honduran real estate can be challenging. We connect you with highly reputable and experienced legal professionals specializing in property law. They will conduct thorough due diligence, including title searches, verification of property boundaries, and ensuring there are no outstanding liens or encumbrances. Our legal partners will also assist with contract review and preparation, ensuring your interests are protected throughout the transaction.',
          ctaText: 'Let\'s discuss how we can assist you with legal guidance & assistance. Contact us today for a personalized consultation.'
  },
  'relocation-assistance': {
    title: 'Relocation Assistance',
    description: 'Making the move to Roatán is an exciting adventure, and we\'re here to make your transition as smooth as possible. Our relocation assistance services cover a wide range of needs, from providing information on residency requirements and visa processes, to helping you set up bank accounts, find schools for your children, and connect with essential local services. We can also offer insights into island life, community groups, and cultural nuances to help you feel at home quickly.',
    ctaText: 'Let\'s discuss how we can assist you with relocation assistance. Contact us today for a personalized consultation.'
  },
  'land-development-investment': {
    title: 'Development & Investment',
    description: 'Roatán offers significant opportunities for land development and real estate investment. We assist clients in identifying prime parcels of land suitable for residential, commercial, or mixed-use development. Our team can connect you with trusted local architects, engineers, and construction companies. We also provide market analysis and investment strategy advice to help you maximize your returns and navigate the development process efficiently.',
    ctaText: 'Let\'s discuss how we can assist you with development & investment. Contact us today for a personalized consultation.'
  },
  'vacation-rental-management': {
    title: 'Vacation Rental Management',
    description: 'Turn your Roatán property into a lucrative income source with our professional vacation rental management services. We handle all aspects of managing your rental, including marketing and listing on popular platforms, managing bookings and guest communication, coordinating check-ins/check-outs, and overseeing cleaning and maintenance. Our goal is to maximize your occupancy rates and rental income while ensuring your property is well-maintained and your guests have an exceptional experience.',
    ctaText: 'Let\'s discuss how we can assist you with vacation rental management. Contact us today for a personalized consultation.'
  },
  'commercial-real-estate': {
    title: 'Commercial Real Estate',
    description: 'For businesses looking to establish or expand their presence in Roatán, we offer specialized commercial real estate services. We can help you find suitable office spaces, retail locations, warehouses, or properties for hospitality ventures like hotels and restaurants. Our team understands the local commercial market dynamics and can assist with site selection, lease negotiation, and connecting you with relevant business support services.',
    ctaText: 'Let\'s discuss how we can assist you with commercial real estate. Contact us today for a personalized consultation.'
  },
  footer: {
    companyInfo: {
      description: 'Your trusted partner for finding exceptional properties in the Caribbean.',
      address: 'Main Street, Luxury Cay, Caribbean',
      phone: '+1 (555) LUX-REALTY',
      email: 'info@caribbeanluxrealty.com'
    },
    newsletter: {
      title: 'Stay Updated',
      description: 'Subscribe to our newsletter for the latest luxury properties and news.',
      placeholder: 'Enter your email',
      buttonText: 'Subscribe'
    }
  }
};

// Get content from localStorage or return default
export const getWebsiteContent = () => {
  try {
    const stored = localStorage.getItem(CONTENT_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      
      // Check if the content is corrupted (has numeric keys)
      const isCorrupted = Object.keys(parsed).some(key => {
        if (typeof parsed[key] === 'object' && parsed[key] !== null) {
          return Object.keys(parsed[key]).some(subKey => {
            if (typeof parsed[key][subKey] === 'object' && parsed[key][subKey] !== null) {
              return Object.keys(parsed[key][subKey]).some(fieldKey => {
                const value = parsed[key][subKey][fieldKey];
                return typeof value === 'object' && value !== null && Object.keys(value).every(k => !isNaN(k));
              });
            }
            return false;
          });
        }
        return false;
      });
      
      if (isCorrupted) {
        console.warn('🧹 contentUtils: Detected corrupted content, clearing localStorage');
        localStorage.removeItem(CONTENT_STORAGE_KEY);
        return defaultContent;
      }
      
      // Additional check: ensure all values are strings, not objects
      const hasObjectValues = Object.keys(parsed).some(pageKey => {
        if (typeof parsed[pageKey] === 'object' && parsed[pageKey] !== null) {
          return Object.keys(parsed[pageKey]).some(sectionKey => {
            if (typeof parsed[pageKey][sectionKey] === 'object' && parsed[pageKey][sectionKey] !== null) {
              return Object.keys(parsed[pageKey][sectionKey]).some(fieldKey => {
                const value = parsed[pageKey][sectionKey][fieldKey];
                return typeof value === 'object' && value !== null && !Array.isArray(value);
              });
            }
            return false;
          });
        }
        return false;
      });
      
      if (hasObjectValues) {
        console.warn('🧹 contentUtils: Detected object values instead of strings, clearing localStorage');
        localStorage.removeItem(CONTENT_STORAGE_KEY);
        return defaultContent;
      }
      
      // Merge with defaults to ensure all fields exist
      const merged = mergeWithDefaults(parsed);
      return merged;
    }
    return defaultContent;
  } catch (error) {
    console.error('Error loading website content:', error);
    // Clear localStorage on any error
    try {
      localStorage.removeItem(CONTENT_STORAGE_KEY);
    } catch (clearError) {
      console.error('Error clearing localStorage:', clearError);
    }
    return defaultContent;
  }
};

// Save content to localStorage
export const saveWebsiteContent = (content) => {
  try {
    const serialized = JSON.stringify(content);
    localStorage.setItem(CONTENT_STORAGE_KEY, serialized);
    
    // Dispatch event immediately after saving
    window.dispatchEvent(new Event('websiteContentUpdated'));
    
    return true;
  } catch (error) {
    console.error('Error saving website content:', error);
    return false;
  }
};

// Get specific content section
export const getContentSection = (page, section) => {
  const content = getWebsiteContent();
  return content[page]?.[section] || {};
};

// Get specific content field with fallback defaults
export const getContentField = (page, section, field) => {
  const content = getWebsiteContent();
  
  // Handle individual service pages that don't have sections
  let value;
  if (section === '') {
    value = content[page]?.[field];
  } else {
    const sectionContent = getContentSection(page, section);
    value = sectionContent[field];
  }
  
  // If the value is empty, null, undefined, or not a string, return the default
  if (!value || typeof value !== 'string' || value.trim() === '') {
    // Handle individual service pages that don't have sections in defaults
    if (section === '') {
      return defaultContent[page]?.[field] || '';
    } else {
      return defaultContent[page]?.[section]?.[field] || '';
    }
  }
  
  return value;
};

// Merge stored content with defaults to ensure all fields exist
const mergeWithDefaults = (stored) => {
  const merged = { ...defaultContent };
  
  // Recursively merge stored content with defaults
  Object.keys(stored).forEach(page => {
    if (merged[page]) {
      Object.keys(stored[page]).forEach(section => {
        if (merged[page][section]) {
          merged[page][section] = {
            ...merged[page][section],
            ...stored[page][section]
          };
        } else {
          merged[page][section] = stored[page][section];
        }
      });
    } else {
      merged[page] = stored[page];
    }
  });
  
  return merged;
};

// Reset content to defaults
export const resetToDefaults = () => {
  try {
    localStorage.removeItem(CONTENT_STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Error resetting website content:', error);
    return false;
  }
};

// Export default content for backup
export const getDefaultContent = () => defaultContent;

// Clear localStorage and reset to defaults
export const clearWebsiteContent = () => {
  try {
    localStorage.removeItem(CONTENT_STORAGE_KEY);
    console.log('🧹 contentUtils: localStorage cleared');
    return true;
  } catch (error) {
    console.error('Error clearing website content:', error);
    return false;
  }
}; 