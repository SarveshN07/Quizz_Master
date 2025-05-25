
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { getQuestions, addQuizHistory } from '@/services/database';
import type { Question } from '@/services/database';

const Quiz = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [answers, setAnswers] = useState({});
  const [categoryId, setCategoryId] = useState<number | null>(null);
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

    const catId = parseInt(searchParams.get('category') || '0');
    const catName = searchParams.get('name') || '';
    
    if (!catId || !catName) {
      navigate('/dashboard');
      return;
    }

    setCategoryId(catId);
    setCategoryName(catName);

    // Get questions from database
    loadQuestions(catId);
  }, [searchParams, navigate]);

  const loadQuestions = async (catId: number) => {
    try {
      const categoryQuestions = await getQuestions(catId);
      
      if (categoryQuestions.length === 0) {
        navigate('/dashboard');
        return;
      }
      
      // Randomize and select 5 questions
      const shuffled = [...categoryQuestions].sort(() => 0.5 - Math.random());
      const selectedQuestions = shuffled.slice(0, Math.min(5, shuffled.length));
      setQuestions(selectedQuestions);
    } catch (error) {
      console.error('Error loading questions:', error);
      navigate('/dashboard');
    }
  };

  const handleAnswerSelect = (answer: string) => {
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

  const finishQuiz = async () => {
    const finalAnswers = { ...answers, [currentQuestion]: selectedAnswer };
    let score = 0;

    questions.forEach((question, index) => {
      if (finalAnswers[index] === question.correct) {
        score++;
      }
    });

    const percentage = Math.round((score / questions.length) * 100);

    try {
      // Save to database
      await addQuizHistory({
        user_id: user.id,
        category_id: categoryId!,
        category_name: categoryName,
        score,
        percentage,
        date: new Date().toLocaleDateString(),
        questions,
        answers: finalAnswers
      });

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
    } catch (error) {
      console.error('Error saving quiz history:', error);
      // Still navigate to results even if saving fails
      navigate('/results', { 
        state: { 
          score, 
          percentage,
          categoryName, 
          questions, 
          answers: finalAnswers 
        } 
      });
    }
  };

  if (!user || questions.length === 0) return null;

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const currentQ = questions[currentQuestion];

  return (
    <div className="min-h-screen bg-[#1A1A1D]">
      {/* Header */}
      <header className="bg-[#2C2C30] backdrop-blur-sm border-b border-[#3D3D40] shadow-lg">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Button
                onClick={() => navigate('/dashboard')}
                variant="ghost"
                className="text-[#A0A0A0] hover:text-[#E0E0E0] hover:bg-[#3D3D40] mr-4"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
              <h1 className="text-xl font-bold text-[#E0E0E0]">{categoryName} Quiz</h1>
            </div>
            <div className="text-[#A0A0A0]">
              Question {currentQuestion + 1} of {questions.length}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-[#A0A0A0] mb-2">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-3 bg-[#3D3D40]" />
        </div>

        {/* Question Card */}
        <Card className="bg-[#2C2C30] border-[#3D3D40] mb-8 shadow-lg">
          <CardHeader>
            <CardTitle className="text-[#E0E0E0] text-xl leading-relaxed">
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
                      ? 'border-[#6A0DAD] bg-[#6A0DAD]/20 text-[#E0E0E0] shadow-lg shadow-[#6A0DAD]/20'
                      : 'border-[#3D3D40] bg-[#1E1E21] text-[#A0A0A0] hover:border-[#A0A0A0] hover:bg-[#2C2C30]'
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center mr-4 font-semibold ${
                      isSelected
                        ? 'border-[#6A0DAD] bg-[#6A0DAD] text-[#E0E0E0]'
                        : 'border-[#A0A0A0] text-[#A0A0A0]'
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
            className="bg-gradient-to-r from-[#6A0DAD] to-[#CC5500] hover:from-[#7B1BB8] hover:to-[#E6610D] text-[#E0E0E0] px-8 py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-lg border-none"
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
