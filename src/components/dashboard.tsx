"use client";

import { useState } from 'react';
import { UserPreferences } from '@/lib/openai';
import OnboardingQuiz from './onboarding/onboarding-quiz';

interface DashboardProps {
  userPreferences: UserPreferences;
  onPreferencesUpdate: (preferences: UserPreferences) => void;
  isDarkMode?: boolean;
}

export default function Dashboard({ userPreferences, onPreferencesUpdate, isDarkMode = false, onRecalibrate, onStartMealPlanning }: DashboardProps & { onRecalibrate: () => void; onStartMealPlanning: () => void; }) {
  const [showOnboarding, setShowOnboarding] = useState(false);

  const handleOnboardingComplete = (newPreferences: UserPreferences) => {
    onPreferencesUpdate(newPreferences);
    setShowOnboarding(false);
  };

  if (showOnboarding) {
    return (
      <OnboardingQuiz
        onComplete={handleOnboardingComplete}
      />
    );
  }

  return (
    <div className={`min-h-screen transition-all duration-300 pb-24 flex flex-col items-center justify-center ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-slate-900' 
        : 'bg-gradient-to-br from-gray-50 via-white to-blue-50'
    }`}>
      {/* Minimal Header */}
      <div className="text-center mb-6">
        <h1 className={`text-3xl font-light ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>Your Preferences</h1>
        <p className={`text-sm font-light ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>A quick summary of your meal planning profile</p>
      </div>
      
      {/* Clean Glass Container */}
      <div className={`w-full max-w-md mx-auto bg-white rounded-2xl border p-6 shadow-lg transition-all duration-300 ${
        isDarkMode 
          ? 'bg-gray-800 border-gray-600' 
          : 'bg-white border-gray-200'
      }`}>
        <ul className="space-y-2 text-sm" style={{ color: '#374151' }}>
          <li><span className="font-medium">Proteins:</span> {userPreferences.likedProteins.join(', ') || 'None selected'}</li>
          <li><span className="font-medium">Vegetables:</span> {userPreferences.likedVegetables.join(', ') || 'None selected'}</li>
          <li><span className="font-medium">Cuisines:</span> {userPreferences.cuisinePreferences.join(', ') || 'None selected'}</li>
          <li><span className="font-medium">Calorie Target:</span> {userPreferences.dailyCalorieTarget || 'Not set'} cal/day</li>
          <li><span className="font-medium">Health Goal:</span> {userPreferences.healthGoals || 'Not set'}</li>
          <li><span className="font-medium">Activity Level:</span> {userPreferences.activityLevel || 'Not set'}</li>
          <li><span className="font-medium">Weight Goal:</span> {userPreferences.currentWeight} → {userPreferences.goalWeight} lbs</li>
          <li><span className="font-medium">Grocery Store:</span> {userPreferences.preferredGroceryStore || 'Not set'}</li>
          <li><span className="font-medium">Location:</span> {userPreferences.location || 'Not set'}</li>
        </ul>
      </div>
      
      {/* Motivational Message */}
      <div className="text-center mt-6 max-w-lg">
        <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Your preferences power <span className="font-medium text-orange-600 dark:text-orange-400">hyper-personalized meal ideas</span> that hit your goals while staying in budget. <span className="font-medium">This is making groceries work for you</span>.
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
        <button
          onClick={onRecalibrate}
          className={`px-6 py-3 rounded-xl transition-all duration-300 ${
            isDarkMode 
              ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' 
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
          }`}
        >
          🔄 Recalibrate Preferences
        </button>
        <button
          onClick={onStartMealPlanning}
          className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-200 shadow-md hover:shadow-lg"
        >
          ✨ Start Meal Planning
        </button>
      </div>
    </div>
  );
} 