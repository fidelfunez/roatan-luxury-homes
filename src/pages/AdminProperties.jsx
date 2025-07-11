import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { getProperties, deleteProperty } from '@/lib/propertyUtils';
import { useToast } from '@/components/ui/use-toast';
import { 
  Home, 
  PlusSquare, 
  Edit, 
  Trash2, 
  Search, 
  Filter, 
  Eye, 
  MoreHorizontal,
  DollarSign,
  MapPin,
  BedDouble,
  Bath,
  CarFront,
  Maximize,
  Calendar,
  Users,
  Star,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Download,
  Upload
} from 'lucide-react';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const AdminProperties = () => {
  const { toast } = useToast();
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [propertyType, setPropertyType] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedProperties, setSelectedProperties] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    loadProperties();
  }, []);

  useEffect(() => {
    filterProperties();
  }, [properties, searchTerm, propertyType, statusFilter]);

  const loadProperties = () => {
    const allProperties = getProperties();
    setProperties(allProperties);
  };

  const filterProperties = () => {
    let filtered = [...properties];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(p => 
        p.title?.toLowerCase().includes(term) ||
        p.location?.toLowerCase().includes(term) ||
        p.description?.toLowerCase().includes(term)
      );
    }

    if (propertyType !== 'all') {
      filtered = filtered.filter(p => p.type === propertyType);
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(p => {
        if (statusFilter === 'featured') return p.featured;
        if (statusFilter === 'recent') {
          const createdAt = new Date(p.createdAt || p.id);
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          return createdAt >= weekAgo;
        }
        return true;
      });
    }

    setFilteredProperties(filtered);
  };

  const handleDeleteProperty = async (propertyId) => {
    if (!window.confirm('Are you sure you want to delete this property? This action cannot be undone.')) {
      return;
    }

    setIsProcessing(true);
    try {
      deleteProperty(propertyId);
      loadProperties();
      toast({
        title: "Property Deleted! 🗑️",
        description: "The property has been successfully deleted.",
        variant: "default",
      });
    } catch (error) {
      console.error('Error deleting property:', error);
      toast({
        title: "Delete Failed ❌",
        description: "Failed to delete property. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedProperties.length === 0) {
      toast({
        title: "No Properties Selected ❌",
        description: "Please select properties to delete.",
        variant: "destructive",
      });
      return;
    }

    if (!window.confirm(`Are you sure you want to delete ${selectedProperties.length} properties? This action cannot be undone.`)) {
      return;
    }

    setIsProcessing(true);
    try {
      selectedProperties.forEach(propertyId => {
        deleteProperty(propertyId);
      });
      setSelectedProperties([]);
      loadProperties();
      toast({
        title: "Properties Deleted! 🗑️",
        description: `${selectedProperties.length} properties have been successfully deleted.`,
        variant: "default",
      });
    } catch (error) {
      console.error('Error deleting properties:', error);
      toast({
        title: "Delete Failed ❌",
        description: "Failed to delete properties. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSelectProperty = (propertyId) => {
    setSelectedProperties(prev => 
      prev.includes(propertyId) 
        ? prev.filter(id => id !== propertyId)
        : [...prev, propertyId]
    );
  };

  const handleSelectAll = () => {
    if (selectedProperties.length === filteredProperties.length) {
      setSelectedProperties([]);
    } else {
      setSelectedProperties(filteredProperties.map(p => p.id));
    }
  };

  const exportProperties = () => {
    try {
      const data = {
        properties: filteredProperties,
        exportDate: new Date().toISOString(),
        filters: { searchTerm, propertyType, statusFilter }
      };
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `properties-export-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      
      toast({
        title: "Properties Exported! 📁",
        description: "Property data has been successfully exported.",
        variant: "default",
      });
    } catch (error) {
      console.error('Error exporting properties:', error);
      toast({
        title: "Export Failed ❌",
        description: "Failed to export properties. Please try again.",
        variant: "destructive",
      });
    }
  };

  const formatCurrency = (amount) => {
    if (!amount) return 'N/A';
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`;
    }
    return `$${amount.toLocaleString()}`;
  };

  const getPropertyTypeIcon = (type) => {
    const icons = {
      'Villa': <Home className="w-4 h-4" />,
      'House': <Home className="w-4 h-4" />,
      'Condo': <Home className="w-4 h-4" />,
      'Apartment': <Home className="w-4 h-4" />,
      'Land': <Home className="w-4 h-4" />,
      'Commercial': <Home className="w-4 h-4" />,
      'Estate': <Home className="w-4 h-4" />
    };
    return icons[type] || <Home className="w-4 h-4" />;
  };

  const uniquePropertyTypes = ['all', ...new Set(properties.map(p => p.type).filter(Boolean))];

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
            <h1 className="text-3xl font-bold text-primary mb-2">Manage Properties</h1>
            <p className="text-muted-foreground">Admin control center for all property listings</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={loadProperties}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button onClick={exportProperties}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button asChild>
              <Link to="/admin/properties/add">
                <PlusSquare className="w-4 h-4 mr-2" />
                Add Property
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Total Properties</p>
                <p className="text-3xl font-bold">{properties.length}</p>
              </div>
              <Home className="w-8 h-8 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Total Value</p>
                <p className="text-3xl font-bold">{formatCurrency(properties.reduce((sum, p) => sum + (p.price || 0), 0))}</p>
              </div>
              <DollarSign className="w-8 h-8 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Property Types</p>
                <p className="text-3xl font-bold">{uniquePropertyTypes.length - 1}</p>
              </div>
              <TrendingUp className="w-8 h-8 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Selected</p>
                <p className="text-3xl font-bold">{selectedProperties.length}</p>
              </div>
              <CheckCircle className="w-8 h-8 opacity-80" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Search Properties</label>
              <div className="relative">
                <Input 
                  placeholder="Search by title, location, or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
            
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Property Type</label>
              <Select value={propertyType} onValueChange={setPropertyType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {uniquePropertyTypes.map(type => (
                    <SelectItem key={type} value={type}>{type === 'all' ? 'All Types' : type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Properties</SelectItem>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="recent">Recent (Last 7 days)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedProperties.length > 0 && (
        <Card className="mb-6 border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-orange-600" />
                <span className="font-medium text-orange-800">
                  {selectedProperties.length} property{selectedProperties.length !== 1 ? 'ies' : 'y'} selected
                </span>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedProperties([])}
                  className="text-orange-600 border-orange-200"
                >
                  Clear Selection
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={handleBulkDelete}
                  disabled={isProcessing}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Selected
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Properties List */}
      <div className="space-y-4">
        {filteredProperties.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Properties Found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || propertyType !== 'all' || statusFilter !== 'all'
                  ? 'Try adjusting your search or filter criteria.'
                  : 'No properties have been added yet.'
                }
              </p>
              <Button asChild>
                <Link to="/admin/properties/add">Add Your First Property</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredProperties.map((property) => (
              <Card key={property.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedProperties.includes(property.id)}
                        onChange={() => handleSelectProperty(property.id)}
                        className="rounded border-gray-300"
                      />
                      <div className="flex items-center gap-2">
                        {getPropertyTypeIcon(property.type)}
                        <Badge variant="secondary">{property.type}</Badge>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" asChild>
                        <Link to={`/properties/${property.id}`}>
                          <Eye className="w-4 h-4" />
                        </Link>
                      </Button>
                      <Button size="sm" variant="outline" asChild>
                        <Link to={`/admin/properties/edit/${property.id}`}>
                          <Edit className="w-4 h-4" />
                        </Link>
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => handleDeleteProperty(property.id)}
                        disabled={isProcessing}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <h3 className="font-semibold text-lg text-primary">{property.title}</h3>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {property.location}
                      </p>
                    </div>

                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {property.description}
                    </p>

                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      {property.beds && (
                        <span className="flex items-center gap-1">
                          <BedDouble className="w-4 h-4" />
                          {property.beds} beds
                        </span>
                      )}
                      {property.baths && (
                        <span className="flex items-center gap-1">
                          <Bath className="w-4 h-4" />
                          {property.baths} baths
                        </span>
                      )}
                      {property.parking && (
                        <span className="flex items-center gap-1">
                          <CarFront className="w-4 h-4" />
                          {property.parking} parking
                        </span>
                      )}
                      {property.area && (
                        <span className="flex items-center gap-1">
                          <Maximize className="w-4 h-4" />
                          {property.area} sq ft
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-primary">
                          {formatCurrency(property.price)}
                        </span>
                        {property.featured && (
                          <Badge className="bg-yellow-100 text-yellow-800">
                            <Star className="w-3 h-3 mr-1" />
                            Featured
                          </Badge>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Added {new Date(property.createdAt || property.id).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Select All Button */}
      {filteredProperties.length > 0 && (
        <div className="mt-6 flex justify-center">
          <Button 
            variant="outline" 
            onClick={handleSelectAll}
            className="flex items-center gap-2"
          >
            {selectedProperties.length === filteredProperties.length ? 'Deselect All' : 'Select All'}
          </Button>
        </div>
      )}
    </motion.div>
  );
};

export default AdminProperties; 