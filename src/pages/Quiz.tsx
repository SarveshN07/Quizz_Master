
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';

// Mock quiz questions
const mockQuestions = {
  1: [ // Science
    {
      id: 1,
      question: "What is the chemical symbol for gold?",
      options: ["Go", "Gd", "Au", "Ag"],
      correct: "C"
    },
    {
      id: 2,
      question: "Which planet is known as the Red Planet?",
      options: ["Venus", "Mars", "Jupiter", "Saturn"],
      correct: "B"
    },
    {
      id: 3,
      question: "What is the speed of light in vacuum?",
      options: ["300,000 km/s", "150,000 km/s", "450,000 km/s", "600,000 km/s"],
      correct: "A"
    },
    {
      id: 4,
      question: "Which gas makes up approximately 78% of Earth's atmosphere?",
      options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Argon"],
      correct: "C"
    },
    {
      id: 5,
      question: "What is the smallest unit of matter?",
      options: ["Molecule", "Atom", "Electron", "Proton"],
      correct: "B"
    },
    {
      id: 6,
      question: "Which blood type is known as the universal donor?",
      options: ["A+", "B+", "AB+", "O-"],
      correct: "D"
    },
    {
      id: 7,
      question: "What force keeps planets in orbit around the sun?",
      options: ["Magnetic force", "Gravitational force", "Nuclear force", "Electric force"],
      correct: "B"
    }
  ],
  2: [ // History
    {
      id: 1,
      question: "In which year did World War II end?",
      options: ["1944", "1945", "1946", "1947"],
      correct: "B"
    },
    {
      id: 2,
      question: "Who was the first President of the United States?",
      options: ["Thomas Jefferson", "John Adams", "George Washington", "Benjamin Franklin"],
      correct: "C"
    },
    {
      id: 3,
      question: "Which ancient wonder of the world was located in Alexandria?",
      options: ["Hanging Gardens", "Lighthouse", "Colossus", "Mausoleum"],
      correct: "B"
    },
    {
      id: 4,
      question: "The Berlin Wall fell in which year?",
      options: ["1987", "1988", "1989", "1990"],
      correct: "C"
    },
    {
      id: 5,
      question: "Which empire was ruled by Julius Caesar?",
      options: ["Greek Empire", "Roman Empire", "Persian Empire", "Byzantine Empire"],
      correct: "B"
    },
    {
      id: 6,
      question: "In which year did the Titanic sink?",
      options: ["1910", "1911", "1912", "1913"],
      correct: "C"
    }
  ],
  3: [ // Movies
    {
      id: 1,
      question: "Which movie won the Academy Award for Best Picture in 2020?",
      options: ["1917", "Joker", "Parasite", "Once Upon a Time in Hollywood"],
      correct: "C"
    },
    {
      id: 2,
      question: "Who directed the movie 'Inception'?",
      options: ["Steven Spielberg", "Christopher Nolan", "Martin Scorsese", "Quentin Tarantino"],
      correct: "B"
    },
    {
      id: 3,
      question: "Which actor played Iron Man in the Marvel Cinematic Universe?",
      options: ["Chris Evans", "Chris Hemsworth", "Robert Downey Jr.", "Mark Ruffalo"],
      correct: "C"
    },
    {
      id: 4,
      question: "What is the highest-grossing film of all time (as of 2023)?",
      options: ["Titanic", "Avatar", "Avengers: Endgame", "Star Wars: The Force Awakens"],
      correct: "B"
    },
    {
      id: 5,
      question: "Which movie features the song 'My Heart Will Go On'?",
      options: ["The Bodyguard", "Titanic", "Ghost", "Dirty Dancing"],
      correct: "B"
    },
    {
      id: 6,
      question: "Who played the character of Jack Sparrow?",
      options: ["Orlando Bloom", "Johnny Depp", "Geoffrey Rush", "Keira Knightley"],
      correct: "B"
    }
  ],
  4: [ // Literature
    {
      id: 1,
      question: "Who wrote 'Pride and Prejudice'?",
      options: ["Charlotte Brontë", "Emily Brontë", "Jane Austen", "George Eliot"],
      correct: "C"
    },
    {
      id: 2,
      question: "Which Shakespeare play features the characters Romeo and Juliet?",
      options: ["Hamlet", "Macbeth", "Romeo and Juliet", "Othello"],
      correct: "C"
    },
    {
      id: 3,
      question: "Who wrote '1984'?",
      options: ["Aldous Huxley", "George Orwell", "Ray Bradbury", "Kurt Vonnegut"],
      correct: "B"
    },
    {
      id: 4,
      question: "Which novel begins with 'It was the best of times, it was the worst of times'?",
      options: ["Great Expectations", "Oliver Twist", "A Tale of Two Cities", "David Copperfield"],
      correct: "C"
    },
    {
      id: 5,
      question: "Who wrote 'To Kill a Mockingbird'?",
      options: ["Harper Lee", "Toni Morrison", "Flannery O'Connor", "Zora Neale Hurston"],
      correct: "A"
    },
    {
      id: 6,
      question: "Which epic poem was written by Homer?",
      options: ["The Aeneid", "The Iliad", "Beowulf", "The Divine Comedy"],
      correct: "B"
    }
  ]
};

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

    // Get questions for this category and randomize 5
    const categoryQuestions = mockQuestions[catId] || [];
    const shuffled = [...categoryQuestions].sort(() => 0.5 - Math.random());
    const selectedQuestions = shuffled.slice(0, 5);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Button
                onClick={() => navigate('/dashboard')}
                variant="ghost"
                className="text-slate-300 hover:text-white mr-4"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
              <h1 className="text-xl font-bold text-white">{categoryName} Quiz</h1>
            </div>
            <div className="text-slate-300">
              Question {currentQuestion + 1} of {questions.length}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-slate-400 mb-2">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2 bg-slate-700" />
        </div>

        {/* Question Card */}
        <Card className="bg-slate-800/50 border-slate-700 mb-8">
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
                      ? 'border-blue-500 bg-blue-500/20 text-white'
                      : 'border-slate-600 bg-slate-700/30 text-slate-300 hover:border-slate-500 hover:bg-slate-700/50'
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center mr-4 font-semibold ${
                      isSelected
                        ? 'border-blue-400 bg-blue-500 text-white'
                        : 'border-slate-500 text-slate-400'
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
            className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
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
