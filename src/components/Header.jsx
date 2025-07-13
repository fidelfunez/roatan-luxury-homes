import React, { useState, useEffect, useCallback } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Menu, X, Home as HomeIcon, Info, Mail, Briefcase, Building2, Newspaper, Phone, Search, ChevronDown, MapPin, Clock, ArrowRight } from 'lucide-react';
import Logo from './Logo';
import { searchWebsite, getSearchSuggestions } from '@/lib/searchUtils';
import { getContentField, getWebsiteContent } from '@/lib/contentUtils';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [searchResults, setSearchResults] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [content, setContent] = useState({});
  const navigate = useNavigate();

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

  // Navigation links with editable content
  const navLinks = [
    { to: '/', label: getContent('header', 'navigation', 'homeLabel'), icon: <HomeIcon className="w-4 h-4 mr-2" /> },
    { to: '/properties', label: getContent('header', 'navigation', 'propertiesLabel'), icon: <Building2 className="w-4 h-4 mr-2" /> },
    { to: '/services', label: getContent('header', 'navigation', 'servicesLabel'), icon: <Briefcase className="w-4 h-4 mr-2" /> },
    { to: '/about', label: getContent('header', 'navigation', 'aboutLabel'), icon: <Info className="w-4 h-4 mr-2" /> },
    { to: '/blog', label: getContent('header', 'navigation', 'blogLabel'), icon: <Newspaper className="w-4 h-4 mr-2" /> },
    { to: '/contact', label: getContent('header', 'navigation', 'contactLabel'), icon: <Mail className="w-4 h-4 mr-2" /> },
  ];

  // Optimized scroll handler with throttling
  const handleScroll = useCallback(() => {
    const scrolled = window.scrollY > 20;
    if (scrolled !== isScrolled) {
      setIsScrolled(scrolled);
    }
  }, [isScrolled]);

  useEffect(() => {
    let ticking = false;
    
    const throttledScrollHandler = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };
    
    window.addEventListener('scroll', throttledScrollHandler, { passive: true });
    return () => window.removeEventListener('scroll', throttledScrollHandler);
  }, [handleScroll]);

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleSearch = () => setShowSearch(!showSearch);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const results = searchWebsite(searchQuery.trim());
      setSearchResults(results);
      setShowResults(true);
    }
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.trim()) {
      const results = searchWebsite(query);
      setSearchResults(results);
      setShowResults(true);
    } else {
      setShowResults(false);
      setSearchResults(null);
    }
  };

  const handleResultClick = (url) => {
    navigate(url);
    setSearchQuery('');
    setShowSearch(false);
    setShowResults(false);
    setSearchResults(null);
  };

  const handleSearchClose = () => {
    setShowSearch(false);
    setShowResults(false);
    setSearchResults(null);
    setSearchQuery('');
  };

  const linkClasses = "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ease-in-out";
  const activeLinkClasses = "bg-primary text-primary-foreground shadow-md";
  const inactiveLinkClasses = "text-foreground hover:bg-primary/10 hover:text-primary";
  
  const mobileLinkClasses = "flex items-center px-3 py-3 rounded-md text-base font-medium transition-colors duration-200 ease-in-out";
  const mobileActiveLinkClasses = "bg-primary text-primary-foreground shadow-lg";
  const mobileInactiveLinkClasses = "text-foreground hover:bg-primary/10 hover:text-primary";

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-[9999] transition-all duration-150 ease-in-out ${isScrolled || isOpen ? 'bg-background/95 backdrop-blur-sm shadow-lg' : 'bg-background/80 backdrop-blur-sm'}`}
    >
      {/* Desktop Header */}
      <div className="hidden lg:block">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Bar with Contact Info */}
          <div className="flex items-center justify-between py-2 border-b border-primary/10">
            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-2 text-primary" />
                <span>{getContent('header', 'topBar', 'location')}</span>
              </div>
              <div className="flex items-center">
                <Phone className="w-4 h-4 mr-2 text-primary" />
                <span>{getContent('header', 'topBar', 'phone')}</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2 text-primary" />
                <span>{getContent('header', 'topBar', 'hours')}</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={toggleSearch} className="text-muted-foreground hover:text-primary">
                <Search className="w-4 h-4" />
              </Button>
              <Button asChild size="sm" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-white/80 backdrop-blur-sm font-semibold shadow-lg">
                <Link to="/contact">
                  <Phone className="w-4 h-4 mr-2" />
                  {getContent('header', 'cta', 'ctaText')}
                </Link>
              </Button>
            </div>
          </div>

          {/* Main Navigation */}
          <div className="flex items-center justify-between h-20">
            <Logo textClassName="text-2xl font-bold" />
            
            <nav className="flex space-x-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : inactiveLinkClasses}`}
                >
                  {link.icon}
                  {link.label}
                  {link.label === 'Properties' && <ChevronDown className="w-3 h-3 ml-1" />}
                </NavLink>
              ))}
            </nav>

            {/* Search Bar */}
            {showSearch && (
              <div className="absolute top-full left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border/50 p-4">
                <div className="container mx-auto">
                  <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input 
                      type="text" 
                      placeholder={getContent('header', 'cta', 'searchPlaceholder')} 
                      value={searchQuery}
                      onChange={handleSearchChange}
                      onKeyPress={handleSearchKeyPress}
                      className="pl-10 bg-background/70 focus:bg-background"
                      autoFocus
                    />
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm" 
                      onClick={handleSearchClose}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-primary"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </form>
                  
                  {/* Search Results Dropdown */}
                  {showResults && searchResults && (
                    <div className="max-w-2xl mx-auto mt-4 bg-background/95 backdrop-blur-sm border border-border/50 rounded-lg shadow-lg max-h-96 overflow-y-auto">
                      {searchResults.total === 0 ? (
                        <div className="p-6 text-center text-muted-foreground">
                          <p className="text-lg font-medium mb-2">No results found</p>
                          <p className="text-sm">Try different keywords or browse our site</p>
                        </div>
                      ) : (
                        <div className="p-4">
                          {/* Properties Results */}
                          {searchResults.properties.length > 0 && (
                            <div className="mb-6">
                              <h3 className="text-sm font-semibold text-primary mb-3 flex items-center">
                                <Building2 className="w-4 h-4 mr-2" />
                                Properties ({searchResults.properties.length})
                              </h3>
                              <div className="space-y-2">
                                {searchResults.properties.slice(0, 3).map((property) => (
                                  <button
                                    key={property.id}
                                    onClick={() => handleResultClick(`/properties/${property.id}`)}
                                    className="w-full text-left p-3 rounded-md hover:bg-primary/10 transition-colors"
                                  >
                                    <div className="font-medium text-foreground">{property.title}</div>
                                    <div className="text-sm text-muted-foreground">{property.location}</div>
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Pages Results */}
                          {searchResults.pages.length > 0 && (
                            <div className="mb-6">
                              <h3 className="text-sm font-semibold text-primary mb-3 flex items-center">
                                <HomeIcon className="w-4 h-4 mr-2" />
                                Pages ({searchResults.pages.length})
                              </h3>
                              <div className="space-y-2">
                                {searchResults.pages.slice(0, 3).map((page) => (
                                  <button
                                    key={page.url}
                                    onClick={() => handleResultClick(page.url)}
                                    className="w-full text-left p-3 rounded-md hover:bg-primary/10 transition-colors"
                                  >
                                    <div className="font-medium text-foreground">{page.title}</div>
                                    <div className="text-sm text-muted-foreground line-clamp-2">{page.content}</div>
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Services Results */}
                          {searchResults.services.length > 0 && (
                            <div className="mb-6">
                              <h3 className="text-sm font-semibold text-primary mb-3 flex items-center">
                                <Briefcase className="w-4 h-4 mr-2" />
                                Services ({searchResults.services.length})
                              </h3>
                              <div className="space-y-2">
                                {searchResults.services.slice(0, 3).map((service) => (
                                  <button
                                    key={service.url}
                                    onClick={() => handleResultClick(service.url)}
                                    className="w-full text-left p-3 rounded-md hover:bg-primary/10 transition-colors"
                                  >
                                    <div className="font-medium text-foreground">{service.title}</div>
                                    <div className="text-sm text-muted-foreground line-clamp-2">{service.content}</div>
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* View All Results */}
                          {searchResults.total > 6 && (
                            <div className="pt-4 border-t border-border/50">
                              <button
                                onClick={() => handleResultClick(`/properties?search=${encodeURIComponent(searchQuery)}`)}
                                className="w-full text-center p-3 text-primary hover:bg-primary/10 rounded-md transition-colors font-medium"
                              >
                                View all {searchResults.total} results <ArrowRight className="w-4 h-4 ml-2 inline" />
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="lg:hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Logo textClassName="hidden sm:inline-block" />
            
            <div className="flex items-center space-x-2">
              <Button variant="ghost" onClick={toggleSearch} aria-label="Search">
                <Search className="h-5 w-5 text-primary" />
              </Button>
              <Button variant="ghost" onClick={toggleMenu} aria-label="Toggle menu">
                {isOpen ? <X className="h-7 w-7 text-primary" /> : <Menu className="h-7 w-7 text-primary" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Search */}
        {showSearch && (
          <div className="bg-background/95 backdrop-blur-sm border-t border-border/50 p-4">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input 
                type="text" 
                placeholder="Search the entire website..." 
                value={searchQuery}
                onChange={handleSearchChange}
                onKeyPress={handleSearchKeyPress}
                className="pl-10 bg-background/70 focus:bg-background"
                autoFocus
              />
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                onClick={handleSearchClose}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-primary"
              >
                <X className="h-4 w-4" />
              </Button>
            </form>
            
            {/* Mobile Search Results */}
            {showResults && searchResults && (
              <div className="mt-4 bg-background/95 backdrop-blur-sm border border-border/50 rounded-lg shadow-lg max-h-80 overflow-y-auto">
                {searchResults.total === 0 ? (
                  <div className="p-4 text-center text-muted-foreground">
                    <p className="font-medium mb-1">No results found</p>
                    <p className="text-sm">Try different keywords</p>
                  </div>
                ) : (
                  <div className="p-4 space-y-3">
                    {searchResults.properties.slice(0, 2).map((property) => (
                      <button
                        key={property.id}
                        onClick={() => handleResultClick(`/properties/${property.id}`)}
                        className="w-full text-left p-3 rounded-md hover:bg-primary/10 transition-colors"
                      >
                        <div className="font-medium text-foreground">{property.title}</div>
                        <div className="text-sm text-muted-foreground">{property.location}</div>
                      </button>
                    ))}
                    {searchResults.pages.slice(0, 2).map((page) => (
                      <button
                        key={page.url}
                        onClick={() => handleResultClick(page.url)}
                        className="w-full text-left p-3 rounded-md hover:bg-primary/10 transition-colors"
                      >
                        <div className="font-medium text-foreground">{page.title}</div>
                        <div className="text-sm text-muted-foreground line-clamp-1">{page.content}</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Mobile Menu */}
        {isOpen && (
          <div className="bg-background/95 backdrop-blur-sm border-t border-border/50">
            <div className="container mx-auto px-4 py-4">
              <nav className="space-y-2">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) => `${mobileLinkClasses} ${isActive ? mobileActiveLinkClasses : mobileInactiveLinkClasses}`}
                  >
                    {link.icon}
                    {link.label}
                  </NavLink>
                ))}
                <div className="pt-4">
                  <Button 
                    asChild 
                    variant="outline"
                    className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-white/80 backdrop-blur-sm font-semibold shadow-lg transition-all duration-200 ease-in-out"
                  >
                    <Link to="/contact" onClick={() => setIsOpen(false)}>
                      <Phone className="w-4 h-4 mr-2" />
                      Get in Touch
                    </Link>
                  </Button>
                </div>
              </nav>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;