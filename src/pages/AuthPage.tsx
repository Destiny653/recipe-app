// File: src/pages/AuthPage.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useApi } from '../hooks/useApi';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { useToast } from '../hooks/use-toast';

// Define the shape of the successful authentication response
interface AuthResponse {
  token: string;
  username: string;
}

const AuthPage: React.FC = () => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { request } = useApi();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const endpoint = isLoginMode ? '/auth/login' : '/auth/register';
    const body = isLoginMode ? { email, password } : { username, email, password };
    const method = 'POST';

    // Explicitly set the expected response type to AuthResponse
    const data = await request<AuthResponse>({ url: endpoint, method, data: body });

    if (data && data.token) {
      localStorage.setItem('token', data.token);
      toast({
        title: "Success!",
        description: `Welcome, ${data.username || username}!`,
      });
      navigate('/');
    }
    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen pt-24 bg-gray-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-[380px] md:w-[450px] font-poppins shadow-lg rounded-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-playfair font-bold text-gray-800">
              {isLoginMode ? 'Welcome Back!' : 'Join Culinary Compass'}
            </CardTitle>
            <CardDescription className="text-gray-600">
              {isLoginMode ? 'Sign in to access your recipes.' : 'Create your account to get started.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAuth} className="space-y-4">
              {!isLoginMode && (
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="JohnDoe"
                    required
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-compass-primary hover:bg-orange-600 text-white" disabled={loading}>
                {loading ? (isLoginMode ? 'Logging in...' : 'Registering...') : (isLoginMode ? 'Login' : 'Register')}
              </Button>
            </form>
            <div className="mt-4 text-center text-sm text-gray-500">
              {isLoginMode ? "Don't have an account? " : "Already have an account? "}
              <span
                className="font-semibold text-compass-primary hover:underline cursor-pointer"
                onClick={() => setIsLoginMode(!isLoginMode)}
              >
                {isLoginMode ? 'Register here' : 'Login here'}
              </span>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default AuthPage;
