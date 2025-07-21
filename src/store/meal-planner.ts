"use client";

import { create } from 'zustand';

export interface Recipe {
  id: string;
  name: string;
  description: string;
  prepTime: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  calories: number;
  cuisine: string;
  image?: string;
  ingredients: string[];
  instructions: string[];
  proteins: string[];
  vegetables: string[];
  starches: string[];
  isGoingOut?: boolean;
  mealType?: 'lunch' | 'dinner';
  restaurantName?: string;
}

export interface MealSlot {
  day: string;
  mealType: 'lunch' | 'dinner';
  recipe?: Recipe;
}

export interface WeeklyMealPlan {
  [day: string]: {
    lunch?: Recipe;
    dinner?: Recipe;
  };
}

export interface MultiWeekMealPlan {
  [weekKey: string]: WeeklyMealPlan;
}

interface MealPlannerState {
  // Recipe State
  availableRecipes: Recipe[];
  isGenerating: boolean;
  
  // Meal Plan State
  mealPlans: MultiWeekMealPlan;
  currentWeekOffset: number;
  isWeekLocked: boolean;
  
  // Rotation & Custom Meals
  rotationRecipes: Recipe[];
  customRecipes: Recipe[];
  
  // Drag and Drop State
  draggedRecipe: Recipe | null;
  draggedMealSource: { day: string; mealType: 'lunch' | 'dinner' } | null;
  
  // Actions
  setAvailableRecipes: (recipes: Recipe[]) => void;
  setIsGenerating: (generating: boolean) => void;
  setCurrentWeekOffset: (offset: number) => void;
  getCurrentWeekMealPlan: () => WeeklyMealPlan;
  addMealToPlan: (day: string, mealType: 'lunch' | 'dinner', recipe: Recipe) => void;
  removeMealFromPlan: (day: string, mealType: 'lunch' | 'dinner') => void;
  updateMealInPlan: (day: string, mealType: 'lunch' | 'dinner', updates: Partial<Recipe>) => void;
  moveMealInPlan: (fromDay: string, fromMealType: 'lunch' | 'dinner', toDay: string, toMealType: 'lunch' | 'dinner') => void;
  setDraggedRecipe: (recipe: Recipe | null) => void;
  setDraggedMealSource: (source: { day: string; mealType: 'lunch' | 'dinner' } | null) => void;
  clearMealPlan: () => void;
  clearCurrentWeekMealPlan: () => void;
  
  // Week Lock Actions
  lockWeek: () => void;
  unlockWeek: () => void;
  
  // Rotation Actions
  addToRotation: (recipe: Recipe) => void;
  removeFromRotation: (recipeId: string) => void;
  isInRotation: (recipeId: string) => boolean;
  
  // Custom Meals Actions
  addCustomRecipe: (recipe: Recipe) => void;
  removeCustomRecipe: (recipeId: string) => void;
  updateCustomRecipe: (recipeId: string, updates: Partial<Recipe>) => void;
}

const WEEK_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

// Helper function to get week key for a given offset
const getWeekKey = (offset: number): string => {
  const today = new Date();
  const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 1 + (offset * 7)));
  return `${startOfWeek.getFullYear()}-W${Math.ceil(startOfWeek.getDate() / 7)}-${startOfWeek.getMonth()}`;
};

// Helper function to create empty week plan
const createEmptyWeekPlan = (): WeeklyMealPlan => {
  return WEEK_DAYS.reduce((acc, day) => {
    acc[day] = {};
    return acc;
  }, {} as WeeklyMealPlan);
};

