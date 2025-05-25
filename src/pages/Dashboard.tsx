
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LogOut, Play, History, Trophy, BookOpen, Atom, Globe, Film } from 'lucide-react';

// Mock quiz categories
const quizCategories = [
  { id: 1, name: 'Science', icon: Atom, description: 'Test your scientific knowledge' },
  { id: 2, name: 'History', icon: Globe, description: 'Journey through time' },
  { id: 3, name: 'Movies', icon: Film, description: 'Lights, camera, action!' },
  { id: 4, name: 'Literature', icon: BookOpen, description: 'Classic and modern works' }
];

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [quizHistory, setQuizHistory] = useState([]);
  const navigate = useNavigate();

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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-white">QuizMaster</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-slate-300">Welcome, {user.name}!</span>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
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
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-8">Choose a Quiz Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quizCategories.map((category) => {
              const IconComponent = category.icon;
              return (
                <Card
                  key={category.id}
                  className="bg-slate-800/50 border-slate-700 hover:border-blue-500 transition-all duration-300 cursor-pointer hover:scale-105 group"
                  onClick={() => startQuiz(category.id, category.name)}
                >
                  <CardHeader className="text-center">
                    <div className="mx-auto w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-500/30 transition-colors">
                      <IconComponent className="w-8 h-8 text-blue-400" />
                    </div>
                    <CardTitle className="text-white text-xl">{category.name}</CardTitle>
                    <CardDescription className="text-slate-400">
                      {category.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white transition-colors">
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
            <History className="w-8 h-8 mr-3 text-blue-400" />
            Your Quiz History
          </h2>
          
          {quizHistory.length === 0 ? (
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="text-center py-12">
                <Trophy className="w-16 h-16 text-slate-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-300 mb-2">
                  No quizzes taken yet
                </h3>
                <p className="text-slate-400 mb-6">
                  Start your first quiz to see your results here!
                </p>
                <Button
                  onClick={() => document.querySelector('.quiz-categories')?.scrollIntoView({ behavior: 'smooth' })}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  Take Your First Quiz
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-700/50">
                      <tr>
                        <th className="text-left py-4 px-6 text-slate-300 font-semibold">Category</th>
                        <th className="text-left py-4 px-6 text-slate-300 font-semibold">Date</th>
                        <th className="text-left py-4 px-6 text-slate-300 font-semibold">Score</th>
                        <th className="text-left py-4 px-6 text-slate-300 font-semibold">Percentage</th>
                        <th className="text-left py-4 px-6 text-slate-300 font-semibold">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {quizHistory.map((quiz, index) => (
                        <tr key={index} className="border-t border-slate-700 hover:bg-slate-700/30 transition-colors">
                          <td className="py-4 px-6 text-white font-medium">{quiz.categoryName}</td>
                          <td className="py-4 px-6 text-slate-300">{quiz.date}</td>
                          <td className="py-4 px-6 text-slate-300">{quiz.score}/5</td>
                          <td className="py-4 px-6">
                            <span className={`font-semibold ${
                              quiz.percentage >= 80 ? 'text-green-400' :
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
                              className="bg-blue-500 hover:bg-blue-600 text-white"
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
