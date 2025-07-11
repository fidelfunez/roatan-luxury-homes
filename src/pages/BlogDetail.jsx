import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ChevronLeft, 
  Calendar, 
  User, 
  Tag, 
  Clock, 
  Share2,
  Facebook,
  Twitter,
  Linkedin,
  Mail,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const BlogDetail = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadBlogPost();
  }, [slug]);

  const loadBlogPost = () => {
    try {
      setLoading(true);
      const allPosts = JSON.parse(localStorage.getItem('caribbeanLuxRealty_blogPosts') || '[]');
      const foundPost = allPosts.find(p => p.slug === slug && p.status === 'published');
      
      if (foundPost) {
        setPost(foundPost);
        
        // Get related posts (same category, excluding current post)
        const related = allPosts
          .filter(p => p.category === foundPost.category && p.id !== foundPost.id && p.status === 'published')
          .slice(0, 3);
        setRelatedPosts(related);
      } else {
        setError('Blog post not found');
      }
    } catch (error) {
      console.error('Error loading blog post:', error);
      setError('Failed to load blog post');
    } finally {
      setLoading(false);
    }
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

  const sharePost = (platform) => {
    const url = window.location.href;
    const title = post.title;
    const text = post.excerpt;

    let shareUrl = '';
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      case 'email':
        shareUrl = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(text + '\n\n' + url)}`;
        break;
      default:
        return;
    }

    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded mb-8"></div>
            <div className="h-64 bg-gray-200 rounded mb-8"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div 
            className="py-16"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            <h1 className="text-4xl font-bold text-primary mb-4">Blog Post Not Found</h1>
            <p className="text-lg text-muted-foreground mb-8">
              The blog post you're looking for doesn't exist or has been removed.
            </p>
            <Button asChild>
              <Link to="/blog">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Blog
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <motion.div className="mb-8" variants={fadeIn}>
          <Button variant="outline" asChild>
            <Link to="/blog" className="text-primary hover:text-primary/80">
              <ChevronLeft className="mr-2 h-4 w-4" /> Back to Blog
            </Link>
          </Button>
        </motion.div>

        {/* Blog Post Header */}
        <motion.article variants={fadeIn}>
          <header className="mb-8">
            <div className="mb-6">
              {post.category && (
                <Badge variant="secondary" className="mb-4">
                  {post.category}
                </Badge>
              )}
              <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4 leading-tight">
                {post.title}
              </h1>
              <p className="text-xl text-muted-foreground mb-6 leading-relaxed">
                {post.excerpt}
              </p>
            </div>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(post.publishDate || post.createdAt)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>5 min read</span>
              </div>
            </div>

            {/* Share Buttons */}
            <div className="flex items-center gap-2 mb-8">
              <span className="text-sm font-medium text-muted-foreground">Share:</span>
              <Button size="sm" variant="outline" onClick={() => sharePost('facebook')}>
                <Facebook className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="outline" onClick={() => sharePost('twitter')}>
                <Twitter className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="outline" onClick={() => sharePost('linkedin')}>
                <Linkedin className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="outline" onClick={() => sharePost('email')}>
                <Mail className="w-4 h-4" />
              </Button>
            </div>
          </header>

          {/* Featured Image */}
          {post.image && (
            <motion.div className="mb-8" variants={fadeIn}>
              <img 
                src={post.image} 
                alt={post.title}
                className="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg"
              />
            </motion.div>
          )}

          {/* Blog Content */}
          <motion.div 
            className="prose prose-lg max-w-none mb-12"
            variants={fadeIn}
          >
            <div className="whitespace-pre-wrap text-muted-foreground leading-relaxed">
              {post.content}
            </div>
          </motion.div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <motion.div className="mb-8" variants={fadeIn}>
              <div className="flex items-center gap-2 mb-4">
                <Tag className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">Tags:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag, index) => (
                  <Badge key={index} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </motion.div>
          )}

          {/* Author Bio */}
          <motion.div className="mb-12" variants={fadeIn}>
            <Card className="bg-gradient-to-r from-primary/5 to-turquoise-light/5 border border-primary/20">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-turquoise-dark rounded-full flex items-center justify-center shadow-lg">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2 text-primary">{post.author}</h3>
                    <p className="text-muted-foreground mb-3">
                      Real estate expert with years of experience in Caribbean property markets. 
                      Specializing in luxury properties and investment opportunities.
                    </p>
                    <Button asChild variant="outline" size="sm">
                      <Link to="/contact">
                        Contact {post.author}
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.article>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <motion.section className="mt-16" variants={fadeIn}>
            <h2 className="text-2xl font-bold text-primary mb-6 flex items-center">
              <ArrowRight className="w-6 h-6 mr-2" />
              Related Posts
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Card key={relatedPost.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    {relatedPost.image && (
                      <img 
                        src={relatedPost.image} 
                        alt={relatedPost.title}
                        className="w-full h-32 object-cover rounded mb-4"
                      />
                    )}
                    <div className="space-y-2">
                      {relatedPost.category && (
                        <Badge variant="secondary" className="text-xs">
                          {relatedPost.category}
                        </Badge>
                      )}
                      <h3 className="font-semibold text-primary line-clamp-2">
                        {relatedPost.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {relatedPost.excerpt}
                      </p>
                      <div className="flex items-center justify-between pt-2">
                        <span className="text-xs text-muted-foreground">
                          {formatDate(relatedPost.publishDate || relatedPost.createdAt)}
                        </span>
                        <Button size="sm" variant="outline" asChild>
                          <Link to={`/blog/${relatedPost.slug}`}>
                            Read More
                            <ArrowRight className="w-3 h-3 ml-1" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.section>
        )}
      </div>
    </div>
  );
};

export default BlogDetail; 