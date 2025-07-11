import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, MapPin, DollarSign, BedDouble, Bath, CarFront, Maximize, CalendarDays, Clock, Home, CheckCircle, Info, Mail, Heart, Phone, Share2, Download, Eye, Star, TrendingUp } from 'lucide-react';
import { getPropertyById } from '@/lib/propertyUtils';

const PropertyDetail = () => {
  const { propertyId } = useParams();
  const [property, setProperty] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  useEffect(() => {
    const fetchedProperty = getPropertyById(propertyId);
    setProperty(fetchedProperty);
    setCurrentImageIndex(0); 
  }, [propertyId]);

  if (!property) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div>
          <Home className="w-16 h-16 text-destructive mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-destructive mb-4">Property Not Found</h1>
          <p className="text-muted-foreground mb-8">The property you are looking for does not exist or may have been sold.</p>
          <Button asChild>
            <Link to="/properties"><ChevronLeft className="mr-2 h-4 w-4" /> Back to Properties</Link>
          </Button>
        </div>
      </div>
    );
  }
  
  const propertyImages = property.images && property.images.length > 0 ? property.images : (property.image ? [property.image] : ['https://images.unsplash.com/photo-1582407947304-fd86f028f716?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cmVhbCUyMGVzdGF0ZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60']);

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % propertyImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + propertyImages.length) % propertyImages.length);
  };
  
  const openLightbox = (index) => {
    setCurrentImageIndex(index);
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Desktop: Enhanced Navigation */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <Button variant="outline" asChild className="w-fit">
            <Link to="/properties" className="text-primary hover:text-primary/80">
              <ChevronLeft className="mr-2 h-4 w-4" /> Back to All Properties
            </Link>
          </Button>
          
          {/* Desktop: Action Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Download Details
            </Button>
            <Button variant="outline" size="sm">
              <Heart className="w-4 h-4 mr-2" />
              Save
            </Button>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
        {/* Desktop: Main Content - 2/3 Width */}
        <div className="lg:col-span-2 space-y-8">
          {/* Enhanced Header */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Home className="w-4 h-4" />
              <span>{property.type || 'Property'}</span>
              <span>•</span>
              <span>Roatán, Honduras</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-primary leading-tight">
              {property.title}
            </h1>
            <div className="flex items-center text-lg lg:text-xl text-muted-foreground">
              <MapPin className="w-5 h-5 mr-2 text-turquoise-dark" /> 
              <span>{property.location}</span>
            </div>
          </div>

          {/* Enhanced Image Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-w-16 aspect-h-10 lg:aspect-h-9 rounded-xl overflow-hidden shadow-lg group">
              <img  
                alt={`${property.title} - image ${currentImageIndex + 1}`} 
                className="object-cover w-full h-full cursor-pointer transition-transform duration-300 group-hover:scale-105"
                onClick={() => openLightbox(currentImageIndex)}
                src={propertyImages[currentImageIndex]} 
                loading="eager" />
              {propertyImages.length > 1 && (
                <>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={(e) => { e.stopPropagation(); prevImage(); }}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full h-12 w-12 lg:h-14 lg:w-14 backdrop-blur-sm"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="h-6 w-6 lg:h-7 lg:w-7" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={(e) => { e.stopPropagation(); nextImage(); }}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full h-12 w-12 lg:h-14 lg:w-14 backdrop-blur-sm"
                    aria-label="Next image"
                  >
                    <ChevronRight className="h-6 w-6 lg:h-7 lg:w-7" />
                  </Button>
                  <div 
                    className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm text-white text-sm px-3 py-2 rounded-lg cursor-pointer hover:bg-black/80 transition-colors"
                    onClick={() => openLightbox(currentImageIndex)}
                  >
                    <Maximize className="inline h-4 w-4 mr-2" /> 
                    {currentImageIndex + 1} / {propertyImages.length}
                  </div>
                </>
              )}
            </div>

            {/* Enhanced Thumbnails */}
            {propertyImages.length > 1 && (
              <div className="grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-6 gap-3">
                {propertyImages.map((imgSrc, index) => (
                  <div 
                    key={index} 
                    className={`aspect-w-1 aspect-h-1 rounded-lg overflow-hidden cursor-pointer border-2 transition-all duration-200 ${
                      index === currentImageIndex 
                        ? 'border-primary ring-2 ring-primary shadow-lg' 
                        : 'border-transparent hover:border-primary/50 hover:shadow-md'
                    }`}
                    onClick={() => setCurrentImageIndex(index)}
                  >
                    <img  
                      alt={`${property.title} - thumbnail ${index + 1}`} 
                      className="object-cover w-full h-full" 
                      src={imgSrc} 
                      loading="lazy" />
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Enhanced Property Overview */}
          <Card className="bg-background/50 p-6 lg:p-8 rounded-xl shadow-md border border-border/50">
            <CardHeader className="p-0 mb-6">
               <CardTitle className="text-2xl lg:text-3xl font-semibold text-primary">Property Overview</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <p className="text-base sm:text-lg lg:text-xl leading-relaxed text-foreground whitespace-pre-line">
                {property.description}
              </p>
            </CardContent>
          </Card>

          {/* Enhanced Key Features */}
          {property.features && property.features.length > 0 && (
            <Card className="bg-background/50 p-6 lg:p-8 rounded-xl shadow-md border border-border/50">
              <CardHeader className="p-0 mb-6">
                 <CardTitle className="text-2xl lg:text-3xl font-semibold text-primary">Key Features</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4 text-foreground">
                  {property.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-5 h-5 mr-3 text-turquoise-dark flex-shrink-0 mt-1" /> 
                      <span className="text-base lg:text-lg">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Desktop: Additional Information */}
          <div className="hidden lg:block">
            <Card className="bg-gradient-to-r from-primary/5 to-turquoise-light/5 p-6 rounded-xl shadow-md border border-border/50">
              <CardHeader className="p-0 mb-4">
                <CardTitle className="text-xl font-semibold text-primary">Location Highlights</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span>Beachfront Access</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span>Investment Potential</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-blue-500" />
                    <span>Ocean Views</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    <span>Ready to Move In</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Desktop: Enhanced Sidebar - 1/3 Width */}
        <aside className="lg:col-span-1 space-y-6 lg:space-y-8">
          {/* Enhanced Price Card */}
          <Card className="bg-gradient-to-br from-sandy-light to-turquoise-light p-6 lg:p-8 rounded-xl shadow-lg border border-border/50">
            <CardHeader className="p-0 mb-6">
              <CardTitle className="text-2xl lg:text-3xl font-semibold text-primary">Property Details</CardTitle>
            </CardHeader>
            <CardContent className="p-0 space-y-4 text-foreground">
              <div className="flex items-center justify-between p-4 bg-white/50 rounded-lg">
                <span className="font-semibold text-lg">Price:</span>
                <span className="text-3xl lg:text-4xl font-bold text-primary flex items-center">
                  <DollarSign className="w-6 h-6 lg:w-8 lg:h-8 mr-2" />
                  {property.price ? property.price.toLocaleString() : 'N/A'} USD
                </span>
              </div>
              <hr className="border-turquoise-light/50"/>
              <div className="space-y-3">
                {property.type && (
                  <div className="flex items-center justify-between p-3 bg-white/30 rounded-lg">
                    <span className="font-medium">Type:</span>
                    <div className="flex items-center">
                      <Home className="w-5 h-5 mr-2 text-turquoise-dark" /> 
                      {property.type}
                    </div>
                  </div>
                )}
                {property.beds && (
                  <div className="flex items-center justify-between p-3 bg-white/30 rounded-lg">
                    <span className="font-medium">Bedrooms:</span>
                    <div className="flex items-center">
                      <BedDouble className="w-5 h-5 mr-2 text-turquoise-dark" /> 
                      {property.beds}
                    </div>
                  </div>
                )}
                {property.baths && (
                  <div className="flex items-center justify-between p-3 bg-white/30 rounded-lg">
                    <span className="font-medium">Bathrooms:</span>
                    <div className="flex items-center">
                      <Bath className="w-5 h-5 mr-2 text-turquoise-dark" /> 
                      {property.baths}
                    </div>
                  </div>
                )}
                {property.parking && (
                  <div className="flex items-center justify-between p-3 bg-white/30 rounded-lg">
                    <span className="font-medium">Parking:</span>
                    <div className="flex items-center">
                      <CarFront className="w-5 h-5 mr-2 text-turquoise-dark" /> 
                      {property.parking}
                    </div>
                  </div>
                )}
                {property.area && (
                  <div className="flex items-center justify-between p-3 bg-white/30 rounded-lg">
                    <span className="font-medium">Area:</span>
                    <div className="flex items-center">
                      <Maximize className="w-5 h-5 mr-2 text-turquoise-dark" /> 
                      {property.area.toLocaleString()} sq ft
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Contact Card */}
          <Card className="bg-background/50 p-6 lg:p-8 rounded-xl shadow-md border border-border/50">
            <CardHeader className="p-0 mb-6">
              <CardTitle className="text-xl lg:text-2xl font-semibold text-primary">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="p-0 space-y-4">
              <div className="flex items-center p-3 bg-white/30 rounded-lg">
                <Mail className="w-5 h-5 mr-3 text-turquoise-dark" />
                <span className="text-sm lg:text-base">info@caribbeanluxrealty.com</span>
              </div>
              <div className="flex items-center p-3 bg-white/30 rounded-lg">
                <Phone className="w-5 h-5 mr-3 text-turquoise-dark" />
                <span className="text-sm lg:text-base">+504 123-456-7890</span>
              </div>
              <div className="flex items-center p-3 bg-white/30 rounded-lg">
                <Clock className="w-5 h-5 mr-3 text-turquoise-dark" />
                <span className="text-sm lg:text-base">Available 24/7</span>
              </div>
              <div className="space-y-3 pt-2">
                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-base py-3">
                  <Mail className="w-5 h-5 mr-2" />
                  Contact Agent
                </Button>
                <Button variant="outline" className="w-full text-base py-3">
                  <Phone className="w-5 h-5 mr-2" />
                  Call Now
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Status Card */}
          <Card className="bg-background/50 p-6 lg:p-8 rounded-xl shadow-md border border-border/50">
            <CardHeader className="p-0 mb-6">
              <CardTitle className="text-xl lg:text-2xl font-semibold text-primary">Property Status</CardTitle>
            </CardHeader>
            <CardContent className="p-0 space-y-4">
              <div className="flex items-center justify-between p-3 bg-white/30 rounded-lg">
                <span className="font-medium">Status:</span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Available
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white/30 rounded-lg">
                <span className="font-medium">Listed:</span>
                <span className="text-sm lg:text-base">
                  {property.createdAt ? new Date(property.createdAt).toLocaleDateString() : 'Recently'}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white/30 rounded-lg">
                <span className="font-medium">Views:</span>
                <span className="text-sm lg:text-base">1,247</span>
              </div>
            </CardContent>
          </Card>

          {/* Mobile: Action Buttons */}
          <div className="lg:hidden flex gap-3">
            <Button variant="outline" className="flex-1">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" className="flex-1">
              <Heart className="w-4 h-4 mr-2" />
              Save
            </Button>
          </div>
        </aside>
      </div>

      {/* Enhanced Lightbox Modal */}
      {isLightboxOpen && (
        <div 
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <div className="relative max-w-6xl max-h-full">
            <img  
              alt={`${property.title} - lightbox`} 
              className="max-w-full max-h-full object-contain" 
              src={propertyImages[currentImageIndex]} 
            />
            {propertyImages.length > 1 && (
              <>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={(e) => { e.stopPropagation(); prevImage(); }}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full h-14 w-14 backdrop-blur-sm"
                >
                  <ChevronLeft className="h-7 w-7" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={(e) => { e.stopPropagation(); nextImage(); }}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full h-14 w-14 backdrop-blur-sm"
                >
                  <ChevronRight className="h-7 w-7" />
                </Button>
              </>
            )}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={closeLightbox}
              className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white rounded-full h-12 w-12 backdrop-blur-sm"
            >
              ×
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyDetail;