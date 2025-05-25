
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Shield, AlertCircle } from 'lucide-react';

// Mock user and admin data
const mockUsers = [
  { id: 1, email: 'user@quiz.com', password: 'user123', name: 'John Doe' },
  { id: 2, email: 'jane@quiz.com', password: 'jane123', name: 'Jane Smith' }
];

const mockAdmins = [
  { id: 1, email: 'admin@quiz.com', password: 'admin123', name: 'Admin User' }
];

const Index = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (role: 'user' | 'admin') => {
    setIsLoading(true);
    setError('');

    // Basic validation
    if (!email || !password) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    // Simulate authentication
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">QuizMaster</h1>
          <p className="text-slate-400">Test your knowledge, challenge yourself</p>
        </div>

        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-white text-2xl">Welcome Back</CardTitle>
            <CardDescription className="text-slate-400">
              Choose your role and sign in to continue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="user" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-slate-700/50">
                <TabsTrigger value="user" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                  <User className="w-4 h-4 mr-2" />
                  User Login
                </TabsTrigger>
                <TabsTrigger value="admin" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                  <Shield className="w-4 h-4 mr-2" />
                  Admin Login
                </TabsTrigger>
              </TabsList>

              <TabsContent value="user" className="space-y-4 mt-6">
                <div className="space-y-2">
                  <Label htmlFor="user-email" className="text-slate-300">Email</Label>
                  <Input
                    id="user-email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="user-password" className="text-slate-300">Password</Label>
                  <Input
                    id="user-password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500"
                  />
                </div>
                {error && (
                  <div className="flex items-center space-x-2 text-red-400 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>{error}</span>
                  </div>
                )}
                <Button
                  onClick={() => handleLogin('user')}
                  disabled={isLoading}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white transition-colors duration-200"
                >
                  {isLoading ? 'Signing in...' : 'Sign In as User'}
                </Button>
                <p className="text-xs text-slate-400 text-center">
                  Demo: user@quiz.com / user123
                </p>
              </TabsContent>

              <TabsContent value="admin" className="space-y-4 mt-6">
                <div className="space-y-2">
                  <Label htmlFor="admin-email" className="text-slate-300">Email</Label>
                  <Input
                    id="admin-email"
                    type="email"
                    placeholder="Enter admin email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admin-password" className="text-slate-300">Password</Label>
                  <Input
                    id="admin-password"
                    type="password"
                    placeholder="Enter admin password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500"
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
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white transition-colors duration-200"
                >
                  {isLoading ? 'Signing in...' : 'Sign In as Admin'}
                </Button>
                <p className="text-xs text-slate-400 text-center">
                  Demo: admin@quiz.com / admin123
                </p>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="text-center mt-8 text-slate-400">
          <p>&copy; 2024 QuizMaster. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
