"use client";

import { useState } from 'react';
import { useMealPlannerStore, Recipe } from '@/store/meal-planner';
import { getCuisineIcon } from '@/data/mock-recipes';
import RecipeModal from '@/components/recipe-modal';

const WEEK_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const FULL_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

interface MealSlotProps {
  day: string;
  mealType: 'lunch' | 'dinner';
  recipe?: Recipe;
  onDrop: (day: string, mealType: 'lunch' | 'dinner') => void;
  onRecipeClick?: (recipe: Recipe) => void;
  isLocked?: boolean;
  onPlacedMealDragStart?: (day: string, mealType: 'lunch' | 'dinner', recipe: Recipe) => void;
  onGoingOutEdit?: (day: string, mealType: 'lunch' | 'dinner', newName: string) => void;
  onRemoveMeal?: (day: string, mealType: 'lunch' | 'dinner') => void;
  onToggleRotation?: (recipe: Recipe) => void;
  onToggleCompletion?: (day: string, mealType: 'lunch' | 'dinner') => void;
  isInRotation?: boolean;
  isCompleted?: boolean;
  isDarkMode?: boolean;
}

function MealSlot({ day, mealType, recipe, onDrop, onRecipeClick, onPlacedMealDragStart, onGoingOutEdit, onRemoveMeal, onToggleRotation, onToggleCompletion, isInRotation, isCompleted, isLocked, isDarkMode = false }: MealSlotProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingName, setEditingName] = useState('');
  const [isHovered, setIsHovered] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    onDrop(day, mealType);
  };

  const handlePlacedMealDragStart = () => {
    if (recipe && onPlacedMealDragStart) {
      onPlacedMealDragStart(day, mealType, recipe);
    }
  };

  const handleEditSubmit = () => {
    if (onGoingOutEdit && editingName.trim()) {
      onGoingOutEdit(day, mealType, editingName.trim());
    }
    setIsEditing(false);
    setEditingName('');
  };

  const handleEditCancel = () => {
    setIsEditing(false);
    setEditingName('');
  };

  const handleRemoveMeal = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onRemoveMeal) {
      onRemoveMeal(day, mealType);
    }
  };

  const handleToggleCompletion = () => {
    if (onToggleCompletion) {
      onToggleCompletion(day, mealType);
    }
  };

  const handleCheckmarkClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the recipe card from being clicked
    handleToggleCompletion();
  };


  return (
    <div
      className={`
        flex-1 ${isLocked ? 'h-[100px]' : 'h-[100px]'} rounded-2xl border-2 transition-all duration-300 overflow-hidden relative
        ${isLocked ? 'opacity-75 cursor-not-allowed' : ''}
        ${recipe 
          ? isDarkMode 
            ? 'border-gray-600 shadow-lg bg-gray-700/80' 
            : 'border-white shadow-lg bg-white'
          : isDarkMode 
            ? 'border-dashed border-gray-600 bg-gray-800/50' 
            : 'border-dashed border-gray-200 bg-gray-50/50'
        }
        ${isDragOver ? 'border-emerald-400 bg-emerald-50 scale-105 shadow-xl' : ''}
        ${recipe 
          ? 'hover:shadow-xl cursor-pointer' 
          : isDarkMode ? 'hover:bg-gray-700/70' : 'hover:bg-gray-100/70'
        }
      `}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => {
        if (recipe && onRecipeClick) {
          onRecipeClick(recipe);
        }
      }}
      draggable={!!recipe}
      onDragStart={handlePlacedMealDragStart}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`${isLocked ? 'p-4' : 'p-3'} h-full flex flex-col justify-center`}>
        {recipe ? (
          <div className={`space-y-1.5 ${isLocked ? 'h-[110px]' : ''}`}>
            {/* Action buttons */}
            {isHovered && !isEditing && !isLocked && (
              <div className="absolute top-1 right-1 flex gap-1 z-10">
                {/* Rotation button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onToggleRotation) {
                      onToggleRotation(recipe);
                    }
                  }}
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs transition-all duration-200 shadow-sm hover:shadow-md ${
                    isInRotation 
                      ? 'bg-red-500 hover:bg-red-600 text-white' 
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-600'
                  }`}
                  title={isInRotation ? "Remove from rotation" : "Add to rotation"}
                >
                  <span className="text-xs">{isInRotation ? '❤️' : '🤍'}</span>
                </button>
                
                {/* Trash can button */}
                <button
                  onClick={handleRemoveMeal}
                  className="w-7 h-7 bg-gray-400 hover:bg-gray-500 text-white rounded-full flex items-center justify-center text-xs transition-all duration-200 shadow-sm hover:shadow-md"
                  title="Remove meal"
                >
                  <span className="text-xs">🗑️</span>
                </button>
              </div>
            )}
            <div className="flex items-start gap-2">
              <div className="flex-1 min-w-0">
                {isEditing && recipe.isGoingOut ? (
                  <div className="space-y-1">
                    <input
                      type="text"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      className="w-full text-sm font-semibold bg-transparent border-b border-purple-300 focus:outline-none focus:border-purple-500"
                      placeholder="Restaurant name..."
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleEditSubmit();
                        if (e.key === 'Escape') handleEditCancel();
                      }}
                    />
                    <div className="flex gap-1">
                      <button
                        onClick={handleEditSubmit}
                        className="text-xs px-1.5 py-0.5 bg-purple-500 text-white rounded"
                      >
                        ✓
                      </button>
                      <button
                        onClick={handleEditCancel}
                        className="text-xs px-1.5 py-0.5 bg-gray-300 text-gray-700 rounded"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col h-full">
                    <h4
                      className={`font-medium text-sm leading-tight transition-colors duration-300 line-clamp-2 ${
                        recipe.isGoingOut
                          ? isDarkMode
                            ? 'text-gray-200 cursor-pointer hover:text-gray-300'
                            : 'text-gray-900 cursor-pointer hover:text-purple-700'
                          : isDarkMode ? 'text-gray-200 cursor-pointer hover:text-gray-300' : 'text-gray-900 cursor-pointer hover:text-gray-700'
                      }`}
                      onClick={() => onRecipeClick?.(recipe)}
                    >
                      {recipe.isGoingOut ? '🍽️ ' : `${getCuisineIcon(recipe.cuisine)} `}{recipe.name}
                    </h4>
                    <p className={`text-xs mt-4 transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} flex items-center justify-between`}>
                      <span>{recipe.calories > 0 ? `${recipe.calories} cal` : 'Variable'}</span>
                      <button 
                        onClick={handleCheckmarkClick}
                        className={`text-xs transition-colors duration-300 hover:scale-110 ${
                          isCompleted 
                            ? 'text-green-500' 
                            : isDarkMode ? 'text-gray-500 hover:text-green-400' : 'text-gray-400 hover:text-green-500'
                        }`}
                        title="Mark as completed"
                      >
                        ✓
                      </button>
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className={`text-xs font-medium mb-1 transition-colors duration-300 ${
              isDarkMode ? 'text-gray-500' : 'text-gray-400'
            }`}>
              {mealType === 'lunch' ? '🥗 Lunch' : '🍽️ Dinner'}
            </div>
            <div className={`text-2xl mb-1 transition-colors duration-300 ${
              isDarkMode ? 'text-gray-600' : 'text-gray-300'
            }`}>+</div>
            <div className={`text-xs transition-colors duration-300 ${
              isDarkMode ? 'text-gray-500' : 'text-gray-400'
            }`}>Drop here</div>
          </div>
        )}
      </div>
    </div>
  );
}

