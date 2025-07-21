"use client";

import { useState } from 'react';
import { Recipe } from '@/store/meal-planner';
import { getCuisineIcon } from '@/data/mock-recipes';

interface RecipeModalProps {
  recipe: Recipe;
  isOpen: boolean;
  onClose: () => void;
  onAddToPlan?: (recipe: Recipe) => void;
  onEdit?: (recipe: Recipe) => void;
  isDarkMode?: boolean;
}

export default function RecipeModal({ recipe, isOpen, onClose, onAddToPlan, onEdit, isDarkMode = false }: RecipeModalProps) {
  const [stepByStepInstructions, setStepByStepInstructions] = useState<string[]>([]);
  const [isGeneratingSteps, setIsGeneratingSteps] = useState(false);

  if (!isOpen) return null;

  const generateStepByStepInstructions = async () => {
    setIsGeneratingSteps(true);
    try {
      const response = await fetch('/api/generate-steps', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ recipe }),
      });
      
      if (response.ok) {
        const data = await response.json();
        setStepByStepInstructions(data.steps);
      }
    } catch (error) {
      console.error('Error generating step-by-step instructions:', error);
    } finally {
      setIsGeneratingSteps(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-50 p-4"
      onClick={onClose} // Click outside to close
    >
      {/* Modal background overlay */}
      <div className={`absolute inset-0 transition-all duration-300 ${
        isDarkMode 
          ? 'bg-gray-900/80' 
          : 'bg-gray-900/20'
      }`}></div>
      <div className="absolute inset-0 backdrop-blur-sm"></div>
      
      {/* Modal content */}
      <div 
        className={`relative rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden transition-colors duration-300 ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        }`}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking modal content
      >
        {/* Header */}
        <div className={`p-6 border-b transition-colors duration-300 ${
          isDarkMode ? 'border-gray-700' : 'border-gray-100'
        }`}>
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{getCuisineIcon(recipe.cuisine)}</span>
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h2 className={`text-2xl font-bold transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-100' : 'text-gray-900'
                  }`}>{recipe.name}</h2>
                  {recipe.id?.startsWith('custom-') && onEdit && (
                    <button
                      onClick={() => onEdit(recipe)}
                      className={`p-1.5 rounded-lg transition-all text-sm ${
                        isDarkMode 
                          ? 'text-gray-500 hover:text-purple-400 hover:bg-gray-700' 
                          : 'text-gray-400 hover:text-purple-600 hover:bg-purple-50'
                      }`}
                      title="Edit recipe"
                    >
                      ✏️
                    </button>
                  )}
                </div>
                <p className={`mt-1 transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>{recipe.description}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className={`p-3 rounded-full transition-colors text-xl font-bold ${
                isDarkMode 
                  ? 'hover:bg-gray-700 text-gray-400 hover:text-gray-200' 
                  : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
              }`}
            >
              ×
            </button>
          </div>
          
          {/* Quick Info */}
          <div className="flex gap-4 mt-4">
            <div className={`px-3 py-2 rounded-lg transition-colors duration-300 ${
              isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
            }`}>
              <span className={`text-xs font-medium transition-colors duration-300 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-700'
              }`}>Prep Time</span>
              <div className={`font-semibold transition-colors duration-300 ${
                isDarkMode ? 'text-gray-200' : 'text-gray-900'
              }`}>{recipe.prepTime}</div>
            </div>
            <div className={`px-3 py-2 rounded-lg transition-colors duration-300 ${
              isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
            }`}>
              <span className={`text-xs font-medium transition-colors duration-300 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-700'
              }`}>Difficulty</span>
              <div className={`font-semibold transition-colors duration-300 ${
                isDarkMode ? 'text-gray-200' : 'text-gray-900'
              }`}>{recipe.difficulty}</div>
            </div>
            <div className={`px-3 py-2 rounded-lg transition-colors duration-300 ${
              isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
            }`}>
              <span className={`text-xs font-medium transition-colors duration-300 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-700'
              }`}>Calories</span>
              <div className={`font-semibold transition-colors duration-300 ${
                isDarkMode ? 'text-gray-200' : 'text-gray-900'
              }`}>{recipe.calories}</div>
            </div>
            <div className={`px-3 py-2 rounded-lg transition-colors duration-300 ${
              isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
            }`}>
              <span className={`text-xs font-medium transition-colors duration-300 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-700'
              }`}>Cuisine</span>
              <div className={`font-semibold transition-colors duration-300 ${
                isDarkMode ? 'text-gray-200' : 'text-gray-900'
              }`}>{recipe.cuisine}</div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="p-6 space-y-6">
            {/* Ingredients */}
            <div>
              <h3 className={`text-lg font-semibold mb-3 transition-colors duration-300 ${
                isDarkMode ? 'text-gray-100' : 'text-gray-900'
              }`}>Ingredients</h3>
              <div className="grid grid-cols-1 gap-2">
                {recipe.ingredients.map((ingredient, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="text-orange-500">•</span>
                    <span className={`transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>{ingredient}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Basic Instructions */}
            <div>
              <h3 className={`text-lg font-semibold mb-3 transition-colors duration-300 ${
                isDarkMode ? 'text-gray-100' : 'text-gray-900'
              }`}>Instructions</h3>
              <div className="space-y-3">
                {recipe.instructions.map((instruction, index) => (
                  <div key={index} className="flex gap-3">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0 mt-0.5 transition-colors duration-300 ${
                      isDarkMode 
                        ? 'bg-orange-800/50 text-orange-300' 
                        : 'bg-orange-100 text-orange-700'
                    }`}>
                      {index + 1}
                    </span>
                    <p className={`transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>{instruction}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Step-by-Step Guide / Restaurant Ideas */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className={`text-lg font-semibold transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-100' : 'text-gray-900'
                }`}>
                  {recipe.isGoingOut ? 'Restaurant Ideas' : 'Step-by-Step Guide'}
                </h3>
                {stepByStepInstructions.length === 0 && (
                  <button
                    onClick={generateStepByStepInstructions}
                    disabled={isGeneratingSteps}
                    className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 text-sm font-medium"
                  >
                    {isGeneratingSteps ? '⏳ Generating...' : 
                     recipe.isGoingOut ? '🍽️ Find Restaurants' : '✨ Get Detailed Steps'}
                  </button>
                )}
              </div>
              
              {stepByStepInstructions.length > 0 ? (
                <div className={`rounded-xl p-4 space-y-3 transition-colors duration-300 ${
                  isDarkMode ? 'bg-blue-900/30' : 'bg-blue-50'
                }`}>
                  {stepByStepInstructions.map((step, index) => (
                    <div key={index} className="flex gap-3">
                      <span className="bg-blue-500 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                        {index + 1}
                      </span>
                      <p className={`font-medium transition-colors duration-300 ${
                        isDarkMode ? 'text-gray-200' : 'text-gray-800'
                      }`}>{step}</p>
                    </div>
                  ))}
                </div>
              ) : !isGeneratingSteps && (
                <div className={`rounded-xl p-4 text-center transition-colors duration-300 ${
                  isDarkMode 
                    ? 'bg-gray-700/50 text-gray-400' 
                    : 'bg-gray-50 text-gray-500'
                }`}>
                  <p className="text-sm">
                    {recipe.isGoingOut 
                      ? 'Discover local restaurants and make reservations for this meal!' 
                      : 'Get detailed, confidence-building steps to master this recipe!'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={`p-6 border-t transition-colors duration-300 ${
          isDarkMode 
            ? 'border-gray-700 bg-gray-800/50' 
            : 'border-gray-100 bg-gray-50'
        }`}>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className={`flex-1 px-4 py-2 border rounded-lg transition-colors ${
                isDarkMode 
                  ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              Close
            </button>
            {onAddToPlan && (
              <button
                onClick={() => {
                  onAddToPlan(recipe);
                  onClose();
                }}
                className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
              >
                Add to Plan
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}