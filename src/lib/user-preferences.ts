import { UserPreferences } from './openai';

const STORAGE_KEY = 'yeschef_user_preferences';

export function saveUserPreferences(preferences: UserPreferences): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
  }
}

export function getUserPreferences(): UserPreferences | null {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (error) {
        console.error('Error parsing user preferences:', error);
        return null;
      }
    }
  }
  return null;
}

export function hasUserPreferences(): boolean {
  return getUserPreferences() !== null;
}

export function clearUserPreferences(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
  }
}

// Default preferences for new users
export function getDefaultPreferences(): Partial<UserPreferences> {
  return {
    likedProteins: [],
    dislikedProteins: [],
    likedVegetables: [],
    dislikedVegetables: [],
    likedStarches: ['Rice', 'Pasta', 'Potatoes', 'Quinoa', 'Bread'],
    dislikedStarches: [],
    cuisinePreferences: [],
    dietaryRestrictions: [],
    healthGoals: 'maintain_weight',
    currentWeight: 150,
    goalWeight: 150,
    dailyCalorieTarget: 2000,
    activityLevel: 'moderate',
    favoriteRestaurants: [],
    location: '',
    mealsPerWeek: 14,
    goingOutFrequency: 2
  };
}