interface MealPlannerProps {
  isDarkMode?: boolean;
  isLocked?: boolean;
}

export default function MealPlanner({ isDarkMode = false, isLocked = false }: MealPlannerProps) {
  const { 
    currentWeekOffset,
    draggedRecipe, 
    draggedMealSource,
    getCurrentWeekMealPlan,
    addMealToPlan, 
    moveMealInPlan,
    updateMealInPlan,
    removeMealFromPlan,
    setCurrentWeekOffset,
    setDraggedRecipe,
    setDraggedMealSource,
    clearCurrentWeekMealPlan,
    addToRotation,
    removeFromRotation,
    isInRotation,
    isWeekLocked,
    lockWeek,
    unlockWeek
  } = useMealPlannerStore();

  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLockAnimating, setIsLockAnimating] = useState(false);
  const [completedMeals, setCompletedMeals] = useState<Set<string>>(new Set());
  
  const mealPlan = getCurrentWeekMealPlan();

  const handleDrop = (day: string, mealType: 'lunch' | 'dinner') => {
    if (isWeekLocked) return; // Prevent drops when locked
    
    const fullDay = FULL_DAYS[WEEK_DAYS.indexOf(day)];
    
    if (draggedMealSource) {
      // Moving a meal from one slot to another
      moveMealInPlan(draggedMealSource.day, draggedMealSource.mealType, fullDay, mealType);
      setDraggedMealSource(null);
      setDraggedRecipe(null);
    } else if (draggedRecipe) {
      // Adding a new recipe from discovery
      addMealToPlan(fullDay, mealType, draggedRecipe);
    }
  };

  const handlePlacedMealDragStart = (day: string, mealType: 'lunch' | 'dinner', recipe: Recipe) => {
    if (isWeekLocked) return; // Prevent drag when locked
    
    const fullDay = FULL_DAYS[WEEK_DAYS.indexOf(day)];
    setDraggedMealSource({ day: fullDay, mealType });
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

  const handleLockToggle = () => {
    if (isWeekLocked) {
      // Unlocking - animate back to planning mode
      setIsLockAnimating(true);
      
      setTimeout(() => {
        unlockWeek();
        setIsLockAnimating(false);
      }, 600);
    } else {
      // Locking - animate to execution mode
      setIsLockAnimating(true);
      
      // Start the visual animation immediately
      setTimeout(() => {
        lockWeek();
        setIsLockAnimating(false);
        // Smooth scroll to top when entering execution mode
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 600); // Reduced from 800ms for snappier feel
    }
  };

  const handleGoingOutEdit = (day: string, mealType: 'lunch' | 'dinner', newName: string) => {
    const fullDay = FULL_DAYS[WEEK_DAYS.indexOf(day)];
    updateMealInPlan(fullDay, mealType, {
      restaurantName: newName,
      name: `${mealType === 'lunch' ? 'Lunch' : 'Dinner'} Out${newName ? ` (${newName})` : ''}`
    });
  };

  const handleRemoveMeal = (day: string, mealType: 'lunch' | 'dinner') => {
    if (isWeekLocked) return; // Prevent removal when locked
    
    const fullDay = FULL_DAYS[WEEK_DAYS.indexOf(day)];
    removeMealFromPlan(fullDay, mealType);
  };

  const handleToggleRotation = (recipe: Recipe) => {
    if (isInRotation(recipe.id)) {
      removeFromRotation(recipe.id);
    } else {
      addToRotation(recipe);
    }
  };

  const toggleMealCompletion = (day: string, mealType: 'lunch' | 'dinner') => {
    // Convert short day name to full day name for consistency
    const dayIndex = WEEK_DAYS.indexOf(day);
    const fullDay = FULL_DAYS[dayIndex];
    const mealKey = `${fullDay}-${mealType}`;
    
    const newCompletedMeals = new Set(completedMeals);
    
    if (newCompletedMeals.has(mealKey)) {
      newCompletedMeals.delete(mealKey);
    } else {
      newCompletedMeals.add(mealKey);
    }
    
    setCompletedMeals(newCompletedMeals);
  };

  const getWeekDate = (offset: number) => {
    const today = new Date();
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 1 + (offset * 7)));
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    
    return {
      start: startOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      end: endOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    };
  };

  const getPlannedMeals = () => {
    let count = 0;
    Object.values(mealPlan).forEach(day => {
      if (day.lunch) count++;
      if (day.dinner) count++;
    });
    return count;
  };

  const weekDate = getWeekDate(currentWeekOffset);

  if (isLocked) {
    // Stacked, full-screen execution mode
    return (
      <div className="w-full max-w-[99.5rem] mx-auto transition-all duration-500 px-1">
        {/* Zen Mode Header */}
        <div className="flex flex-col items-center mb-12">
          <h2 className={`text-5xl font-light mb-3 transition-colors duration-300 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>Execution Mode</h2>
          <p className={`text-lg transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Your plan is locked in. Stick to it.</p>
        </div>
        
        {/* Stacked Week Layout */}
        <div className="space-y-6">
          {/* Top Row: Monday - Thursday */}
          <div className="grid grid-cols-4 gap-0">
            {WEEK_DAYS.slice(0, 4).map((day, index) => {
              const fullDay = FULL_DAYS[index];
              return (
                <div key={day} className="flex-1">
                  <div className={`p-4 rounded-3xl border transition-all duration-300 ${isDarkMode ? 'bg-gray-800/80 border-gray-700' : 'bg-white/80 border-gray-100'}`}> 
                    <h3 className={`text-lg font-semibold mb-4 text-center ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>{day}</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-4">
                        <span className={`text-sm font-medium w-16 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Lunch</span>
                        <MealSlot
                          day={day}
                          mealType="lunch"
                          recipe={mealPlan[fullDay]?.lunch}
                          onDrop={() => {}}
                          onRecipeClick={handleRecipeClick}
                          onToggleCompletion={toggleMealCompletion}
                          isCompleted={mealPlan[fullDay]?.lunch ? completedMeals.has(`${fullDay}-lunch`) : false}
                          isLocked={true}
                          isDarkMode={isDarkMode}
                        />
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`text-sm font-medium w-16 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Dinner</span>
                        <MealSlot
                          day={day}
                          mealType="dinner"
                          recipe={mealPlan[fullDay]?.dinner}
                          onDrop={() => {}}
                          onRecipeClick={handleRecipeClick}
                          onToggleCompletion={toggleMealCompletion}
                          isCompleted={mealPlan[fullDay]?.dinner ? completedMeals.has(`${fullDay}-dinner`) : false}
                          isLocked={true}
                          isDarkMode={isDarkMode}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Bottom Row: Friday - Sunday + Snacks */}
          <div className="grid grid-cols-4 gap-0">
            {WEEK_DAYS.slice(4, 7).map((day, index) => {
              const fullDay = FULL_DAYS[index + 4];
              return (
                <div key={day} className="flex-1">
                  <div className={`p-4 rounded-3xl border transition-all duration-300 ${isDarkMode ? 'bg-gray-800/80 border-gray-700' : 'bg-white/80 border-gray-100'}`}> 
                    <h3 className={`text-lg font-semibold mb-4 text-center ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>{day}</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-4">
                        <span className={`text-sm font-medium w-16 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Lunch</span>
                        <MealSlot
                          day={day}
                          mealType="lunch"
                          recipe={mealPlan[fullDay]?.lunch}
                          onDrop={() => {}}
                          onRecipeClick={handleRecipeClick}
                          onToggleCompletion={toggleMealCompletion}
                          isCompleted={mealPlan[fullDay]?.lunch ? completedMeals.has(`${fullDay}-lunch`) : false}
                          isLocked={true}
                          isDarkMode={isDarkMode}
                        />
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`text-sm font-medium w-16 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Dinner</span>
                        <MealSlot
                          day={day}
                          mealType="dinner"
                          recipe={mealPlan[fullDay]?.dinner}
                          onDrop={() => {}}
                          onRecipeClick={handleRecipeClick}
                          onToggleCompletion={toggleMealCompletion}
                          isCompleted={mealPlan[fullDay]?.dinner ? completedMeals.has(`${fullDay}-dinner`) : false}
                          isLocked={true}
                          isDarkMode={isDarkMode}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            
            {/* Snacks Card */}
            <div className="flex-1">
              <div className={`p-4 rounded-3xl border transition-all duration-300 ${isDarkMode ? 'bg-gray-800/80 border-gray-700' : 'bg-white/80 border-gray-100'}`}> 
                <h3 className={`text-lg font-semibold mb-4 text-center ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Snacks</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-4">
                    <span className={`text-sm font-medium w-16 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Healthy</span>
                    <div className={`flex-1 h-[80px] rounded-2xl border-2 transition-all duration-300 overflow-hidden relative ${isDarkMode ? 'border-dashed border-gray-600 bg-gray-800/50' : 'border-dashed border-gray-200 bg-gray-50/50'}`}>
                      <div className="p-3 h-full flex flex-col justify-center">
                        <div className="text-center">
                          <div className={`text-xs font-medium mb-1 transition-colors duration-300 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                            🥤 Protein Shakes
                          </div>
                          <div className={`text-2xl mb-1 transition-colors duration-300 ${isDarkMode ? 'text-gray-600' : 'text-gray-300'}`}>+</div>
                          <div className={`text-xs transition-colors duration-300 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Add healthy snacks</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`text-sm font-medium w-16 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Treats</span>
                    <div className={`flex-1 h-[100px] rounded-2xl border-2 transition-all duration-300 overflow-hidden relative ${isDarkMode ? 'border-dashed border-gray-600 bg-gray-800/50' : 'border-dashed border-gray-200 bg-gray-50/50'}`}>
                      <div className="p-3 h-full flex flex-col justify-center">
                        <div className="text-center">
                          <div className={`text-xs font-medium mb-1 transition-colors duration-300 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                            🍫 Smart Desserts
                          </div>
                          <div className={`text-2xl mb-1 transition-colors duration-300 ${isDarkMode ? 'text-gray-600' : 'text-gray-300'}`}>+</div>
                          <div className={`text-xs transition-colors duration-300 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Plan your treats</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Unlock Toggle */}
        <div className="text-center mt-12">
          <div className="flex items-center justify-center space-x-3">
            <span className={`text-sm font-medium transition-colors ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              🔒 Execution Mode
            </span>
            
            {/* Toggle Switch */}
            <button
              onClick={handleLockToggle}
              disabled={isLockAnimating}
              className={`
                relative w-16 h-8 rounded-full transition-all duration-500 focus:outline-none focus:ring-2 focus:ring-orange-300
                ${isLockAnimating
                  ? 'bg-gradient-to-r from-orange-300 to-yellow-400 shadow-lg'
                  : 'bg-gradient-to-r from-orange-400 to-yellow-500 shadow-lg'
                }
              `}
            >
              {/* Toggle Slider */}
              <div className={`
                absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-all duration-500 flex items-center justify-center
                ${isLockAnimating ? 'translate-x-1' : 'translate-x-8'}
                ${!isLockAnimating ? 'hover:scale-110' : ''}
              `}>
                {isLockAnimating ? (
                  <span className="text-xs animate-pulse">
                    🔓
                  </span>
                ) : (
                  <span className="text-xs">🔓</span>
                )}
              </div>
            </button>
            
            <span className={`text-sm font-medium transition-colors ${
              isLockAnimating 
                ? 'text-orange-600' 
                : isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              ✨ Plan & Edit
            </span>
          </div>
        </div>

        {/* Recipe Modal */}
        {selectedRecipe && (
          <RecipeModal
            recipe={selectedRecipe}
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            onEdit={() => {}} // TODO: Implement edit from meal planner if needed
            isDarkMode={isDarkMode}
          />
        )}
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      {/* Minimal Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-4 mb-3">
          <button 
            onClick={() => setCurrentWeekOffset(currentWeekOffset - 1)}
            className={`p-2 rounded-full transition-colors ${
              isDarkMode 
                ? 'hover:bg-gray-700 text-gray-400 hover:text-gray-200'
                : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
            }`}
          >
            ←
          </button>
          <div>
            <h2 className={`text-2xl font-light transition-colors duration-300 ${
              isDarkMode ? 'text-gray-100' : 'text-gray-800'
            }`}>
              {currentWeekOffset === 0 ? 'This Week' : 
               currentWeekOffset === 1 ? 'Next Week' : 
               currentWeekOffset === -1 ? 'Last Week' : 
               currentWeekOffset > 1 ? `${currentWeekOffset} Weeks Ahead` : 
               `${Math.abs(currentWeekOffset)} Weeks Ago`}
            </h2>
            <p className={`text-sm transition-colors duration-300 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              {weekDate.start} - {weekDate.end}
            </p>
          </div>
          <button 
            onClick={() => setCurrentWeekOffset(currentWeekOffset + 1)}
            className={`p-2 rounded-full transition-colors ${
              isDarkMode 
                ? 'hover:bg-gray-700 text-gray-400 hover:text-gray-200'
                : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
            }`}
          >
            →
          </button>
        </div>
        
        {/* Progress Indicator */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className={`text-xs transition-colors duration-300 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            {getPlannedMeals()} of 14 meals planned
          </div>
          <div className={`w-24 h-1.5 rounded-full overflow-hidden transition-colors duration-300 ${
            isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
          }`}>
            <div 
              className="h-full bg-gradient-to-r from-emerald-400 to-blue-500 transition-all duration-500"
              style={{ width: `${(getPlannedMeals() / 14) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Vertical Day List */}
      <div className="space-y-6">
        {WEEK_DAYS.map((day, index) => {
          const fullDay = FULL_DAYS[index];
          const isToday = index === new Date().getDay() - 1;
          
          return (
            <div 
              key={day}
              className={`
                p-6 backdrop-blur-sm rounded-3xl border transition-all duration-300 hover:shadow-lg
                ${isToday 
                  ? isDarkMode 
                    ? 'bg-gray-800/70 border-gray-600' 
                    : 'border-emerald-200 bg-emerald-50/30'
                  : isDarkMode 
                    ? 'bg-gray-800/70 border-gray-700 hover:border-gray-600' 
                    : 'bg-white/70 border-gray-100 hover:border-gray-200'
                }
              `}
            >
              {/* Day Header */}
              <div className="text-center mb-4">
                <h3 className={`text-lg font-medium transition-colors duration-300 ${
                  isToday 
                    ? 'text-emerald-600' 
                    : isDarkMode ? 'text-gray-200' : 'text-gray-700'
                }`}>
                  {day}
                  {isToday && (
                    <span className={`text-xs ml-2 px-2 py-1 rounded-full transition-colors duration-300 ${
                      isDarkMode 
                        ? 'bg-emerald-900/40 text-emerald-500' 
                        : 'bg-emerald-100 text-emerald-600'
                    }`}>Today</span>
                  )}
                </h3>
              </div>

              {/* Meal Slots */}
              <div className="flex gap-4">
                <MealSlot
                  day={day}
                  mealType="lunch"
                  recipe={mealPlan[fullDay]?.lunch}
                  onDrop={handleDrop}
                  onRecipeClick={handleRecipeClick}
                  onPlacedMealDragStart={handlePlacedMealDragStart}
                  onGoingOutEdit={handleGoingOutEdit}
                  onRemoveMeal={handleRemoveMeal}
                  onToggleRotation={handleToggleRotation}
                  onToggleCompletion={toggleMealCompletion}
                  isInRotation={mealPlan[fullDay]?.lunch ? isInRotation(mealPlan[fullDay]!.lunch!.id) : false}
                  isCompleted={mealPlan[fullDay]?.lunch ? completedMeals.has(`${fullDay}-lunch`) : false}
                  isLocked={isWeekLocked}
                  isDarkMode={isDarkMode}
                />
                <MealSlot
                  day={day}
                  mealType="dinner"
                  recipe={mealPlan[fullDay]?.dinner}
                  onDrop={handleDrop}
                  onRecipeClick={handleRecipeClick}
                  onPlacedMealDragStart={handlePlacedMealDragStart}
                  onGoingOutEdit={handleGoingOutEdit}
                  onRemoveMeal={handleRemoveMeal}
                  onToggleRotation={handleToggleRotation}
                  onToggleCompletion={toggleMealCompletion}
                  isInRotation={mealPlan[fullDay]?.dinner ? isInRotation(mealPlan[fullDay]!.dinner!.id) : false}
                  isCompleted={mealPlan[fullDay]?.dinner ? completedMeals.has(`${fullDay}-dinner`) : false}
                  isLocked={isWeekLocked}
                  isDarkMode={isDarkMode}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Actions */}
      <div className="text-center mt-8 space-y-3">
        {/* Lock It In Toggle */}
        <div className="flex items-center justify-center space-x-3">
          <span className={`text-sm font-medium transition-colors ${
            !isWeekLocked 
              ? 'text-orange-600' 
              : isDarkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            ✨ Plan & Edit
          </span>
          
          {/* Toggle Switch */}
          <button
            onClick={handleLockToggle}
            disabled={isLockAnimating}
            className={`
              relative w-16 h-8 rounded-full transition-all duration-500 focus:outline-none focus:ring-2 focus:ring-orange-300
              ${isWeekLocked 
                ? 'bg-gradient-to-r from-orange-400 to-yellow-500 shadow-lg' 
                : isLockAnimating
                ? 'bg-gradient-to-r from-orange-300 to-yellow-400 shadow-lg'
                : 'bg-gradient-to-r from-gray-300 to-gray-400 hover:from-purple-300 hover:to-pink-300'
              }
            `}
          >
            {/* Toggle Slider */}
            <div className={`
              absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-all duration-500 flex items-center justify-center
              ${isWeekLocked || isLockAnimating ? 'translate-x-8' : 'translate-x-1'}
              ${!isLockAnimating ? 'hover:scale-110' : ''}
            `}>
              {isLockAnimating ? (
                <span className="text-xs animate-pulse">
                  🔒
                </span>
              ) : isWeekLocked ? (
                <span className="text-xs">🔒</span>
              ) : (
                <span className="text-xs">✏️</span>
              )}
            </div>
          </button>
          
          <span className={`text-sm font-medium transition-colors ${
            isWeekLocked 
              ? 'text-orange-600' 
              : isDarkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            🔒 Lock It In
          </span>
        </div>

        {/* Clear Week Button */}
        <button 
          onClick={clearCurrentWeekMealPlan}
          disabled={isWeekLocked}
          className={`px-6 py-2 text-sm transition-colors ${
            isWeekLocked 
              ? isDarkMode ? 'text-gray-600 cursor-not-allowed' : 'text-gray-300 cursor-not-allowed'
              : isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Clear This Week
        </button>
      </div>

      {/* Recipe Modal */}
      {selectedRecipe && (
        <RecipeModal
          recipe={selectedRecipe}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onEdit={() => {}} // TODO: Implement edit from meal planner if needed
          isDarkMode={isDarkMode}
        />
      )}
    </div>
  );
}