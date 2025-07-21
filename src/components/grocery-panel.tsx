"use client";

import { useMealPlannerStore } from '@/store/meal-planner';
import { useState, useMemo, useEffect, useCallback } from 'react';
import { groceryPricingService } from '@/services/grocery-pricing';

interface GroceryItem {
  name: string;
  category: 'protein' | 'vegetable' | 'starch' | 'other';
  checked: boolean;
  price?: number;
  unit?: string;
  store?: string;
  trend?: 'up' | 'down' | 'stable';
}

const CATEGORY_ICONS = {
  protein: '🥩',
  vegetable: '🥕',
  starch: '🌾',
  other: '🛒'
};

// Common pantry items that users often already have
const COMMON_PANTRY_ITEMS = [
  'salt', 'pepper', 'olive oil', 'vegetable oil', 'garlic', 'onion',
  'butter', 'flour', 'sugar', 'paprika', 'cumin', 'oregano', 'basil',
  'thyme', 'rosemary', 'parsley', 'bay leaves', 'cinnamon', 'vanilla',
  'baking powder', 'baking soda', 'vinegar', 'soy sauce', 'honey',
  'lemon juice', 'lime juice', 'hot sauce', 'mustard', 'ketchup',
  'mayonnaise', 'worcestershire sauce', 'sesame oil', 'ginger',
  'turmeric', 'chili powder', 'red pepper flakes', 'black pepper',
  'garlic powder', 'onion powder', 'italian seasoning', 'dill',
  'cilantro', 'scallions', 'green onions'
];

const isCommonPantryItem = (itemName: string): boolean => {
  return COMMON_PANTRY_ITEMS.some(pantryItem => 
    itemName.toLowerCase().includes(pantryItem.toLowerCase())
  );
};

// This component now uses live pricing data

interface GroceryPanelProps {
  isDarkMode?: boolean;
}

