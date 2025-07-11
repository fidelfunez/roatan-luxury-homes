import React, { useState, useRef } from 'react';
    import { useNavigate } from 'react-router-dom';
    import { motion } from 'framer-motion';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { Textarea } from '@/components/ui/textarea';
    import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
    import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
    import { useToast } from '@/components/ui/use-toast';
    import { addProperty } from '@/lib/propertyUtils';
    import { optimizeImage, optimizeImages, validateImageFile, formatFileSize } from '@/lib/imageUtils';
    import { DollarSign, Type, MapPin as MapPinIcon, BedDouble, Bath, CarFront, Maximize, Info, Image as ImageIcon, ListChecks, CalendarDays, Clock, PlusCircle, Trash2, UploadCloud, AlertCircle } from 'lucide-react';

    const fadeIn = {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    };

    const propertyTypes = ['Villa', 'House', 'Condo', 'Apartment', 'Land', 'Commercial', 'Estate'];

    const AddPropertyPage = () => {
      const navigate = useNavigate();
      const { toast } = useToast();
      const [formData, setFormData] = useState({
        title: '',
        location: '',
        price: '',
        description: '',
        type: '',
        beds: '',
        baths: '',
        parking: '',
        area: '',
        image: '', // Main image (will store Base64 string)
        images: [], // Array for gallery images (will store Base64 strings)
        features: [''], 
        ownershipYears: '',
        timeToAttractions: '',
      });
      const [imagePreviews, setImagePreviews] = useState({ main: null, gallery: [] });
      const [isOptimizing, setIsOptimizing] = useState(false);

      const mainImageInputRef = useRef(null);
      const galleryImageInputRef = useRef(null);

      const handleFileChange = async (e, fieldName, index = null) => {
        const file = e.target.files[0];
        if (file) {
          // Validate file first
          const validation = validateImageFile(file);
          if (!validation.valid) {
            toast({
              title: "Invalid Image",
              description: validation.error,
              variant: "destructive",
            });
            return;
          }

          setIsOptimizing(true);
          
          try {
            const optimizedResult = await optimizeImage(file, {
              maxWidth: 1920,
              maxHeight: 1080,
              quality: 0.8,
              maxFileSize: 1024 * 1024 // 1MB
            });

            if (fieldName === 'image') {
              setFormData(prev => ({ ...prev, image: optimizedResult.dataUrl }));
              setImagePreviews(prev => ({ ...prev, main: optimizedResult.dataUrl }));
              
              // Show optimization feedback
              if (optimizedResult.compressionRatio > 0) {
                toast({
                  title: "Image Optimized! 🎉",
                  description: `Reduced from ${formatFileSize(optimizedResult.originalSize)} to ${formatFileSize(optimizedResult.optimizedSize)} (${optimizedResult.compressionRatio}% smaller)`,
                  variant: "default",
                });
              }
            } else if (fieldName === 'images') {
              const newImages = [...formData.images];
              const newPreviews = [...imagePreviews.gallery];
              if (index !== null) { // replace existing gallery image
                newImages[index] = optimizedResult.dataUrl;
                newPreviews[index] = optimizedResult.dataUrl;
              } else { // add new gallery image
                newImages.push(optimizedResult.dataUrl);
                newPreviews.push(optimizedResult.dataUrl);
              }
              setFormData(prev => ({ ...prev, images: newImages }));
              setImagePreviews(prev => ({ ...prev, gallery: newPreviews }));
              
              // Show optimization feedback for gallery images
              if (optimizedResult.compressionRatio > 0) {
                toast({
                  title: "Gallery Image Optimized! 🎉",
                  description: `Reduced from ${formatFileSize(optimizedResult.originalSize)} to ${formatFileSize(optimizedResult.optimizedSize)} (${optimizedResult.compressionRatio}% smaller)`,
                  variant: "default",
                });
              }
            }
          } catch (error) {
            console.error('Image optimization failed:', error);
            toast({
              title: "Image Processing Error",
              description: "Failed to process image. Please try again with a different file.",
              variant: "destructive",
            });
          } finally {
            setIsOptimizing(false);
          }
        }
      };

      const handleGalleryUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        // Validate all files first
        for (const file of files) {
          const validation = validateImageFile(file);
          if (!validation.valid) {
            toast({
              title: "Invalid Image",
              description: validation.error,
              variant: "destructive",
            });
            return;
          }
        }

        setIsOptimizing(true);

        try {
          const optimizedResults = await optimizeImages(files, {
            maxWidth: 1920,
            maxHeight: 1080,
            quality: 0.8,
            maxFileSize: 1024 * 1024 // 1MB
          });

          const newImages = [...formData.images];
          const newPreviews = [...imagePreviews.gallery];

          optimizedResults.forEach((result, index) => {
            newImages.push(result.dataUrl);
            newPreviews.push(result.dataUrl);
            
            // Show optimization feedback for each image
            if (result.compressionRatio > 0) {
              toast({
                title: `Gallery Image ${index + 1} Optimized! 🎉`,
                description: `Reduced from ${formatFileSize(result.originalSize)} to ${formatFileSize(result.optimizedSize)} (${result.compressionRatio}% smaller)`,
                variant: "default",
              });
            }
          });

          setFormData(prev => ({ ...prev, images: newImages }));
          setImagePreviews(prev => ({ ...prev, gallery: newPreviews }));

        } catch (error) {
          console.error('Gallery image optimization failed:', error);
          toast({
            title: "Image Processing Error",
            description: "Failed to process some images. Please try again.",
            variant: "destructive",
          });
        } finally {
          setIsOptimizing(false);
        }

        e.target.value = null; // Reset file input
      };
      
      const addGalleryImageSlot = () => {
        // This function is now primarily for UI management if needed, actual image adding happens via file input
        // For this version, we allow dynamic adding of file inputs or previews.
        // If we manage a list of file inputs, we could add one here.
        // For simplicity, one file input for gallery images that adds to the array is often used.
      };

      const removeGalleryImage = (index) => {
        const newImages = [...formData.images];
        const newPreviews = [...imagePreviews.gallery];
        newImages.splice(index, 1);
        newPreviews.splice(index, 1);
        setFormData(prev => ({ ...prev, images: newImages }));
        setImagePreviews(prev => ({ ...prev, gallery: newPreviews }));
      };


      const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
      };

      const handleSelectChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
      };

      const handleFeatureChange = (e, index) => {
        const { value } = e.target;
        const list = [...formData.features];
        list[index] = value;
        setFormData(prev => ({ ...prev, features: list }));
      };
    
      const addFeature = () => {
        setFormData(prev => ({ ...prev, features: [...prev.features, ''] }));
      };
    
      const removeFeature = (index) => {
        const list = [...formData.features];
        list.splice(index, 1);
        setFormData(prev => ({ ...prev, features: list }));
      };


      const handleSubmit = (e) => {
        e.preventDefault();
        try {
          const numericFields = ['price', 'beds', 'baths', 'parking', 'area'];
          const processedData = { ...formData };
          numericFields.forEach(field => {
            if (processedData[field] !== '' && processedData[field] !== null && !isNaN(parseFloat(processedData[field]))) {
              processedData[field] = parseFloat(processedData[field]);
            } else if (field === 'price' || field === 'area') { 
                processedData[field] = 0;
            } else {
                processedData[field] = null; 
            }
          });
          
          processedData.features = formData.features.filter(feat => feat.trim() !== '');

          if (!processedData.image && processedData.images.length > 0) {
            processedData.image = processedData.images[0];
          } else if (!processedData.image && processedData.images.length === 0) {
             processedData.image = 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cmVhbCUyMGVzdGF0ZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60';
          }
          if (processedData.images.length === 0 && processedData.image !== 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cmVhbCUyMGVzdGF0ZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60') {
            processedData.images = [processedData.image];
          } else if (processedData.images.length === 0) {
            processedData.images = ['https://images.unsplash.com/photo-1582407947304-fd86f028f716?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cmVhbCUyMGVzdGF0ZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60'];
          }


          addProperty(processedData);
          toast({
            title: "Property Added! 🎉",
            description: `${formData.title} has been successfully listed.`,
            variant: "default",
          });
          navigate('/admin/properties/add');
        } catch (error) {
          console.error("Failed to add property:", error);
          toast({
            title: "Uh oh! Something went wrong.",
            description: "There was a problem saving the property. Please try again.",
            variant: "destructive",
          });
        }
      };

      return (
        <motion.div 
          className="container mx-auto px-4 py-12"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
        >
          <Card className="max-w-3xl mx-auto shadow-2xl">
            <CardHeader className="bg-primary/10 p-6 rounded-t-lg">
              <CardTitle className="text-3xl font-bold text-primary">List a New Property</CardTitle>
              <CardDescription className="text-muted-foreground">Fill in the details below to add a new property to Caribbean Lux Realty.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 md:p-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                
                <section className="space-y-4">
                  <h3 className="text-xl font-semibold text-primary border-b pb-2 mb-4">Basic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="title" className="flex items-center mb-1"><Info className="w-4 h-4 mr-2 text-primary" />Property Title</Label>
                      <Input id="title" name="title" value={formData.title} onChange={handleChange} placeholder="e.g., Stunning Oceanfront Villa" required />
                    </div>
                    <div>
                      <Label htmlFor="location" className="flex items-center mb-1"><MapPinIcon className="w-4 h-4 mr-2 text-primary" />Location</Label>
                      <Input id="location" name="location" value={formData.location} onChange={handleChange} placeholder="e.g., West Bay, Roatán" required />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="description" className="flex items-center mb-1"><Info className="w-4 h-4 mr-2 text-primary" />Description</Label>
                    <Textarea id="description" name="description" value={formData.description} onChange={handleChange} placeholder="Detailed description of the property..." rows={4} required />
                  </div>
                </section>

                <section className="space-y-4">
                  <h3 className="text-xl font-semibold text-primary border-b pb-2 mb-4">Property Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div>
                      <Label htmlFor="price" className="flex items-center mb-1"><DollarSign className="w-4 h-4 mr-2 text-primary" />Price (USD)</Label>
                      <Input id="price" name="price" type="number" value={formData.price} onChange={handleChange} placeholder="e.g., 500000" required />
                    </div>
                    <div>
                      <Label htmlFor="type" className="flex items-center mb-1"><Type className="w-4 h-4 mr-2 text-primary" />Property Type</Label>
                      <Select name="type" onValueChange={(value) => handleSelectChange('type', value)} value={formData.type}>
                        <SelectTrigger id="type"><SelectValue placeholder="Select type" /></SelectTrigger>
                        <SelectContent>
                          {propertyTypes.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                     <div>
                      <Label htmlFor="area" className="flex items-center mb-1"><Maximize className="w-4 h-4 mr-2 text-primary transform rotate-45" />Area (sq ft)</Label>
                      <Input id="area" name="area" type="number" value={formData.area} onChange={handleChange} placeholder="e.g., 2500" />
                    </div>
                  </div>
                  {(formData.type && formData.type !== 'Land' && formData.type !== 'Commercial') && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                       <div>
                        <Label htmlFor="beds" className="flex items-center mb-1"><BedDouble className="w-4 h-4 mr-2 text-primary" />Bedrooms</Label>
                        <Input id="beds" name="beds" type="number" value={formData.beds} onChange={handleChange} placeholder="e.g., 3" />
                      </div>
                      <div>
                        <Label htmlFor="baths" className="flex items-center mb-1"><Bath className="w-4 h-4 mr-2 text-primary" />Bathrooms</Label>
                        <Input id="baths" name="baths" type="number" step="0.5" value={formData.baths} onChange={handleChange} placeholder="e.g., 2.5" />
                      </div>
                      <div>
                        <Label htmlFor="parking" className="flex items-center mb-1"><CarFront className="w-4 h-4 mr-2 text-primary" />Parking Spots</Label>
                        <Input id="parking" name="parking" type="number" value={formData.parking} onChange={handleChange} placeholder="e.g., 2" />
                      </div>
                    </div>
                  )}
                </section>

                <section className="space-y-6">
                  <h3 className="text-xl font-semibold text-primary border-b pb-2 mb-4">Media</h3>
                  
                  {/* Image Optimization Info */}
                  <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1">Automatic Image Optimization</h4>
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                          Images are automatically optimized for web performance. Large files will be compressed and resized to ensure fast loading times.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="mainImageFile" className="flex items-center mb-2">
                      <ImageIcon className="w-4 h-4 mr-2 text-primary" />
                      Main Image
                      {isOptimizing && <span className="ml-2 text-sm text-muted-foreground">(Optimizing...)</span>}
                    </Label>
                    <Input 
                      id="mainImageFile" 
                      name="mainImageFile" 
                      type="file" 
                      accept="image/*" 
                      onChange={(e) => handleFileChange(e, 'image')}
                      className="mb-2 hidden"
                      ref={mainImageInputRef}
                      disabled={isOptimizing}
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => mainImageInputRef.current?.click()} 
                      className="w-full justify-start text-muted-foreground hover:text-primary"
                      disabled={isOptimizing}
                    >
                      <UploadCloud className="w-5 h-5 mr-2" /> 
                      {imagePreviews.main ? "Change Main Image" : "Upload Main Image"}
                    </Button>
                    {imagePreviews.main && (
                      <div className="mt-2 relative w-full h-48 border rounded-md overflow-hidden">
                        <img src={imagePreviews.main} alt="Main preview" className="w-full h-full object-cover" loading="lazy" />
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">This will be the primary display image. Maximum file size: 10MB</p>
                  </div>
                  
                  <div>
                    <Label htmlFor="galleryImageFiles" className="flex items-center mb-2">
                      <ImageIcon className="w-4 h-4 mr-2 text-primary" />
                      Gallery Images
                      {isOptimizing && <span className="ml-2 text-sm text-muted-foreground">(Optimizing...)</span>}
                    </Label>
                    <Input 
                      id="galleryImageFiles" 
                      name="galleryImageFiles" 
                      type="file" 
                      accept="image/*" 
                      multiple 
                      onChange={handleGalleryUpload}
                      className="mb-2 hidden"
                      ref={galleryImageInputRef}
                      disabled={isOptimizing}
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => galleryImageInputRef.current?.click()} 
                      className="w-full justify-start text-muted-foreground hover:text-primary"
                      disabled={isOptimizing}
                    >
                      <UploadCloud className="w-5 h-5 mr-2" /> Add Gallery Images
                    </Button>
                    {imagePreviews.gallery.length > 0 && (
                      <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                        {imagePreviews.gallery.map((previewUrl, index) => (
                          <div key={index} className="relative aspect-square border rounded-md overflow-hidden group">
                            <img src={previewUrl} alt={`Gallery preview ${index + 1}`} className="w-full h-full object-cover" loading="lazy" />
                            <Button 
                              type="button" 
                              variant="destructive" 
                              size="icon" 
                              onClick={() => removeGalleryImage(index)}
                              className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                              disabled={isOptimizing}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">Upload multiple images for the property gallery. Maximum file size: 10MB per image</p>
                  </div>
                </section>

                <section className="space-y-4">
                  <h3 className="text-xl font-semibold text-primary border-b pb-2 mb-4">Features & Additional Info</h3>
                   <div>
                    <Label className="flex items-center mb-1"><ListChecks className="w-4 h-4 mr-2 text-primary" />Key Features</Label>
                    {formData.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2 mb-2">
                        <Input 
                          type="text" 
                          value={feature} 
                          onChange={(e) => handleFeatureChange(e, index)}
                          placeholder={`e.g., Private Pool, Ocean View`}
                        />
                        {(formData.features.length > 1 || feature !== "") && (
                           <Button type="button" variant="ghost" size="icon" onClick={() => removeFeature(index)} className="text-destructive hover:bg-destructive/10">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button type="button" variant="outline" size="sm" onClick={addFeature} className="mt-1 text-primary border-primary hover:bg-primary/10">
                      <PlusCircle className="h-4 w-4 mr-2" /> Add Feature
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="ownershipYears" className="flex items-center mb-1"><CalendarDays className="w-4 h-4 mr-2 text-primary" />Ownership Years (by current owner)</Label>
                      <Input id="ownershipYears" name="ownershipYears" value={formData.ownershipYears} onChange={handleChange} placeholder="e.g., 5 or New Construction" />
                    </div>
                    <div>
                      <Label htmlFor="timeToAttractions" className="flex items-center mb-1"><Clock className="w-4 h-4 mr-2 text-primary" />Time to Main Attractions</Label>
                      <Input id="timeToAttractions" name="timeToAttractions" value={formData.timeToAttractions} onChange={handleChange} placeholder="e.g., 5 mins to beach, 10 mins to town" />
                    </div>
                  </div>
                </section>


                <div className="flex justify-end pt-6">
                  <Button type="submit" size="lg" className="bg-gradient-to-r from-primary to-turquoise-dark hover:from-primary/90 hover:to-turquoise-dark/90 text-lg px-8 py-3">
                    Add Property
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      );
    };

    export default AddPropertyPage;