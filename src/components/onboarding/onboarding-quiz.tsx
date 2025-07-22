"use client";

import { useState } from 'react';
import { UserPreferences } from '@/lib/openai';

interface OnboardingStep {
  id: number;
  title: string;
  subtitle: string;
  type: 'multi-select' | 'single-select' | 'input' | 'slider' | 'weight-input' | 'text-input';
  options?: string[];
  field: keyof UserPreferences;
  required?: boolean;
}

const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 1,
    title: "What proteins do you enjoy?",
    subtitle: "Select all that you love eating",
    type: 'multi-select',
    field: 'likedProteins',
    options: ['Chicken', 'Beef', 'Pork', 'Fish', 'Salmon', 'Shrimp', 'Tofu', 'Eggs', 'Turkey', 'Lamb', 'Duck', 'Beans', 'Lentils'],
    required: true
  },
  {
    id: 2,
    title: "Any proteins you dislike or avoid?",
    subtitle: "We'll make sure to exclude these from your meal plans",
    type: 'multi-select',
    field: 'dislikedProteins',
    options: ['Chicken', 'Beef', 'Pork', 'Fish', 'Salmon', 'Shrimp', 'Tofu', 'Eggs', 'Turkey', 'Lamb', 'Duck', 'Beans', 'Lentils']
  },
  {
    id: 3,
    title: "What vegetables do you love?",
    subtitle: "The more you select, the more variety we can create",
    type: 'multi-select',
    field: 'likedVegetables',
    options: ['Broccoli', 'Spinach', 'Carrots', 'Bell Peppers', 'Onions', 'Garlic', 'Tomatoes', 'Mushrooms', 'Asparagus', 'Brussels Sprouts', 'Zucchini', 'Sweet Potatoes', 'Kale', 'Cauliflower'],
    required: true
  },
  {
    id: 4,
    title: "Any vegetables you dislike?",
    subtitle: "We'll keep these off your plate",
    type: 'multi-select',
    field: 'dislikedVegetables',
    options: ['Broccoli', 'Spinach', 'Carrots', 'Bell Peppers', 'Onions', 'Garlic', 'Tomatoes', 'Mushrooms', 'Asparagus', 'Brussels Sprouts', 'Zucchini', 'Sweet Potatoes', 'Kale', 'Cauliflower']
  },
  {
    id: 5,
    title: "What are your health goals?",
    subtitle: "This helps us tailor portion sizes and meal types",
    type: 'single-select',
    field: 'healthGoals',
    options: ['Lose Weight', 'Maintain Weight', 'Gain Weight', 'Build Muscle'],
    required: true
  },
  {
    id: 6,
    title: "Tell us about your weight goals",
    subtitle: "Current weight and target weight (in lbs)",
    type: 'weight-input',
    field: 'currentWeight',
    required: true
  },
  {
    id: 7,
    title: "What's your daily calorie target?",
    subtitle: "We'll design meals to help you hit this goal",
    type: 'slider',
    field: 'dailyCalorieTarget',
    required: true
  },
  {
    id: 8,
    title: "How active are you?",
    subtitle: "This affects your nutritional needs",
    type: 'single-select',
    field: 'activityLevel',
    options: ['Sedentary (desk job)', 'Light (1-3 days/week)', 'Moderate (3-5 days/week)', 'Active (6-7 days/week)', 'Very Active (2x/day)'],
    required: true
  },
  {
    id: 9,
    title: "What cuisines excite you?",
    subtitle: "We'll bring these flavors to your meal plans",
    type: 'multi-select',
    field: 'cuisinePreferences',
    options: ['Italian', 'Asian', 'Mexican', 'Mediterranean', 'Indian', 'Thai', 'French', 'American', 'Japanese', 'Korean', 'Middle Eastern', 'Greek'],
    required: true
  },
  {
    id: 10,
    title: "What's your location and favorite restaurants?",
    subtitle: "For when we suggest dining out options",
    type: 'text-input',
    field: 'location',
    required: true
  },
  {
    id: 11,
    title: "What is your main or primary grocery store?",
    subtitle: "We'll use this for accurate pricing and availability",
    type: 'single-select',
    field: 'preferredGroceryStore',
    options: ['Jewel-Osco', "Mariano's", 'Whole Foods', 'Trader Joe\'s', 'Aldi', 'Kroger', 'Safeway', 'Walmart', 'Target', 'Local Market'],
    required: true
  },
  {
    id: 12,
    title: "How many meals do you want to plan per week?",
    subtitle: "This helps us create the right amount of recipes",
    type: 'single-select',
    field: 'mealsPerWeek',
    options: ['7 meals', '10 meals', '14 meals', '21 meals'],
    required: true
  },
  {
    id: 13,
    title: "How often do you dine out?",
    subtitle: "We'll include restaurant options in your meal plans",
    type: 'single-select',
    field: 'goingOutFrequency',
    options: ['0-1 times per week', '2-3 times per week', '4-5 times per week', '6+ times per week'],
    required: true
  },
  {
    id: 14,
    title: "Any dietary restrictions?",
    subtitle: "We'll make sure to avoid these ingredients",
    type: 'multi-select',
    field: 'dietaryRestrictions',
    options: ['Gluten-Free', 'Dairy-Free', 'Vegetarian', 'Vegan', 'Keto', 'Paleo', 'Low-Carb', 'Low-Sodium', 'Nut-Free', 'None'],
    required: false
  }
];