// Persistence helpers
const loadMealPlans = (): MultiWeekMealPlan => {
  try {
    const stored = localStorage.getItem('chefmate-meal-plans');
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
};

const saveMealPlans = (mealPlans: MultiWeekMealPlan) => {
  try {
    localStorage.setItem('chefmate-meal-plans', JSON.stringify(mealPlans));
  } catch {
    // Silently fail if localStorage is not available
  }
};

const loadRotationRecipes = (): Recipe[] => {
  try {
    const stored = localStorage.getItem('chefmate-rotation');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveRotationRecipes = (rotation: Recipe[]) => {
  try {
    localStorage.setItem('chefmate-rotation', JSON.stringify(rotation));
  } catch {
    // Silently fail if localStorage is not available
  }
};

const loadCustomRecipes = (): Recipe[] => {
  try {
    const stored = localStorage.getItem('chefmate-custom-recipes');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveCustomRecipes = (customRecipes: Recipe[]) => {
  try {
    localStorage.setItem('chefmate-custom-recipes', JSON.stringify(customRecipes));
  } catch {
    // Silently fail if localStorage is not available
  }
};

export const useMealPlannerStore = create<MealPlannerState>((set, get) => ({
  // Initial State
  availableRecipes: [],
  isGenerating: false,
  mealPlans: loadMealPlans(),
  currentWeekOffset: 0,
  isWeekLocked: false,
  rotationRecipes: loadRotationRecipes(),
  customRecipes: loadCustomRecipes(),
  draggedRecipe: null,
  draggedMealSource: null,

  // Actions
  setAvailableRecipes: (recipes) => set({ availableRecipes: recipes }),
  
  setIsGenerating: (generating) => set({ isGenerating: generating }),
  
  setCurrentWeekOffset: (offset) => set({ currentWeekOffset: offset }),
  
  getCurrentWeekMealPlan: () => {
    const state = get();
    const weekKey = getWeekKey(state.currentWeekOffset);
    return state.mealPlans[weekKey] || createEmptyWeekPlan();
  },
  
  addMealToPlan: (day, mealType, recipe) => set((state) => {
    const weekKey = getWeekKey(state.currentWeekOffset);
    const currentWeekPlan = state.mealPlans[weekKey] || createEmptyWeekPlan();
    
    const updatedMealPlans = {
      ...state.mealPlans,
      [weekKey]: {
        ...currentWeekPlan,
        [day]: {
          ...currentWeekPlan[day],
          [mealType]: recipe,
        },
      },
    };
    
    saveMealPlans(updatedMealPlans);
    return { mealPlans: updatedMealPlans };
  }),
  
  removeMealFromPlan: (day, mealType) => set((state) => {
    const weekKey = getWeekKey(state.currentWeekOffset);
    const currentWeekPlan = state.mealPlans[weekKey] || createEmptyWeekPlan();
    
    const updatedMealPlans = {
      ...state.mealPlans,
      [weekKey]: {
        ...currentWeekPlan,
        [day]: {
          ...currentWeekPlan[day],
          [mealType]: undefined,
        },
      },
    };
    
    saveMealPlans(updatedMealPlans);
    return { mealPlans: updatedMealPlans };
  }),
  
  updateMealInPlan: (day, mealType, updates) => set((state) => {
    const weekKey = getWeekKey(state.currentWeekOffset);
    const currentWeekPlan = state.mealPlans[weekKey] || createEmptyWeekPlan();
    const currentMeal = currentWeekPlan[day]?.[mealType];
    
    if (!currentMeal) return state;
    
    const updatedMealPlans = {
      ...state.mealPlans,
      [weekKey]: {
        ...currentWeekPlan,
        [day]: {
          ...currentWeekPlan[day],
          [mealType]: {
            ...currentMeal,
            ...updates,
          },
        },
      },
    };
    
    saveMealPlans(updatedMealPlans);
    return { mealPlans: updatedMealPlans };
  }),
  
  moveMealInPlan: (fromDay, fromMealType, toDay, toMealType) => set((state) => {
    const weekKey = getWeekKey(state.currentWeekOffset);
    const currentWeekPlan = state.mealPlans[weekKey] || createEmptyWeekPlan();
    const mealToMove = currentWeekPlan[fromDay]?.[fromMealType];
    const mealAtDestination = currentWeekPlan[toDay]?.[toMealType];
    
    if (!mealToMove) return state;
    
    const updatedMealPlans = {
      ...state.mealPlans,
      [weekKey]: {
        ...currentWeekPlan,
        [fromDay]: {
          ...currentWeekPlan[fromDay],
          [fromMealType]: mealAtDestination, // Swap meals or place undefined
        },
        [toDay]: {
          ...currentWeekPlan[toDay],
          [toMealType]: mealToMove,
        },
      },
    };
    
    saveMealPlans(updatedMealPlans);
    return { mealPlans: updatedMealPlans };
  }),
  
  setDraggedRecipe: (recipe) => set({ draggedRecipe: recipe }),
  
  setDraggedMealSource: (source) => set({ draggedMealSource: source }),
  
  clearMealPlan: () => set((state) => {
    const updatedMealPlans = {};
    saveMealPlans(updatedMealPlans);
    return { mealPlans: updatedMealPlans };
  }),
  
  clearCurrentWeekMealPlan: () => set((state) => {
    const weekKey = getWeekKey(state.currentWeekOffset);
    const updatedMealPlans = {
      ...state.mealPlans,
      [weekKey]: createEmptyWeekPlan(),
    };
    
    saveMealPlans(updatedMealPlans);
    return { mealPlans: updatedMealPlans };
  }),
  
  // Rotation Actions
  addToRotation: (recipe) => set((state) => {
    if (state.rotationRecipes.some(rot => rot.id === recipe.id)) {
      return state; // Already in rotation
    }
    
    const updatedRotation = [...state.rotationRecipes, recipe];
    saveRotationRecipes(updatedRotation);
    return { rotationRecipes: updatedRotation };
  }),
  
  removeFromRotation: (recipeId) => set((state) => {
    const updatedRotation = state.rotationRecipes.filter(recipe => recipe.id !== recipeId);
    saveRotationRecipes(updatedRotation);
    return { rotationRecipes: updatedRotation };
  }),
  
  isInRotation: (recipeId) => {
    const state = get();
    return state.rotationRecipes.some(recipe => recipe.id === recipeId);
  },
  
  // Custom Meals Actions
  addCustomRecipe: (recipe) => set((state) => {
    // Only generate new ID if recipe doesn't already have a custom ID
    const customRecipe = {
      ...recipe,
      id: recipe.id && recipe.id.startsWith('custom-') ? recipe.id : `custom-${Date.now()}`,
    };
    
    const updatedCustomRecipes = [...state.customRecipes, customRecipe];
    saveCustomRecipes(updatedCustomRecipes);
    return { customRecipes: updatedCustomRecipes };
  }),
  
  removeCustomRecipe: (recipeId) => set((state) => {
    const updatedCustomRecipes = state.customRecipes.filter(recipe => recipe.id !== recipeId);
    saveCustomRecipes(updatedCustomRecipes);
    return { customRecipes: updatedCustomRecipes };
  }),
  
  updateCustomRecipe: (recipeId, updates) => set((state) => {
    const updatedCustomRecipes = state.customRecipes.map(recipe =>
      recipe.id === recipeId ? { ...recipe, ...updates } : recipe
    );
    saveCustomRecipes(updatedCustomRecipes);
    return { customRecipes: updatedCustomRecipes };
  }),
  
  // Week Lock Actions
  lockWeek: () => set({ isWeekLocked: true }),
  unlockWeek: () => set({ isWeekLocked: false }),
}));