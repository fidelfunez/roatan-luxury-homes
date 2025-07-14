import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Link } from 'react-router-dom';
import { CalendarDays, UserCircle, ArrowRight, Search, Filter, BookOpen, TrendingUp, Star, MessageSquare, Clock, Eye, Heart, Share2, Tag, PenTool, Home as HomeIconLucide } from 'lucide-react';
import { getBlogPosts } from '@/lib/supabaseUtils';
import { getContentField, getWebsiteContent } from '@/lib/contentUtils';

const Blog = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [content, setContent] = useState({});

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
    // Load website content
    const loadContent = () => {
      const websiteContent = getWebsiteContent();
      setContent(websiteContent);
    };
    
    loadContent();
    
    // Listen for content updates
    const handleContentUpdate = () => {
      loadContent();
    };
    
    window.addEventListener('websiteContentUpdated', handleContentUpdate);
    
    return () => {
      window.removeEventListener('websiteContentUpdated', handleContentUpdate);
    };
  }, []);

  // Helper function to get content with fallback
  const getContent = (page, section, field) => {
    const value = content[page]?.[section]?.[field];
    
    // If the value is empty, null, or undefined, return the default
    if (!value || value.trim() === '') {
      return getContentField(page, section, field);
    }
    
    return value;
  };

  useEffect(() => {
    loadBlogPosts();
  }, []);

  useEffect(() => {
    filterPosts();
  }, [blogPosts, searchTerm, categoryFilter]);

  const loadBlogPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const posts = await getBlogPosts();
      // Only show published posts (published is boolean true/false)
      const publishedPosts = posts.filter(post => post.published === true);
      setBlogPosts(publishedPosts);
    } catch (error) {
      console.error('Error loading blog posts:', error);
      setError('Failed to load blog posts. Please try again later.');
    } finally {
      setLoading(false);
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

    setFilteredPosts(filtered);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="space-y-16 md:space-y-24">
        {/* Enhanced Loading Hero Section */}
        <section className="hero-full-bleed text-center py-16 md:py-20 lg:py-24 relative overflow-hidden rounded-xl bg-gradient-to-br from-purple-400 via-pink-500 to-orange-500" style={{ background: 'linear-gradient(to bottom right, #a855f7, #ec4899, #f97316)' }}>
          <div className="absolute inset-0">
            <img 
              src="/Photos/roatan-island-optimized.jpg" 
              alt="Roatán Island" 
              className="w-full h-full object-cover"
              loading="eager"
              fetchpriority="high"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/50"></div>
          </div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="mb-6">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-white text-sm font-medium mb-4 drop-shadow-md">
                <BookOpen className="w-4 h-4" />
                <span>{getContent('blog', 'hero', 'badge')}</span>
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white drop-shadow-lg mb-4">{getContent('blog', 'hero', 'title')}</h1>
            <p className="text-lg md:text-xl lg:text-2xl text-white/95 max-w-4xl mx-auto mb-8 drop-shadow-md">
              {getContent('blog', 'hero', 'subtitle')}
            </p>
            
            {/* Blog Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {[
                { number: "50+", label: "Articles Published", icon: <PenTool className="w-6 h-6 text-white" /> },
                { number: "10K+", label: "Monthly Readers", icon: <Eye className="w-6 h-6 text-white" /> },
                { number: "15+", label: "Expert Authors", icon: <UserCircle className="w-6 h-6 text-white" /> },
                { number: "8", label: "Categories", icon: <Tag className="w-6 h-6 text-white" /> }
              ].map((stat, index) => (
                <div key={index} className="text-center p-4 bg-white/10 backdrop-blur-sm rounded-xl shadow-md border border-white/20">
                  <div className="flex justify-center mb-2">{stat.icon}</div>
                  <div className="text-2xl md:text-3xl font-bold text-white">{stat.number}</div>
                  <div className="text-sm text-white/80">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="space-y-4">
                  <div className="h-48 bg-gray-200 rounded-xl"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-16 md:space-y-24">
        {/* Enhanced Error Hero Section */}
        <section className="hero-full-bleed text-center py-16 md:py-20 lg:py-24 relative overflow-hidden rounded-xl bg-gradient-to-br from-purple-400 via-pink-500 to-orange-500 min-h-[600px] md:min-h-[700px] lg:min-h-[800px] flex items-center" style={{ background: 'linear-gradient(to bottom right, #a855f7, #ec4899, #f97316)' }}>
          <div className="absolute inset-0">
            <img 
              src="/Photos/roatan-island-optimized.jpg" 
              alt="Roatán Island" 
              className="w-full h-full object-cover"
              loading="eager"
              fetchpriority="high"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/50"></div>
          </div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="mb-6">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-white text-sm font-medium mb-4 drop-shadow-md">
                <BookOpen className="w-4 h-4" />
                <span>{getContent('blog', 'hero', 'badge')}</span>
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white drop-shadow-lg mb-4">{getContent('blog', 'hero', 'title')}</h1>
            <p className="text-lg md:text-xl lg:text-2xl text-white/95 max-w-4xl mx-auto mb-8 drop-shadow-md">
              {getContent('blog', 'hero', 'subtitle')}
            </p>
          </div>
        </section>

        <div className="container mx-auto px-4">
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="text-6xl mb-6">⚠️</div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Error Loading Blog Posts</h3>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button 
                onClick={() => window.location.reload()} 
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              >
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-16 md:space-y-24">
      {/* Enhanced Hero Section */}
      <section className="hero-full-bleed text-center py-16 md:py-20 lg:py-24 relative overflow-hidden rounded-xl bg-gradient-to-br from-purple-400 via-pink-500 to-orange-500 min-h-[600px] md:min-h-[700px] lg:min-h-[800px] flex items-center" style={{ background: 'linear-gradient(to bottom right, #a855f7, #ec4899, #f97316)' }}>
        <div className="absolute inset-0">
          <img 
            src="/Photos/roatan-island-optimized.jpg" 
            alt="Roatán Island" 
            className="w-full h-full object-cover"
            loading="eager"
            fetchpriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/50"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-white text-sm font-medium mb-4 drop-shadow-md">
              <BookOpen className="w-4 h-4" />
              <span>{getContent('blog', 'hero', 'badge')}</span>
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white drop-shadow-lg mb-4">{getContent('blog', 'hero', 'title')}</h1>
          <p className="text-lg md:text-xl lg:text-2xl text-white/95 max-w-4xl mx-auto mb-8 drop-shadow-md">
            {getContent('blog', 'hero', 'subtitle')}
          </p>
          
          {/* Blog Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              { number: "50+", label: "Articles Published", icon: <PenTool className="w-6 h-6 text-white" /> },
              { number: "10K+", label: "Monthly Readers", icon: <Eye className="w-6 h-6 text-white" /> },
              { number: "15+", label: "Expert Authors", icon: <UserCircle className="w-6 h-6 text-white" /> },
              { number: "8", label: "Categories", icon: <Tag className="w-6 h-6 text-white" /> }
            ].map((stat, index) => (
              <div key={index} className="text-center p-4 bg-white/10 backdrop-blur-sm rounded-xl shadow-md border border-white/20 hover:bg-white/15 transition-all duration-300">
                <div className="flex justify-center mb-2">{stat.icon}</div>
                <div className="text-2xl md:text-3xl font-bold text-white">{stat.number}</div>
                <div className="text-sm text-white/80">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4">
        {/* Enhanced Filters */}
        <div className="mb-12">
          <div className="bg-card p-6 rounded-2xl shadow-lg border border-border/50">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Input 
                    placeholder="Search blog posts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-background/70 focus:bg-background"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
              </div>
              
              <div className="flex-1">
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="bg-background/70 focus:bg-background">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* Blog Posts */}
        {filteredPosts.length === 0 ? (
          <div className="text-center py-16">
            <div className="max-w-2xl mx-auto">
              <div className="text-8xl mb-6">📝</div>
              <h3 className="text-2xl font-bold text-foreground mb-4">No Blog Posts Found</h3>
              <p className="text-lg text-muted-foreground mb-8">
                {searchTerm || categoryFilter !== 'all'
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Our team is working on creating valuable content for you. Check back soon for expert insights on Roatán real estate!'
                }
              </p>
              
              {/* Coming Soon Preview */}
              <div className="grid md:grid-cols-3 gap-6 mt-12">
                {[
                  {
                    title: "Complete Guide to Buying Property in Roatán",
                    category: "Buying Process",
                    excerpt: "Everything you need to know about purchasing real estate in paradise, from legal requirements to closing costs.",
                    icon: <HomeIconLucide className="w-8 h-8 text-primary" />
                  },
                  {
                    title: "Investment Opportunities in Caribbean Real Estate",
                    category: "Investment Guide",
                    excerpt: "Discover the best investment strategies for maximizing returns on your Roatán property investment.",
                    icon: <TrendingUp className="w-8 h-8 text-primary" />
                  },
                  {
                    title: "Living the Island Life: A Day in Roatán",
                    category: "Lifestyle",
                    excerpt: "Experience the daily rhythm of island living and what makes Roatán the perfect place to call home.",
                    icon: <Star className="w-8 h-8 text-primary" />
                  }
                ].map((preview, index) => (
                  <div key={index} className="bg-card p-6 rounded-xl shadow-md border border-border/50 hover:shadow-lg transition-all duration-300">
                    <div className="flex justify-center mb-4">
                      <div className="p-3 bg-primary/10 rounded-xl">
                        {preview.icon}
                      </div>
                    </div>
                    <div className="inline-block bg-primary/10 text-primary text-xs px-2 py-1 rounded-full mb-3">
                      {preview.category}
                    </div>
                    <h4 className="text-lg font-semibold mb-2 text-foreground">{preview.title}</h4>
                    <p className="text-sm text-muted-foreground">{preview.excerpt}</p>
                  </div>
                ))}
              </div>
              
              <div className="mt-8">
                <Button asChild size="lg" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                  <Link to="/contact">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Get Notified When We Publish
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {filteredPosts.map((post, index) => (
              <div 
                key={post.id} 
                className="h-full group"
              >
                <Card className="h-full overflow-hidden shadow-lg hover:shadow-xl border border-border/50 transition-all duration-300 hover:-translate-y-1">
                  <CardHeader className="p-0">
                    <div className="relative aspect-w-16 aspect-h-9">
                      <img 
                        src={post.featured_image || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cmVhbCUyMGVzdGF0ZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60"} 
                        alt={post.title}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      <div className="absolute top-4 left-4 flex gap-2">
                        {post.category && (
                          <div className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full font-medium">
                            {post.category}
                          </div>
                        )}
                        {index === 0 && (
                          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                            Featured
                          </div>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                      <CalendarDays className="w-3 h-3" />
                      <span>{formatDate(post.createdAt)}</span>
                      {post.author && (
                        <>
                          <span>•</span>
                          <UserCircle className="w-3 h-3" />
                          <span>{post.author}</span>
                        </>
                      )}
                    </div>
                    
                    <CardTitle className="text-lg sm:text-xl font-semibold mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                      {post.title}
                    </CardTitle>
                    
                    <CardDescription className="text-sm text-muted-foreground line-clamp-3 mb-4">
                      {post.excerpt}
                    </CardDescription>
                    
                    {/* Post Stats */}
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        <span>1.2K views</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="w-3 h-3" />
                        <span>24 likes</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="w-3 h-3" />
                        <span>8 comments</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="p-6 bg-slate-50 dark:bg-slate-800/50 mt-auto">
                    <Button asChild variant="link" className="text-primary p-0 group-hover:underline font-semibold text-sm sm:text-base">
                      <Link to={`/blog/${post.slug}`}>
                        Read More <ArrowRight className="ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Blog;