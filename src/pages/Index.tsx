import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Shield, AlertCircle, UserPlus } from 'lucide-react';
import { addUser, authenticateUser, authenticateAdmin } from '@/services/database';

const Index = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (role: 'user' | 'admin') => {
    setIsLoading(true);
    setError('');
    setSuccess('');

    if (!email || !password) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    try {
      let user = null;
      
      if (role === 'user') {
        user = await authenticateUser(email, password);
        if (user) {
          localStorage.setItem('userSession', JSON.stringify({ id: user.id, name: user.name, email: user.email, role: 'user' }));
          navigate('/dashboard');
        }
      } else {
        user = await authenticateAdmin(email, password);
        if (user) {
          localStorage.setItem('userSession', JSON.stringify({ id: user.id, name: user.name, email: user.email, role: 'admin' }));
          navigate('/admin-dashboard');
        }
      }

      if (!user) {
        setError('Invalid credentials. Please try again.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Login failed. Please try again.');
    }

    setIsLoading(false);
  };

  const handleRegister = async () => {
    setIsLoading(true);
    setError('');
    setSuccess('');

    if (!name || !email || !password) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    try {
      await addUser({ name, email, password });
      setSuccess('Account created successfully! You can now login.');
      setName('');
      setEmail('');
      setPassword('');
    } catch (err: any) {
      console.error('Registration error:', err);
      if (err.message?.includes('duplicate key')) {
        setError('Email already exists. Please use a different email.');
      } else {
        setError('Failed to create account. Please try again.');
      }
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#1A1A1D] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#6A0DAD] to-[#CC5500] bg-clip-text text-transparent mb-2">
            Quizzer
          </h1>
          <p className="text-[#A0A0A0]">Test your knowledge, challenge yourself , try today </p>
        </div>

        <Card className="bg-[#2C2C30] border-[#3D3D40] backdrop-blur-sm shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-[#E0E0E0] text-2xl">Welcome</CardTitle>
            <CardDescription className="text-[#A0A0A0]">
              Sign in to continue or create a new account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="user" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-[#1E1E21]">
                <TabsTrigger 
                  value="user" 
                  className="data-[state=active]:bg-[#6A0DAD] data-[state=active]:text-[#E0E0E0] text-[#A0A0A0]"
                >
                  <User className="w-4 h-4 mr-2" />
                  Login
                </TabsTrigger>
                <TabsTrigger 
                  value="register" 
                  className="data-[state=active]:bg-[#228B22] data-[state=active]:text-[#E0E0E0] text-[#A0A0A0]"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Register
                </TabsTrigger>
                <TabsTrigger 
                  value="admin" 
                  className="data-[state=active]:bg-[#CC5500] data-[state=active]:text-[#E0E0E0] text-[#A0A0A0]"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Admin
                </TabsTrigger>
              </TabsList>

              <TabsContent value="user" className="space-y-4 mt-6">
                <div className="space-y-2">
                  <Label htmlFor="user-email" className="text-[#E0E0E0]">Email</Label>
                  <Input
                    id="user-email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-[#1E1E21] border-[#3D3D40] text-[#E0E0E0] placeholder:text-[#A0A0A0] focus:border-[#6A0DAD] focus:ring-[#6A0DAD]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="user-password" className="text-[#E0E0E0]">Password</Label>
                  <Input
                    id="user-password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-[#1E1E21] border-[#3D3D40] text-[#E0E0E0] placeholder:text-[#A0A0A0] focus:border-[#6A0DAD] focus:ring-[#6A0DAD]"
                  />
                </div>
                {error && (
                  <div className="flex items-center space-x-2 text-[#DC3545] text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>{error}</span>
                  </div>
                )}
                {success && (
                  <div className="text-[#28A745] text-sm">
                    {success}
                  </div>
                )}
                <Button
                  onClick={() => handleLogin('user')}
                  disabled={isLoading}
                  className="w-full bg-[#6A0DAD] hover:bg-[#7B1BB8] text-[#E0E0E0] font-medium transition-colors duration-200 shadow-lg border-none"
                >
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </Button>
                <p className="text-xs text-[#A0A0A0] text-center">
                  Demo: user@quiz.com / user123
                </p>
              </TabsContent>

              <TabsContent value="register" className="space-y-4 mt-6">
                <div className="space-y-2">
                  <Label htmlFor="register-name" className="text-[#E0E0E0]">Full Name</Label>
                  <Input
                    id="register-name"
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-[#1E1E21] border-[#3D3D40] text-[#E0E0E0] placeholder:text-[#A0A0A0] focus:border-[#228B22] focus:ring-[#228B22]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-email" className="text-[#E0E0E0]">Email</Label>
                  <Input
                    id="register-email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-[#1E1E21] border-[#3D3D40] text-[#E0E0E0] placeholder:text-[#A0A0A0] focus:border-[#228B22] focus:ring-[#228B22]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-password" className="text-[#E0E0E0]">Password</Label>
                  <Input
                    id="register-password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-[#1E1E21] border-[#3D3D40] text-[#E0E0E0] placeholder:text-[#A0A0A0] focus:border-[#228B22] focus:ring-[#228B22]"
                  />
                </div>
                {error && (
                  <div className="flex items-center space-x-2 text-[#DC3545] text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>{error}</span>
                  </div>
                )}
                {success && (
                  <div className="text-[#28A745] text-sm">
                    {success}
                  </div>
                )}
                <Button
                  onClick={handleRegister}
                  disabled={isLoading}
                  className="w-full bg-[#228B22] hover:bg-[#2EA043] text-[#E0E0E0] font-medium transition-colors duration-200 shadow-lg border-none"
                >
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </Button>
              </TabsContent>

              <TabsContent value="admin" className="space-y-4 mt-6">
                <div className="space-y-2">
                  <Label htmlFor="admin-email" className="text-[#E0E0E0]">Email</Label>
                  <Input
                    id="admin-email"
                    type="email"
                    placeholder="Enter admin email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-[#1E1E21] border-[#3D3D40] text-[#E0E0E0] placeholder:text-[#A0A0A0] focus:border-[#CC5500] focus:ring-[#CC5500]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admin-password" className="text-[#E0E0E0]">Password</Label>
                  <Input
                    id="admin-password"
                    type="password"
                    placeholder="Enter admin password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-[#1E1E21] border-[#3D3D40] text-[#E0E0E0] placeholder:text-[#A0A0A0] focus:border-[#CC5500] focus:ring-[#CC5500]"
                  />
                </div>
                {error && (
                  <div className="flex items-center space-x-2 text-[#DC3545] text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>{error}</span>
                  </div>
                )}
                <Button
                  onClick={() => handleLogin('admin')}
                  disabled={isLoading}
                  className="w-full bg-[#CC5500] hover:bg-[#E6610D] text-[#E0E0E0] font-medium transition-colors duration-200 shadow-lg border-none"
                >
                  {isLoading ? 'Signing in...' : 'Sign In as Admin'}
                </Button>
                <p className="text-xs text-[#A0A0A0] text-center">
                  Demo: admin@quiz.com / admin123
                </p>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="text-center mt-8 text-[#A0A0A0]">
          <p>&copy; 2024 QuizMaster. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
