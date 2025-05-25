
// Shared mock data store that both admin and user can access
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
  categoryId: number;
  question: string;
  options: string[];
  correct: string;
}

export interface QuizHistory {
  id: number;
  userId: number;
  categoryId: number;
  categoryName: string;
  score: number;
  percentage: number;
  date: string;
  questions: Question[];
  answers: Record<number, string>;
}

// Initialize data from localStorage or use defaults
const getStoredData = <T>(key: string, defaultValue: T): T => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch {
    return defaultValue;
  }
};

// Mock users
export let mockUsers: User[] = getStoredData('quiz_users', [
  { id: 1, email: 'user@quiz.com', password: 'user123', name: 'John Doe' },
  { id: 2, email: 'jane@quiz.com', password: 'jane123', name: 'Jane Smith' }
]);

// Mock admins
export const mockAdmins: Admin[] = [
  { id: 1, email: 'admin@quiz.com', password: 'admin123', name: 'Admin User' }
];

// Quiz categories - shared between admin and user
export let quizCategories: Category[] = getStoredData('quiz_categories', [
  { id: 1, name: 'Science' },
  { id: 2, name: 'History' },
  { id: 3, name: 'Movies' },
  { id: 4, name: 'Literature' }
]);

// Quiz questions - shared between admin and user
export let mockQuestions: Record<number, Question[]> = getStoredData('quiz_questions', {
  1: [ // Science
    {
      id: 1,
      categoryId: 1,
      question: "What is the chemical symbol for gold?",
      options: ["Go", "Gd", "Au", "Ag"],
      correct: "C"
    },
    {
      id: 2,
      categoryId: 1,
      question: "Which planet is known as the Red Planet?",
      options: ["Venus", "Mars", "Jupiter", "Saturn"],
      correct: "B"
    },
    {
      id: 3,
      categoryId: 1,
      question: "What is the speed of light in vacuum?",
      options: ["300,000 km/s", "150,000 km/s", "450,000 km/s", "600,000 km/s"],
      correct: "A"
    },
    {
      id: 4,
      categoryId: 1,
      question: "Which gas makes up approximately 78% of Earth's atmosphere?",
      options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Argon"],
      correct: "C"
    },
    {
      id: 5,
      categoryId: 1,
      question: "What is the smallest unit of matter?",
      options: ["Molecule", "Atom", "Electron", "Proton"],
      correct: "B"
    },
    {
      id: 6,
      categoryId: 1,
      question: "Which blood type is known as the universal donor?",
      options: ["A+", "B+", "AB+", "O-"],
      correct: "D"
    },
    {
      id: 7,
      categoryId: 1,
      question: "What force keeps planets in orbit around the sun?",
      options: ["Magnetic force", "Gravitational force", "Nuclear force", "Electric force"],
      correct: "B"
    }
  ],
  2: [ // History
    {
      id: 8,
      categoryId: 2,
      question: "In which year did World War II end?",
      options: ["1944", "1945", "1946", "1947"],
      correct: "B"
    },
    {
      id: 9,
      categoryId: 2,
      question: "Who was the first President of the United States?",
      options: ["Thomas Jefferson", "John Adams", "George Washington", "Benjamin Franklin"],
      correct: "C"
    },
    {
      id: 10,
      categoryId: 2,
      question: "Which ancient wonder of the world was located in Alexandria?",
      options: ["Hanging Gardens", "Lighthouse", "Colossus", "Mausoleum"],
      correct: "B"
    },
    {
      id: 11,
      categoryId: 2,
      question: "The Berlin Wall fell in which year?",
      options: ["1987", "1988", "1989", "1990"],
      correct: "C"
    },
    {
      id: 12,
      categoryId: 2,
      question: "Which empire was ruled by Julius Caesar?",
      options: ["Greek Empire", "Roman Empire", "Persian Empire", "Byzantine Empire"],
      correct: "B"
    },
    {
      id: 13,
      categoryId: 2,
      question: "In which year did the Titanic sink?",
      options: ["1910", "1911", "1912", "1913"],
      correct: "C"
    }
  ],
  3: [ // Movies
    {
      id: 14,
      categoryId: 3,
      question: "Which movie won the Academy Award for Best Picture in 2020?",
      options: ["1917", "Joker", "Parasite", "Once Upon a Time in Hollywood"],
      correct: "C"
    },
    {
      id: 15,
      categoryId: 3,
      question: "Who directed the movie 'Inception'?",
      options: ["Steven Spielberg", "Christopher Nolan", "Martin Scorsese", "Quentin Tarantino"],
      correct: "B"
    },
    {
      id: 16,
      categoryId: 3,
      question: "Which actor played Iron Man in the Marvel Cinematic Universe?",
      options: ["Chris Evans", "Chris Hemsworth", "Robert Downey Jr.", "Mark Ruffalo"],
      correct: "C"
    },
    {
      id: 17,
      categoryId: 3,
      question: "What is the highest-grossing film of all time (as of 2023)?",
      options: ["Titanic", "Avatar", "Avengers: Endgame", "Star Wars: The Force Awakens"],
      correct: "B"
    },
    {
      id: 18,
      categoryId: 3,
      question: "Which movie features the song 'My Heart Will Go On'?",
      options: ["The Bodyguard", "Titanic", "Ghost", "Dirty Dancing"],
      correct: "B"
    },
    {
      id: 19,
      categoryId: 3,
      question: "Who played the character of Jack Sparrow?",
      options: ["Orlando Bloom", "Johnny Depp", "Geoffrey Rush", "Keira Knightley"],
      correct: "B"
    }
  ],
  4: [ // Literature
    {
      id: 20,
      categoryId: 4,
      question: "Who wrote 'Pride and Prejudice'?",
      options: ["Charlotte Brontë", "Emily Brontë", "Jane Austen", "George Eliot"],
      correct: "C"
    },
    {
      id: 21,
      categoryId: 4,
      question: "Which Shakespeare play features the characters Romeo and Juliet?",
      options: ["Hamlet", "Macbeth", "Romeo and Juliet", "Othello"],
      correct: "C"
    },
    {
      id: 22,
      categoryId: 4,
      question: "Who wrote '1984'?",
      options: ["Aldous Huxley", "George Orwell", "Ray Bradbury", "Kurt Vonnegut"],
      correct: "B"
    },
    {
      id: 23,
      categoryId: 4,
      question: "Which novel begins with 'It was the best of times, it was the worst of times'?",
      options: ["Great Expectations", "Oliver Twist", "A Tale of Two Cities", "David Copperfield"],
      correct: "C"
    },
    {
      id: 24,
      categoryId: 4,
      question: "Who wrote 'To Kill a Mockingbird'?",
      options: ["Harper Lee", "Toni Morrison", "Flannery O'Connor", "Zora Neale Hurston"],
      correct: "A"
    },
    {
      id: 25,
      categoryId: 4,
      question: "Which epic poem was written by Homer?",
      options: ["The Aeneid", "The Iliad", "Beowulf", "The Divine Comedy"],
      correct: "B"
    }
  ]
});

