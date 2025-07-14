import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider'; 
import { Label } from '@/components/ui/label';
import { MapPin, DollarSign, Search, Filter, BedDouble, Bath, CarFront, ArrowRight, PlusSquare, Star, CheckCircle, Eye, Heart, TrendingUp, Grid3X3, List, SortAsc, SortDesc } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { getProperties } from '@/lib/supabaseUtils';
import { useAdmin } from '@/context/AdminContext.jsx';
import { useToast } from '@/components/ui/use-toast';
import { getContentField, getWebsiteContent } from '@/lib/contentUtils';

const Properties = () => {
  const [allProperties, setAllProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [content, setContent] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [propertyType, setPropertyType] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 2000000]);
  const [bedrooms, setBedrooms] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [sortBy, setSortBy] = useState('featured'); // 'featured', 'price-low', 'price-high', 'newest'
  const { isAdmin, loading: adminLoading } = useAdmin();
  const { toast } = useToast();

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

  // Handle URL search parameters
  useEffect(() => {
    const urlSearch = searchParams.get('search');
    if (urlSearch) {
      setSearchTerm(urlSearch);
      // Clear the URL parameter after setting the search term
      searchParams.delete('search');
      setSearchParams(searchParams);
    }
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    const loadProperties = async () => {
      try {
        setLoading(true);
        setError(null);
        const propertiesFromDatabase = await getProperties();
        setAllProperties(propertiesFromDatabase);
      } catch (err) {
        console.error('Error loading properties:', err);
        setError('Failed to load properties. Please try again later.');
        toast({
          title: "Error",
          description: "Failed to load properties. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadProperties();
  }, [toast]);

  useEffect(() => {
    let currentProperties = [...allProperties];

    if (searchTerm) {
      currentProperties = currentProperties.filter(p => 
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (propertyType !== 'all') {
      currentProperties = currentProperties.filter(p => p.type === propertyType);
    }
    
    currentProperties = currentProperties.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    if (bedrooms !== 'all') {
      const numBedrooms = parseInt(bedrooms);
      currentProperties = currentProperties.filter(p => {
        if (p.type === 'Land' || p.type === 'Commercial') return true; 
        if (numBedrooms === 5) return p.beds >= 5; 
        return p.beds === numBedrooms;
      });
    }

    // Sort properties
    switch (sortBy) {
      case 'price-low':
        currentProperties.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        currentProperties.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        currentProperties.sort((a, b) => new Date(b.dateAdded || 0) - new Date(a.dateAdded || 0));
        break;
      case 'featured':
      default:
        // Keep featured properties first, then by price
        currentProperties.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return b.price - a.price;
        });
        break;
    }

    setFilteredProperties(currentProperties);
  }, [searchTerm, propertyType, priceRange, bedrooms, allProperties, sortBy]);

  const uniquePropertyTypes = ['all', ...new Set(allProperties.map(p => p.type).filter(Boolean))];
  const bedroomOptions = ['all', '1', '2', '3', '4', '5+'];
  
  const maxPriceFromData = allProperties.length > 0 ? Math.max(...allProperties.map(p => p.price).filter(p => typeof p === 'number'), 2000000) : 2000000;
  
  // Update price range if it's still at default and we have properties
  useEffect(() => {
    if (allProperties.length > 0 && priceRange[1] === 2000000) {
      const maxPrice = Math.max(...allProperties.map(p => p.price).filter(p => typeof p === 'number'));
      if (maxPrice > 2000000) {
        setPriceRange([0, maxPrice]);
      }
    }
  }, [allProperties]);

  // Get property badge based on type and features
  const getPropertyBadge = (property, index) => {
    if (index === 0) return { text: "Featured", color: "from-yellow-400 to-orange-500" };
    if (property.type === "Luxury") return { text: "Luxury", color: "from-purple-400 to-purple-600" };
    if (property.type === "Beachfront") return { text: "Beachfront", color: "from-blue-400 to-blue-600" };
    if (property.type === "New") return { text: "New", color: "from-green-400 to-green-600" };
    return null;
  };

  return (
    <div className="space-y-16 md:space-y-24">
      {/* Enhanced Hero Section - Desktop Full Width */}
      <section className="hero-full-bleed text-center py-12 md:py-16 lg:py-20 relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-400 via-blue-500 to-teal-600 min-h-[400px] md:min-h-[500px] lg:min-h-[600px] flex items-center" style={{ background: 'linear-gradient(to bottom right, #60a5fa, #3b82f6, #0d9488)' }}>
        {/* Background Image with Color-Matched Placeholder */}
        <div className="absolute inset-0">
          <img 
            src="/Photos/beach-optimized.jpg" 
            alt="Caribbean beach" 
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/40"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-white text-sm font-medium mb-4 drop-shadow-md">
              <Star className="w-4 h-4" />
              <span>{getContent('properties', 'hero', 'badge')}</span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-4">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white drop-shadow-lg mb-4">{getContent('properties', 'hero', 'title')}</h1>
          </div>
          <p className="text-lg md:text-xl lg:text-2xl text-white/95 max-w-4xl mx-auto mb-8 drop-shadow-md">
            {getContent('properties', 'hero', 'subtitle')}
          </p>
          
          {/* Property Stats - Desktop Enhanced */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              { number: allProperties.length.toString(), label: "Total Properties", icon: <Grid3X3 className="w-6 h-6 text-white" /> },
              { number: allProperties.filter(p => p.type === "Luxury").length.toString(), label: "Luxury Homes", icon: <Star className="w-6 h-6 text-white" /> },
              { number: allProperties.filter(p => p.type === "Beachfront").length.toString(), label: "Beachfront", icon: <MapPin className="w-6 h-6 text-white" /> },
              { number: allProperties.filter(p => p.type === "Land").length.toString(), label: "Land Plots", icon: <TrendingUp className="w-6 h-6 text-white" /> }
            ].map((stat, index) => (
              <div key={index} className="text-center p-4 bg-white/10 backdrop-blur-sm rounded-xl shadow-md border border-white/20">
                <div className="flex justify-center mb-2">{stat.icon}</div>
                <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-white">{stat.number}</div>
                <div className="text-sm text-white/80">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Filter Section - Desktop Advanced */}
      <section className="container mx-auto px-4">
        <div className="bg-card p-6 md:p-8 lg:p-10 rounded-xl shadow-md mb-12 border border-border/50">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl lg:text-3xl font-semibold text-primary mb-2">Filter Properties</h2>
              <p className="text-sm lg:text-base text-muted-foreground">Find exactly what you're looking for</p>
            </div>
            
            {/* Desktop: View Controls */}
            <div className="hidden lg:flex items-center gap-4 mt-4 lg:mt-0">
              <div className="flex items-center gap-2">
                <Label className="text-sm font-medium">View:</Label>
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="h-8 w-8 p-0"
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="h-8 w-8 p-0"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="flex items-center gap-2">
                <Label className="text-sm font-medium">Sort:</Label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-32 h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="lg:hidden w-full">
              <Filter className="w-4 h-4 mr-2" /> {showFilters ? 'Hide Filters' : 'Show Filters'}
            </Button>
          </div>
          
          <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 ${showFilters ? 'block' : 'hidden lg:grid'}`}>
            <div className="lg:col-span-2">
              <Label htmlFor="search" className="text-sm font-medium text-foreground">Search by Keyword</Label>
              <div className="relative mt-1">
                <Input 
                  type="text" 
                  id="search" 
                  placeholder="e.g., West Bay, beachfront, villa" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-background/70 focus:bg-background"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              </div>
            </div>

            <div>
              <Label htmlFor="propertyType" className="text-sm font-medium text-foreground">Property Type</Label>
              <Select value={propertyType} onValueChange={setPropertyType}>
                <SelectTrigger id="propertyType" className="mt-1 bg-background/70 focus:bg-background">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {uniquePropertyTypes.map(type => (
                    <SelectItem key={type} value={type}>{type === 'all' ? 'All Types' : type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="bedrooms" className="text-sm font-medium text-foreground">Bedrooms</Label>
              <Select value={bedrooms} onValueChange={setBedrooms}>
                <SelectTrigger id="bedrooms" className="mt-1 bg-background/70 focus:bg-background">
                  <SelectValue placeholder="Any" />
                </SelectTrigger>
                <SelectContent>
                  {bedroomOptions.map(option => (
                    <SelectItem key={option} value={option}>{option === 'all' ? 'Any Bedrooms' : option}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="lg:col-span-1">
              <Label className="text-sm font-medium text-foreground">Price Range (USD)</Label>
              <div className="mt-2 space-y-2">
                <Slider
                  min={0}
                  max={maxPriceFromData}
                  step={50000}
                  value={priceRange}
                  onValueChange={setPriceRange}
                  className="[&>span:first-child]:h-1 [&>span:first-child>span]:bg-primary [&_[role=slider]]:bg-primary [&_[role=slider]]:border-primary-foreground [&_[role=slider]]:shadow-md"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>${priceRange[0].toLocaleString()}</span>
                  <span>${priceRange[1].toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Results Summary - Desktop Enhanced */}
        {filteredProperties.length > 0 && (
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <p className="text-muted-foreground text-lg">
                  Showing <span className="font-semibold text-primary">{filteredProperties.length}</span> of <span className="font-semibold">{allProperties.length}</span> properties
              </p>
                {sortBy !== 'featured' && (
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    {sortBy === 'price-low' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
                    <span>Sorted by {sortBy === 'price-low' ? 'Price (Low to High)' : sortBy === 'price-high' ? 'Price (High to Low)' : 'Newest'}</span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Eye className="w-4 h-4" />
                <span>Click on any property for details</span>
              </div>
            </div>
          </div>
        )}
        
        {/* Loading State */}
        {loading && (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Loading Properties</h3>
              <p className="text-muted-foreground">Fetching the latest properties from our database...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="text-6xl mb-6">⚠️</div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Error Loading Properties</h3>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button 
                onClick={() => window.location.reload()} 
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              >
                Try Again
              </Button>
            </div>
          </div>
        )}
        
        {!loading && !error && filteredProperties.length > 0 ? (
          <div className={`grid gap-6 lg:gap-8 ${
            viewMode === 'list' 
              ? 'grid-cols-1' 
              : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
          }`}>
            {filteredProperties.map((property, index) => {
              const badge = getPropertyBadge(property, index);
              return (
                <div 
                  key={property.id} 
                  className={`h-full group ${viewMode === 'list' ? 'lg:col-span-1' : ''}`}
                >
                  <Card className={`overflow-hidden shadow-md hover:shadow-xl h-full flex flex-col group border border-border/50 transition-all duration-300 ${
                    viewMode === 'list' ? 'lg:flex-row' : ''
                  }`}>
                    <CardHeader className={`p-0 relative ${viewMode === 'list' ? 'lg:w-1/3' : ''}`}>
                      <div className={`${viewMode === 'list' ? 'h-full' : 'aspect-w-16 aspect-h-9'}`}>
                        <img 
                          alt={property.title} 
                          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300" 
                          src={property.image || "https://images.unsplash.com/photo-1582407947304-fd86f028f716?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cmVhbCUyMGVzdGF0ZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60"} 
                          loading="lazy" 
                        />
                      </div>
                      
                      {/* Property Type Badge */}
                      {property.type && (
                        <div className="absolute top-2 right-2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold shadow-md">
                          {property.type}
                        </div>
                      )}
                      
                      {/* Special Badge */}
                      {badge && (
                        <div className={`absolute top-2 left-2 bg-gradient-to-r ${badge.color} text-white px-3 py-1 rounded-full text-xs font-semibold shadow-md`}>
                          {badge.text}
                        </div>
                      )}
                    </CardHeader>
                    <Link to={`/properties/${property.id}`} className="block flex-grow">
                      <CardContent className={`p-4 sm:p-6 flex-grow ${viewMode === 'list' ? 'lg:w-2/3' : ''}`}>
                        <CardTitle className={`font-semibold mb-2 text-primary line-clamp-2 ${
                          viewMode === 'list' ? 'text-xl lg:text-2xl' : 'text-lg sm:text-xl'
                        }`}>{property.title}</CardTitle>
                        <div className="flex items-center text-sm text-muted-foreground mb-2">
                          <MapPin className="w-4 h-4 mr-1 text-turquoise-dark flex-shrink-0" /> 
                          <span className="truncate">{property.location}</span>
                        </div>
                        <CardDescription className={`text-foreground mb-3 line-clamp-2 ${
                          viewMode === 'list' ? 'text-base lg:text-lg' : 'text-sm'
                        }`}>{property.description}</CardDescription>
                        
                        {property.type !== 'Land' && property.type !== 'Commercial' && (
                          <div className={`flex flex-wrap gap-x-3 gap-y-1 text-muted-foreground mb-3 ${
                            viewMode === 'list' ? 'text-base' : 'text-sm'
                          }`}>
                            {property.beds && <span className="flex items-center"><BedDouble className="w-4 h-4 mr-1 text-turquoise-dark flex-shrink-0" /> {property.beds} Beds</span>}
                            {property.baths && <span className="flex items-center"><Bath className="w-4 h-4 mr-1 text-turquoise-dark flex-shrink-0" /> {property.baths} Baths</span>}
                            {property.parking && <span className="flex items-center"><CarFront className="w-4 h-4 mr-1 text-turquoise-dark flex-shrink-0" /> {property.parking} Parking</span>}
                          </div>
                        )}
                        {property.area && <p className={`text-muted-foreground ${
                          viewMode === 'list' ? 'text-base' : 'text-sm'
                        }`}>Area: {property.area ? property.area.toLocaleString() : 'N/A'} sq ft</p>}
                      </CardContent>
                      <CardFooter className={`p-4 sm:p-6 bg-slate-50 dark:bg-slate-800/50 flex justify-between items-center mt-auto ${
                        viewMode === 'list' ? 'lg:w-2/3' : ''
                      }`}>
                        <p className={`font-bold text-primary flex items-center ${
                          viewMode === 'list' ? 'text-xl lg:text-3xl' : 'text-lg sm:text-2xl'
                        }`}>
                          <DollarSign className={`mr-1 ${
                            viewMode === 'list' ? 'h-6 w-6 lg:h-8 lg:w-8' : 'h-5 w-5 sm:h-6 sm:w-6'
                          }`} />
                          {property.price ? property.price.toLocaleString() : 'N/A'}
                        </p>
                        <Button variant="link" className="text-primary p-0 group-hover:underline font-semibold">
                          <span className={viewMode === 'list' ? 'text-base lg:text-lg' : 'text-sm sm:text-base'}>
                            View Details
                          </span>
                          <ArrowRight className={`ml-1 ${
                            viewMode === 'list' ? 'h-4 w-4 lg:h-5 lg:w-5' : 'h-3 w-3 sm:h-4 sm:w-4'
                          }`} />
                        </Button>
                      </CardFooter>
                    </Link>
                  </Card>
                </div>
              );
            })}
          </div>
        ) : !loading && !error && (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="text-8xl mb-6">🏠</div>
              <h3 className="text-2xl font-semibold text-foreground mb-4">
                {searchTerm || propertyType !== 'all' || bedrooms !== 'all' || priceRange[0] > 0 || priceRange[1] < 2000000
                  ? 'No Properties Found'
                  : 'No Properties Listed Yet'
                }
              </h3>
              <p className="text-muted-foreground mb-8 text-lg">
                {searchTerm || propertyType !== 'all' || bedrooms !== 'all' || priceRange[0] > 0 || priceRange[1] < 2000000
                  ? 'Try adjusting your search filters or browse all properties.'
                  : 'Our team is working on adding amazing properties. Check back soon or contact us to list your property!'
                }
              </p>
              
              {/* Action buttons based on context */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {(searchTerm || propertyType !== 'all' || bedrooms !== 'all' || priceRange[0] > 0 || priceRange[1] < 2000000) ? (
                  <>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setSearchTerm('');
                        setPropertyType('all');
                        setBedrooms('all');
                        setPriceRange([0, 2000000]);
                      }}
                      className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                    >
                      Clear All Filters
                    </Button>
                    <Button asChild variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                    <Link to="/contact">
                      Contact Us
                    </Link>
                  </Button>
                  </>
                ) : (
                  <>
                    <Button asChild variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                      <Link to="/contact">
                      List Your Property
                    </Link>
                  </Button>
                    <Button asChild variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                      <Link to="/services">
                        Our Services
                      </Link>
                    </Button>
                  </>
                )}
                </div>
            </div>
          </div>
        )}
      </section>

      {/* Enhanced List Your Property Banner */}
      <section className="container mx-auto px-4">
        <div className="bg-gradient-to-r from-primary/10 via-turquoise-light/20 to-primary/10 rounded-xl p-8 md:p-12 lg:p-16 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-turquoise-light/10 to-primary/10"></div>
          <div className="max-w-4xl mx-auto relative z-10">
            <div className="mb-6">
              <TrendingUp className="w-12 h-12 lg:w-16 lg:h-16 text-primary mx-auto mb-4" />
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-4">
              Want to List Your Property with Us?
            </h2>
            <p className="text-lg lg:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Enter your property details for submission and approval. Our team will review your listing and get back to you within 24 hours.
            </p>
            <div className="grid md:grid-cols-3 gap-4 mb-8 text-sm lg:text-base">
              <div className="flex items-center justify-center gap-2">
                <CheckCircle className="w-4 h-4 text-primary" />
                <span>Quick submission process</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <CheckCircle className="w-4 h-4 text-primary" />
                <span>100% Free Listing</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <CheckCircle className="w-4 h-4 text-primary" />
                <span>48-hour response time</span>
              </div>
            </div>
              <div>
              <Button asChild size="lg" variant="outline" className="text-lg px-8 py-3 border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors bg-white/80 backdrop-blur-sm font-semibold shadow-lg">
                  <Link to="/submit-property">
                    Submit Your Property
                  </Link>
                </Button>
              </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Properties;