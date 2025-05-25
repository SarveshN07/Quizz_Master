
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { getQuestions, getCategories } from '@/utils/mockData';

const Quiz = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [answers, setAnswers] = useState({});
  const [categoryId, setCategoryId] = useState(null);
  const [categoryName, setCategoryName] = useState('');

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

    const catId = parseInt(searchParams.get('category'));
    const catName = searchParams.get('name');
    
    if (!catId || !catName) {
      navigate('/dashboard');
      return;
    }

    setCategoryId(catId);
    setCategoryName(catName);

    // Get questions from shared data
    const categoryQuestions = getQuestions(catId);
    
    if (categoryQuestions.length === 0) {
      navigate('/dashboard');
      return;
    }
    
    // Randomize and select 5 questions
    const shuffled = [...categoryQuestions].sort(() => 0.5 - Math.random());
    const selectedQuestions = shuffled.slice(0, Math.min(5, shuffled.length));
    setQuestions(selectedQuestions);
  }, [searchParams, navigate]);

  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);
  };

  const handleNext = () => {
    if (selectedAnswer) {
      setAnswers(prev => ({
        ...prev,
        [currentQuestion]: selectedAnswer
      }));

      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedAnswer('');
      } else {
        finishQuiz();
      }
    }
  };

  const finishQuiz = () => {
    const finalAnswers = { ...answers, [currentQuestion]: selectedAnswer };
    let score = 0;

    questions.forEach((question, index) => {
      if (finalAnswers[index] === question.correct) {
        score++;
      }
    });

    const percentage = Math.round((score / questions.length) * 100);

    // Save to history
    const history = localStorage.getItem(`quizHistory_${user.id}`) || '[]';
    const quizHistory = JSON.parse(history);
    
    const newResult = {
      categoryId,
      categoryName,
      score,
      percentage,
      date: new Date().toLocaleDateString(),
      questions,
      answers: finalAnswers
    };

    quizHistory.push(newResult);
    localStorage.setItem(`quizHistory_${user.id}`, JSON.stringify(quizHistory));

    // Navigate to results
    navigate('/results', { 
      state: { 
        score, 
        percentage,
        categoryName, 
        questions, 
        answers: finalAnswers 
      } 
    });
  };

  if (!user || questions.length === 0) return null;

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const currentQ = questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* Header */}
      <header className="bg-gray-800/70 backdrop-blur-sm border-b border-gray-700 shadow-lg">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Button
                onClick={() => navigate('/dashboard')}
                variant="ghost"
                className="text-gray-300 hover:text-white hover:bg-gray-700 mr-4"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
              <h1 className="text-xl font-bold text-white">{categoryName} Quiz</h1>
            </div>
            <div className="text-gray-300">
              Question {currentQuestion + 1} of {questions.length}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-3 bg-gray-700" />
        </div>

        {/* Question Card */}
        <Card className="bg-gray-800/70 border-gray-700 mb-8 shadow-lg">
          <CardHeader>
            <CardTitle className="text-white text-xl leading-relaxed">
              {currentQ.question}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {currentQ.options.map((option, index) => {
              const optionLetter = String.fromCharCode(65 + index); // A, B, C, D
              const isSelected = selectedAnswer === optionLetter;
              
              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(optionLetter)}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-500/20 text-white shadow-lg shadow-emerald-500/20'
                      : 'border-gray-600 bg-gray-700/50 text-gray-300 hover:border-gray-500 hover:bg-gray-700/70'
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center mr-4 font-semibold ${
                      isSelected
                        ? 'border-emerald-400 bg-emerald-500 text-white'
                        : 'border-gray-500 text-gray-400'
                    }`}>
                      {isSelected ? <Check className="w-4 h-4" /> : optionLetter}
                    </div>
                    <span className="text-lg">{option}</span>
                  </div>
                </button>
              );
            })}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-end">
          <Button
            onClick={handleNext}
            disabled={!selectedAnswer}
            className="bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700 text-white px-8 py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-lg"
          >
            {currentQuestion === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Quiz;
