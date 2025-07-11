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
import { DollarSign, Type, MapPin as MapPinIcon, BedDouble, Bath, CarFront, Maximize, Info, Image as ImageIcon, ListChecks, CalendarDays, Clock, PlusCircle, Trash2, UploadCloud, Send } from 'lucide-react';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const propertyTypes = ['Villa', 'House', 'Condo', 'Apartment', 'Land', 'Commercial', 'Estate'];

const ClientPropertySubmission = () => {
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
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    image: '', // Main image (will store Base64 string)
    images: [], // Array for gallery images (will store Base64 strings)
    features: [''], 
    ownershipYears: '',
    timeToAttractions: '',
    status: 'pending' // pending, approved, rejected
  });
  const [imagePreviews, setImagePreviews] = useState({ main: null, gallery: [] });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const mainImageInputRef = useRef(null);
  const galleryImageInputRef = useRef(null);

  const handleFileChange = (e, fieldName, index = null) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (fieldName === 'image') {
          setFormData(prev => ({ ...prev, image: reader.result }));
          setImagePreviews(prev => ({ ...prev, main: reader.result }));
        } else if (fieldName === 'images') {
          const newImages = [...formData.images];
          const newPreviews = [...imagePreviews.gallery];
          if (index !== null) { // replace existing gallery image
            newImages[index] = reader.result;
            newPreviews[index] = reader.result;
          } else { // add new gallery image
            newImages.push(reader.result);
            newPreviews.push(reader.result);
          }
          setFormData(prev => ({ ...prev, images: newImages }));
          setImagePreviews(prev => ({ ...prev, gallery: newPreviews }));
        }
      };
      reader.readAsDataURL(file);
    }
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
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
      processedData.submissionDate = new Date().toISOString();

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

      // Save to localStorage for admin review
      const submissions = JSON.parse(localStorage.getItem('caribbeanLuxRealty_submissions') || '[]');
      const newSubmission = {
        ...processedData,
        id: Date.now(),
        status: 'pending',
        submissionDate: new Date().toISOString()
      };
      submissions.push(newSubmission);
      localStorage.setItem('caribbeanLuxRealty_submissions', JSON.stringify(submissions));

      toast({
        title: "Submission Sent! 📝",
        description: "Thank you for your property submission. Our team will review it within 24 hours and contact you with the results.",
        variant: "default",
      });
      
      navigate('/properties');
    } catch (error) {
      console.error("Failed to submit property:", error);
      toast({
        title: "Submission Failed ❌",
        description: "There was a problem submitting your property. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div 
      className="container mx-auto px-4 py-6"
      style={{ overflow: 'visible', position: 'static' }}
      initial="hidden"
      animate="visible"
      variants={fadeIn}
    >
      <Card className="max-w-4xl mx-auto shadow-2xl">
        <CardHeader className="bg-primary/10 p-6 rounded-t-lg">
          <CardTitle className="text-3xl font-bold text-primary">Submit Your Property</CardTitle>
          <CardDescription className="text-muted-foreground">
            Fill in the details below to submit your property for review. Our team will contact you within 24 hours.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Contact Information */}
            <section className="space-y-4">
              <h3 className="text-xl font-semibold text-primary border-b pb-2 mb-4">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <Label htmlFor="contactName" className="flex items-center mb-1"><Info className="w-4 h-4 mr-2 text-primary" />Your Name</Label>
                  <Input id="contactName" name="contactName" value={formData.contactName} onChange={handleChange} placeholder="John Doe" required />
                </div>
                <div>
                  <Label htmlFor="contactEmail" className="flex items-center mb-1"><Info className="w-4 h-4 mr-2 text-primary" />Email Address</Label>
                  <Input id="contactEmail" name="contactEmail" type="email" value={formData.contactEmail} onChange={handleChange} placeholder="john@example.com" required />
                </div>
                <div>
                  <Label htmlFor="contactPhone" className="flex items-center mb-1"><Info className="w-4 h-4 mr-2 text-primary" />Phone Number</Label>
                  <Input id="contactPhone" name="contactPhone" value={formData.contactPhone} onChange={handleChange} placeholder="+1 (555) 123-4567" required />
                </div>
              </div>
            </section>

            {/* Basic Information */}
            <section className="space-y-4">
              <h3 className="text-xl font-semibold text-primary border-b pb-2 mb-4">Property Information</h3>
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

            {/* Property Details */}
            <section className="space-y-4">
              <h3 className="text-xl font-semibold text-primary border-b pb-2 mb-4">Property Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <Label htmlFor="price" className="flex items-center mb-1"><DollarSign className="w-4 h-4 mr-2 text-primary" />Price (USD)</Label>
                  <Input id="price" name="price" type="number" value={formData.price} onChange={handleChange} placeholder="e.g., 500000" required />
                </div>
                <div>
                  <Label htmlFor="type" className="flex items-center mb-1"><Type className="w-4 h-4 mr-2 text-primary" />Property Type</Label>
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    required
                    className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="" disabled>Select property type</option>
                    {propertyTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="area" className="flex items-center mb-1"><Maximize className="w-4 h-4 mr-2 text-primary" />Area (sq ft)</Label>
                  <Input id="area" name="area" type="number" value={formData.area} onChange={handleChange} placeholder="e.g., 2500" />
                </div>
                <div>
                  <Label htmlFor="beds" className="flex items-center mb-1"><BedDouble className="w-4 h-4 mr-2 text-primary" />Bedrooms</Label>
                  <Input id="beds" name="beds" type="number" value={formData.beds} onChange={handleChange} placeholder="e.g., 3" />
                </div>
                <div>
                  <Label htmlFor="baths" className="flex items-center mb-1"><Bath className="w-4 h-4 mr-2 text-primary" />Bathrooms</Label>
                  <Input id="baths" name="baths" type="number" value={formData.baths} onChange={handleChange} placeholder="e.g., 2" />
                </div>
                <div>
                  <Label htmlFor="parking" className="flex items-center mb-1"><CarFront className="w-4 h-4 mr-2 text-primary" />Parking Spaces</Label>
                  <Input id="parking" name="parking" type="number" value={formData.parking} onChange={handleChange} placeholder="e.g., 2" />
                </div>
              </div>
            </section>

            {/* Images */}
            <section className="space-y-4">
              <h3 className="text-xl font-semibold text-primary border-b pb-2 mb-4">Property Images</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="mainImage" className="flex items-center mb-1"><ImageIcon className="w-4 h-4 mr-2 text-primary" />Main Image</Label>
                  <Input 
                    id="mainImage" 
                    type="file" 
                    accept="image/*" 
                    onChange={(e) => handleFileChange(e, 'image')} 
                    ref={mainImageInputRef}
                    className="cursor-pointer"
                  />
                  {imagePreviews.main && (
                    <div className="mt-2 relative w-full h-48 border rounded-md overflow-hidden">
                      <img src={imagePreviews.main} alt="Main preview" className="w-full h-full object-cover" loading="lazy" />
                    </div>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="galleryImages" className="flex items-center mb-1"><ImageIcon className="w-4 h-4 mr-2 text-primary" />Gallery Images (Optional)</Label>
                  <Input 
                    id="galleryImages" 
                    type="file" 
                    accept="image/*" 
                    multiple 
                    onChange={(e) => {
                      Array.from(e.target.files).forEach(file => {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setFormData(prev => ({ ...prev, images: [...prev.images, reader.result] }));
                          setImagePreviews(prev => ({ ...prev, gallery: [...prev.gallery, reader.result] }));
                        };
                        reader.readAsDataURL(file);
                      });
                    }}
                    ref={galleryImageInputRef}
                    className="cursor-pointer"
                  />
                  {imagePreviews.gallery.length > 0 && (
                    <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-2">
                      {imagePreviews.gallery.map((previewUrl, index) => (
                        <div key={index} className="relative aspect-square border rounded-md overflow-hidden group">
                          <img src={previewUrl} alt={`Gallery preview ${index + 1}`} className="w-full h-full object-cover" loading="lazy" />
                          <Button 
                            type="button" 
                            size="sm" 
                            variant="destructive" 
                            className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removeGalleryImage(index)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* Features */}
            <section className="space-y-4">
              <h3 className="text-xl font-semibold text-primary border-b pb-2 mb-4">Property Features</h3>
              <div className="space-y-3">
                {formData.features.map((feature, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={feature}
                      onChange={(e) => handleFeatureChange(e, index)}
                      placeholder={`Feature ${index + 1} (e.g., Ocean View, Pool, etc.)`}
                      className="flex-1"
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={() => removeFeature(index)}
                      disabled={formData.features.length === 1}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={addFeature} className="w-full">
                  <PlusCircle className="w-4 h-4 mr-2" /> Add Feature
                </Button>
              </div>
            </section>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4 pt-6 border-t">
              <Button type="button" variant="outline" onClick={() => navigate('/properties')}>
                Cancel
              </Button>
              <Button type="submit" size="lg" disabled={isSubmitting} className="bg-gradient-to-r from-primary to-turquoise-dark hover:from-primary/90 hover:to-turquoise-dark/90 text-primary-foreground transform hover:scale-105 transition-transform duration-200 shadow-lg">
                {isSubmitting ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-transparent border-t-white rounded-full mr-2"
                    />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Submit Property
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ClientPropertySubmission; 