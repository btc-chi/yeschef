"use client";

import { useState } from 'react';
import { useMealPlannerStore, Recipe } from '@/store/meal-planner';
import { getCuisineIcon } from '@/data/mock-recipes';
import RecipeModal from '@/components/recipe-modal';

export default function FavoritesPanel() {
  const { 
    rotationRecipes, 
    customRecipes, 
    removeFromRotation, 
    removeCustomRecipe,
    setDraggedRecipe,
    addMealToPlan,
    getCurrentWeekMealPlan
  } = useMealPlannerStore();

  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'rotation' | 'custom'>('rotation');

  const handleDragStart = (recipe: Recipe) => {
    setDraggedRecipe(recipe);
  };

  const handleRecipeClick = (recipe: Recipe) => {
    if (recipe.isGoingOut) return;
    setSelectedRecipe(recipe);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRecipe(null);
  };

  const handleQuickAdd = (recipe: Recipe) => {
    // Find the first empty slot in the current week
    const mealPlan = getCurrentWeekMealPlan();
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    
    for (const day of days) {
      if (!mealPlan[day]?.lunch) {
        addMealToPlan(day, 'lunch', recipe);
        return;
      }
      if (!mealPlan[day]?.dinner) {
        addMealToPlan(day, 'dinner', recipe);
        return;
      }
    }
    
    // If no empty slots, show message
    alert('Your week is fully planned! Clear a slot first or drag to replace.');
  };

  const RecipeCard = ({ recipe, onRemove, showRemove = true }: { 
    recipe: Recipe; 
    onRemove: () => void;
    showRemove?: boolean;
  }) => (
    <div
      className="p-4 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 cursor-grab active:cursor-grabbing hover:shadow-lg hover:border-gray-200 transition-all duration-200 group relative"
      draggable={true}
      onDragStart={() => handleDragStart(recipe)}
      onClick={() => handleRecipeClick(recipe)}
    >
      {/* Action buttons */}
      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleQuickAdd(recipe);
          }}
          className="w-7 h-7 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center text-xs transition-all duration-200 shadow-sm hover:shadow-md"
          title="Quick add to plan"
        >
          <span className="text-xs">+</span>
        </button>
        
        {showRemove && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="w-7 h-7 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs transition-all duration-200 shadow-sm hover:shadow-md"
            title="Remove from favorites"
          >
            <span className="text-xs">×</span>
          </button>
        )}
      </div>
      
      <div className="flex items-center gap-3">
        <span className="text-2xl group-hover:scale-110 transition-transform">
          {recipe.isGoingOut ? '🍽️' : getCuisineIcon(recipe.cuisine)}
        </span>
        <div className="flex-1 min-w-0 pr-12">
          <h4 className="font-medium text-gray-900 text-sm truncate">
            {recipe.name}
          </h4>
          <p className="text-xs text-gray-500 mt-1">
            {recipe.prepTime} • {recipe.difficulty} • {recipe.calories} cal
          </p>
          <div className="flex items-center gap-2 mt-2">
            <div className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
              {recipe.cuisine}
            </div>
            {recipe.id.startsWith('custom-') && (
              <div className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full">
                Custom
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const currentRecipes = activeTab === 'rotation' ? rotationRecipes : customRecipes;

  return (
    <div className="max-w-sm mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-light text-gray-800 mb-2">My Recipes</h2>
        <p className="text-sm text-gray-500">Your personal collection</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-gray-100 rounded-xl p-1">
        <button
          onClick={() => setActiveTab('rotation')}
          className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'rotation'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          ❤️ Rotation ({rotationRecipes.length})
        </button>
        <button
          onClick={() => setActiveTab('custom')}
          className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'custom'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          ✨ Custom ({customRecipes.length})
        </button>
      </div>

      {/* Recipe List */}
      {currentRecipes.length === 0 ? (
        <div className="text-center py-12 bg-white/50 rounded-2xl border border-gray-100">
          <div className="text-4xl mb-3">
            {activeTab === 'rotation' ? '💔' : '📝'}
          </div>
          <p className="text-gray-500 text-sm mb-4">
            {activeTab === 'rotation' 
              ? 'No rotation recipes yet' 
              : 'No custom recipes yet'
            }
          </p>
          <p className="text-gray-400 text-xs">
            {activeTab === 'rotation'
              ? 'Heart recipes in the discovery panel to add them to rotation'
              : 'Click "Add Custom Meal" in the discovery panel to create your own'
            }
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {currentRecipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onRemove={() => {
                if (activeTab === 'rotation') {
                  removeFromRotation(recipe.id);
                } else {
                  removeCustomRecipe(recipe.id);
                }
              }}
            />
          ))}
        </div>
      )}

      {/* Quick Stats */}
      {currentRecipes.length > 0 && (
        <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-purple-100">
          <div className="text-center">
            <div className="text-sm font-medium text-purple-700 mb-1">
              {activeTab === 'rotation' ? 'Rotation' : 'Custom'} Collection
            </div>
            <div className="text-xs text-purple-600">
              {currentRecipes.length} recipe{currentRecipes.length !== 1 ? 's' : ''} • 
              Avg {Math.round(currentRecipes.reduce((sum, r) => sum + r.calories, 0) / currentRecipes.length)} cal
            </div>
          </div>
        </div>
      )}

      {/* Recipe Modal */}
      {selectedRecipe && (
        <RecipeModal
          recipe={selectedRecipe}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}