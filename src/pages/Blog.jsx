import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';
import { CalendarDays, UserCircle, ArrowRight, Search, BookOpen, TrendingUp, Star, MessageSquare, Eye, Tag, PenTool, Home as HomeIconLucide } from 'lucide-react';
import { getBlogPosts } from '@/lib/supabaseUtils';
import OptimizedImage from '@/components/OptimizedImage';
import SEO from '@/components/SEO';
import { useContent } from '@/lib/useContent';

const Blog = () => {
  const { t } = useTranslation();
  const { getContent } = useContent();
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
        {/* Enhanced Loading Hero Section */}
        <section className="hero-full-bleed text-center py-12 md:py-16 lg:py-20 relative overflow-hidden rounded-xl bg-gradient-to-br from-purple-400 via-pink-500 to-orange-500 min-h-[400px] md:min-h-[500px] lg:min-h-[600px] flex items-center" style={{ background: 'linear-gradient(to bottom right, #a855f7, #ec4899, #f97316)' }}>
          <div className="absolute inset-0">
            <OptimizedImage
              src="/Photos/roatan-island-optimized.jpg"
              webpSrc="/Photos/roatan-island-optimized.webp"
              alt="Roatán Island"
              className="w-full h-full object-cover"
              loading="lazy"
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
            
            {/* Blog Stats - real numbers */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {[
                { number: blogPosts.length.toString(), label: t('blog.articlesPublished'), icon: <PenTool className="w-6 h-6 text-white" /> },
                { number: "0", label: t('blog.monthlyReaders'), icon: <Eye className="w-6 h-6 text-white" /> },
                { number: [...new Set(blogPosts.map(p => p.author).filter(Boolean))].length.toString(), label: t('blog.expertAuthors'), icon: <UserCircle className="w-6 h-6 text-white" /> },
                { number: [...new Set(blogPosts.map(p => p.category).filter(Boolean))].length.toString(), label: t('blog.categories'), icon: <Tag className="w-6 h-6 text-white" /> }
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
        <section className="hero-full-bleed text-center py-12 md:py-16 lg:py-20 relative overflow-hidden rounded-xl bg-gradient-to-br from-purple-400 via-pink-500 to-orange-500 min-h-[400px] md:min-h-[500px] lg:min-h-[600px] flex items-center" style={{ background: 'linear-gradient(to bottom right, #a855f7, #ec4899, #f97316)' }}>
          <div className="absolute inset-0">
            <OptimizedImage
              src="/Photos/roatan-island-optimized.jpg"
              webpSrc="/Photos/roatan-island-optimized.webp"
              alt="Roatán Island"
              className="w-full h-full object-cover"
              loading="lazy"
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
              <h3 className="text-xl font-semibold text-foreground mb-2">{t('blog.errorLoading')}</h3>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button 
                onClick={() => window.location.reload()} 
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              >
                {t('properties.tryAgain')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

return (
      <div className="space-y-16 md:space-y-24">
      <SEO
        title="Blog"
        description="Roatán real estate insights, buying guides, market news, and lifestyle tips from Roatán Luxury Homes."
        canonical="/blog"
      />
      {/* Enhanced Hero Section */}
      <section className="hero-full-bleed text-center py-12 md:py-16 lg:py-20 relative overflow-hidden rounded-xl bg-gradient-to-br from-purple-400 via-pink-500 to-orange-500 min-h-[400px] md:min-h-[500px] lg:min-h-[600px] flex items-center" style={{ background: 'linear-gradient(to bottom right, #a855f7, #ec4899, #f97316)' }}>
        <div className="absolute inset-0">
          <OptimizedImage
            src="/Photos/roatan-island-optimized.jpg"
            webpSrc="/Photos/roatan-island-optimized.webp"
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
          
          {/* Blog Stats - real numbers */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              { number: blogPosts.length.toString(), label: t('blog.articlesPublished'), icon: <PenTool className="w-6 h-6 text-white" /> },
              { number: "0", label: t('blog.monthlyReaders'), icon: <Eye className="w-6 h-6 text-white" /> },
              { number: [...new Set(blogPosts.map(p => p.author).filter(Boolean))].length.toString(), label: t('blog.expertAuthors'), icon: <UserCircle className="w-6 h-6 text-white" /> },
              { number: [...new Set(blogPosts.map(p => p.category).filter(Boolean))].length.toString(), label: t('blog.categories'), icon: <Tag className="w-6 h-6 text-white" /> }
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
                    placeholder={t('blog.searchPlaceholder')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-background/70 focus:bg-background"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
              </div>
              
              <div className="flex-1">
                <select 
                  value={categoryFilter} 
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="all">{t('blog.allCategories')}</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Blog Posts */}
        {filteredPosts.length === 0 ? (
          <div className="text-center py-16">
            <div className="max-w-2xl mx-auto">
              <div className="text-8xl mb-6">📝</div>
              <h3 className="text-2xl font-bold text-foreground mb-4">{t('blog.noPostsFound')}</h3>
              <p className="text-lg text-muted-foreground mb-8">
                {searchTerm || categoryFilter !== 'all'
                  ? t('blog.adjustSearch')
                  : t('blog.noPostsDesc')
                }
              </p>
              
              {/* Coming Soon Preview */}
              <div className="grid md:grid-cols-3 gap-6 mt-12">
                {[
                  {
                    title: t('blog.previewBuyingTitle'),
                    category: t('blog.previewBuyingCategory'),
                    excerpt: t('blog.previewBuyingExcerpt'),
                    icon: <HomeIconLucide className="w-8 h-8 text-primary" />
                  },
                  {
                    title: t('blog.previewInvestmentTitle'),
                    category: t('blog.previewInvestmentCategory'),
                    excerpt: t('blog.previewInvestmentExcerpt'),
                    icon: <TrendingUp className="w-8 h-8 text-primary" />
                  },
                  {
                    title: t('blog.previewLifestyleTitle'),
                    category: t('blog.previewLifestyleCategory'),
                    excerpt: t('blog.previewLifestyleExcerpt'),
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
                    {t('blog.getNotified')}
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
                            {t('blog.featured')}
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