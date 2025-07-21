import { NextRequest, NextResponse } from 'next/server';
import { getOpenAIClient } from '@/lib/openai';

export async function POST(request: NextRequest) {
  try {
    const { title } = await request.json();

    if (!title || typeof title !== 'string') {
      return NextResponse.json(
        { error: 'Recipe title is required' },
        { status: 400 }
      );
    }

    const client = getOpenAIClient();

    const prompt = `Based on the recipe title "${title}", generate a complete recipe with the following details. Return a valid JSON object with these exact keys:

{
  "description": "A brief, appetizing description of the dish",
  "prepTime": "Preparation time (e.g., '25 min', '1 hour')",
  "difficulty": "Easy, Medium, or Hard",
  "calories": 500,
  "cuisine": "Type of cuisine - MUST be exactly one of: Italian, American, Mexican, Asian, Japanese, Korean, Thai, Mediterranean, Greek, French, Indian, Middle Eastern",
  "proteins": ["protein1", "protein2"],
  "vegetables": ["vegetable1", "vegetable2"], 
  "starches": ["starch1", "starch2"],
  "ingredients": ["ingredient 1 with amount", "ingredient 2 with amount"],
  "instructions": ["step 1", "step 2", "step 3"]
}

IMPORTANT CONTEXT:
- The "proteins", "vegetables", and "starches" arrays are used for grocery list organization and nutrition tracking
- These should contain the main food categories (e.g., "chicken breast", "spinach", "rice")
- The "ingredients" array is for detailed cooking with measurements (e.g., "1 lb chicken breast", "2 cups fresh spinach")
- Focus on making the category arrays comprehensive for grocery shopping
- Include ingredients you might forget or that add special flavor

Make sure the response is realistic, detailed, and matches the recipe title. The category arrays should capture all the main components for grocery shopping.

Return only the JSON object, no additional text.`;

    const completion = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a professional chef and recipe developer. Generate complete, realistic recipes based on dish titles. Always return valid JSON only.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1500,
    });

    const content = completion.choices[0]?.message?.content;
    
    if (!content) {
      throw new Error('No content received from OpenAI');
    }

    // Parse the JSON response
    let recipeData;
    try {
      recipeData = JSON.parse(content);
    } catch (parseError) {
      console.error('Failed to parse OpenAI response as JSON:', content);
      throw new Error('Invalid JSON response from AI');
    }

    // Validate the response structure
    const requiredKeys = ['description', 'prepTime', 'difficulty', 'calories', 'cuisine', 'proteins', 'vegetables', 'starches', 'ingredients', 'instructions'];
    const missingKeys = requiredKeys.filter(key => !(key in recipeData));
    
    if (missingKeys.length > 0) {
      throw new Error(`Missing required fields: ${missingKeys.join(', ')}`);
    }

    return NextResponse.json({
      status: 'success',
      data: recipeData
    });

  } catch (error) {
    console.error('Error generating recipe details:', error);
    
    return NextResponse.json(
      { 
        status: 'error',
        error: error instanceof Error ? error.message : 'Failed to generate recipe details'
      },
      { status: 500 }
    );
  }
}