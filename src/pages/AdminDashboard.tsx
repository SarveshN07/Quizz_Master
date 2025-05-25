
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
import { getCategories, getAllQuestions, addCategory, deleteCategory, addQuestion, deleteQuestion } from '@/services/database';

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
  const [isDeleting, setIsDeleting] = useState(false);
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

  const loadCategories = async () => {
    try {
      const categoriesData = await getCategories();
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error loading categories:', error);
      toast({
        title: "Error",
        description: "Failed to load categories",
        variant: "destructive",
      });
    }
  };

  const loadQuestions = async (categoryId) => {
    try {
      const allQuestions = await getAllQuestions();
      setQuestions(allQuestions[categoryId] || []);
    } catch (error) {
      console.error('Error loading questions:', error);
      toast({
        title: "Error",
        description: "Failed to load questions",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (selectedCategory) {
      loadQuestions(parseInt(selectedCategory));
    }
  }, [selectedCategory]);

  const handleLogout = () => {
    localStorage.removeItem('userSession');
    navigate('/');
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      toast({
        title: "Error",
        description: "Category name cannot be empty",
        variant: "destructive",
      });
      return;
    }

    const existingCategory = categories.find(cat => 
      cat.name.toLowerCase() === newCategoryName.trim().toLowerCase()
    );

    if (existingCategory) {
      toast({
        title: "Error",
        description: "Category already exists",
        variant: "destructive",
      });
      return;
    }

    try {
      await addCategory(newCategoryName.trim());
      await loadCategories();
      setNewCategoryName('');
      
      toast({
        title: "Success",
        description: "Category added successfully",
      });
    } catch (error) {
      console.error('Error adding category:', error);
      toast({
        title: "Error",
        description: "Failed to add category",
        variant: "destructive",
      });
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (!window.confirm('Are you sure you want to delete this category? This will also delete all associated questions and quiz history records.')) {
      return;
    }

    setIsDeleting(true);
    try {
      console.log('Attempting to delete category:', categoryId);
      await deleteCategory(categoryId);
      console.log('Category deleted successfully');
      
      // Reload categories to reflect the deletion
      await loadCategories();
      
      // Clear selected category if it was the one being deleted
      if (selectedCategory === categoryId.toString()) {
        setSelectedCategory('');
        setQuestions([]);
      }

      toast({
        title: "Success",
        description: "Category and all associated data deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting category:', error);
      toast({
        title: "Error",
        description: `Failed to delete category: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleAddQuestion = async () => {
    if (!selectedCategory) {
      toast({
        title: "Error",
        description: "Please select a category first",
        variant: "destructive",
      });
      return;
    }

    if (!newQuestion.question.trim() || !newQuestion.optionA.trim() || 
        !newQuestion.optionB.trim() || !newQuestion.optionC.trim() || 
        !newQuestion.optionD.trim() || !newQuestion.correct) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    const questionData = {
      category_id: parseInt(selectedCategory),
      question: newQuestion.question.trim(),
      options: [
        newQuestion.optionA.trim(),
        newQuestion.optionB.trim(),
        newQuestion.optionC.trim(),
        newQuestion.optionD.trim()
      ],
      correct: newQuestion.correct
    };

    try {
      await addQuestion(questionData);
      await loadQuestions(parseInt(selectedCategory));
      
      setNewQuestion({
        question: '',
        optionA: '',
        optionB: '',
        optionC: '',
        optionD: '',
        correct: ''
      });

      toast({
        title: "Success",
        description: "Question added successfully",
      });
    } catch (error) {
      console.error('Error adding question:', error);
      toast({
        title: "Error",
        description: "Failed to add question",
        variant: "destructive",
      });
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    if (!window.confirm('Are you sure you want to delete this question?')) {
      return;
    }

    try {
      await deleteQuestion(questionId);
      await loadQuestions(parseInt(selectedCategory));
      
      toast({
        title: "Success",
        description: "Question deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting question:', error);
      toast({
        title: "Error",
        description: "Failed to delete question",
        variant: "destructive",
      });
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#1A1A1D]">
      {/* Header */}
      <header className="bg-[#2C2C30] backdrop-blur-sm border-b border-[#3D3D40] shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Settings className="w-8 h-8 text-[#6A0DAD] mr-3" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-[#6A0DAD] to-[#CC5500] bg-clip-text text-transparent">Admin Panel</h1>
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
        <Tabs defaultValue="categories" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-[#2C2C30] border border-[#3D3D40]">
            <TabsTrigger 
              value="categories" 
              className="data-[state=active]:bg-[#6A0DAD] data-[state=active]:text-[#E0E0E0] text-[#A0A0A0] hover:text-[#E0E0E0] transition-colors"
            >
              Manage Categories
            </TabsTrigger>
            <TabsTrigger 
              value="questions" 
              className="data-[state=active]:bg-[#6A0DAD] data-[state=active]:text-[#E0E0E0] text-[#A0A0A0] hover:text-[#E0E0E0] transition-colors"
            >
              Manage Questions
            </TabsTrigger>
          </TabsList>

          {/* Manage Categories */}
          <TabsContent value="categories" className="space-y-6">
            <Card className="bg-[#2C2C30] border-[#3D3D40] shadow-lg">
              <CardHeader>
                <CardTitle className="text-[#E0E0E0] text-xl">Add New Category</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4">
                  <Input
                    placeholder="Enter category name"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    className="bg-[#1E1E21] border-[#3D3D40] text-[#E0E0E0] placeholder:text-[#A0A0A0] focus:border-[#6A0DAD] focus:ring-[#6A0DAD]"
                  />
                  <Button
                    onClick={handleAddCategory}
                    className="bg-gradient-to-r from-[#6A0DAD] to-[#CC5500] hover:from-[#7B1BB8] hover:to-[#E6610D] text-[#E0E0E0] font-medium shadow-lg border-none whitespace-nowrap"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Category
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#2C2C30] border-[#3D3D40] shadow-lg">
              <CardHeader>
                <CardTitle className="text-[#E0E0E0] text-xl">Existing Categories</CardTitle>
              </CardHeader>
              <CardContent>
                {categories.length === 0 ? (
                  <p className="text-[#A0A0A0] text-center py-8">No categories found</p>
                ) : (
                  <div className="space-y-3">
                    {categories.map((category) => (
                      <div key={category.id} className="flex justify-between items-center p-4 bg-[#1E1E21] rounded-lg border border-[#3D3D40]">
                        <span className="text-[#E0E0E0] font-medium">{category.name}</span>
                        <Button
                          onClick={() => handleDeleteCategory(category.id)}
                          disabled={isDeleting}
                          variant="outline"
                          size="sm"
                          className="border-[#DC3545] bg-transparent text-[#DC3545] hover:bg-[#DC3545] hover:text-[#E0E0E0] hover:border-[#DC3545] disabled:opacity-50"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          {isDeleting ? 'Deleting...' : 'Delete'}
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
            <Card className="bg-[#2C2C30] border-[#3D3D40] shadow-lg">
              <CardHeader>
                <CardTitle className="text-[#E0E0E0] text-xl">Select Category</CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="bg-[#1E1E21] border-[#3D3D40] text-[#E0E0E0] focus:border-[#6A0DAD] focus:ring-[#6A0DAD]">
                    <SelectValue placeholder="Select a category to manage questions" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#2C2C30] border-[#3D3D40]">
                    {categories.map((category) => (
                      <SelectItem 
                        key={category.id} 
                        value={category.id.toString()}
                        className="text-[#E0E0E0] hover:bg-[#3D3D40] focus:bg-[#3D3D40]"
                      >
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {selectedCategory && (
              <>
                <Card className="bg-[#2C2C30] border-[#3D3D40] shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-[#E0E0E0] text-xl">
                      Add New Question for {categories.find(c => c.id.toString() === selectedCategory)?.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-[#A0A0A0]">Question Text</Label>
                      <Textarea
                        placeholder="Enter your question"
                        value={newQuestion.question}
                        onChange={(e) => setNewQuestion(prev => ({ ...prev, question: e.target.value }))}
                        className="bg-[#1E1E21] border-[#3D3D40] text-[#E0E0E0] placeholder:text-[#A0A0A0] focus:border-[#6A0DAD] focus:ring-[#6A0DAD]"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-[#A0A0A0]">Option A</Label>
                        <Input
                          placeholder="Option A"
                          value={newQuestion.optionA}
                          onChange={(e) => setNewQuestion(prev => ({ ...prev, optionA: e.target.value }))}
                          className="bg-[#1E1E21] border-[#3D3D40] text-[#E0E0E0] placeholder:text-[#A0A0A0] focus:border-[#6A0DAD] focus:ring-[#6A0DAD]"
                        />
                      </div>
                      <div>
                        <Label className="text-[#A0A0A0]">Option B</Label>
                        <Input
                          placeholder="Option B"
                          value={newQuestion.optionB}
                          onChange={(e) => setNewQuestion(prev => ({ ...prev, optionB: e.target.value }))}
                          className="bg-[#1E1E21] border-[#3D3D40] text-[#E0E0E0] placeholder:text-[#A0A0A0] focus:border-[#6A0DAD] focus:ring-[#6A0DAD]"
                        />
                      </div>
                      <div>
                        <Label className="text-[#A0A0A0]">Option C</Label>
                        <Input
                          placeholder="Option C"
                          value={newQuestion.optionC}
                          onChange={(e) => setNewQuestion(prev => ({ ...prev, optionC: e.target.value }))}
                          className="bg-[#1E1E21] border-[#3D3D40] text-[#E0E0E0] placeholder:text-[#A0A0A0] focus:border-[#6A0DAD] focus:ring-[#6A0DAD]"
                        />
                      </div>
                      <div>
                        <Label className="text-[#A0A0A0]">Option D</Label>
                        <Input
                          placeholder="Option D"
                          value={newQuestion.optionD}
                          onChange={(e) => setNewQuestion(prev => ({ ...prev, optionD: e.target.value }))}
                          className="bg-[#1E1E21] border-[#3D3D40] text-[#E0E0E0] placeholder:text-[#A0A0A0] focus:border-[#6A0DAD] focus:ring-[#6A0DAD]"
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="text-[#A0A0A0]">Correct Answer</Label>
                      <Select value={newQuestion.correct} onValueChange={(value) => setNewQuestion(prev => ({ ...prev, correct: value }))}>
                        <SelectTrigger className="bg-[#1E1E21] border-[#3D3D40] text-[#E0E0E0] focus:border-[#6A0DAD] focus:ring-[#6A0DAD]">
                          <SelectValue placeholder="Select correct answer" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#2C2C30] border-[#3D3D40]">
                          <SelectItem value="A" className="text-[#E0E0E0] hover:bg-[#3D3D40] focus:bg-[#3D3D40]">A</SelectItem>
                          <SelectItem value="B" className="text-[#E0E0E0] hover:bg-[#3D3D40] focus:bg-[#3D3D40]">B</SelectItem>
                          <SelectItem value="C" className="text-[#E0E0E0] hover:bg-[#3D3D40] focus:bg-[#3D3D40]">C</SelectItem>
                          <SelectItem value="D" className="text-[#E0E0E0] hover:bg-[#3D3D40] focus:bg-[#3D3D40]">D</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button
                      onClick={handleAddQuestion}
                      className="w-full bg-gradient-to-r from-[#6A0DAD] to-[#CC5500] hover:from-[#7B1BB8] hover:to-[#E6610D] text-[#E0E0E0] font-medium shadow-lg border-none"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Question
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-[#2C2C30] border-[#3D3D40] shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-[#E0E0E0] text-xl flex items-center">
                      <BookOpen className="w-5 h-5 mr-2 text-[#6A0DAD]" />
                      Existing Questions ({questions.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {questions.length === 0 ? (
                      <div className="text-center py-8">
                        <AlertTriangle className="w-12 h-12 text-[#A0A0A0] mx-auto mb-4" />
                        <p className="text-[#A0A0A0]">No questions found for this category. Add some!</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {questions.map((question, index) => (
                          <div key={question.id} className="p-4 bg-[#1E1E21] rounded-lg border border-[#3D3D40]">
                            <div className="flex justify-between items-start mb-3">
                              <h3 className="text-[#E0E0E0] font-medium flex-1 pr-4">
                                {index + 1}. {question.question}
                              </h3>
                              <Button
                                onClick={() => handleDeleteQuestion(question.id)}
                                variant="outline"
                                size="sm"
                                className="border-[#DC3545] bg-transparent text-[#DC3545] hover:bg-[#DC3545] hover:text-[#E0E0E0] hover:border-[#DC3545]"
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
                                    isCorrect ? 'bg-[#28A745]/20 text-[#28A745]' : 'bg-[#3D3D40]/30 text-[#A0A0A0]'
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
