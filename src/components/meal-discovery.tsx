"use client";

import { useEffect, useState } from 'react';
import RecipeModal from '@/components/recipe-modal';
import CustomMealModal from '@/components/custom-meal-modal';
import { useMealPlannerStore, Recipe } from '@/store/meal-planner';
import { MOCK_RECIPES, GOING_OUT_TEMPLATES, getCuisineIcon } from '@/data/mock-recipes';

const FILTER_CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'quick', label: 'Quick' },
  { id: 'healthy', label: 'Healthy' },
  { id: 'rotation', label: 'Rotation' },
];

interface MealDiscoveryProps {
  isDarkMode?: boolean;
}

export default function MealDiscovery({ isDarkMode = false }: MealDiscoveryProps) {
  const { 
    availableRecipes, 
    customRecipes,
    setAvailableRecipes, 
    setDraggedRecipe,
    isGenerating,
    addToRotation,
    removeFromRotation,
    isInRotation,
    addCustomRecipe,
    updateCustomRecipe
  } = useMealPlannerStore();

  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);

  // Reset filter to 'all' when new recipes are generated
  useEffect(() => {
    if (availableRecipes.length > 0 && activeFilter !== 'all') {
      console.log(`Resetting filter from "${activeFilter}" to "all" to show new recipes`);
      setActiveFilter('all');
    }
  }, [availableRecipes.length, activeFilter]); // Trigger when recipe count changes

  useEffect(() => {
    // Combine all recipe sources
    const allRecipes = [...GOING_OUT_TEMPLATES, ...MOCK_RECIPES, ...customRecipes];
    
    // Create a comprehensive deduplication system
    const uniqueRecipes = allRecipes.filter((recipe, index, self) => {
      // Normalize recipe name for comparison (lowercase, trimmed, remove extra spaces)
      const normalizedName = recipe.name.toLowerCase().trim().replace(/\s+/g, ' ');
      
      // Find first occurrence of this ID
      const firstIdIndex = self.findIndex(r => r.id === recipe.id);
      if (firstIdIndex !== index) return false;
      
      // Find first occurrence of this normalized name
      const firstNameIndex = self.findIndex(r => 
        r.name.toLowerCase().trim().replace(/\s+/g, ' ') === normalizedName
      );
      if (firstNameIndex !== index) return false;
      
      return true;
    });
    
    // Sort to ensure custom meals appear at the bottom
    const sortedRecipes = uniqueRecipes.sort((a, b) => {
      const aIsCustom = a.id?.startsWith('custom-') ? 1 : 0;
      const bIsCustom = b.id?.startsWith('custom-') ? 1 : 0;
      return aIsCustom - bIsCustom;
    });
    
    console.log(`Loaded ${sortedRecipes.length} unique recipes from ${allRecipes.length} total`);
    setAvailableRecipes(sortedRecipes);
  }, [customRecipes, setAvailableRecipes]);

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

  const handleCloseCustomModal = () => {
    setIsCustomModalOpen(false);
    setEditingRecipe(null); // Reset editing state
  };

  const handleToggleRotation = (e: React.MouseEvent, recipe: Recipe) => {
    e.stopPropagation();
    if (isInRotation(recipe.id)) {
      removeFromRotation(recipe.id);
    } else {
      addToRotation(recipe);
    }
  };

  const handleSaveCustomRecipe = (recipe: Recipe) => {
    if (editingRecipe) {
      // Update existing recipe
      updateCustomRecipe(recipe.id, recipe);
      setEditingRecipe(null);
    } else {
      // Add new recipe
      addCustomRecipe(recipe);
    }
    setIsCustomModalOpen(false);
  };

  const handleEditRecipe = (recipe: Recipe) => {
    setEditingRecipe(recipe);
    setIsCustomModalOpen(true);
    setIsModalOpen(false); // Close recipe modal
  };

  const filteredRecipes = availableRecipes.filter(recipe => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'quick') return recipe.prepTime.includes('15') || recipe.prepTime.includes('10');
    if (activeFilter === 'healthy') return recipe.calories < 400;
    if (activeFilter === 'rotation') return isInRotation(recipe.id);
    return true;
  });

  console.log(`MealDiscovery rendering: ${availableRecipes.length} total recipes, ${filteredRecipes.length} after filter "${activeFilter}"`);

  if (isGenerating) {
    return (
      <div className="max-w-sm mx-auto">
        <div className={`backdrop-blur-sm rounded-3xl border p-8 text-center transition-all duration-300 ${
          isDarkMode 
            ? 'bg-gray-800/70 border-gray-700' 
            : 'bg-white/70 border-gray-100'
        }`}>
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-orange-500 border-t-transparent mx-auto mb-4"></div>
          <p className={`text-sm transition-colors duration-300 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>Generating fresh ideas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-sm mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className={`text-2xl font-light mb-2 transition-colors duration-300 ${
          isDarkMode ? 'text-gray-100' : 'text-gray-800'
        }`}>Recipe Ideas</h2>
        <p className={`text-sm mb-4 transition-colors duration-300 ${
          isDarkMode ? 'text-gray-400' : 'text-gray-500'
        }`}>Drag to plan your week</p>
        
        {/* Add Custom Meal Button */}
        <button
          onClick={() => setIsCustomModalOpen(true)}
          className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors font-medium text-sm shadow-sm hover:shadow-md"
        >
          ✨ Add Custom Meal
        </button>
      </div>

      {/* Filter Pills */}
      <div className="flex gap-2 mb-6 justify-center">
        {FILTER_CATEGORIES.map(filter => {
          return (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                activeFilter === filter.id
                  ? isDarkMode 
                    ? 'bg-gray-700/80 text-gray-200 border-gray-600'
                    : 'bg-emerald-100 text-emerald-700 border-emerald-200'
                  : isDarkMode 
                    ? 'bg-gray-800/70 text-gray-300 hover:bg-gray-700/70 border-gray-600'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border-gray-200'
              }`}
            >
              {filter.label}
            </button>
          );
        })}
      </div>

      {/* Recipe List */}
      <div className="space-y-4">
        {/* Going Out Templates */}
        <div className="space-y-3">
          {GOING_OUT_TEMPLATES.map((template) => (
            <div
              key={template.id}
              className={`p-4 rounded-2xl border-2 border-dashed cursor-grab active:cursor-grabbing hover:shadow-md transition-all duration-200 ${
                isDarkMode 
                  ? 'bg-gray-800/60 border-gray-600 hover:border-gray-500'
                  : 'bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200 hover:border-purple-300'
              }`}
              draggable={true}
              onDragStart={() => handleDragStart(template)}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">🍽️</span>
                <div>
                  <h4 className={`font-medium text-sm transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-200' : 'text-gray-900'
                  }`}>
                    {template.name}
                  </h4>
                  <p className={`text-xs transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>Editable placeholder</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Regular Recipes */}
        <div className="space-y-3">
          {filteredRecipes.filter(recipe => !recipe.isGoingOut).map((recipe) => (
            <div
              key={recipe.id}
              className={`p-4 backdrop-blur-sm rounded-2xl border cursor-grab active:cursor-grabbing hover:shadow-lg transition-all duration-200 group relative ${
                isDarkMode 
                  ? 'bg-gray-800/80 border-gray-700 hover:border-gray-600'
                  : 'bg-white/80 border-gray-100 hover:border-gray-200'
              }`}
              draggable={true}
              onDragStart={() => handleDragStart(recipe)}
              onClick={() => handleRecipeClick(recipe)}
            >
              {/* Rotation button */}
              <button
                onClick={(e) => handleToggleRotation(e, recipe)}
                className={`absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 z-10 opacity-0 group-hover:opacity-100 ${
                  isInRotation(recipe.id)
                    ? 'bg-red-100 hover:bg-red-200 text-red-600' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-500'
                }`}
                title={isInRotation(recipe.id) ? "Remove from rotation" : "Add to rotation"}
              >
                <span className="text-xs">{isInRotation(recipe.id) ? '❤️' : '🤍'}</span>
              </button>
              
              <div className="flex items-center gap-3">
                <span className="text-2xl group-hover:scale-110 transition-transform">
                  {getCuisineIcon(recipe.cuisine)}
                </span>
                <div className="flex-1 min-w-0 pr-8">
                  <h4 className={`font-medium text-sm truncate transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-200' : 'text-gray-900'
                  }`}>
                    {recipe.name}
                  </h4>
                  <p className={`text-xs mt-1 transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    {recipe.prepTime} • {recipe.difficulty} • {recipe.calories} cal
                  </p>
                  <div className={`text-xs px-2 py-1 rounded-full inline-block mt-2 max-w-[120px] transition-all duration-300 ${
                    isDarkMode 
                      ? 'bg-gray-700/70 text-gray-300'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    <span className="truncate block">
                      {recipe.cuisine.length > 15 ? recipe.cuisine.split(/[-\s]/).slice(0, 2).join(' ') : recipe.cuisine}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Empty State */}
      {filteredRecipes.length === 0 && (
        <div className={`text-center py-12 rounded-2xl border transition-all duration-300 ${
          isDarkMode 
            ? 'bg-gray-800/50 border-gray-700'
            : 'bg-white/50 border-gray-100'
        }`}>
          <div className="text-4xl mb-2">🤔</div>
          <p className={`text-sm transition-colors duration-300 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>No recipes match your filter</p>
        </div>
      )}

      {/* Recipe Modal */}
      {selectedRecipe && (
        <RecipeModal
          recipe={selectedRecipe}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onEdit={handleEditRecipe}
          isDarkMode={isDarkMode}
        />
      )}
      
      {/* Custom Meal Modal */}
      <CustomMealModal
        isOpen={isCustomModalOpen}
        onClose={handleCloseCustomModal}
        onSave={handleSaveCustomRecipe}
        editingRecipe={editingRecipe || undefined}
      />
    </div>
  );
}