// Functions to manage data
export const addUser = (user: Omit<User, 'id'>): User => {
  const newUser = { ...user, id: Math.max(...mockUsers.map(u => u.id), 0) + 1 };
  mockUsers.push(newUser);
  localStorage.setItem('quiz_users', JSON.stringify(mockUsers));
  return newUser;
};

export const addCategory = (name: string): Category => {
  const newCategory = { id: Math.max(...quizCategories.map(c => c.id), 0) + 1, name };
  quizCategories.push(newCategory);
  localStorage.setItem('quiz_categories', JSON.stringify(quizCategories));
  return newCategory;
};

export const deleteCategory = (id: number): void => {
  quizCategories = quizCategories.filter(c => c.id !== id);
  delete mockQuestions[id];
  localStorage.setItem('quiz_categories', JSON.stringify(quizCategories));
  localStorage.setItem('quiz_questions', JSON.stringify(mockQuestions));
};

export const addQuestion = (question: Omit<Question, 'id'>): Question => {
  const newId = Math.max(...Object.values(mockQuestions).flat().map(q => q.id), 0) + 1;
  const newQuestion = { ...question, id: newId };
  
  if (!mockQuestions[question.categoryId]) {
    mockQuestions[question.categoryId] = [];
  }
  
  mockQuestions[question.categoryId].push(newQuestion);
  localStorage.setItem('quiz_questions', JSON.stringify(mockQuestions));
  return newQuestion;
};

export const deleteQuestion = (categoryId: number, questionId: number): void => {
  if (mockQuestions[categoryId]) {
    mockQuestions[categoryId] = mockQuestions[categoryId].filter(q => q.id !== questionId);
    localStorage.setItem('quiz_questions', JSON.stringify(mockQuestions));
  }
};

export const getCategories = (): Category[] => {
  return getStoredData('quiz_categories', quizCategories);
};

export const getQuestions = (categoryId: number): Question[] => {
  const questions = getStoredData('quiz_questions', mockQuestions);
  return questions[categoryId] || [];
};

export const getAllQuestions = (): Record<number, Question[]> => {
  return getStoredData('quiz_questions', mockQuestions);
};
