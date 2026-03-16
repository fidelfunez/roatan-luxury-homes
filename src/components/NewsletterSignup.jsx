import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { MailOpen } from 'lucide-react';

const NewsletterSignup = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }
    setIsSubmitting(true);
    
    await new Promise(resolve => setTimeout(resolve, 1000));

    toast({
      title: "Subscribed!",
      description: "Thank you for subscribing to our newsletter.",
    });
    setEmail('');
    setIsSubmitting(false);
  };

  return (
    <div className="bg-gradient-to-r from-primary/10 to-turquoise-light/10 rounded-xl p-8 md:p-12 text-center">
      <div className="max-w-2xl mx-auto">
        <MailOpen className="w-12 h-12 text-primary mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-primary mb-4">{t('newsletter.stayUpdated')}</h2>
        <p className="text-lg text-muted-foreground mb-8">
          {t('newsletter.description')}
        </p>
        
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
          <div className="flex-1">
            <Label htmlFor="newsletter-email" className="sr-only">{t('newsletter.emailAddress')}</Label>
            <Input
              id="newsletter-email"
              type="email"
              placeholder={t('newsletter.enterEmail')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full"
            />
          </div>
          <div>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full sm:w-auto bg-primary-dark hover:bg-primary-dark/90 text-primary-foreground"
              aria-label={t('newsletter.subscribe')}
            >
              {isSubmitting ? t('newsletter.subscribing') : t('newsletter.subscribe')}
            </Button>
          </div>
        </form>
        
        <p className="text-sm text-muted-foreground mt-4">
          {t('newsletter.privacyNote')}
        </p>
      </div>
    </div>
  );
};

export default NewsletterSignup;