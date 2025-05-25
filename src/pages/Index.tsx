
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Shield, AlertCircle, UserPlus } from 'lucide-react';
import { mockUsers, mockAdmins, addUser } from '@/utils/mockData';

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

    setTimeout(() => {
      let user = null;
      
      if (role === 'user') {
        user = mockUsers.find(u => u.email === email && u.password === password);
        if (user) {
          localStorage.setItem('userSession', JSON.stringify({ id: user.id, name: user.name, email: user.email, role: 'user' }));
          navigate('/dashboard');
        }
      } else {
        user = mockAdmins.find(a => a.email === email && a.password === password);
        if (user) {
          localStorage.setItem('userSession', JSON.stringify({ id: user.id, name: user.name, email: user.email, role: 'admin' }));
          navigate('/admin-dashboard');
        }
      }

      if (!user) {
        setError('Invalid credentials. Please try again.');
      }

      setIsLoading(false);
    }, 500);
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

    if (mockUsers.find(u => u.email === email)) {
      setError('Email already exists. Please use a different email.');
      setIsLoading(false);
      return;
    }

    setTimeout(() => {
      try {
        addUser({ name, email, password });
        setSuccess('Account created successfully! You can now login.');
        setName('');
        setEmail('');
        setPassword('');
      } catch (err) {
        setError('Failed to create account. Please try again.');
      }
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent mb-2">
            QuizMaster
          </h1>
          <p className="text-gray-400">Test your knowledge, challenge yourself</p>
        </div>

        <Card className="bg-gray-800/70 border-gray-700 backdrop-blur-sm shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-white text-2xl">Welcome</CardTitle>
            <CardDescription className="text-gray-400">
              Sign in to continue or create a new account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="user" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-gray-700/50">
                <TabsTrigger 
                  value="user" 
                  className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-gray-300"
                >
                  <User className="w-4 h-4 mr-2" />
                  Login
                </TabsTrigger>
                <TabsTrigger 
                  value="register" 
                  className="data-[state=active]:bg-cyan-600 data-[state=active]:text-white text-gray-300"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Register
                </TabsTrigger>
                <TabsTrigger 
                  value="admin" 
                  className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-gray-300"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Admin
                </TabsTrigger>
              </TabsList>

              <TabsContent value="user" className="space-y-4 mt-6">
                <div className="space-y-2">
                  <Label htmlFor="user-email" className="text-gray-300">Email</Label>
                  <Input
                    id="user-email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-emerald-500 focus:ring-emerald-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="user-password" className="text-gray-300">Password</Label>
                  <Input
                    id="user-password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-emerald-500 focus:ring-emerald-500"
                  />
                </div>
                {error && (
                  <div className="flex items-center space-x-2 text-red-400 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>{error}</span>
                  </div>
                )}
                {success && (
                  <div className="text-emerald-400 text-sm">
                    {success}
                  </div>
                )}
                <Button
                  onClick={() => handleLogin('user')}
                  disabled={isLoading}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition-colors duration-200 shadow-lg"
                >
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </Button>
                <p className="text-xs text-gray-400 text-center">
                  Demo: user@quiz.com / user123
                </p>
              </TabsContent>

              <TabsContent value="register" className="space-y-4 mt-6">
                <div className="space-y-2">
                  <Label htmlFor="register-name" className="text-gray-300">Full Name</Label>
                  <Input
                    id="register-name"
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-cyan-500 focus:ring-cyan-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-email" className="text-gray-300">Email</Label>
                  <Input
                    id="register-email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-cyan-500 focus:ring-cyan-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-password" className="text-gray-300">Password</Label>
                  <Input
                    id="register-password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-cyan-500 focus:ring-cyan-500"
                  />
                </div>
                {error && (
                  <div className="flex items-center space-x-2 text-red-400 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>{error}</span>
                  </div>
                )}
                {success && (
                  <div className="text-emerald-400 text-sm">
                    {success}
                  </div>
                )}
                <Button
                  onClick={handleRegister}
                  disabled={isLoading}
                  className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-medium transition-colors duration-200 shadow-lg"
                >
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </Button>
              </TabsContent>

              <TabsContent value="admin" className="space-y-4 mt-6">
                <div className="space-y-2">
                  <Label htmlFor="admin-email" className="text-gray-300">Email</Label>
                  <Input
                    id="admin-email"
                    type="email"
                    placeholder="Enter admin email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-purple-500 focus:ring-purple-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admin-password" className="text-gray-300">Password</Label>
                  <Input
                    id="admin-password"
                    type="password"
                    placeholder="Enter admin password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-purple-500 focus:ring-purple-500"
                  />
                </div>
                {error && (
                  <div className="flex items-center space-x-2 text-red-400 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>{error}</span>
                  </div>
                )}
                <Button
                  onClick={() => handleLogin('admin')}
                  disabled={isLoading}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium transition-colors duration-200 shadow-lg"
                >
                  {isLoading ? 'Signing in...' : 'Sign In as Admin'}
                </Button>
                <p className="text-xs text-gray-400 text-center">
                  Demo: admin@quiz.com / admin123
                </p>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="text-center mt-8 text-gray-400">
          <p>&copy; 2024 QuizMaster. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
