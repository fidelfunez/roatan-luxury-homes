import React, { useState } from 'react';
    import { useNavigate, useLocation } from 'react-router-dom';
    import { useAdmin } from '@/context/AdminContext.jsx';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
    import { useToast } from '@/components/ui/use-toast';
    import { motion } from 'framer-motion';
    import { Shield, LogIn } from 'lucide-react';

    const fadeIn = {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    };

    const AdminLoginPage = () => {
      const [email, setEmail] = useState('');
      const [password, setPassword] = useState('');
      const [isSubmitting, setIsSubmitting] = useState(false);
      const { login } = useAdmin();
      const navigate = useNavigate();
      const location = useLocation();
      const { toast } = useToast();

      const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
          const success = await login(email, password);
          if (success) {
            toast({
              title: 'Login Successful',
              description: 'Welcome. You now have full access to the management panel.',
            });
            const from = location.state?.from?.pathname || '/admin/dashboard';
            navigate(from, { replace: true });
          } else {
            toast({
              title: 'Login Failed',
              description: 'Incorrect email or password. Please try again.',
              variant: 'destructive',
            });
            setPassword('');
          }
        } catch (err) {
          toast({
            title: 'Login Failed',
            description: err?.message || 'An error occurred. Please try again.',
            variant: 'destructive',
          });
          setPassword('');
        } finally {
          setIsSubmitting(false);
        }
      };

      return (
        <motion.div 
          className="container mx-auto px-4 py-16 flex justify-center items-center min-h-[calc(100vh-200px)]"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
        >
          <Card className="w-full max-w-md shadow-2xl">
            <CardHeader className="text-center bg-primary/10 p-6 rounded-t-lg">
              <Shield className="w-16 h-16 text-primary mx-auto mb-4" />
              <CardTitle className="text-3xl font-bold text-primary">Admin Access</CardTitle>
              <CardDescription className="text-muted-foreground">Sign in with your admin account to manage property listings.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 md:p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@example.com"
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    required
                    className="mt-1"
                  />
                </div>
                <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-lg py-3" disabled={isSubmitting}>
                  <LogIn className="mr-2 h-5 w-5" /> {isSubmitting ? 'Signing in...' : 'Login'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      );
    };

    export default AdminLoginPage;