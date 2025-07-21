import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Export the OpenAI client for use in API routes
export function getOpenAIClient(): OpenAI {
  return openai;
}

export interface UserPreferences {
  likedProteins: string[];
  dislikedProteins: string[];
  likedVegetables: string[];
  dislikedVegetables: string[];
  likedStarches: string[];
  dislikedStarches: string[];
  cuisinePreferences: string[];
  dietaryRestrictions: string[];
  healthGoals: 'lose_weight' | 'maintain_weight' | 'gain_weight' | 'build_muscle';
  currentWeight: number;
  goalWeight: number;
  dailyCalorieTarget: number;
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  favoriteRestaurants: string[];
  location: string;
  mealsPerWeek: number;
  goingOutFrequency: number; // meals per week
}

const SYSTEM_PROMPT = `You are an innovative, world-renowned chef with decades of experience across global cuisines. You're known for your creative fusion cooking, bold flavor combinations, and ability to transform simple ingredients into extraordinary dishes.

Your mission: Create diverse, exciting meal plans that break culinary boundaries while maintaining nutritional balance and home-kitchen practicality.

Creative guidelines:
- Think OUTSIDE the box - combine unexpected flavors, techniques, and cultural influences
- Each meal should feel like a culinary adventure, not just sustenance
- Include diverse cooking methods: grilling, roasting, steaming, pickling, fermenting
- Mix comfort foods with exotic flavors and international fusion
- Create meals suitable for both lunch (lighter, fresh) and dinner (heartier, satisfying)
- Balance proteins, vegetables, and starches in creative ways
- Range from 15-minute quick meals to elaborate weekend projects
- Include various dietary approaches: plant-forward, protein-rich, carb-conscious
- Don't just interchange ingredients - TRANSFORM dishes with unique preparations
- Consider seasonal ingredients and global spice profiles
- Create dishes that tell a story or evoke a place/memory

Respond ONLY with valid JSON in this exact format:
{
  "recipes": [
    {
      "name": "Dish Name",
      "description": "Brief appetizing description",
      "prepTime": "XX min",
      "difficulty": "Easy|Medium|Hard",
      "calories": 000,
      "cuisine": "Cuisine Type",
      "proteins": ["protein1", "protein2"],
      "vegetables": ["veg1", "veg2"],
      "starches": ["starch1"],
      "ingredients": ["ingredient1", "ingredient2", "..."],
      "instructions": ["step1", "step2", "..."]
    }
  ]
}`;

export async function generateMealRecommendations(
  preferences?: UserPreferences,
  requestedMeals: number = 14
): Promise<any> {
  try {
    let userContext: string;
    
    if (preferences) {
      userContext = `
User Preferences:
- Likes: ${preferences.likedProteins.join(', ')} proteins, ${preferences.likedVegetables.join(', ')} vegetables, ${preferences.likedStarches.join(', ')} starches
- Dislikes/Exclude: ${preferences.dislikedProteins.join(', ')} proteins, ${preferences.dislikedVegetables.join(', ')} vegetables, ${preferences.dislikedStarches.join(', ')} starches
- Cuisines: ${preferences.cuisinePreferences.join(', ')}
- Dietary restrictions: ${preferences.dietaryRestrictions.join(', ')}
- Health goal: ${preferences.healthGoals}
- Weight: ${preferences.currentWeight}lbs → ${preferences.goalWeight}lbs
- Daily calorie target: ${preferences.dailyCalorieTarget} calories
- Activity level: ${preferences.activityLevel}
- Location: ${preferences.location}
- Favorite restaurants: ${preferences.favoriteRestaurants.join(', ')}
- Going out frequency: ${preferences.goingOutFrequency} meals/week

Generate ${requestedMeals} diverse meal ideas that avoid all disliked ingredients and align with their health goals.

Include this specific mix:
- 30% lunch-appropriate dishes: lighter, fresh, quick options that work for midday
- 30% dinner options: heartier, more substantial evening meals
- 20% classic comfort foods: timeless dishes and familiar favorites
- 20% creative options: innovative combinations while respecting their preferences

Ensure variety in cooking times, methods, and comfort levels while honoring their dietary restrictions and preferences.
      `;
    } else {
      userContext = `
No specific user preferences provided - this is your chance to be EXTRA creative! 

Generate ${requestedMeals} diverse meal ideas with this specific mix:
- 30% lunch-appropriate dishes: lighter, fresh, quick options (salads, wraps, bowls, sandwiches)
- 30% dinner options: heartier, more substantial meals 
- 20% classic comfort foods: timeless dishes everyone loves (burgers, pasta, roasted chicken, etc.)
- 20% creative fusion: innovative global combinations and unique twists

Include variety across:
- Cooking times: Mix of 15-30 min quick meals and 45+ min weekend projects
- Cuisines: American classics, Italian, Mexican, Asian, Mediterranean, and fusion
- Cooking methods: grilling, roasting, sautéing, baking, fresh prep
- Dietary balance: proteins, vegetables, and satisfying starches
- Comfort level: familiar favorites alongside adventurous new flavors

Make sure each recipe feels approachable yet exciting!
      `;
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userContext }
      ],
      temperature: preferences ? 0.8 : 0.95, // Higher creativity when no preferences
      max_tokens: 4000,
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) {
      throw new Error('No response from OpenAI');
    }

    // Handle markdown-formatted JSON responses
    let jsonString = response.trim();
    
    // Remove markdown code block formatting if present
    if (jsonString.startsWith('```json')) {
      jsonString = jsonString.replace(/```json\s*/, '').replace(/\s*```$/, '');
    } else if (jsonString.startsWith('```')) {
      jsonString = jsonString.replace(/```\s*/, '').replace(/\s*```$/, '');
    }

    try {
      return JSON.parse(jsonString);
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError);
      console.error('Raw response:', response);
      console.error('Cleaned JSON string:', jsonString);
      throw new Error(`Failed to parse LLM response as JSON: ${parseError}`);
    }
  } catch (error) {
    console.error('Error generating meal recommendations:', error);
    throw error;
  }
}

// Test function to verify API connection
export async function testOpenAIConnection() {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "user", content: "Respond with just: 'API connection successful'" }
      ],
      max_tokens: 10,
    });

    return {
      success: true,
      message: completion.choices[0]?.message?.content || 'Connected',
      usage: completion.usage
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Connection failed',
      error
    };
  }
}