
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, RotateCcw, Home, Eye, EyeOff, Check, X } from 'lucide-react';

const Results = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [showAnswers, setShowAnswers] = useState(false);

  const { score, percentage, categoryName, questions, answers } = location.state || {};

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

    if (!score && score !== 0) {
      navigate('/dashboard');
    }
  }, [navigate, score]);

  const getScoreMessage = () => {
    if (percentage >= 80) return { message: "Excellent work! 🎉", color: "text-green-400" };
    if (percentage >= 60) return { message: "Good effort! 👍", color: "text-yellow-400" };
    return { message: "Keep practicing! 💪", color: "text-red-400" };
  };

  const retakeQuiz = () => {
    // Find category ID from the first question or use a mapping
    const categoryMapping = {
      'Science': 1,
      'History': 2,
      'Movies': 3,
      'Literature': 4
    };
    const categoryId = categoryMapping[categoryName] || 1;
    navigate(`/quiz?category=${categoryId}&name=${encodeURIComponent(categoryName)}`);
  };

  if (!user || (!score && score !== 0)) return null;

  const scoreInfo = getScoreMessage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Score Display */}
        <Card className="bg-slate-800/50 border-slate-700 mb-8">
          <CardHeader className="text-center">
            <div className="mx-auto w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center mb-4">
              <Trophy className="w-10 h-10 text-blue-400" />
            </div>
            <CardTitle className="text-white text-3xl mb-2">
              Quiz Results: {categoryName}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="mb-6">
              <div className="text-6xl font-bold text-white mb-2">
                {score} / {questions?.length || 5}
              </div>
              <div className={`text-4xl font-semibold mb-4 ${scoreInfo.color}`}>
                {percentage}%
              </div>
              <p className={`text-xl ${scoreInfo.color}`}>
                {scoreInfo.message}
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              <Button
                onClick={retakeQuiz}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3"
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                Retake Quiz
              </Button>
              
              <Button
                onClick={() => setShowAnswers(!showAnswers)}
                variant="outline"
                className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white px-6 py-3"
              >
                {showAnswers ? (
                  <>
                    <EyeOff className="w-5 h-5 mr-2" />
                    Hide Answers
                  </>
                ) : (
                  <>
                    <Eye className="w-5 h-5 mr-2" />
                    Reveal Answers
                  </>
                )}
              </Button>
              
              <Button
                onClick={() => navigate('/dashboard')}
                variant="outline"
                className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white px-6 py-3"
              >
                <Home className="w-5 h-5 mr-2" />
                Back to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Answer Review */}
        {showAnswers && (
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white text-2xl">Answer Review</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {questions?.map((question, index) => {
                const userAnswer = answers[index];
                const correctAnswer = question.correct;
                const isCorrect = userAnswer === correctAnswer;
                const userAnswerText = question.options[userAnswer?.charCodeAt(0) - 65] || 'No answer';
                const correctAnswerText = question.options[correctAnswer?.charCodeAt(0) - 65];

                return (
                  <div key={index} className="border border-slate-700 rounded-lg p-6">
                    <div className="flex items-start mb-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-4 flex-shrink-0 ${
                        isCorrect ? 'bg-green-500' : 'bg-red-500'
                      }`}>
                        {isCorrect ? (
                          <Check className="w-5 h-5 text-white" />
                        ) : (
                          <X className="w-5 h-5 text-white" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-semibold text-lg mb-3">
                          Question {index + 1}: {question.question}
                        </h3>
                        
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <span className="text-slate-400 w-24">Your answer:</span>
                            <span className={`font-medium ${
                              isCorrect ? 'text-green-400' : 'text-red-400'
                            }`}>
                              {userAnswer} - {userAnswerText}
                            </span>
                          </div>
                          
                          {!isCorrect && (
                            <div className="flex items-center">
                              <span className="text-slate-400 w-24">Correct answer:</span>
                              <span className="text-green-400 font-medium">
                                {correctAnswer} - {correctAnswerText}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default Results;
