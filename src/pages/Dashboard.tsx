
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LogOut, Play, History, Trophy, BookOpen, Atom, Globe, Film } from 'lucide-react';
import { getCategories, getQuizHistory } from '@/services/database';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [quizHistory, setQuizHistory] = useState([]);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  // Icon mapping for categories
  const iconMap = {
    Science: Atom,
    History: Globe,
    Movies: Film,
    Literature: BookOpen
  };

  useEffect(() => {
    const session = localStorage.getItem('userSession');
    if (!session) {
      navigate('/');
      return;
    }

    const userData = JSON.parse(session);
    if (userData.role !== 'user') {
      navigate('/');
      return;
    }

    setUser(userData);
    loadData(userData);
  }, [navigate]);

  const loadData = async (userData) => {
    try {
      // Load categories from database
      const categoriesData = await getCategories();
      setCategories(categoriesData);

      // Load quiz history from database
      const historyData = await getQuizHistory(userData.id);
      setQuizHistory(historyData);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userSession');
    navigate('/');
  };

  const startQuiz = (categoryId: number, categoryName: string) => {
    navigate(`/quiz?category=${categoryId}&name=${encodeURIComponent(categoryName)}`);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#1A1A1D]">
      {/* Header */}
      <header className="bg-[#2C2C30] backdrop-blur-sm border-b border-[#3D3D40] shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-[#6A0DAD] to-[#CC5500] bg-clip-text text-transparent">
                QuizMaster
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-[#E0E0E0]">Welcome, {user.name}!</span>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="border-[#DC3545] bg-transparent text-[#DC3545] hover:bg-[#DC3545] hover:text-[#E0E0E0] hover:border-[#DC3545] transition-colors"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quiz Categories Section */}
        <section className="mb-12 quiz-categories">
          <h2 className="text-3xl font-bold text-[#E0E0E0] mb-8">Choose a Quiz Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => {
              const IconComponent = iconMap[category.name] || BookOpen;
              return (
                <Card
                  key={category.id}
                  className="bg-[#2C2C30] border-[#3D3D40] hover:border-[#6A0DAD] transition-all duration-300 cursor-pointer hover:scale-105 group shadow-lg hover:shadow-[#6A0DAD]/20"
                  onClick={() => startQuiz(category.id, category.name)}
                >
                  <CardHeader className="text-center">
                    <div className="mx-auto w-16 h-16 bg-gradient-to-br from-[#6A0DAD]/20 to-[#CC5500]/20 rounded-full flex items-center justify-center mb-4 group-hover:from-[#6A0DAD]/30 group-hover:to-[#CC5500]/30 transition-colors">
                      <IconComponent className="w-8 h-8 text-[#6A0DAD]" />
                    </div>
                    <CardTitle className="text-[#E0E0E0] text-xl">{category.name}</CardTitle>
                    <CardDescription className="text-[#A0A0A0]">
                      Test your {category.name.toLowerCase()} knowledge
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <Button className="w-full bg-gradient-to-r from-[#6A0DAD] to-[#CC5500] hover:from-[#7B1BB8] hover:to-[#E6610D] text-[#E0E0E0] font-medium transition-all shadow-lg border-none">
                      <Play className="w-4 h-4 mr-2" />
                      Start Quiz
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Quiz History Section */}
        <section>
          <h2 className="text-3xl font-bold text-[#E0E0E0] mb-8 flex items-center">
            <History className="w-8 h-8 mr-3 text-[#228B22]" />
            Your Quiz History
          </h2>
          
          {quizHistory.length === 0 ? (
            <Card className="bg-[#2C2C30] border-[#3D3D40] shadow-lg">
              <CardContent className="text-center py-12">
                <Trophy className="w-16 h-16 text-[#A0A0A0] mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-[#E0E0E0] mb-2">
                  No quizzes taken yet
                </h3>
                <p className="text-[#A0A0A0] mb-6">
                  Start your first quiz to see your results here!
                </p>
                <Button
                  onClick={() => document.querySelector('.quiz-categories')?.scrollIntoView({ behavior: 'smooth' })}
                  className="bg-gradient-to-r from-[#228B22] to-[#6A0DAD] hover:from-[#2EA043] hover:to-[#7B1BB8] text-[#E0E0E0] font-medium shadow-lg border-none"
                >
                  Take Your First Quiz
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-[#2C2C30] border-[#3D3D40] shadow-lg">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-[#1E1E21]">
                      <tr>
                        <th className="text-left py-4 px-6 text-[#E0E0E0] font-semibold">Category</th>
                        <th className="text-left py-4 px-6 text-[#E0E0E0] font-semibold">Date</th>
                        <th className="text-left py-4 px-6 text-[#E0E0E0] font-semibold">Score</th>
                        <th className="text-left py-4 px-6 text-[#E0E0E0] font-semibold">Percentage</th>
                      </tr>
                    </thead>
                    <tbody>
                      {quizHistory.map((quiz, index) => (
                        <tr key={index} className="border-t border-[#3D3D40] hover:bg-[#1E1E21] transition-colors">
                          <td className="py-4 px-6 text-[#E0E0E0] font-medium">{quiz.category_name}</td>
                          <td className="py-4 px-6 text-[#A0A0A0]">{quiz.date}</td>
                          <td className="py-4 px-6 text-[#A0A0A0]">{quiz.score}/{quiz.questions.length}</td>
                          <td className="py-4 px-6">
                            <span className={`font-semibold ${
                              quiz.percentage >= 80 ? 'text-[#28A745]' :
                              quiz.percentage >= 60 ? 'text-[#FFC107]' :
                              'text-[#DC3545]'
                            }`}>
                              {quiz.percentage}%
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
