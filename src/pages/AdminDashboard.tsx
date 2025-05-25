
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LogOut, Plus, Trash2, Settings, BookOpen, AlertTriangle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const AdminDashboard = () => {
  const [user, setUser] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [questions, setQuestions] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newQuestion, setNewQuestion] = useState({
    question: '',
    optionA: '',
    optionB: '',
    optionC: '',
    optionD: '',
    correct: ''
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const session = localStorage.getItem('userSession');
    if (!session) {
      navigate('/');
      return;
    }

    const userData = JSON.parse(session);
    if (userData.role !== 'admin') {
      navigate('/');
      return;
    }

    setUser(userData);
    loadCategories();
  }, [navigate]);

  const loadCategories = () => {
    const savedCategories = localStorage.getItem('quizCategories') || 
      JSON.stringify([
        { id: 1, name: 'Science' },
        { id: 2, name: 'History' },
        { id: 3, name: 'Movies' },
        { id: 4, name: 'Literature' }
      ]);
    setCategories(JSON.parse(savedCategories));
  };

  const loadQuestions = (categoryId) => {
    const savedQuestions = localStorage.getItem(`questions_${categoryId}`) || '[]';
    setQuestions(JSON.parse(savedQuestions));
  };

  useEffect(() => {
    if (selectedCategory) {
      loadQuestions(selectedCategory);
    }
  }, [selectedCategory]);

  const handleLogout = () => {
    localStorage.removeItem('userSession');
    navigate('/');
  };

  const addCategory = () => {
    if (!newCategoryName.trim()) {
      setMessage({ type: 'error', text: 'Category name cannot be empty' });
      return;
    }

    const existingCategory = categories.find(cat => 
      cat.name.toLowerCase() === newCategoryName.trim().toLowerCase()
    );

    if (existingCategory) {
      setMessage({ type: 'error', text: 'Category already exists' });
      return;
    }

    const newId = Math.max(...categories.map(cat => cat.id), 0) + 1;
    const newCategory = { id: newId, name: newCategoryName.trim() };
    const updatedCategories = [...categories, newCategory];
    
    setCategories(updatedCategories);
    localStorage.setItem('quizCategories', JSON.stringify(updatedCategories));
    setNewCategoryName('');
    setMessage({ type: 'success', text: 'Category added successfully' });

    toast({
      title: "Success",
      description: "Category added successfully",
    });
  };

  const deleteCategory = (categoryId) => {
    if (!window.confirm('Are you sure you want to delete this category? This will also delete all associated questions.')) {
      return;
    }

    const updatedCategories = categories.filter(cat => cat.id !== categoryId);
    setCategories(updatedCategories);
    localStorage.setItem('quizCategories', JSON.stringify(updatedCategories));
    localStorage.removeItem(`questions_${categoryId}`);
    
    if (selectedCategory === categoryId.toString()) {
      setSelectedCategory('');
      setQuestions([]);
    }

    setMessage({ type: 'success', text: 'Category deleted successfully' });
    toast({
      title: "Success",
      description: "Category and all associated questions deleted successfully",
    });
  };

  const addQuestion = () => {
    if (!selectedCategory) {
      setMessage({ type: 'error', text: 'Please select a category first' });
      return;
    }

    if (!newQuestion.question.trim() || !newQuestion.optionA.trim() || 
        !newQuestion.optionB.trim() || !newQuestion.optionC.trim() || 
        !newQuestion.optionD.trim() || !newQuestion.correct) {
      setMessage({ type: 'error', text: 'Please fill in all fields' });
      return;
    }

    const questionData = {
      id: Date.now(),
      question: newQuestion.question.trim(),
      options: [
        newQuestion.optionA.trim(),
        newQuestion.optionB.trim(),
        newQuestion.optionC.trim(),
        newQuestion.optionD.trim()
      ],
      correct: newQuestion.correct
    };

    const updatedQuestions = [...questions, questionData];
    setQuestions(updatedQuestions);
    localStorage.setItem(`questions_${selectedCategory}`, JSON.stringify(updatedQuestions));
    
    setNewQuestion({
      question: '',
      optionA: '',
      optionB: '',
      optionC: '',
      optionD: '',
      correct: ''
    });

    setMessage({ type: 'success', text: 'Question added successfully' });
    toast({
      title: "Success",
      description: "Question added successfully",
    });
  };

  const deleteQuestion = (questionId) => {
    if (!window.confirm('Are you sure you want to delete this question?')) {
      return;
    }

    const updatedQuestions = questions.filter(q => q.id !== questionId);
    setQuestions(updatedQuestions);
    localStorage.setItem(`questions_${selectedCategory}`, JSON.stringify(updatedQuestions));
    
    setMessage({ type: 'success', text: 'Question deleted successfully' });
    toast({
      title: "Success",
      description: "Question deleted successfully",
    });
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Settings className="w-8 h-8 text-blue-400 mr-3" />
              <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
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
        {/* Message Display */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-lg border ${
            message.type === 'success' 
              ? 'bg-green-500/20 border-green-500 text-green-400' 
              : 'bg-red-500/20 border-red-500 text-red-400'
          }`}>
            {message.text}
          </div>
        )}

        <Tabs defaultValue="categories" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-slate-800/50">
            <TabsTrigger value="categories" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
              Manage Categories
            </TabsTrigger>
            <TabsTrigger value="questions" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
              Manage Questions
            </TabsTrigger>
          </TabsList>

          {/* Manage Categories */}
          <TabsContent value="categories" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white text-xl">Add New Category</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4">
                  <Input
                    placeholder="Enter category name"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                  />
                  <Button
                    onClick={addCategory}
                    className="bg-blue-500 hover:bg-blue-600 text-white whitespace-nowrap"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Category
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white text-xl">Existing Categories</CardTitle>
              </CardHeader>
              <CardContent>
                {categories.length === 0 ? (
                  <p className="text-slate-400 text-center py-8">No categories found</p>
                ) : (
                  <div className="space-y-3">
                    {categories.map((category) => (
                      <div key={category.id} className="flex justify-between items-center p-4 bg-slate-700/30 rounded-lg border border-slate-600">
                        <span className="text-white font-medium">{category.name}</span>
                        <Button
                          onClick={() => deleteCategory(category.id)}
                          variant="outline"
                          size="sm"
                          className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Manage Questions */}
          <TabsContent value="questions" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white text-xl">Select Category</CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                    <SelectValue placeholder="Select a category to manage questions" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {selectedCategory && (
              <>
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white text-xl">
                      Add New Question for {categories.find(c => c.id.toString() === selectedCategory)?.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-slate-300">Question Text</Label>
                      <Textarea
                        placeholder="Enter your question"
                        value={newQuestion.question}
                        onChange={(e) => setNewQuestion(prev => ({ ...prev, question: e.target.value }))}
                        className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-slate-300">Option A</Label>
                        <Input
                          placeholder="Option A"
                          value={newQuestion.optionA}
                          onChange={(e) => setNewQuestion(prev => ({ ...prev, optionA: e.target.value }))}
                          className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                        />
                      </div>
                      <div>
                        <Label className="text-slate-300">Option B</Label>
                        <Input
                          placeholder="Option B"
                          value={newQuestion.optionB}
                          onChange={(e) => setNewQuestion(prev => ({ ...prev, optionB: e.target.value }))}
                          className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                        />
                      </div>
                      <div>
                        <Label className="text-slate-300">Option C</Label>
                        <Input
                          placeholder="Option C"
                          value={newQuestion.optionC}
                          onChange={(e) => setNewQuestion(prev => ({ ...prev, optionC: e.target.value }))}
                          className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                        />
                      </div>
                      <div>
                        <Label className="text-slate-300">Option D</Label>
                        <Input
                          placeholder="Option D"
                          value={newQuestion.optionD}
                          onChange={(e) => setNewQuestion(prev => ({ ...prev, optionD: e.target.value }))}
                          className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="text-slate-300">Correct Answer</Label>
                      <Select value={newQuestion.correct} onValueChange={(value) => setNewQuestion(prev => ({ ...prev, correct: value }))}>
                        <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                          <SelectValue placeholder="Select correct answer" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700">
                          <SelectItem value="A">A</SelectItem>
                          <SelectItem value="B">B</SelectItem>
                          <SelectItem value="C">C</SelectItem>
                          <SelectItem value="D">D</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button
                      onClick={addQuestion}
                      className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Question
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white text-xl flex items-center">
                      <BookOpen className="w-5 h-5 mr-2" />
                      Existing Questions ({questions.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {questions.length === 0 ? (
                      <div className="text-center py-8">
                        <AlertTriangle className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                        <p className="text-slate-400">No questions found for this category. Add some!</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {questions.map((question, index) => (
                          <div key={question.id} className="p-4 bg-slate-700/30 rounded-lg border border-slate-600">
                            <div className="flex justify-between items-start mb-3">
                              <h3 className="text-white font-medium flex-1 pr-4">
                                {index + 1}. {question.question}
                              </h3>
                              <Button
                                onClick={() => deleteQuestion(question.id)}
                                variant="outline"
                                size="sm"
                                className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              {question.options.map((option, optIndex) => {
                                const letter = String.fromCharCode(65 + optIndex);
                                const isCorrect = question.correct === letter;
                                return (
                                  <div key={optIndex} className={`p-2 rounded ${
                                    isCorrect ? 'bg-green-500/20 text-green-400' : 'bg-slate-600/30 text-slate-300'
                                  }`}>
                                    <strong>{letter}:</strong> {option}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
