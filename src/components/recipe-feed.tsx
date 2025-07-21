"use client";

import { useEffect, useState } from 'react';
import { BentoGrid, BentoCard } from '@/components/ui/bento-grid';
import Marquee from '@/components/ui/marquee';
import RecipeModal from '@/components/recipe-modal';
import { useMealPlannerStore, Recipe } from '@/store/meal-planner';
import { MOCK_RECIPES, getCuisineIcon } from '@/data/mock-recipes';

export default function RecipeFeed() {
  const { 
    availableRecipes, 
    setAvailableRecipes, 
    setDraggedRecipe,
    isGenerating,
    addMealToPlan 
  } = useMealPlannerStore();

  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Initialize with mock recipes
    setAvailableRecipes(MOCK_RECIPES);
  }, [setAvailableRecipes]);

  const handleDragStart = (recipe: Recipe) => {
    setDraggedRecipe(recipe);
  };

  const handleRecipeClick = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRecipe(null);
  };

  const handleAddToPlan = (recipe: Recipe) => {
    // For now, we'll add to next available slot - this could be enhanced with a day/meal selector
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const mealTypes: ('lunch' | 'dinner')[] = ['dinner', 'lunch'];
    
    // Find first available slot
    for (const day of days) {
      for (const mealType of mealTypes) {
        // This is a simplified version - in reality you'd check the meal plan state
        addMealToPlan(day, mealType, recipe);
        return;
      }
    }
  };

  if (isGenerating) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Marquee */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-800">Discover Recipes</h2>
        <Marquee className="text-sm font-medium text-orange-600">
          🔥 Fresh Seasonal Recipes • 🎯 Bold Flavors • ⚡ Quick & Easy • 👨‍🍳 Chef Approved
        </Marquee>
      </div>

      {/* Recipe Grid */}
      <div className="max-h-[800px] overflow-y-auto pr-2">
        <BentoGrid className="grid-cols-1 md:grid-cols-2 gap-4">
          {availableRecipes.map((recipe) => (
            <BentoCard
              key={recipe.id}
              name={recipe.name}
              description={`${recipe.prepTime} • ${recipe.difficulty} • ${recipe.calories} cal`}
              className="col-span-1 h-48 cursor-grab active:cursor-grabbing hover:shadow-lg transition-all"
              draggable={true}
              onDragStart={() => handleDragStart(recipe)}
              onClick={() => handleRecipeClick(recipe)}
              cta="View Recipe"
              background={
                <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-amber-50 opacity-50" />
              }
            >
              <div className="flex items-center gap-2">
                <span className="text-2xl">{getCuisineIcon(recipe.cuisine)}</span>
                <span className="text-sm text-gray-600">{recipe.cuisine}</span>
              </div>
            </BentoCard>
          ))}
        </BentoGrid>
      </div>

      {/* Generate More Button */}
      <div className="flex justify-center pt-4">
        <button 
          className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
          onClick={() => {
            // Placeholder for LLM integration
            console.log('Generate more recipes...');
          }}
        >
          ✨ Generate More Recipes
        </button>
      </div>

      {/* Recipe Modal */}
      {selectedRecipe && (
        <RecipeModal
          recipe={selectedRecipe}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onAddToPlan={handleAddToPlan}
        />
      )}
    </div>
  );
}