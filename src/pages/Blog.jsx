import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Link } from 'react-router-dom';
import { CalendarDays, UserCircle, ArrowRight, Search, Filter } from 'lucide-react';
import { getBlogPosts } from '@/lib/supabaseUtils';

const Blog = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        <section className="text-center py-16 md:py-20 bg-gradient-to-b from-primary/10 via-transparent to-transparent rounded-xl">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-primary mb-4">Roatán Real Estate Insights</h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Stay informed with our latest articles, news, and guides on buying, selling, and living in Roatán.
            </p>
          </div>
        </section>

        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="space-y-4">
                  <div className="h-48 bg-gray-200 rounded"></div>
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
        <section className="text-center py-16 md:py-20 bg-gradient-to-b from-primary/10 via-transparent to-transparent rounded-xl">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-primary mb-4">Roatán Real Estate Insights</h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Stay informed with our latest articles, news, and guides on buying, selling, and living in Roatán.
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
      <section className="text-center py-16 md:py-20 bg-gradient-to-b from-primary/10 via-transparent to-transparent rounded-xl">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-primary mb-4 drop-shadow-sm">Roatán Real Estate Insights</h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto drop-shadow-sm">
            Stay informed with our latest articles, news, and guides on buying, selling, and living in Roatán.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4">
        {/* Filters */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Input 
                  placeholder="Search blog posts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
            
            <div className="flex-1">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
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

        {/* Blog Posts */}
        {filteredPosts.length === 0 ? (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-semibold mb-2">No Blog Posts Found</h3>
              <p className="text-muted-foreground">
                {searchTerm || categoryFilter !== 'all'
                  ? 'Try adjusting your search or filter criteria.'
                  : 'No blog posts have been published yet. Check back soon!'
                }
              </p>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {filteredPosts.map((post, index) => (
              <div 
                key={post.id} 
                className="h-full"
              >
                <Card className="h-full overflow-hidden shadow-md hover:shadow-lg border border-border/50">
                  <CardHeader className="p-0">
                    <div className="aspect-w-16 aspect-h-9">
                      <img 
                        src={post.featured_image || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cmVhbCUyMGVzdGF0ZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60"} 
                        alt={post.title}
                        className="object-cover w-full h-full"
                        loading="lazy"
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
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
                    
                    {post.category && (
                      <div className="inline-block bg-primary/10 text-primary text-xs px-2 py-1 rounded-full mb-3">
                        {post.category}
                      </div>
                    )}
                    
                    <CardTitle className="text-lg sm:text-xl font-semibold mb-2 line-clamp-2">
                      {post.title}
                    </CardTitle>
                    
                    <CardDescription className="text-sm text-muted-foreground line-clamp-3 mb-4">
                      {post.excerpt}
                    </CardDescription>
                  </CardContent>
                  <CardFooter className="p-4 sm:p-6 bg-slate-50 dark:bg-slate-800/50 mt-auto">
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