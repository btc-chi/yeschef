"use client";

import { useState, useEffect } from 'react';
import { UserPreferences } from '@/lib/openai';
import { getUserPreferences, saveUserPreferences, hasUserPreferences } from '@/lib/user-preferences';
import OnboardingQuiz from './onboarding/onboarding-quiz';
import MealDiscovery from './meal-discovery';
import MealPlanner from './meal-planner';
import GroceryPanel from './grocery-panel';
import APITest from './api-test';
import { useMealPlannerStore } from '@/store/meal-planner';

export default function AppWrapper() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [userPreferences, setUserPreferences] = useState<UserPreferences | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { setAvailableRecipes, setIsGenerating, rotationRecipes, customRecipes } = useMealPlannerStore();

  useEffect(() => {
    console.log('AppWrapper useEffect running');
    // Check if user has completed onboarding
    const savedPreferences = getUserPreferences();
    console.log('savedPreferences:', savedPreferences);
    if (savedPreferences) {
      setUserPreferences(savedPreferences);
      setShowOnboarding(false);
      console.log('User has preferences, showing main app');
    } else {
      setShowOnboarding(true);
      console.log('No preferences found, showing onboarding');
    }
    setIsLoading(false);
  }, []);

  const handleOnboardingComplete = (preferences: UserPreferences) => {
    saveUserPreferences(preferences);
    setUserPreferences(preferences);
    setShowOnboarding(false);
  };

  const handleSkipOnboarding = () => {
    console.log('Skipping onboarding');
    setShowOnboarding(false);
    // Continue with default preferences or empty state
  };

  const resetOnboarding = () => {
    setShowOnboarding(true);
    setUserPreferences(null);
  };

  const generateMeals = async () => {
    setIsGenerating(true);
    try {
      // Always generate 14 meals (both lunch AND dinner ideas) as requested
      const newRecipesToGenerate = 14; // Generate 14 diverse meals including lunch and dinner options
      
      console.log(`Requesting ${newRecipesToGenerate} new recipes from LLM`);
      
      const response = await fetch('/api/generate-meals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          preferences: userPreferences,
          requestedMeals: newRecipesToGenerate
        }),
      });

      const result = await response.json();
      
      console.log(`LLM returned ${result.data?.recipes?.length || 0} recipes:`, result.data?.recipes?.map(r => r.name) || []);
      
      if (result.status === 'success' && result.data.recipes) {
        // Create a smart mix of rotation recipes, custom recipes, and new AI-generated recipes
        const { GOING_OUT_TEMPLATES } = await import('@/data/mock-recipes');
        
        // Start with base templates and custom recipes (always include these)
        const baseRecipes = [...GOING_OUT_TEMPLATES, ...customRecipes];
        
        // Add a selection of rotation recipes (rotate them for variety)
        const selectedRotation = rotationRecipes
          .sort(() => Math.random() - 0.5) // Shuffle rotation
          .slice(0, Math.min(rotationRecipes.length, 6)); // Include up to 6 rotation recipes
        
        // Filter out AI-generated recipes that match existing custom recipe names
        const existingNames = new Set([
          ...customRecipes.map(r => r.name.toLowerCase().trim().replace(/\s+/g, ' ')),
          ...rotationRecipes.map(r => r.name.toLowerCase().trim().replace(/\s+/g, ' '))
        ]);
        
        const newRecipes = result.data.recipes
          .filter((recipe: any) => {
            const normalizedName = recipe.name.toLowerCase().trim().replace(/\s+/g, ' ');
            return !existingNames.has(normalizedName);
          })
          .map((recipe: any, index: number) => ({
            ...recipe,
            id: `ai-${Date.now()}-${index}` // Ensure each AI recipe has a unique ID
          }));
        
        // Combine recipes ensuring custom meals always appear
        const allRecipes = [...baseRecipes, ...selectedRotation, ...newRecipes];
        
        console.log('All recipes before deduplication:', allRecipes.map(r => ({name: r.name, id: r.id})));
        
        const uniqueRecipes = allRecipes.filter((recipe, index, self) => {
          const normalizedName = recipe.name.toLowerCase().trim().replace(/\s+/g, ' ');
          
          // Always keep custom recipes (they should appear at bottom)
          if (recipe.id?.startsWith('custom-')) {
            // For custom recipes, only remove if there's an exact duplicate custom recipe earlier
            const firstCustomIndex = self.findIndex(r => 
              r.id?.startsWith('custom-') && 
              r.name.toLowerCase().trim().replace(/\s+/g, ' ') === normalizedName
            );
            const keep = firstCustomIndex === index;
            console.log(`Custom recipe "${recipe.name}": ${keep ? 'KEEPING' : 'FILTERING OUT'}`);
            return keep;
          }
          
          // For non-custom recipes, deduplicate by ID first, then by name
          const firstIdIndex = self.findIndex(r => r.id === recipe.id);
          if (firstIdIndex !== index) {
            console.log(`Recipe "${recipe.name}" filtered out: duplicate ID`);
            return false;
          }
          
          const firstNameIndex = self.findIndex(r => 
            r.name.toLowerCase().trim().replace(/\s+/g, ' ') === normalizedName
          );
          const keep = firstNameIndex === index;
          console.log(`Recipe "${recipe.name}": ${keep ? 'KEEPING' : 'FILTERING OUT (duplicate name)'}`);
          return keep;
        });
        
        // Sort to ensure custom meals appear at the bottom
        const sortedRecipes = uniqueRecipes.sort((a, b) => {
          const aIsCustom = a.id?.startsWith('custom-') ? 1 : 0;
          const bIsCustom = b.id?.startsWith('custom-') ? 1 : 0;
          return aIsCustom - bIsCustom; // Custom recipes (1) come after others (0)
        });
        
        console.log(`Generated meal mix:
          - ${customRecipes.length} custom recipes (at bottom)
          - ${selectedRotation.length} rotation recipes  
          - ${newRecipes.length} new AI recipes (${result.data.recipes.length - newRecipes.length} filtered out)
          - ${GOING_OUT_TEMPLATES.length} going out templates
          - Total: ${sortedRecipes.length} unique recipes`);
        
        setAvailableRecipes(sortedRecipes);
      } else {
        console.error('Failed to generate meals:', result);
        alert('Failed to generate meals. Please try again.');
      }
    } catch (error) {
      console.error('Error generating meals:', error);
      alert('Error generating meals. Please check your connection and try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  console.log('AppWrapper render - isLoading:', isLoading, 'showOnboarding:', showOnboarding, 'userPreferences:', userPreferences);

  if (isLoading) {
    console.log('Showing loading screen');
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-orange-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading yeschef...</p>
        </div>
      </div>
    );
  }

  if (showOnboarding) {
    console.log('Showing onboarding');
    return (
      <OnboardingQuiz
        onComplete={handleOnboardingComplete}
        onSkip={handleSkipOnboarding}
      />
    );
  }

  console.log('Showing main app');

  return (
    <div className={`min-h-screen transition-all duration-300 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-slate-900' 
        : 'bg-gradient-to-br from-gray-50 via-white to-blue-50'
    }`}>
      {/* Dark Mode Toggle - Top Right */}
      <div className="absolute top-6 right-6 z-50">
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className={`p-2 rounded-lg transition-all duration-300 ${
            isDarkMode 
              ? 'bg-gray-800/50 hover:bg-gray-700/60 text-gray-400 hover:text-gray-300' 
              : 'bg-gray-100/70 hover:bg-gray-200/80 text-gray-500 hover:text-gray-700'
          }`}
          title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDarkMode ? (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
            </svg>
          )}
        </button>
      </div>

      {/* Minimal Header with Logo */}
      <div className="pt-8 pb-4">
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
            onClick={resetOnboarding}
            className={`px-4 py-2 text-sm transition-colors rounded-xl ${
              isDarkMode 
                ? 'text-gray-300 hover:text-gray-100 hover:bg-gray-700' 
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            Preferences
          </button>
          <div className={`w-px h-6 ${isDarkMode ? 'bg-gray-600' : 'bg-gray-200'}`}></div>
          <button 
            onClick={generateMeals}
            className="px-6 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            ✨ Generate Fresh Ideas
          </button>
        </div>
      </div>

      {/* User Preferences Chip */}
      {userPreferences && (
        <div className="text-center mb-8">
          <div className={`inline-block border rounded-full px-4 py-2 text-sm transition-all duration-300 ${
            isDarkMode 
              ? 'bg-emerald-900/30 border-emerald-700/50 text-emerald-300' 
              : 'bg-emerald-50 border-emerald-200 text-emerald-700'
          }`}>
            <span className="font-medium">{userPreferences.likedProteins.slice(0, 3).join(', ')}</span>
            <span className="mx-2">•</span>
            <span>{userPreferences.healthGoals}</span>
            <span className="mx-2">•</span>
            <span>{userPreferences.dailyCalorieTarget} cal/day</span>
          </div>
        </div>
      )}

      {/* Main Content - Zen Three Column Layout */}
      <main className="max-w-7xl mx-auto px-8 pb-16">
        <div className="grid grid-cols-12 gap-8">
          {/* Recipe Discovery - Left */}
          <div className="col-span-4">
            <MealDiscovery isDarkMode={isDarkMode} />
          </div>

          {/* Meal Planning - Center Hero */}
          <div className="col-span-4">
            <MealPlanner isDarkMode={isDarkMode} />
          </div>

          {/* Grocery Panel */}
          <div className="col-span-4">
            <GroceryPanel isDarkMode={isDarkMode} />
          </div>
        </div>
      </main>
    </div>
  );
}