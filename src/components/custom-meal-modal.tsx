"use client";

import { useState, useEffect } from 'react';
import { Recipe } from '@/store/meal-planner';
import { getCuisineIcon } from '@/data/mock-recipes';

interface CustomMealModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (recipe: Recipe) => void;
  editingRecipe?: Recipe; // For edit mode
}

const CUISINE_OPTIONS = [
  'Italian', 'American', 'Mexican', 'Asian', 'Japanese', 'Korean', 
  'Thai', 'Mediterranean', 'Greek', 'French', 'Indian', 'Middle Eastern'
];

const DIFFICULTY_OPTIONS = ['Easy', 'Medium', 'Hard'] as const;

export default function CustomMealModal({ isOpen, onClose, onSave, editingRecipe }: CustomMealModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    prepTime: '',
    difficulty: 'Easy' as 'Easy' | 'Medium' | 'Hard',
    calories: '',
    cuisine: 'American',
    proteins: '',
    vegetables: '',
    starches: '',
    ingredients: '',
    instructions: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isAutoFilling, setIsAutoFilling] = useState(false);

  // Pre-populate form when editing
  useEffect(() => {
    if (editingRecipe) {
      setFormData({
        name: editingRecipe.name,
        description: editingRecipe.description,
        prepTime: editingRecipe.prepTime,
        difficulty: editingRecipe.difficulty,
        calories: editingRecipe.calories.toString(),
        cuisine: editingRecipe.cuisine,
        proteins: editingRecipe.proteins.join(', '),
        vegetables: editingRecipe.vegetables.join(', '),
        starches: editingRecipe.starches.join(', '),
        ingredients: editingRecipe.ingredients.join('\n'),
        instructions: editingRecipe.instructions.join('\n')
      });
    }
  }, [editingRecipe]);

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newErrors.name = 'Recipe name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.prepTime.trim()) newErrors.prepTime = 'Prep time is required';
    if (!formData.calories || parseInt(formData.calories) <= 0) newErrors.calories = 'Valid calories required';
    if (!formData.instructions.trim()) newErrors.instructions = 'Instructions are required';
    // Note: ingredients are now optional - categories are sufficient for grocery list
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAutoFill = async () => {
    if (!formData.name.trim()) {
      alert('Please enter a recipe name first before auto-filling');
      return;
    }

    setIsAutoFilling(true);
    try {
      const response = await fetch('/api/autofill-recipe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: formData.name.trim() }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Auto-fill result:', result);
      
      if (result.status === 'success' && result.data) {
        const data = result.data;
        // Validate cuisine against our supported options
        const validCuisine = CUISINE_OPTIONS.includes(data.cuisine) ? data.cuisine : 'American';
        
        setFormData(prev => ({
          ...prev,
          description: data.description || prev.description,
          prepTime: data.prepTime || prev.prepTime,
          difficulty: (data.difficulty as 'Easy' | 'Medium' | 'Hard') || prev.difficulty,
          calories: data.calories?.toString() || prev.calories,
          cuisine: validCuisine,
          proteins: Array.isArray(data.proteins) ? data.proteins.join(', ') : prev.proteins,
          vegetables: Array.isArray(data.vegetables) ? data.vegetables.join(', ') : prev.vegetables,
          starches: Array.isArray(data.starches) ? data.starches.join(', ') : prev.starches,
          ingredients: Array.isArray(data.ingredients) ? data.ingredients.join('\n') : prev.ingredients,
          instructions: Array.isArray(data.instructions) ? data.instructions.join('\n') : prev.instructions,
        }));
      } else {
        alert('Failed to auto-fill recipe details. Please try again.');
      }
    } catch (error) {
      console.error('Error auto-filling recipe:', error);
      alert('Error auto-filling recipe details. Please try again.');
    } finally {
      setIsAutoFilling(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const recipe: Recipe = {
      id: editingRecipe?.id || `custom-${Date.now()}`, // Keep existing ID when editing
      name: formData.name.trim(),
      description: formData.description.trim(),
      prepTime: formData.prepTime.trim(),
      difficulty: formData.difficulty,
      calories: parseInt(formData.calories),
      cuisine: formData.cuisine,
      proteins: formData.proteins.split(',').map(p => p.trim()).filter(p => p),
      vegetables: formData.vegetables.split(',').map(v => v.trim()).filter(v => v),
      starches: formData.starches.split(',').map(s => s.trim()).filter(s => s),
      ingredients: formData.ingredients.trim() ? formData.ingredients.split('\n').map(i => i.trim()).filter(i => i) : [],
      instructions: formData.instructions.split('\n').map(i => i.trim()).filter(i => i)
    };

    onSave(recipe);
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      name: '',
      description: '',
      prepTime: '',
      difficulty: 'Easy',
      calories: '',
      cuisine: 'American',
      proteins: '',
      vegetables: '',
      starches: '',
      ingredients: '',
      instructions: ''
    });
    setErrors({});
    onClose();
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-pink-50">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <span className="text-3xl">✨</span>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingRecipe ? 'Edit Recipe' : 'Create Custom Meal'}
                </h2>
                <p className="text-gray-600 mt-1">
                  {editingRecipe ? 'Update your recipe details' : 'Add your own recipe to your rotation'}
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-3 hover:bg-gray-100 rounded-full transition-colors text-gray-500 hover:text-gray-700 text-xl font-bold"
            >
              ×
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="p-6 space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Recipe Name *
                  </label>
                  {!editingRecipe && (
                    <button
                      type="button"
                      onClick={handleAutoFill}
                      disabled={isAutoFilling || !formData.name.trim()}
                      className="px-3 py-1 text-xs bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 disabled:opacity-50 transition-all font-medium"
                    >
                      {isAutoFilling ? '⏳ Auto-filling...' : '✨ Auto-fill Fields'}
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => updateFormData('name', e.target.value)}
                  className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-400 ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., Wagyu Burgers on the Grill"
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prep Time *
                </label>
                <input
                  type="text"
                  value={formData.prepTime}
                  onChange={(e) => updateFormData('prepTime', e.target.value)}
                  className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-400 ${
                    errors.prepTime ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., 25 min"
                />
                {errors.prepTime && <p className="text-red-500 text-xs mt-1">{errors.prepTime}</p>}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => updateFormData('description', e.target.value)}
                rows={2}
                className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-400 ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., Perfect juicy wagyu patties with caramelized onions and truffle aioli"
              />
              {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
            </div>

            {/* Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Difficulty
                </label>
                <select
                  value={formData.difficulty}
                  onChange={(e) => updateFormData('difficulty', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-gray-900"
                >
                  {DIFFICULTY_OPTIONS.map(difficulty => (
                    <option key={difficulty} value={difficulty}>{difficulty}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Calories *
                </label>
                <input
                  type="number"
                  value={formData.calories}
                  onChange={(e) => updateFormData('calories', e.target.value)}
                  className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-400 ${
                    errors.calories ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="650"
                />
                {errors.calories && <p className="text-red-500 text-xs mt-1">{errors.calories}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cuisine
                </label>
                <select
                  value={formData.cuisine}
                  onChange={(e) => updateFormData('cuisine', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-gray-900"
                >
                  {CUISINE_OPTIONS.map(cuisine => (
                    <option key={cuisine} value={cuisine}>
                      {getCuisineIcon(cuisine)} {cuisine}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Food Categories */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Proteins (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.proteins}
                  onChange={(e) => updateFormData('proteins', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-400"
                  placeholder="wagyu beef, bacon"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vegetables (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.vegetables}
                  onChange={(e) => updateFormData('vegetables', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-400"
                  placeholder="onions, lettuce, tomato"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Starches (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.starches}
                  onChange={(e) => updateFormData('starches', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-400"
                  placeholder="brioche buns, sweet potato fries"
                />
              </div>
            </div>

            {/* Ingredients */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ingredients (one per line) <span className="text-gray-500">• Optional</span>
              </label>
              <textarea
                value={formData.ingredients}
                onChange={(e) => updateFormData('ingredients', e.target.value)}
                rows={6}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-400"
                placeholder={`1 lb wagyu ground beef
4 brioche buns
2 tbsp truffle aioli
1 large onion, caramelized
Salt and pepper to taste`}
              />
            </div>

            {/* Instructions */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Instructions (one step per line) *
              </label>
              <textarea
                value={formData.instructions}
                onChange={(e) => updateFormData('instructions', e.target.value)}
                rows={6}
                className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-400 ${
                  errors.instructions ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder={`Season wagyu beef with salt and pepper
Form into 4 patties
Preheat grill to medium-high heat
Grill patties 4-5 minutes per side for medium-rare
Toast brioche buns on grill
Assemble burgers with truffle aioli and caramelized onions`}
              />
              {errors.instructions && <p className="text-red-500 text-xs mt-1">{errors.instructions}</p>}
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 bg-gray-50">
          <div className="flex gap-3">
            <button
              onClick={handleClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors font-medium"
            >
              {editingRecipe ? 'Update Recipe' : 'Add to Rotation'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}