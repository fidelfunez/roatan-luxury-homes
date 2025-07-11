import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getProperties } from '@/lib/propertyUtils';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  MapPin, 
  Calendar, 
  Eye, 
  Users,
  Home,
  Building2,
  Car,
  TreePalm,
  Download,
  Filter,
  RefreshCw,
  Target,
  Award,
  Clock,
  Star
} from 'lucide-react';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const AdminAnalytics = () => {
  const [properties, setProperties] = useState([]);
  const [timeRange, setTimeRange] = useState('all');
  const [propertyType, setPropertyType] = useState('all');
  const [analytics, setAnalytics] = useState({
    totalProperties: 0,
    totalValue: 0,
    averagePrice: 0,
    priceRange: { min: 0, max: 0 },
    propertyTypes: {},
    locationStats: {},
    monthlyTrends: {},
    topPerformers: [],
    recentActivity: []
  });

  useEffect(() => {
    loadAnalytics();
  }, [timeRange, propertyType]);

  const loadAnalytics = () => {
    const allProperties = getProperties();
    let filteredProperties = [...allProperties];

    // Apply filters
    if (timeRange !== 'all') {
      const now = new Date();
      const monthsAgo = new Date();
      monthsAgo.setMonth(now.getMonth() - parseInt(timeRange));
      
      filteredProperties = filteredProperties.filter(property => {
        const createdAt = new Date(property.createdAt || property.id);
        return createdAt >= monthsAgo;
      });
    }

    if (propertyType !== 'all') {
      filteredProperties = filteredProperties.filter(property => property.type === propertyType);
    }

    setProperties(filteredProperties);
    calculateAnalytics(filteredProperties);
  };

  const calculateAnalytics = (props) => {
    const totalValue = props.reduce((sum, p) => sum + (p.price || 0), 0);
    const averagePrice = props.length > 0 ? totalValue / props.length : 0;
    const prices = props.map(p => p.price || 0).filter(p => p > 0);
    const priceRange = {
      min: prices.length > 0 ? Math.min(...prices) : 0,
      max: prices.length > 0 ? Math.max(...prices) : 0
    };

    // Property types distribution
    const propertyTypes = props.reduce((acc, p) => {
      if (p.type) {
        acc[p.type] = (acc[p.type] || 0) + 1;
      }
      return acc;
    }, {});

    // Location statistics
    const locationStats = props.reduce((acc, p) => {
      if (p.location) {
        acc[p.location] = (acc[p.location] || 0) + 1;
      }
      return acc;
    }, {});

    // Monthly trends (last 6 months)
    const monthlyTrends = {};
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = month.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      monthlyTrends[monthKey] = 0;
    }

    props.forEach(property => {
      const createdAt = new Date(property.createdAt || property.id);
      const monthKey = createdAt.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      if (monthlyTrends[monthKey] !== undefined) {
        monthlyTrends[monthKey]++;
      }
    });

    // Top performers (by price)
    const topPerformers = props
      .filter(p => p.price && p.price > 0)
      .sort((a, b) => b.price - a.price)
      .slice(0, 5);

    // Recent activity (last 10 properties)
    const recentActivity = props
      .sort((a, b) => new Date(b.createdAt || b.id) - new Date(a.createdAt || a.id))
      .slice(0, 10);

    setAnalytics({
      totalProperties: props.length,
      totalValue,
      averagePrice,
      priceRange,
      propertyTypes,
      locationStats,
      monthlyTrends,
      topPerformers,
      recentActivity
    });
  };

  const formatCurrency = (amount) => {
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
      'House': <Building2 className="w-4 h-4" />,
      'Condo': <Building2 className="w-4 h-4" />,
      'Apartment': <Building2 className="w-4 h-4" />,
      'Land': <TreePalm className="w-4 h-4" />,
      'Commercial': <Building2 className="w-4 h-4" />,
      'Estate': <Home className="w-4 h-4" />
    };
    return icons[type] || <Home className="w-4 h-4" />;
  };

  const exportAnalytics = () => {
    const data = {
      analytics,
      filters: { timeRange, propertyType },
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `property-analytics-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
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
            <h1 className="text-3xl font-bold text-primary mb-2">Property Analytics</h1>
            <p className="text-muted-foreground">Comprehensive insights into your property portfolio</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={loadAnalytics}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button onClick={exportAnalytics}>
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Time Range</label>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="1">Last Month</SelectItem>
                  <SelectItem value="3">Last 3 Months</SelectItem>
                  <SelectItem value="6">Last 6 Months</SelectItem>
                  <SelectItem value="12">Last Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Property Type</label>
              <Select value={propertyType} onValueChange={setPropertyType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Villa">Villa</SelectItem>
                  <SelectItem value="House">House</SelectItem>
                  <SelectItem value="Condo">Condo</SelectItem>
                  <SelectItem value="Apartment">Apartment</SelectItem>
                  <SelectItem value="Land">Land</SelectItem>
                  <SelectItem value="Commercial">Commercial</SelectItem>
                  <SelectItem value="Estate">Estate</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Total Properties</p>
                <p className="text-3xl font-bold">{analytics.totalProperties}</p>
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
                <p className="text-3xl font-bold">{formatCurrency(analytics.totalValue)}</p>
              </div>
              <DollarSign className="w-8 h-8 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Average Price</p>
                <p className="text-3xl font-bold">{formatCurrency(analytics.averagePrice)}</p>
              </div>
              <TrendingUp className="w-8 h-8 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Price Range</p>
                <p className="text-lg font-bold">{formatCurrency(analytics.priceRange.min)} - {formatCurrency(analytics.priceRange.max)}</p>
              </div>
              <Target className="w-8 h-8 opacity-80" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Property Types Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Property Types Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(analytics.propertyTypes).map(([type, count]) => (
                <div key={type} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getPropertyTypeIcon(type)}
                    <span className="font-medium">{type}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{ width: `${(count / analytics.totalProperties) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-muted-foreground w-8 text-right">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Locations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Top Locations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(analytics.locationStats)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 5)
                .map(([location, count]) => (
                <div key={location} className="flex items-center justify-between">
                  <span className="font-medium">{location}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{ width: `${(count / analytics.totalProperties) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-muted-foreground w-8 text-right">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Trends */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Monthly Property Additions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            {Object.entries(analytics.monthlyTrends).map(([month, count]) => (
              <div key={month} className="text-center">
                <div className="text-sm text-muted-foreground mb-1">{month}</div>
                <div className="text-2xl font-bold text-primary">{count}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top Performers */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5" />
            Top Performing Properties (by Price)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.topPerformers.map((property, index) => (
              <div key={property.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="font-semibold">{property.title}</h4>
                    <p className="text-sm text-muted-foreground">{property.location}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-primary">{formatCurrency(property.price)}</p>
                  <p className="text-sm text-muted-foreground">{property.type}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.recentActivity.map((property) => (
              <div key={property.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                    {getPropertyTypeIcon(property.type)}
                  </div>
                  <div>
                    <h4 className="font-semibold">{property.title}</h4>
                    <p className="text-sm text-muted-foreground">{property.location}</p>
                    <p className="text-xs text-muted-foreground">
                      Added {new Date(property.createdAt || property.id).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-primary">{formatCurrency(property.price)}</p>
                  <p className="text-sm text-muted-foreground">{property.type}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AdminAnalytics; 