interface OnboardingQuizProps {
  onComplete: (preferences: UserPreferences) => void;
  onSkip: () => void;
}

export default function OnboardingQuiz({ onComplete, onSkip }: OnboardingQuizProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [preferences, setPreferences] = useState<Partial<UserPreferences>>({
    likedProteins: [],
    dislikedProteins: [],
    likedVegetables: [],
    dislikedVegetables: [],
    likedStarches: ['Rice', 'Pasta', 'Potatoes', 'Quinoa', 'Bread'],
    dislikedStarches: [],
    cuisinePreferences: [],
    dietaryRestrictions: [],
    currentWeight: 150,
    goalWeight: 140,
    dailyCalorieTarget: 2000,
    activityLevel: 'moderate',
    favoriteRestaurants: [],
    location: '',
    mealsPerWeek: 14,
    goingOutFrequency: 2,
    preferredGroceryStore: ''
  });
  const [animationClass, setAnimationClass] = useState('animate-fade-in');

  const currentStepData = ONBOARDING_STEPS[currentStep];
  const progress = ((currentStep + 1) / ONBOARDING_STEPS.length) * 100;

  const handleNext = () => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setAnimationClass('animate-fade-out');
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
        setAnimationClass('animate-fade-in');
      }, 200);
    } else {
      onComplete(preferences as UserPreferences);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setAnimationClass('animate-fade-out');
      setTimeout(() => {
        setCurrentStep(currentStep - 1);
        setAnimationClass('animate-fade-in');
      }, 200);
    }
  };

  const handleSkip = () => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setAnimationClass('animate-fade-out');
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
        setAnimationClass('animate-fade-in');
      }, 200);
    } else {
      onComplete(preferences as UserPreferences);
    }
  };

  const updatePreference = (field: keyof UserPreferences, value: unknown) => {
    setPreferences(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const isStepValid = () => {
    const step = currentStepData;
    if (!step.required) return true;
    
    const value = preferences[step.field];
    
    if (step.type === 'multi-select') {
      return Array.isArray(value) && value.length > 0;
    }
    
    if (step.type === 'text-input') {
      return typeof value === 'string' && value.length > 0;
    }
    
    return value !== undefined && value !== null && value !== '';
  };

  const renderStepContent = () => {
    const step = currentStepData;
    
    switch (step.type) {
      case 'multi-select':
        return (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-w-2xl">
            {step.options?.map((option) => {
              const isSelected = (preferences[step.field] as string[])?.includes(option);
              return (
                <button
                  key={option}
                  onClick={() => {
                    const current = (preferences[step.field] as string[]) || [];
                    const updated = isSelected 
                      ? current.filter(item => item !== option)
                      : [...current, option];
                    updatePreference(step.field, updated);
                  }}
                  className={`p-4 rounded-2xl border-2 transition-all duration-200 text-left ${
                    isSelected 
                      ? 'border-emerald-400 bg-emerald-50 text-emerald-700 shadow-lg' 
                      : 'border-gray-300 hover:border-gray-400 bg-white/70 backdrop-blur-sm hover:bg-white hover:shadow-md text-gray-700 hover:text-gray-900'
                  }`}
                >
                  <div className="font-medium text-gray-800">{option}</div>
                </button>
              );
            })}
          </div>
        );
        
      case 'single-select':
        return (
          <div className="space-y-3 max-w-md">
            {step.options?.map((option) => {
              let mappedValue;
              if (step.field === 'preferredGroceryStore') {
                mappedValue = option;
              } else if (step.field === 'mealsPerWeek') {
                mappedValue = parseInt(option.split(' ')[0]);
              } else if (step.field === 'goingOutFrequency') {
                mappedValue = parseInt(option.split(' ')[0]);
              } else {
                mappedValue = option.toLowerCase().replace(/\s+/g, '_').replace(/[()]/g, '');
              }
              const isSelected = preferences[step.field] === mappedValue;
              return (
                <button
                  key={option}
                  onClick={() => updatePreference(step.field, mappedValue)}
                  className={`w-full p-4 rounded-2xl border-2 transition-all duration-200 text-left ${
                    isSelected 
                      ? 'border-emerald-400 bg-emerald-50 text-emerald-700 shadow-lg' 
                      : 'border-gray-300 hover:border-gray-400 bg-white/70 backdrop-blur-sm hover:bg-white hover:shadow-md text-gray-700 hover:text-gray-900'
                  }`}
                >
                  <div className="font-medium text-gray-800">{option}</div>
                </button>
              );
            })}
          </div>
        );
        
      case 'weight-input':
        return (
          <div className="space-y-6 max-w-md">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Weight (lbs)
              </label>
              <input
                type="number"
                value={preferences.currentWeight || ''}
                onChange={(e) => updatePreference('currentWeight', Number(e.target.value))}
                className="w-full p-3 border border-gray-300 rounded-xl bg-white/70 backdrop-blur-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all placeholder-gray-600"
                placeholder="150"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Goal Weight (lbs)
              </label>
              <input
                type="number"
                value={preferences.goalWeight || ''}
                onChange={(e) => updatePreference('goalWeight', Number(e.target.value))}
                className="w-full p-3 border border-gray-300 rounded-xl bg-white/70 backdrop-blur-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all placeholder-gray-600"
                placeholder="140"
              />
            </div>
          </div>
        );
        
      case 'slider':
        return (
          <div className="max-w-md space-y-4">
            <div className="text-center">
              <span className="text-3xl font-bold text-emerald-600">
                {preferences.dailyCalorieTarget || 2000}
              </span>
              <span className="text-gray-500 ml-2">calories/day</span>
            </div>
            <input
              type="range"
              min="1200"
              max="3500"
              step="50"
              value={preferences.dailyCalorieTarget || 2000}
              onChange={(e) => updatePreference('dailyCalorieTarget', Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-sm text-gray-500">
              <span>1,200</span>
              <span>3,500</span>
            </div>
          </div>
        );
        
      case 'text-input':
        return (
          <div className="space-y-4 max-w-md">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City/Location
              </label>
              <input
                type="text"
                value={preferences.location || ''}
                onChange={(e) => updatePreference('location', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-xl bg-white/70 backdrop-blur-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all placeholder-gray-600"
                placeholder="e.g., Chicago, IL"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Favorite Restaurants (optional)
              </label>
              <textarea
                value={preferences.favoriteRestaurants?.join(', ') || ''}
                onChange={(e) => updatePreference('favoriteRestaurants', e.target.value.split(',').map(r => r.trim()).filter(r => r.length > 0))}
                className="w-full p-3 border border-gray-300 rounded-xl bg-white/70 backdrop-blur-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all placeholder-gray-600"
                placeholder="e.g., Ramen San, Olive Vita, Girl & the Goat"
                rows={3}
              />
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex items-center justify-center p-6">
      <div className="max-w-4xl w-full">
        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex justify-between text-sm text-gray-500 mb-3">
            <span>Question {currentStep + 1} of {ONBOARDING_STEPS.length}</span>
            <span>{Math.round(progress)}% complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-emerald-500 to-blue-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question Content */}
        <div className={`text-center mb-16 transition-all duration-200 ${animationClass}`}>
          <h1 className="text-3xl md:text-4xl font-light text-gray-800 mb-4">
            {currentStepData.title}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto font-light">
            {currentStepData.subtitle}
          </p>
        </div>

        {/* Step Content */}
        <div className={`flex justify-center mb-12 transition-all duration-200 ${animationClass}`}>
          {renderStepContent()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 bg-white/70 backdrop-blur-sm hover:bg-white hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            ← Previous
          </button>

          <button
            onClick={handleSkip}
            className="px-4 py-2 text-gray-500 hover:text-gray-700 transition-colors"
          >
            Skip for now
          </button>

          <button
            onClick={handleNext}
            disabled={!isStepValid()}
            className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-xl hover:from-emerald-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            {currentStep === ONBOARDING_STEPS.length - 1 ? 'Complete Setup' : 'Next →'}
          </button>
        </div>
      </div>

      <style jsx>{`
        .animate-fade-in {
          opacity: 1;
          transform: translateY(0);
        }
        .animate-fade-out {
          opacity: 0;
          transform: translateY(10px);
        }
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #10b981;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
        }
        .slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #10b981;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
        }
      `}</style>
    </div>
  );
}