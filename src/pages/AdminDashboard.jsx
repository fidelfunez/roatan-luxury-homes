import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useAdmin } from '@/context/AdminContext.jsx';
import { getProperties } from '@/lib/propertyUtils';
import { 
  Home, 
  PlusSquare, 
  Edit, 
  Trash2, 
  Users, 
  Settings, 
  LogOut, 
  BarChart3, 
  DollarSign,
  MapPin,
  Calendar,
  TrendingUp,
  Shield,
  MessageSquare,
  Clock,
  CheckCircle,
  XCircle,
  FileText,
  Globe
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: { staggerChildren: 0.1, delayChildren: i * 0.05, duration: 0.5, ease: "easeOut" },
  }),
};

const AdminDashboard = () => {
  const { isAdmin, logout } = useAdmin();
  const { toast } = useToast();
  const [properties, setProperties] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [stats, setStats] = useState({
    totalProperties: 0,
    totalValue: 0,
    averagePrice: 0,
    propertyTypes: {},
    totalSubmissions: 0,
    pendingSubmissions: 0,
    approvedSubmissions: 0,
    rejectedSubmissions: 0
  });

  useEffect(() => {
    const allProperties = getProperties();
    const allSubmissions = JSON.parse(localStorage.getItem('caribbeanLuxRealty_submissions') || '[]');
    
    setProperties(allProperties);
    setSubmissions(allSubmissions);
    
    // Calculate stats
    const totalValue = allProperties.reduce((sum, p) => sum + (p.price || 0), 0);
    const averagePrice = allProperties.length > 0 ? totalValue / allProperties.length : 0;
    const propertyTypes = allProperties.reduce((acc, p) => {
      if (p.type) {
        acc[p.type] = (acc[p.type] || 0) + 1;
      }
      return acc;
    }, {});

    // Calculate submission stats
    const submissionStats = allSubmissions.reduce((acc, sub) => {
      acc.total++;
      acc[sub.status] = (acc[sub.status] || 0) + 1;
      return acc;
    }, { total: 0, pending: 0, approved: 0, rejected: 0 });

    setStats({
      totalProperties: allProperties.length,
      totalValue,
      averagePrice,
      propertyTypes,
      totalSubmissions: submissionStats.total,
      pendingSubmissions: submissionStats.pending,
      approvedSubmissions: submissionStats.approved,
      rejectedSubmissions: submissionStats.rejected
    });
  }, []);

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged Out! 👋",
      description: "You have been successfully logged out of the admin panel.",
      variant: "default",
    });
  };

  const adminActions = [
    {
      title: "Website Editor",
      description: "Edit website content easily",
      icon: <Globe className="w-8 h-8" />,
      href: "/admin/website-editor",
      color: "bg-emerald-500 hover:bg-emerald-600"
    },
    {
      title: "Add New Property",
      description: "Create a new property listing",
      icon: <PlusSquare className="w-8 h-8" />,
      href: "/admin/properties/add",
      color: "bg-green-500 hover:bg-green-600"
    },
    {
      title: "Manage Properties",
      description: "View/Edit all property listings",
      icon: <Edit className="w-8 h-8" />,
      href: "/admin/properties",
      color: "bg-blue-500 hover:bg-blue-600"
    },
    {
      title: "Manage Blog",
      description: "Create and manage blog posts",
      icon: <FileText className="w-8 h-8" />,
      href: "/admin/blog",
      color: "bg-purple-500 hover:bg-purple-600"
    },
    {
      title: "Review Submissions",
      description: "Approve client submissions",
      icon: <MessageSquare className="w-8 h-8" />,
      href: "/admin/submissions",
      color: "bg-yellow-500 hover:bg-yellow-600"
    },
  ];

  const recentProperties = properties.slice(0, 5);

  return (
    <motion.div 
      className="space-y-8"
      initial="hidden"
      animate="visible"
      variants={fadeIn}
    >
      {/* Header */}
      <motion.section 
        className="text-center py-16 md:py-20 bg-gradient-to-b from-primary/10 via-transparent to-transparent rounded-xl"
        variants={fadeIn}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center mb-4">
            <Shield className="w-12 h-12 text-primary mr-4" />
            <motion.h1 variants={fadeIn} className="text-4xl sm:text-5xl font-extrabold text-primary">Admin Dashboard</motion.h1>
          </div>
          <motion.p variants={fadeIn} className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-6">
            Manage your Caribbean luxury real estate portfolio. Add properties, review submissions, and control your website content from one central dashboard.
          </motion.p>
        </div>
      </motion.section>

      {/* Stats Cards */}
      <motion.section 
        className="container mx-auto px-4"
        variants={fadeIn}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Total Properties</p>
                  <p className="text-3xl font-bold">{stats.totalProperties}</p>
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
                  <p className="text-3xl font-bold">${(stats.totalValue / 1000000).toFixed(1)}M</p>
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
                  <p className="text-3xl font-bold">${(stats.averagePrice / 1000).toFixed(0)}K</p>
                </div>
                <TrendingUp className="w-8 h-8 opacity-80" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Property Types</p>
                  <p className="text-3xl font-bold">{Object.keys(stats.propertyTypes).length}</p>
                </div>
                <MapPin className="w-8 h-8 opacity-80" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Submissions Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Total Submissions</p>
                  <p className="text-3xl font-bold">{stats.totalSubmissions}</p>
                </div>
                <MessageSquare className="w-8 h-8 opacity-80" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Pending Review</p>
                  <p className="text-3xl font-bold">{stats.pendingSubmissions}</p>
                </div>
                <Clock className="w-8 h-8 opacity-80" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Approved</p>
                  <p className="text-3xl font-bold">{stats.approvedSubmissions}</p>
                </div>
                <CheckCircle className="w-8 h-8 opacity-80" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Rejected</p>
                  <p className="text-3xl font-bold">{stats.rejectedSubmissions}</p>
                </div>
                <XCircle className="w-8 h-8 opacity-80" />
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.section>

      {/* Quick Actions */}
      <motion.section 
        className="container mx-auto px-4"
        variants={fadeIn}
      >
        <h2 className="text-2xl font-bold text-primary mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {adminActions.map((action, index) => (
            <motion.div key={action.title} custom={index} variants={fadeIn}>
              <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className={`inline-flex p-3 rounded-full text-white mb-4 ${action.color}`}>
                      {action.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-primary mb-2">{action.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{action.description}</p>
                    <Button asChild className="w-full">
                      <Link to={action.href}>{action.title}</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Recent Properties */}
      <motion.section 
        className="container mx-auto px-4"
        variants={fadeIn}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-primary">Recent Properties</h2>
          <Button asChild variant="outline">
            <Link to="/properties">View All Properties</Link>
          </Button>
        </div>
        
        {recentProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentProperties.map((property, index) => (
              <motion.div key={property.id} custom={index} variants={fadeIn}>
                <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                  <CardHeader className="p-0">
                    <div className="aspect-w-16 aspect-h-9">
                      <img 
                        src={property.image || "https://images.unsplash.com/photo-1582407947304-fd86f028f716?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cmVhbCUyMGVzdGF0ZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60"} 
                        alt={property.title || "Property"}
                        className="object-cover w-full h-full rounded-t-lg"
                        loading="lazy"
                        onError={(e) => {
                          e.target.src = "https://images.unsplash.com/photo-1582407947304-fd86f028f716?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cmVhbCUyMGVzdGF0ZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60";
                        }}
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-primary mb-2">{property.title || "Untitled Property"}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{property.location || "Location not specified"}</p>
                    <p className="text-lg font-bold text-primary">
                      ${property.price ? property.price.toLocaleString() : "Price not specified"}
                    </p>
                    <div className="flex gap-2 mt-3">
                      <Button size="sm" variant="outline" asChild>
                        <Link to={`/properties/${property.id}`}>View</Link>
                      </Button>
                      <Button size="sm" variant="outline" asChild>
                        <Link to={`/admin/properties/edit/${property.id}`}>Edit</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <Home className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Properties Yet</h3>
              <p className="text-muted-foreground mb-4">Start by adding your first property listing.</p>
              <Button asChild>
                <Link to="/admin/properties/add">Add Your First Property</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </motion.section>
    </motion.div>
  );
};

export default AdminDashboard; 