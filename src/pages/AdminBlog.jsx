import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { optimizeImage, validateImageFile, formatFileSize } from '@/lib/imageUtils';
import { getBlogPosts, addBlogPost, updateBlogPost, deleteBlogPost } from '@/lib/supabaseUtils';
import { 
  FileText, 
  PlusSquare, 
  Edit, 
  Trash2, 
  Search, 
  Eye, 
  Calendar,
  User,
  Tag,
  Clock,
  RefreshCw,
  Download,
  Upload,
  Save,
  X,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  MessageSquare,
  BarChart3,
  Image as ImageIcon,
  UploadCloud
} from 'lucide-react';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const AdminBlog = () => {
  const { toast } = useToast();
  const [blogPosts, setBlogPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedPost, setSelectedPost] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const imageInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    author: 'Bristean Luzey',
    category: '',
    image: '', // Will store optimized base64 string
    status: 'published', // draft, published
    tags: [],
    publishDate: new Date().toISOString().split('T')[0]
  });

  const categories = [
    'Investment Guide',
    'Buying Process', 
    'Lifestyle',
    'Rental Tips',
    'Market News',
    'Property Guide',
    'Caribbean Living',
    'Real Estate Tips'
  ];

  useEffect(() => {
    loadBlogPosts();
  }, []);

  useEffect(() => {
    filterPosts();
  }, [blogPosts, searchTerm, categoryFilter, statusFilter]);

  const loadBlogPosts = async () => {
    try {
      const posts = await getBlogPosts();
      setBlogPosts(posts);
    } catch (error) {
      console.error('Error loading blog posts:', error);
      toast({
        title: "Error loading blog posts",
        description: "Failed to load blog posts from database.",
        variant: "destructive",
      });
    }
  };

  const filterPosts = () => {
    let filtered = [...blogPosts];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(post => 
        post.title?.toLowerCase().includes(term) ||
        post.excerpt?.toLowerCase().includes(term) ||
        post.author?.toLowerCase().includes(term) ||
        post.category?.toLowerCase().includes(term)
      );
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(post => post.category === categoryFilter);
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(post => post.status === statusFilter);
    }

    setFilteredPosts(filtered);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
  };

  const handleTitleChange = (e) => {
    const title = e.target.value;
    setFormData(prev => ({ 
      ...prev, 
      title,
      slug: generateSlug(title)
    }));
  };

  const handleImageUpload = async (e) => {
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

        setFormData(prev => ({ ...prev, image: optimizedResult.dataUrl }));
        setImagePreview(optimizedResult.dataUrl);
        
        // Show optimization feedback
        if (optimizedResult.compressionRatio > 0) {
          toast({
            title: "Blog Image Optimized! 🎉",
            description: `Reduced from ${formatFileSize(optimizedResult.originalSize)} to ${formatFileSize(optimizedResult.optimizedSize)} (${optimizedResult.compressionRatio}% smaller)`,
            variant: "default",
          });
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const postData = {
        title: formData.title,
        content: formData.content,
        excerpt: formData.excerpt,
        author: formData.author,
        featured_image: formData.image,
        published: formData.status === 'published',
        slug: formData.slug,
        created_at: editingPost ? editingPost.created_at : new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      let result;
      if (editingPost) {
        result = await updateBlogPost(editingPost.id, postData);
        toast({
          title: "Blog Post Updated! ✏️",
          description: "The blog post has been successfully updated.",
          variant: "default",
        });
      } else {
        result = await addBlogPost(postData);
        toast({
          title: "Blog Post Created! ✨",
          description: "Your new blog post has been created and published.",
          variant: "default",
        });
      }

      // Reload blog posts to get the updated data
      await loadBlogPosts();
      resetForm();
    } catch (error) {
      console.error('Error saving blog post:', error);
      toast({
        title: "Save Failed ❌",
        description: "Failed to save blog post. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeletePost = async (postId) => {
    const postToDelete = blogPosts.find(post => post.id === postId);
    if (!postToDelete) return;

    const hasImage = postToDelete.featured_image && postToDelete.featured_image.trim() !== '';
    const imageSize = hasImage ? Math.round(postToDelete.featured_image.length * 0.75 / 1024) : 0; // Approximate size in KB

    const confirmMessage = hasImage 
      ? `Are you sure you want to delete "${postToDelete.title}"? This will also remove the associated image (~${imageSize}KB). This action cannot be undone.`
      : `Are you sure you want to delete "${postToDelete.title}"? This action cannot be undone.`;

    if (!window.confirm(confirmMessage)) {
      return;
    }

    setIsProcessing(true);
    try {
      await deleteBlogPost(postId);
      
      // Reload blog posts to get the updated data
      await loadBlogPosts();

      // Log cleanup for transparency
      if (hasImage) {
        console.log(`Blog post "${postToDelete.title}" deleted. Image data (~${imageSize}KB) has been removed from storage.`);
      }

      toast({
        title: "Blog Post Deleted! 🗑️",
        description: hasImage 
          ? `"${postToDelete.title}" and its associated image have been successfully deleted.`
          : `"${postToDelete.title}" has been successfully deleted.`,
        variant: "default",
      });
    } catch (error) {
      console.error('Error deleting blog post:', error);
      toast({
        title: "Delete Failed ❌",
        description: "Failed to delete blog post. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEditPost = (post) => {
    setEditingPost(post);
    setFormData({
      title: post.title || '',
      slug: post.slug || '',
      excerpt: post.excerpt || '',
      content: post.content || '',
      author: post.author || 'Bristean Luzey',
      category: post.category || '',
      image: post.featured_image || '',
      status: post.published ? 'published' : 'draft',
      tags: post.tags || [],
      publishDate: post.publishDate || new Date().toISOString().split('T')[0]
    });
    setImagePreview(post.featured_image || null);
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      author: 'Bristean Luzey',
      category: '',
      image: '',
      status: 'published',
      tags: [],
      publishDate: new Date().toISOString().split('T')[0]
    });
    setEditingPost(null);
    setImagePreview(null);
    setShowForm(false);
  };

  const getStatusColor = (status) => {
    const colors = {
      published: 'bg-green-100 text-green-800 border-green-200',
      draft: 'bg-yellow-100 text-yellow-800 border-yellow-200'
    };
    return colors[status] || colors.draft;
  };

  const getStats = () => {
    const total = blogPosts.length;
    const published = blogPosts.filter(post => post.status === 'published').length;
    const drafts = blogPosts.filter(post => post.status === 'draft').length;
    const categories = new Set(blogPosts.map(post => post.category)).size;

    return { total, published, drafts, categories };
  };

  const stats = getStats();

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
            <h1 className="text-3xl font-bold text-primary mb-2">Blog Management</h1>
            <p className="text-muted-foreground">Create and manage blog posts for the website</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={loadBlogPosts}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button onClick={() => setShowForm(true)}>
              <PlusSquare className="w-4 h-4 mr-2" />
              New Post
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
                <p className="text-sm opacity-90">Total Posts</p>
                <p className="text-3xl font-bold">{stats.total}</p>
              </div>
              <FileText className="w-8 h-8 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Published</p>
                <p className="text-3xl font-bold">{stats.published}</p>
              </div>
              <CheckCircle className="w-8 h-8 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Drafts</p>
                <p className="text-3xl font-bold">{stats.drafts}</p>
              </div>
              <AlertCircle className="w-8 h-8 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Categories</p>
                <p className="text-3xl font-bold">{stats.categories}</p>
              </div>
              <Tag className="w-8 h-8 opacity-80" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Search Posts</label>
              <div className="relative">
                <Input 
                  placeholder="Search by title, excerpt, author, or category..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
            
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Category</label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
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
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Blog Post Form */}
      {showForm && (
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                {editingPost ? 'Edit Blog Post' : 'Create New Blog Post'}
              </CardTitle>
              <Button variant="ghost" onClick={resetForm}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">Title *</label>
                  <Input 
                    name="title"
                    value={formData.title}
                    onChange={handleTitleChange}
                    placeholder="Enter blog post title"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Slug</label>
                  <Input 
                    name="slug"
                    value={formData.slug}
                    onChange={handleFormChange}
                    placeholder="auto-generated-slug"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Author</label>
                  <Input 
                    name="author"
                    value={formData.author}
                    onChange={handleFormChange}
                    placeholder="Bristean Luzey"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Category</label>
                  <Select value={formData.category} onValueChange={(value) => handleSelectChange('category', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Status</label>
                  <Select value={formData.status} onValueChange={(value) => handleSelectChange('status', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Publish Date</label>
                  <Input 
                    name="publishDate"
                    type="date"
                    value={formData.publishDate}
                    onChange={handleFormChange}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="blogImage" className="flex items-center mb-2">
                  <ImageIcon className="w-4 h-4 mr-2 text-primary" />
                  Featured Image
                  {isOptimizing && <span className="ml-2 text-sm text-muted-foreground">(Optimizing...)</span>}
                </Label>
                <Input 
                  id="blogImage" 
                  name="blogImage" 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageUpload}
                  className="mb-2 hidden"
                  ref={imageInputRef}
                  disabled={isOptimizing}
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => imageInputRef.current?.click()} 
                  className="w-full justify-start text-muted-foreground hover:text-primary"
                  disabled={isOptimizing}
                >
                  <UploadCloud className="w-5 h-5 mr-2" /> 
                  {imagePreview ? "Change Featured Image" : "Upload Featured Image"}
                </Button>
                {imagePreview && (
                  <div className="mt-2 relative w-full h-48 border rounded-md overflow-hidden">
                    <img src={imagePreview} alt="Blog preview" className="w-full h-full object-cover" loading="lazy" />
                  </div>
                )}
                <p className="text-xs text-muted-foreground mt-1">This will be the featured image for the blog post. Maximum file size: 10MB</p>
              </div>

              {/* Image Optimization Info */}
              <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1">Automatic Image Optimization</h4>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      Blog images are automatically optimized for web performance. Large files will be compressed and resized to ensure fast loading times.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Excerpt *</label>
                <Textarea 
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleFormChange}
                  placeholder="Brief description of the blog post..."
                  rows={3}
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Content *</label>
                <Textarea 
                  name="content"
                  value={formData.content}
                  onChange={handleFormChange}
                  placeholder="Write your blog post content here..."
                  rows={12}
                  required
                />
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={isProcessing}>
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      {editingPost ? 'Update Post' : 'Create Post'}
                    </>
                  )}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Blog Posts List */}
      <div className="space-y-4">
        {filteredPosts.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Blog Posts Found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || categoryFilter !== 'all' || statusFilter !== 'all'
                  ? 'Try adjusting your search or filter criteria.'
                  : 'No blog posts have been created yet.'
                }
              </p>
              <Button onClick={() => setShowForm(true)}>
                <PlusSquare className="w-4 h-4 mr-2" />
                Create Your First Blog Post
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredPosts.map((post) => (
              <Card key={post.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(post.status)}>
                        {post.status}
                      </Badge>
                      {post.category && (
                        <Badge variant="secondary">{post.category}</Badge>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" asChild>
                        <Link to={`/blog/${post.slug}`}>
                          <Eye className="w-4 h-4" />
                        </Link>
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleEditPost(post)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => handleDeletePost(post.id)}
                        disabled={isProcessing}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <h3 className="font-semibold text-lg text-primary">{post.title}</h3>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {post.author}
                      </p>
                    </div>

                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {post.excerpt}
                    </p>

                    <div className="flex items-center justify-between pt-3 border-t">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        {new Date(post.publishDate || post.createdAt).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {post.status === 'published' ? 'Published' : 'Draft'}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default AdminBlog; 