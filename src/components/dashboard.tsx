"use client";

import { useState } from 'react';
import { UserPreferences } from '@/lib/openai';
import OnboardingQuiz from './onboarding/onboarding-quiz';

interface DashboardProps {
  userPreferences: UserPreferences;
  onPreferencesUpdate: (preferences: UserPreferences) => void;
  isDarkMode?: boolean;
}

const getCuisineIcon = (cuisine: string) => {
  const icons: Record<string, string> = {
    'Italian': '🍝',
    'Asian': '🥢',
    'Mexican': '🌮',
    'Mediterranean': '🫒',
    'Indian': '🍛',
    'Thai': '🥘',
    'French': '🥖',
    'American': '🍔',
    'Japanese': '🍱',
    'Korean': '🍜',
    'Middle Eastern': '🥙',
    'Greek': '🧀'
  };
  return icons[cuisine] || '🍽️';
};

const getActivityIcon = (activity: string) => {
  const icons: Record<string, string> = {
    'Sedentary (desk job)': '🪑',
    'Light (1-3 days/week)': '🚶',
    'Moderate (3-5 days/week)': '🏃',
    'Active (6-7 days/week)': '💪',
    'Very Active (2x/day)': '🔥'
  };
  return icons[activity] || '🏃';
};

export default function Dashboard({ userPreferences, onPreferencesUpdate, isDarkMode = false, onRecalibrate, onStartMealPlanning }: DashboardProps & { onRecalibrate: () => void; onStartMealPlanning: () => void; }) {
  const [showOnboarding, setShowOnboarding] = useState(false);

  const handleOnboardingComplete = (newPreferences: UserPreferences) => {
    onPreferencesUpdate(newPreferences);
    setShowOnboarding(false);
  };

  const handleSkipOnboarding = () => {
    setShowOnboarding(false);
  };

  if (showOnboarding) {
    return (
      <OnboardingQuiz
        onComplete={handleOnboardingComplete}
        onSkip={handleSkipOnboarding}
      />
    );
  }

  // Calculate some analytics
  const proteinCount = userPreferences.likedProteins.length;
  const vegetableCount = userPreferences.likedVegetables.length;
  const cuisineCount = userPreferences.cuisinePreferences.length;
  const calorieDeficit = userPreferences.currentWeight > userPreferences.goalWeight;
  const weeklyCalorieDeficit = calorieDeficit ? 
    (userPreferences.currentWeight - userPreferences.goalWeight) * 500 : 0;

  return (
    <div className={`min-h-screen transition-all duration-300 pb-24 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-slate-900' 
        : 'bg-gradient-to-br from-gray-50 via-white to-blue-50'
    }`}>
      {/* Header */}
      <div className="pt-8 pb-6">
        <div className="text-center">
          <div className="inline-flex items-center gap-3 mb-2">
            <div className="p-3 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl shadow-lg">
              <span className="text-2xl text-white">👨‍🍳</span>
            </div>
            <h1 className={`text-4xl font-light bg-gradient-to-r bg-clip-text text-transparent transition-all duration-300 ${
              isDarkMode 
                ? 'from-gray-100 to-gray-300' 
                : 'from-gray-800 to-gray-600'
            }`}>
              yeschef
            </h1>
          </div>
          <p className={`text-sm font-light transition-all duration-300 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>Your personal meal planning assistant</p>
        </div>
      </div>

      {/* Action Bar */}
      <div className="text-center mb-8">
        <div className={`inline-flex items-center gap-4 backdrop-blur-sm rounded-2xl p-2 shadow-sm border transition-all duration-300 ${
          isDarkMode 
            ? 'bg-gray-800/80 border-gray-700' 
            : 'bg-white/80 border-gray-100'
        }`}>
          <button 
            onClick={() => setShowOnboarding(true)}
            className={`px-4 py-2 text-sm transition-colors rounded-xl relative ${
              isDarkMode 
                ? 'text-gray-300 hover:text-gray-100 hover:bg-gray-700' 
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            Preferences
            {/* Green checkmark for completed onboarding */}
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">✓</span>
            </span>
          </button>
          <div className={`w-px h-6 ${isDarkMode ? 'bg-gray-600' : 'bg-gray-200'}`}></div>
          <button 
            className="px-6 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            ✨ Generate Fresh Ideas
          </button>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="max-w-6xl mx-auto px-4">
        {/* Welcome Section */}
        <div className={`backdrop-blur-sm rounded-3xl border p-8 mb-8 transition-all duration-300 ${
          isDarkMode 
            ? 'bg-gray-800/70 border-gray-700' 
            : 'bg-white/70 border-gray-100'
        }`}>
          <div className="text-center">
            <h2 className={`text-3xl font-light mb-4 transition-colors duration-300 ${
              isDarkMode ? 'text-gray-100' : 'text-gray-800'
            }`}>Welcome to Your Dashboard</h2>
            <p className={`text-lg transition-colors duration-300 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Your personalized meal planning profile is ready to create amazing recipes just for you.
            </p>
          </div>
        </div>

        {/* Analytics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Protein Diversity */}
          <div className={`backdrop-blur-sm rounded-2xl border p-6 transition-all duration-300 ${
            isDarkMode 
              ? 'bg-gray-800/70 border-gray-700' 
              : 'bg-white/70 border-gray-100'
          }`}>
            <div className="text-center">
              <div className="text-3xl mb-2">🥩</div>
              <div className={`text-2xl font-light mb-1 transition-colors duration-300 ${
                isDarkMode ? 'text-gray-100' : 'text-gray-800'
              }`}>{proteinCount}</div>
              <div className={`text-sm transition-colors duration-300 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>Proteins</div>
            </div>
          </div>

          {/* Vegetable Variety */}
          <div className={`backdrop-blur-sm rounded-2xl border p-6 transition-all duration-300 ${
            isDarkMode 
              ? 'bg-gray-800/70 border-gray-700' 
              : 'bg-white/70 border-gray-100'
          }`}>
            <div className="text-center">
              <div className="text-3xl mb-2">🥕</div>
              <div className={`text-2xl font-light mb-1 transition-colors duration-300 ${
                isDarkMode ? 'text-gray-100' : 'text-gray-800'
              }`}>{vegetableCount}</div>
              <div className={`text-sm transition-colors duration-300 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>Vegetables</div>
            </div>
          </div>

          {/* Cuisine Diversity */}
          <div className={`backdrop-blur-sm rounded-2xl border p-6 transition-all duration-300 ${
            isDarkMode 
              ? 'bg-gray-800/70 border-gray-700' 
              : 'bg-white/70 border-gray-100'
          }`}>
            <div className="text-center">
              <div className="text-3xl mb-2">🌍</div>
              <div className={`text-2xl font-light mb-1 transition-colors duration-300 ${
                isDarkMode ? 'text-gray-100' : 'text-gray-800'
              }`}>{cuisineCount}</div>
              <div className={`text-sm transition-colors duration-300 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>Cuisines</div>
            </div>
          </div>

          {/* Calorie Target */}
          <div className={`backdrop-blur-sm rounded-2xl border p-6 transition-all duration-300 ${
            isDarkMode 
              ? 'bg-gray-800/70 border-gray-700' 
              : 'bg-white/70 border-gray-100'
          }`}>
            <div className="text-center">
              <div className="text-3xl mb-2">🎯</div>
              <div className={`text-2xl font-light mb-1 transition-colors duration-300 ${
                isDarkMode ? 'text-gray-100' : 'text-gray-800'
              }`}>{userPreferences.dailyCalorieTarget}</div>
              <div className={`text-sm transition-colors duration-300 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>Calories/day</div>
            </div>
          </div>
        </div>

        {/* Detailed Preferences */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Health Goals */}
            <div className={`backdrop-blur-sm rounded-2xl border p-6 transition-all duration-300 ${
              isDarkMode 
                ? 'bg-gray-800/70 border-gray-700' 
                : 'bg-white/70 border-gray-100'
            }`}>
              <h3 className={`text-xl font-medium mb-4 transition-colors duration-300 ${
                isDarkMode ? 'text-gray-200' : 'text-gray-800'
              }`}>Health Goals</h3>
              <div className="space-y-3">
                <div className={`flex items-center justify-between p-3 rounded-xl transition-all duration-300 ${
                  isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'
                }`}>
                  <span className={`font-medium transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-200' : 'text-gray-700'
                  }`}>Primary Goal</span>
                  <span className={`text-sm transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>{userPreferences.healthGoals}</span>
                </div>
                <div className={`flex items-center justify-between p-3 rounded-xl transition-all duration-300 ${
                  isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'
                }`}>
                  <span className={`font-medium transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-200' : 'text-gray-700'
                  }`}>Activity Level</span>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{getActivityIcon(userPreferences.activityLevel)}</span>
                    <span className={`text-sm transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>{userPreferences.activityLevel}</span>
                  </div>
                </div>
                {userPreferences.currentWeight && userPreferences.goalWeight && (
                  <div className={`flex items-center justify-between p-3 rounded-xl transition-all duration-300 ${
                    isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'
                  }`}>
                    <span className={`font-medium transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-200' : 'text-gray-700'
                    }`}>Weight Goal</span>
                    <span className={`text-sm transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      {userPreferences.currentWeight} → {userPreferences.goalWeight} lbs
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Favorite Proteins */}
            <div className={`backdrop-blur-sm rounded-2xl border p-6 transition-all duration-300 ${
              isDarkMode 
                ? 'bg-gray-800/70 border-gray-700' 
                : 'bg-white/70 border-gray-100'
            }`}>
              <h3 className={`text-xl font-medium mb-4 transition-colors duration-300 ${
                isDarkMode ? 'text-gray-200' : 'text-gray-800'
              }`}>Favorite Proteins</h3>
              <div className="flex flex-wrap gap-2">
                {userPreferences.likedProteins.map((protein) => (
                  <span key={protein} className={`px-3 py-1 rounded-full text-sm transition-all duration-300 ${
                    isDarkMode 
                      ? 'bg-gray-700 text-gray-200' 
                      : 'bg-orange-100 text-orange-700'
                  }`}>
                    {protein}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Cuisine Preferences */}
            <div className={`backdrop-blur-sm rounded-2xl border p-6 transition-all duration-300 ${
              isDarkMode 
                ? 'bg-gray-800/70 border-gray-700' 
                : 'bg-white/70 border-gray-100'
            }`}>
              <h3 className={`text-xl font-medium mb-4 transition-colors duration-300 ${
                isDarkMode ? 'text-gray-200' : 'text-gray-800'
              }`}>Cuisine Preferences</h3>
              <div className="grid grid-cols-2 gap-3">
                {userPreferences.cuisinePreferences.map((cuisine) => (
                  <div key={cuisine} className={`flex items-center gap-2 p-2 rounded-lg transition-all duration-300 ${
                    isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'
                  }`}>
                    <span className="text-lg">{getCuisineIcon(cuisine)}</span>
                    <span className={`text-sm transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-200' : 'text-gray-700'
                    }`}>{cuisine}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Favorite Vegetables */}
            <div className={`backdrop-blur-sm rounded-2xl border p-6 transition-all duration-300 ${
              isDarkMode 
                ? 'bg-gray-800/70 border-gray-700' 
                : 'bg-white/70 border-gray-100'
            }`}>
              <h3 className={`text-xl font-medium mb-4 transition-colors duration-300 ${
                isDarkMode ? 'text-gray-200' : 'text-gray-800'
              }`}>Favorite Vegetables</h3>
              <div className="flex flex-wrap gap-2">
                {userPreferences.likedVegetables.map((vegetable) => (
                  <span key={vegetable} className={`px-3 py-1 rounded-full text-sm transition-all duration-300 ${
                    isDarkMode 
                      ? 'bg-gray-700 text-gray-200' 
                      : 'bg-green-100 text-green-700'
                  }`}>
                    {vegetable}
                  </span>
                ))}
              </div>
            </div>

            {/* Location */}
            {userPreferences.location && (
              <div className={`backdrop-blur-sm rounded-2xl border p-6 transition-all duration-300 ${
                isDarkMode 
                  ? 'bg-gray-800/70 border-gray-700' 
                  : 'bg-white/70 border-gray-100'
              }`}>
                <h3 className={`text-xl font-medium mb-4 transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-200' : 'text-gray-800'
                }`}>Location</h3>
                <div className={`flex items-center gap-2 p-3 rounded-xl transition-all duration-300 ${
                  isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'
                }`}>
                  <span className="text-lg">📍</span>
                  <span className={`text-sm transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-200' : 'text-gray-700'
                  }`}>{userPreferences.location}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="text-center mt-12"> {/* Removed mb-16, padding is on container */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
      </div>
    </div>
  );
} 