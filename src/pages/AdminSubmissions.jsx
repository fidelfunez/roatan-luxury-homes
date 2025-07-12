import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { getClientSubmissions, updateClientSubmission, deleteClientSubmission } from '@/lib/supabaseUtils';
import { getDisplayValue } from '@/lib/fieldMappers';
import { useAdmin } from '@/context/AdminContext.jsx';
import { testDatabaseConnection, testRLSPolicies } from '@/lib/testConnection';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Eye, 
  Mail, 
  Phone, 
  MapPin, 
  DollarSign, 
  BedDouble, 
  Bath, 
  CarFront, 
  Maximize, 
  CalendarDays,
  Filter,
  Search,
  RefreshCw,
  AlertCircle,
  Check,
  X,
  MessageSquare,
  Star,
  TrendingUp,
  Users,
  Trash2
} from 'lucide-react';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  approved: 'bg-green-100 text-green-800 border-green-200',
  rejected: 'bg-red-100 text-red-800 border-red-200'
};

const statusIcons = {
  pending: Clock,
  approved: CheckCircle,
  rejected: XCircle
};

const AdminSubmissions = () => {
  const { toast } = useToast();
  const { isAdmin } = useAdmin();
  const [submissions, setSubmissions] = useState([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    loadSubmissions();
  }, []);

  useEffect(() => {
    filterSubmissions();
  }, [submissions, statusFilter, searchTerm]);

  const loadSubmissions = async () => {
    try {
      console.log('Admin status:', isAdmin);
      console.log('=== LOADING SUBMISSIONS ===');
      const submissionsData = await getClientSubmissions();
      console.log('Final submissions data:', submissionsData);
      console.log('Number of submissions:', submissionsData.length);
      console.log('Type of submissionsData:', typeof submissionsData);
      console.log('Is array:', Array.isArray(submissionsData));
      
      if (submissionsData.length > 0) {
        console.log('First submission structure:', submissionsData[0]);
        console.log('First submission keys:', Object.keys(submissionsData[0]));
        console.log('Title field:', submissionsData[0].title);
        console.log('Contact name field:', submissionsData[0].contactName);
      }
      
      setSubmissions(submissionsData);
      console.log('Submissions state set with:', submissionsData.length, 'items');
    } catch (error) {
      console.error('Error loading submissions:', error);
      toast({
        title: "Error loading submissions",
        description: "Failed to load submissions from database.",
        variant: "destructive",
      });
    }
  };

  const filterSubmissions = () => {
    console.log('=== FILTERING SUBMISSIONS ===');
    console.log('Original submissions count:', submissions.length);
    console.log('Status filter:', statusFilter);
    console.log('Search term:', searchTerm);
    
    let filtered = [...submissions];

    if (statusFilter !== 'all') {
      filtered = filtered.filter(sub => (sub.status || 'pending') === statusFilter);
      console.log('After status filter:', filtered.length);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(sub => 
        sub.title?.toLowerCase().includes(term) ||
        sub.location?.toLowerCase().includes(term) ||
        sub.contactName?.toLowerCase().includes(term) ||
        sub.contactEmail?.toLowerCase().includes(term)
      );
      console.log('After search filter:', filtered.length);
    }

    console.log('Final filtered count:', filtered.length);
    setFilteredSubmissions(filtered);
  };

  const handleStatusChange = async (submissionId, newStatus) => {
    setIsProcessing(true);
    
    try {
      console.log('Updating submission:', submissionId, 'to status:', newStatus);
      await updateClientSubmission(submissionId, { 
        status: newStatus, 
        reviewed_at: new Date().toISOString() 
      });

      // Reload submissions to get the updated data
      await loadSubmissions();

      toast({
        title: `Submission ${newStatus === 'approved' ? 'Approved' : 'Rejected'} ✅`,
        description: `The property submission has been ${newStatus === 'approved' ? 'approved' : 'rejected'}.`,
        variant: newStatus === 'approved' ? 'default' : 'destructive',
      });
    } catch (error) {
      console.error('Error updating submission:', error);
      toast({
        title: "Error ❌",
        description: "Failed to update submission status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteSubmission = async (submissionId) => {
    const submissionToDelete = submissions.find(sub => sub.id === submissionId);
    if (!submissionToDelete) return;

    const hasImages = submissionToDelete.image || (submissionToDelete.images && submissionToDelete.images.length > 0);
    const imageSize = hasImages ? Math.round((submissionToDelete.image?.length || 0) * 0.75 / 1024) : 0; // Approximate size in KB

    const confirmMessage = hasImages 
      ? `Are you sure you want to delete "${submissionToDelete.title}"? This will also remove the associated images (~${imageSize}KB). This action cannot be undone.`
      : `Are you sure you want to delete "${submissionToDelete.title}"? This action cannot be undone.`;

    if (!window.confirm(confirmMessage)) {
      return;
    }

    setIsProcessing(true);
    try {
      await deleteClientSubmission(submissionId);
      
      // Reload submissions to get the updated data
      await loadSubmissions();

      // Log cleanup for transparency
      if (hasImages) {
        console.log(`Submission "${submissionToDelete.title}" deleted. Image data (~${imageSize}KB) has been removed from storage.`);
      }

      toast({
        title: "Submission Deleted! 🗑️",
        description: hasImages 
          ? `"${submissionToDelete.title}" and its associated images have been successfully deleted.`
          : `"${submissionToDelete.title}" has been successfully deleted.`,
        variant: "default",
      });
    } catch (error) {
      console.error('Error deleting submission:', error);
      toast({
        title: "Delete Failed ❌",
        description: "Failed to delete submission. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusCounts = () => {
    const counts = { pending: 0, approved: 0, rejected: 0, total: submissions.length };
    submissions.forEach(sub => {
      const status = sub.status || 'pending';
      counts[status] = (counts[status] || 0) + 1;
    });
    return counts;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const statusCounts = getStatusCounts();

  return (
    <motion.div 
      className="container mx-auto px-4 py-8"
      initial="hidden"
      animate="visible"
      variants={fadeIn}
    >
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">Property Submissions</h1>
        <p className="text-muted-foreground">Review and manage client property submissions</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Submissions</p>
                <p className="text-2xl font-bold text-blue-900">{statusCounts.total}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-600">Pending Review</p>
                <p className="text-2xl font-bold text-yellow-900">{statusCounts.pending}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Approved</p>
                <p className="text-2xl font-bold text-green-900">{statusCounts.approved}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-red-50 to-red-100 border-red-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600">Rejected</p>
                <p className="text-2xl font-bold text-red-900">{statusCounts.rejected}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <input
            type="text"
            placeholder="Search submissions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>

        <Button 
          variant="outline" 
          onClick={loadSubmissions}
          className="flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
        
        <Button 
          variant="outline" 
          onClick={async () => {
            console.log('=== RUNNING DATABASE TESTS ===');
            await testDatabaseConnection();
            await testRLSPolicies();
          }}
          className="flex items-center gap-2"
        >
          <AlertCircle className="h-4 w-4" />
          Test Connection
        </Button>
      </div>

      {/* Submissions List */}
      <div className="space-y-4">
        {console.log('Rendering submissions. Count:', filteredSubmissions.length)}
        {filteredSubmissions.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No submissions found</h3>
              <p className="text-muted-foreground">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filter criteria.'
                  : 'No property submissions have been received yet.'
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredSubmissions.map((submission) => {
            // Debug log for each submission
            console.log('Submission object:', submission);
            const StatusIcon = statusIcons[submission.status];
            return (
              <Card key={submission.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Image */}
                    <div className="w-full lg:w-48 h-32 rounded-lg overflow-hidden flex-shrink-0">
                      <img 
                        src={submission.image} 
                        alt={submission.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 space-y-4">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div>
                          <h3 className="text-xl font-semibold text-primary mb-2">{submission.title}</h3>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                            <span className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {getDisplayValue(submission, 'location', 'Location not specified')}
                            </span>
                            <span className="flex items-center gap-1">
                              <DollarSign className="h-4 w-4" />
                              {getDisplayValue(submission, 'price', 'Price not specified')}
                            </span>
                          </div>
                        </div>
                        
                                                 <div className="flex items-center gap-2">
                           <Badge className={`${statusColors[submission.status || 'pending']} flex items-center gap-1`}>
                             <StatusIcon className="h-3 w-3" />
                             {(submission.status || 'pending').charAt(0).toUpperCase() + (submission.status || 'pending').slice(1)}
                           </Badge>
                         </div>
                      </div>

                      {/* Property Details */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        {submission.beds && (
                          <span className="flex items-center gap-1">
                            <BedDouble className="h-4 w-4 text-primary" />
                            {getDisplayValue(submission, 'beds')} beds
                          </span>
                        )}
                        {submission.baths && (
                          <span className="flex items-center gap-1">
                            <Bath className="h-4 w-4 text-primary" />
                            {getDisplayValue(submission, 'baths')} baths
                          </span>
                        )}
                        {submission.parking && (
                          <span className="flex items-center gap-1">
                            <CarFront className="h-4 w-4 text-primary" />
                            {getDisplayValue(submission, 'parking')} parking
                          </span>
                        )}
                        {submission.area && (
                          <span className="flex items-center gap-1">
                            <Maximize className="h-4 w-4 text-primary" />
                            {getDisplayValue(submission, 'area')} sq ft
                          </span>
                        )}
                      </div>

                      {/* Contact Info */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <span className="flex items-center gap-1">
                          <Mail className="h-4 w-4 text-primary" />
                          {getDisplayValue(submission, 'contactEmail', getDisplayValue(submission, 'email', 'Email not provided'))}
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="h-4 w-4 text-primary" />
                          {getDisplayValue(submission, 'contactPhone', getDisplayValue(submission, 'phone', 'Phone not provided'))}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4 text-primary" />
                          {getDisplayValue(submission, 'contactName', getDisplayValue(submission, 'name', 'Contact name not provided'))}
                        </span>
                      </div>

                      {/* Submission Date */}
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <CalendarDays className="h-4 w-4" />
                        Submitted: {formatDate(submission.createdAt || submission.created_at)}
                      </div>

                                             {/* Actions */}
                       {(submission.status || 'pending') === 'pending' && (
                        <div className="flex gap-2 pt-4 border-t">
                          <Button 
                            onClick={() => handleStatusChange(submission.id, 'approved')}
                            disabled={isProcessing}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <Check className="h-4 w-4 mr-2" />
                            Approve
                          </Button>
                          <Button 
                            onClick={() => handleStatusChange(submission.id, 'rejected')}
                            disabled={isProcessing}
                            variant="destructive"
                          >
                            <X className="h-4 w-4 mr-2" />
                            Reject
                          </Button>
                          <Button 
                            variant="outline"
                            onClick={() => setSelectedSubmission(submission)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                          <Button 
                            variant="outline"
                            onClick={() => handleDeleteSubmission(submission.id)}
                            disabled={isProcessing}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </Button>
                        </div>
                      )}

                                             {(submission.status || 'pending') !== 'pending' && (
                        <div className="flex gap-2 pt-4 border-t">
                          <Button 
                            variant="outline"
                            onClick={() => setSelectedSubmission(submission)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                          {(submission.status || 'pending') === 'approved' && (
                            <Button variant="outline" className="text-green-600">
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Added to Listings
                            </Button>
                          )}
                          <Button 
                            variant="outline"
                            onClick={() => handleDeleteSubmission(submission.id)}
                            disabled={isProcessing}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Submission Detail Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div 
            className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Submission Details</CardTitle>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setSelectedSubmission(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Images */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Images</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {selectedSubmission.images?.map((img, index) => (
                        <div key={index} className="aspect-square rounded-lg overflow-hidden">
                          <img src={img} alt={`Property ${index + 1}`} className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Property Information</h3>
                      <p className="text-sm text-muted-foreground mb-4">{selectedSubmission.description}</p>
                      
                      {selectedSubmission.features?.length > 0 && (
                        <div className="mb-4">
                          <h4 className="font-medium mb-2">Features:</h4>
                          <div className="flex flex-wrap gap-2">
                            {selectedSubmission.features.map((feature, index) => (
                              <Badge key={index} variant="secondary">{feature}</Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div>
                      <h3 className="font-semibold text-lg mb-2">Contact Information</h3>
                      <div className="space-y-2 text-sm">
                        <p><strong>Name:</strong> {getDisplayValue(selectedSubmission, 'contactName', getDisplayValue(selectedSubmission, 'name', 'Not provided'))}</p>
                        <p><strong>Email:</strong> {getDisplayValue(selectedSubmission, 'contactEmail', getDisplayValue(selectedSubmission, 'email', 'Not provided'))}</p>
                        <p><strong>Phone:</strong> {getDisplayValue(selectedSubmission, 'contactPhone', getDisplayValue(selectedSubmission, 'phone', 'Not provided'))}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default AdminSubmissions; 