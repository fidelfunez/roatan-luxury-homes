import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAdmin } from '@/context/AdminContext.jsx';
import { 
  Home, 
  PlusSquare, 
  Edit, 
  BarChart3, 
  Settings, 
  LogOut, 
  Shield,
  Building2,
  MessageSquare,
  FileText,
  Globe
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const AdminNav = () => {
  const { isAdmin, logout } = useAdmin();
  const { toast } = useToast();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged Out! 👋",
      description: "You have been successfully logged out of the admin panel.",
      variant: "default",
    });
  };

  if (!isAdmin) return null;

  const navItems = [
    {
      title: "Dashboard",
      href: "/admin/dashboard",
      icon: <Home className="w-4 h-4" />
    },
    {
      title: "Website Editor",
      href: "/admin/website-editor",
      icon: <Globe className="w-4 h-4" />
    },
    {
      title: "Add Property",
      href: "/admin/properties/add",
      icon: <PlusSquare className="w-4 h-4" />
    },
    {
      title: "Manage Properties",
      href: "/admin/properties",
      icon: <Edit className="w-4 h-4" />
    },
    {
      title: "Manage Blog",
      href: "/admin/blog",
      icon: <FileText className="w-4 h-4" />
    },
    {
      title: "Submissions",
      href: "/admin/submissions",
      icon: <MessageSquare className="w-4 h-4" />
    },
    {
      title: "Analytics",
      href: "/admin/analytics",
      icon: <BarChart3 className="w-4 h-4" />
    },

  ];

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-primary" />
              <span className="font-semibold text-primary">Admin Panel</span>
            </div>
            
            <nav className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => (
                <Button
                  key={item.href}
                  variant={location.pathname === item.href ? "default" : "ghost"}
                  size="sm"
                  asChild
                  className="text-sm"
                >
                  <Link to={item.href}>
                    {item.icon}
                    <span className="ml-2">{item.title}</span>
                  </Link>
                </Button>
              ))}
            </nav>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="text-destructive hover:text-destructive"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden py-2">
          <div className="flex items-center space-x-2 overflow-x-auto">
            {navItems.map((item) => (
              <Button
                key={item.href}
                variant={location.pathname === item.href ? "default" : "outline"}
                size="sm"
                asChild
                className="text-xs whitespace-nowrap"
              >
                <Link to={item.href}>
                  {item.icon}
                  <span className="ml-1">{item.title}</span>
                </Link>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminNav; 