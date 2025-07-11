import React, { useState, useEffect, useRef } from 'react';
    import { useNavigate, useParams } from 'react-router-dom';
    import { motion } from 'framer-motion';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { Textarea } from '@/components/ui/textarea';
    import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
    import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
    import { useToast } from '@/components/ui/use-toast';
    import { getPropertyById, updateProperty } from '@/lib/propertyUtils';
    import { DollarSign, Type, MapPin as MapPinIcon, BedDouble, Bath, CarFront, Maximize, Info, Image as ImageIcon, ListChecks, CalendarDays, Clock, PlusCircle, Trash2, UploadCloud, Save } from 'lucide-react';

    const fadeIn = {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    };

    const propertyTypes = ['Villa', 'House', 'Condo', 'Apartment', 'Land', 'Commercial', 'Estate'];

    const EditPropertyPage = () => {
      const { propertyId } = useParams();
      const navigate = useNavigate();
      const { toast } = useToast();
      const [formData, setFormData] = useState(null);
      const [imagePreviews, setImagePreviews] = useState({ main: null, gallery: [] });

      const mainImageInputRef = useRef(null);
      const galleryImageInputRef = useRef(null);

      useEffect(() => {
        const propertyToEdit = getPropertyById(propertyId);
        if (propertyToEdit) {
          const features = propertyToEdit.features ? (Array.isArray(propertyToEdit.features) ? propertyToEdit.features : [propertyToEdit.features]) : [''];
          setFormData({
            ...propertyToEdit,
            features: features.length > 0 ? features : [''],
            beds: propertyToEdit.beds ?? '',
            baths: propertyToEdit.baths ?? '',
            parking: propertyToEdit.parking ?? '',
            area: propertyToEdit.area ?? '',
            ownershipYears: propertyToEdit.ownershipYears ?? '',
            timeToAttractions: propertyToEdit.timeToAttractions ?? '',
          });
          setImagePreviews({
            main: propertyToEdit.image || null,
            gallery: propertyToEdit.images || [],
          });
        } else {
          toast({
            title: "Property not found!",
            description: "Could not find the property you're trying to edit.",
            variant: "destructive",
          });
          navigate(`/properties/${propertyId}`);
        }
      }, [propertyId, navigate, toast]);

      const handleFileChange = (e, fieldName) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
            const result = reader.result;
            if (fieldName === 'image') {
              setFormData(prev => ({ ...prev, image: result }));
              setImagePreviews(prev => ({ ...prev, main: result }));
            }
          };
          reader.readAsDataURL(file);
        }
      };

      const handleGalleryFileChange = (e) => {
        const files = Array.from(e.target.files);
        files.forEach(file => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const result = reader.result;
            setFormData(prev => ({ ...prev, images: [...prev.images, result] }));
            setImagePreviews(prev => ({ ...prev, gallery: [...prev.gallery, result] }));
          };
          reader.readAsDataURL(file);
        });
        e.target.value = null; // Reset file input
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

          updateProperty(propertyId, processedData);
          toast({
            title: "Property Updated! ✨",
            description: `${formData.title} has been successfully updated.`,
            variant: "default",
          });
          navigate(`/properties/${propertyId}`);
        } catch (error) {
          console.error("Failed to update property:", error);
          toast({
            title: "Uh oh! Something went wrong.",
            description: "There was a problem saving the property. Please try again.",
            variant: "destructive",
          });
        }
      };

      if (!formData) {
        return (
          <div className="flex justify-center items-center h-screen bg-background">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
          </div>
        );
      }

      return (
        <motion.div 
          className="container mx-auto px-4 py-12"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
        >
          <Card className="max-w-3xl mx-auto shadow-2xl">
            <CardHeader className="bg-primary/10 p-6 rounded-t-lg">
              <CardTitle className="text-3xl font-bold text-primary">Edit Property</CardTitle>
              <CardDescription className="text-muted-foreground">Update the details for "{formData.title}".</CardDescription>
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
                  <div>
                    <Label htmlFor="mainImageFile" className="flex items-center mb-2"><ImageIcon className="w-4 h-4 mr-2 text-primary" />Main Image</Label>
                    <Input 
                      id="mainImageFile" 
                      name="mainImageFile" 
                      type="file" 
                      accept="image/*" 
                      onChange={(e) => handleFileChange(e, 'image')}
                      className="mb-2 hidden"
                      ref={mainImageInputRef}
                    />
                    <Button type="button" variant="outline" onClick={() => mainImageInputRef.current?.click()} className="w-full justify-start text-muted-foreground hover:text-primary">
                      <UploadCloud className="w-5 h-5 mr-2" /> {imagePreviews.main ? "Change Main Image" : "Upload Main Image"}
                    </Button>
                    {imagePreviews.main && (
                      <div className="mt-2 relative w-full h-48 border rounded-md overflow-hidden">
                        <img  src={imagePreviews.main} alt="Main preview" className="w-full h-full object-cover" loading="lazy" />
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">This will be the primary display image.</p>
                  </div>
                  
                  <div>
                    <Label htmlFor="galleryImageFiles" className="flex items-center mb-2"><ImageIcon className="w-4 h-4 mr-2 text-primary" />Gallery Images</Label>
                    <Input 
                      id="galleryImageFiles" 
                      name="galleryImageFiles" 
                      type="file" 
                      accept="image/*" 
                      multiple 
                      onChange={handleGalleryFileChange}
                      className="mb-2 hidden"
                      ref={galleryImageInputRef}
                    />
                     <Button type="button" variant="outline" onClick={() => galleryImageInputRef.current?.click()} className="w-full justify-start text-muted-foreground hover:text-primary">
                      <UploadCloud className="w-5 h-5 mr-2" /> Add Gallery Images
                    </Button>
                    {imagePreviews.gallery.length > 0 && (
                      <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                        {imagePreviews.gallery.map((previewUrl, index) => (
                          <div key={index} className="relative aspect-square border rounded-md overflow-hidden group">
                            <img  src={previewUrl} alt={`Gallery preview ${index + 1}`} className="w-full h-full object-cover" loading="lazy" />
                            <Button 
                              type="button" 
                              variant="destructive" 
                              size="icon" 
                              onClick={() => removeGalleryImage(index)}
                              className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">Upload multiple images for the property gallery.</p>
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
                    <Save className="w-5 h-5 mr-2" /> Save Changes
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      );
    };

    export default EditPropertyPage;