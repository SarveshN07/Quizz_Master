
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LogOut, Play, History, Trophy, BookOpen, Atom, Globe, Film } from 'lucide-react';
import { getCategories } from '@/utils/mockData';

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

    // Load categories from shared data
    setCategories(getCategories());

    // Load quiz history
    const history = localStorage.getItem(`quizHistory_${userData.id}`) || '[]';
    setQuizHistory(JSON.parse(history));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('userSession');
    navigate('/');
  };

  const startQuiz = (categoryId: number, categoryName: string) => {
    navigate(`/quiz?category=${categoryId}&name=${encodeURIComponent(categoryName)}`);
  };

  const retakeQuiz = (categoryId: number, categoryName: string) => {
    navigate(`/quiz?category=${categoryId}&name=${encodeURIComponent(categoryName)}`);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* Header */}
      <header className="bg-gray-800/70 backdrop-blur-sm border-b border-gray-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                QuizMaster
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-300">Welcome, {user.name}!</span>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-red-600 hover:text-white hover:border-red-600 transition-colors"
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
          <h2 className="text-3xl font-bold text-white mb-8">Choose a Quiz Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => {
              const IconComponent = iconMap[category.name] || BookOpen;
              return (
                <Card
                  key={category.id}
                  className="bg-gray-800/70 border-gray-700 hover:border-emerald-500 transition-all duration-300 cursor-pointer hover:scale-105 group shadow-lg hover:shadow-emerald-500/20"
                  onClick={() => startQuiz(category.id, category.name)}
                >
                  <CardHeader className="text-center">
                    <div className="mx-auto w-16 h-16 bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 rounded-full flex items-center justify-center mb-4 group-hover:from-emerald-500/30 group-hover:to-cyan-500/30 transition-colors">
                      <IconComponent className="w-8 h-8 text-emerald-400" />
                    </div>
                    <CardTitle className="text-white text-xl">{category.name}</CardTitle>
                    <CardDescription className="text-gray-400">
                      Test your {category.name.toLowerCase()} knowledge
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <Button className="w-full bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700 text-white font-medium transition-all shadow-lg">
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
          <h2 className="text-3xl font-bold text-white mb-8 flex items-center">
            <History className="w-8 h-8 mr-3 text-purple-400" />
            Your Quiz History
          </h2>
          
          {quizHistory.length === 0 ? (
            <Card className="bg-gray-800/70 border-gray-700 shadow-lg">
              <CardContent className="text-center py-12">
                <Trophy className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-300 mb-2">
                  No quizzes taken yet
                </h3>
                <p className="text-gray-400 mb-6">
                  Start your first quiz to see your results here!
                </p>
                <Button
                  onClick={() => document.querySelector('.quiz-categories')?.scrollIntoView({ behavior: 'smooth' })}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium shadow-lg"
                >
                  Take Your First Quiz
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-gray-800/70 border-gray-700 shadow-lg">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-700/50">
                      <tr>
                        <th className="text-left py-4 px-6 text-gray-300 font-semibold">Category</th>
                        <th className="text-left py-4 px-6 text-gray-300 font-semibold">Date</th>
                        <th className="text-left py-4 px-6 text-gray-300 font-semibold">Score</th>
                        <th className="text-left py-4 px-6 text-gray-300 font-semibold">Percentage</th>
                        <th className="text-left py-4 px-6 text-gray-300 font-semibold">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {quizHistory.map((quiz, index) => (
                        <tr key={index} className="border-t border-gray-700 hover:bg-gray-700/30 transition-colors">
                          <td className="py-4 px-6 text-white font-medium">{quiz.categoryName}</td>
                          <td className="py-4 px-6 text-gray-300">{quiz.date}</td>
                          <td className="py-4 px-6 text-gray-300">{quiz.score}/5</td>
                          <td className="py-4 px-6">
                            <span className={`font-semibold ${
                              quiz.percentage >= 80 ? 'text-emerald-400' :
                              quiz.percentage >= 60 ? 'text-yellow-400' :
                              'text-red-400'
                            }`}>
                              {quiz.percentage}%
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <Button
                              onClick={() => retakeQuiz(quiz.categoryId, quiz.categoryName)}
                              size="sm"
                              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium shadow-lg"
                            >
                              Retake
                            </Button>
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