export default function GroceryPanel({ isDarkMode = false }: GroceryPanelProps) {
  const { getCurrentWeekMealPlan, mealPlans, currentWeekOffset } = useMealPlannerStore();
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const [alreadyHaveItems, setAlreadyHaveItems] = useState<Set<string>>(new Set());
  const [groceryList, setGroceryList] = useState<GroceryItem[]>([]);
  const [isLoadingPrices, setIsLoadingPrices] = useState(false);
  
  // Get current week meal plan - need to depend on mealPlans changes too
  const mealPlan = useMemo(() => {
    return getCurrentWeekMealPlan();
  }, [currentWeekOffset, mealPlans]); // Depend on both week offset AND meal plans changing

  const getBalanceScore = (protein: number, veg: number, starch: number) => {
    const total = protein + veg + starch;
    if (total === 0) return 'No meals';
    
    const proteinRatio = protein / total;
    const vegRatio = veg / total;
    const starchRatio = starch / total;
    
    if (vegRatio > 0.4 && proteinRatio > 0.2) return 'Great';
    if (vegRatio > 0.3 && proteinRatio > 0.15) return 'Good';
    return 'Needs veggies';
  };

  // Debug: Log when mealPlan changes
  useEffect(() => {
    const mealCount = Object.values(mealPlan).reduce((count, day) => {
      return count + (day.lunch ? 1 : 0) + (day.dinner ? 1 : 0);
    }, 0);
    console.log('GroceryPanel - MealPlan changed:', Object.keys(mealPlan).length, 'days,', mealCount, 'total meals');
    
    // Log each day's meals for debugging
    Object.entries(mealPlan).forEach(([day, meals]) => {
      if (meals.lunch || meals.dinner) {
        console.log(`  ${day}: lunch=${meals.lunch?.name || 'none'}, dinner=${meals.dinner?.name || 'none'}`);
      }
    });
  }, [mealPlan]);

  // Load grocery list with live pricing
  useEffect(() => {
    const loadGroceryList = async () => {
      setIsLoadingPrices(true);
      
      const items: string[] = [];
      const seenItems = new Set<string>();

      // Collect all unique items from meal plan (don't categorize here, let pricing DB handle it)
      Object.values(mealPlan).forEach(day => {
        [day.lunch, day.dinner].forEach(meal => {
          if (meal) {
            // Add all ingredients without pre-categorizing
            [...meal.proteins, ...meal.vegetables, ...meal.starches].forEach(item => {
              const normalizedItem = item.toLowerCase().trim();
              if (!seenItems.has(normalizedItem)) {
                items.push(item);
                seenItems.add(normalizedItem);
              }
            });
          }
        });
      });

      if (items.length === 0) {
        setGroceryList([]);
        setIsLoadingPrices(false);
        return;
      }

      // Use real store pricing service
      console.log('GroceryPanel - Loading grocery list with', items.length, 'unique items from meal plan');
      console.log('Items to add to grocery list:', items);
      
      try {
        // Get live pricing for all items from Jewel-Osco
        const pricedItems = await Promise.all(
          items.map(async (item) => {
            const livePrice = await groceryPricingService.getLivePrice(item, undefined, 'Jewel-Osco');
            return {
              name: item,
              category: groceryPricingService.getItemCategory(item), // Use pricing DB category as source of truth
              checked: false,
              price: livePrice.price,
              unit: livePrice.unit,
              store: livePrice.store,
              trend: livePrice.trend
            } as GroceryItem;
          })
        );
        
        setGroceryList(pricedItems);
      } catch (error) {
        console.error('Error loading grocery prices:', error);
        // Fallback to basic items without pricing
        const basicItems: GroceryItem[] = items.map(item => ({
          name: item,
          category: groceryPricingService.getItemCategory(item), // Use pricing DB for fallback too
          checked: false,
          price: 3.99,
          unit: 'item',
          store: 'Local Market'
        }));
        setGroceryList(basicItems);
      }
      
      setIsLoadingPrices(false);
    };

    loadGroceryList();
  }, [mealPlan]); // Removed checkedItems to prevent infinite loop

  const metrics = useMemo(() => {
    let totalCalories = 0;
    let mealCount = 0;

    // Count meals and calories
    Object.values(mealPlan).forEach(day => {
      [day.lunch, day.dinner].forEach(meal => {
        if (meal) {
          totalCalories += meal.calories;
          mealCount++;
        }
      });
    });

    // Count grocery list items by category (excluding items you already have)
    const activeGroceryItems = groceryList.filter(item => !alreadyHaveItems.has(item.name));
    const proteinCount = activeGroceryItems.filter(item => item.category === 'protein').length;
    const vegCount = activeGroceryItems.filter(item => item.category === 'vegetable').length;
    const starchCount = activeGroceryItems.filter(item => item.category === 'starch').length;

    const avgCaloriesPerDay = Math.round(totalCalories / 7);
    const daysOfGroceries = Math.ceil(mealCount / 2);

    return {
      totalCalories,
      avgCaloriesPerDay,
      mealCount,
      daysOfGroceries,
      proteinCount,
      vegCount,
      starchCount,
      balance: getBalanceScore(proteinCount, vegCount, starchCount)
    };
  }, [mealPlan, groceryList, alreadyHaveItems]);

  const toggleItem = (itemName: string) => {
    const newChecked = new Set(checkedItems);
    if (newChecked.has(itemName)) {
      newChecked.delete(itemName);
    } else {
      newChecked.add(itemName);
    }
    setCheckedItems(newChecked);
  };

  const toggleAlreadyHave = (itemName: string) => {
    const newAlreadyHave = new Set(alreadyHaveItems);
    if (newAlreadyHave.has(itemName)) {
      newAlreadyHave.delete(itemName);
    } else {
      newAlreadyHave.add(itemName);
    }
    setAlreadyHaveItems(newAlreadyHave);
  };

  const groupedItems = groceryList.reduce((acc, item) => {
    // Only include items that user doesn't already have
    if (!alreadyHaveItems.has(item.name)) {
      if (!acc[item.category]) acc[item.category] = [];
      acc[item.category].push(item);
    }
    return acc;
  }, {} as Record<string, GroceryItem[]>);

  // Define category order: protein, vegetable, starch, other
  const categoryOrder = ['protein', 'vegetable', 'starch', 'other'];
  const sortedGroupedItems = categoryOrder
    .filter(category => groupedItems[category] && groupedItems[category].length > 0)
    .map(category => [category, groupedItems[category]] as [string, GroceryItem[]]);

  const alreadyHaveCount = groceryList.filter(item => alreadyHaveItems.has(item.name)).length;
  
  // Calculate estimated cost separately to avoid dependency loop
  const estimatedCost = Math.round(groceryList.reduce((total, item) => {
    // Exclude items the user already has from cost calculation
    if (alreadyHaveItems.has(item.name)) return total;
    return total + (item.price || 0);
  }, 0));

  return (
    <div className="max-w-sm mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className={`text-2xl font-light mb-2 transition-colors duration-300 ${
          isDarkMode ? 'text-gray-100' : 'text-gray-800'
        }`}>This Week</h2>
        <p className={`text-sm transition-colors duration-300 ${
          isDarkMode ? 'text-gray-400' : 'text-gray-500'
        }`}>Insights & groceries</p>
      </div>

      {/* Quick Metrics */}
      <div className="space-y-4 mb-8">
        <div className="grid grid-cols-2 gap-3">
          <div className={`backdrop-blur-sm p-4 rounded-2xl border text-center transition-all duration-300 ${
            isDarkMode 
              ? 'bg-gray-800/70 border-gray-700' 
              : 'bg-white/70 border-gray-100'
          }`}>
            <div className="text-2xl font-light text-emerald-600">{metrics.mealCount}</div>
            <div className={`text-xs transition-colors duration-300 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>Meals planned</div>
          </div>
          <div className={`backdrop-blur-sm p-4 rounded-2xl border text-center transition-all duration-300 ${
            isDarkMode 
              ? 'bg-gray-800/70 border-gray-700' 
              : 'bg-white/70 border-gray-100'
          }`}>
            <div className="text-2xl font-light text-blue-600">${estimatedCost}</div>
            <div className={`text-xs transition-colors duration-300 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>Est. groceries</div>
          </div>
        </div>

        <div className={`backdrop-blur-sm p-4 rounded-2xl border text-center transition-all duration-300 ${
          isDarkMode 
            ? 'bg-gray-800/70 border-gray-700' 
            : 'bg-white/70 border-gray-100'
        }`}>
          <div className={`text-lg font-medium mb-1 transition-colors duration-300 ${
            isDarkMode ? 'text-gray-200' : 'text-gray-700'
          }`}>{metrics.balance}</div>
          <div className={`text-xs transition-colors duration-300 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>Nutritional balance</div>
          <div className="flex gap-2 justify-center mt-2 flex-wrap">
            <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
              {metrics.proteinCount} proteins
            </span>
            <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
              {metrics.vegCount} veggies
            </span>
            <span className="text-xs bg-amber-100 text-amber-600 px-2 py-1 rounded-full">
              {metrics.starchCount} starches
            </span>
          </div>
        </div>
      </div>

      {/* Grocery List */}
      {groceryList.length === 0 ? (
        <div className={`backdrop-blur-sm rounded-2xl border p-8 text-center transition-all duration-300 ${
          isDarkMode 
            ? 'bg-gray-800/50 border-gray-700' 
            : 'bg-white/50 border-gray-100'
        }`}>
          <div className="text-4xl mb-3">📝</div>
          <p className={`text-sm transition-colors duration-300 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>Plan some meals to generate your grocery list</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="text-center mb-4">
            <h3 className={`text-lg font-medium transition-colors duration-300 ${
              isDarkMode ? 'text-gray-200' : 'text-gray-700'
            }`}>Grocery List</h3>
            <p className={`text-xs transition-colors duration-300 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              {groceryList.length - alreadyHaveCount} items to buy
              {alreadyHaveCount > 0 && <span className="ml-2">• {alreadyHaveCount} already have</span>}
              {isLoadingPrices && <span className="ml-2">• Loading prices...</span>}
            </p>
          </div>
          
          {sortedGroupedItems.map(([category, items]) => (
            <div key={category} className={`backdrop-blur-sm rounded-2xl border p-4 transition-all duration-300 ${
              isDarkMode 
                ? 'bg-gray-800/70 border-gray-700' 
                : 'bg-white/70 border-gray-100'
            }`}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">{CATEGORY_ICONS[category as keyof typeof CATEGORY_ICONS]}</span>
                <h4 className={`font-medium text-sm capitalize transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-200' : 'text-gray-700'
                }`}>{category}s</h4>
                <div className={`flex-1 h-px transition-colors duration-300 ${
                  isDarkMode ? 'bg-gray-600' : 'bg-gray-200'
                }`}></div>
                <span className={`text-xs transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>{items.length}</span>
              </div>
              
              <div className="space-y-2">
                {items.map(item => {
                  const isChecked = checkedItems.has(item.name);
                  return (
                  <div 
                    key={item.name}
                    className={`flex items-center gap-3 p-2 rounded-xl cursor-pointer transition-colors ${
                      isDarkMode 
                        ? 'hover:bg-gray-700/50' 
                        : 'hover:bg-gray-50/50'
                    }`}
                    onClick={() => toggleItem(item.name)}
                  >
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                      isChecked 
                        ? 'bg-emerald-500 border-emerald-500' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}>
                      {isChecked && <span className="text-white text-xs">✓</span>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className={`text-sm transition-all block ${
                        isChecked 
                          ? 'line-through text-gray-400' 
                          : isDarkMode ? 'text-gray-200' : 'text-gray-700'
                      }`}>
                        {item.name}
                      </span>
                      {item.store && (
                        <span className={`text-xs transition-colors duration-300 ${
                          isDarkMode ? 'text-gray-500' : 'text-gray-400'
                        }`}>
                          {item.store}{item.unit && item.unit !== 'item' ? ` • /${item.unit}` : ''}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <div className="text-right">
                        <span className={`text-xs font-medium transition-all block ${
                          isChecked 
                            ? 'line-through text-gray-400' 
                            : isDarkMode ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                          ${item.price?.toFixed(2) || 'N/A'}
                        </span>
                        {item.trend && item.trend !== 'stable' && (
                          <span className={`text-xs ${
                            item.trend === 'up' ? 'text-red-500' : 'text-green-500'
                          }`}>
                            {item.trend === 'up' ? '↗️' : '↘️'}
                          </span>
                        )}
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleAlreadyHave(item.name);
                        }}
                        className="text-[10px] underline decoration-1 underline-offset-2 transition-all font-medium hover:no-underline text-gray-400 hover:text-gray-500 decoration-gray-300"
                        title="Mark as already have"
                      >
                        Have it
                      </button>
                    </div>
                  </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}