
import { supabase } from '@/integrations/supabase/client';

export interface User {
  id: number;
  email: string;
  password: string;
  name: string;
}

export interface Admin {
  id: number;
  email: string;
  password: string;
  name: string;
}

export interface Category {
  id: number;
  name: string;
}

export interface Question {
  id: number;
  category_id: number;
  question: string;
  options: string[];
  correct: string;
}

export interface QuizHistory {
  id: number;
  user_id: number;
  category_id: number;
  category_name: string;
  score: number;
  percentage: number;
  date: string;
  questions: Question[];
  answers: Record<number, string>;
}

// User operations
export const getUsers = async (): Promise<User[]> => {
  const { data, error } = await supabase.from('users').select('*');
  if (error) throw error;
  return data || [];
};

export const addUser = async (user: Omit<User, 'id'>): Promise<User> => {
  const { data, error } = await supabase
    .from('users')
    .insert([user])
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const authenticateUser = async (email: string, password: string): Promise<User | null> => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .eq('password', password)
    .single();
  if (error) return null;
  return data;
};

// Admin operations
export const getAdmins = async (): Promise<Admin[]> => {
  const { data, error } = await supabase.from('admins').select('*');
  if (error) throw error;
  return data || [];
};

export const authenticateAdmin = async (email: string, password: string): Promise<Admin | null> => {
  const { data, error } = await supabase
    .from('admins')
    .select('*')
    .eq('email', email)
    .eq('password', password)
    .single();
  if (error) return null;
  return data;
};

// Category operations
export const getCategories = async (): Promise<Category[]> => {
  const { data, error } = await supabase.from('categories').select('*').order('id');
  if (error) throw error;
  return data || [];
};

export const addCategory = async (name: string): Promise<Category> => {
  const { data, error } = await supabase
    .from('categories')
    .insert([{ name }])
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const deleteCategory = async (id: number): Promise<void> => {
  const { error } = await supabase.from('categories').delete().eq('id', id);
  if (error) throw error;
};

// Question operations
export const getQuestions = async (categoryId: number): Promise<Question[]> => {
  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .eq('category_id', categoryId)
    .order('id');
  if (error) throw error;
  return data?.map(q => ({
    ...q,
    options: Array.isArray(q.options) ? q.options : JSON.parse(q.options as string)
  })) || [];
};

export const getAllQuestions = async (): Promise<Record<number, Question[]>> => {
  const { data, error } = await supabase.from('questions').select('*').order('category_id', { ascending: true });
  if (error) throw error;
  
  const questionsByCategory: Record<number, Question[]> = {};
  data?.forEach(q => {
    if (!questionsByCategory[q.category_id]) {
      questionsByCategory[q.category_id] = [];
    }
    questionsByCategory[q.category_id].push({
      ...q,
      options: Array.isArray(q.options) ? q.options : JSON.parse(q.options as string)
    });
  });
  
  return questionsByCategory;
};

export const addQuestion = async (question: Omit<Question, 'id'>): Promise<Question> => {
  const { data, error } = await supabase
    .from('questions')
    .insert([{
      category_id: question.category_id,
      question: question.question,
      options: JSON.stringify(question.options),
      correct: question.correct
    }])
    .select()
    .single();
  if (error) throw error;
  return {
    ...data,
    options: Array.isArray(data.options) ? data.options : JSON.parse(data.options as string)
  };
};

export const deleteQuestion = async (questionId: number): Promise<void> => {
  const { error } = await supabase.from('questions').delete().eq('id', questionId);
  if (error) throw error;
};

// Quiz history operations
export const getQuizHistory = async (userId: number): Promise<QuizHistory[]> => {
  const { data, error } = await supabase
    .from('quiz_history')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  
  return data?.map(history => ({
    ...history,
    questions: Array.isArray(history.questions) ? history.questions : JSON.parse(history.questions as string),
    answers: typeof history.answers === 'object' ? history.answers : JSON.parse(history.answers as string)
  })) || [];
};

export const addQuizHistory = async (history: Omit<QuizHistory, 'id'>): Promise<QuizHistory> => {
  const { data, error } = await supabase
    .from('quiz_history')
    .insert([{
      user_id: history.user_id,
      category_id: history.category_id,
      category_name: history.category_name,
      score: history.score,
      percentage: history.percentage,
      date: history.date,
      questions: JSON.stringify(history.questions),
      answers: JSON.stringify(history.answers)
    }])
    .select()
    .single();
  if (error) throw error;
  return {
    ...data,
    questions: Array.isArray(data.questions) ? data.questions : JSON.parse(data.questions as string),
    answers: typeof data.answers === 'object' ? data.answers : JSON.parse(data.answers as string)
  };
};
