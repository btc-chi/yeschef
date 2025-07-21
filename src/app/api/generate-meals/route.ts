import { NextRequest, NextResponse } from 'next/server';
import { generateMealRecommendations, UserPreferences } from '@/lib/openai';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { preferences, requestedMeals = 14 }: {
      preferences?: UserPreferences;
      requestedMeals?: number;
    } = body;

    const result = await generateMealRecommendations(preferences, requestedMeals);
    
    return NextResponse.json({
      status: 'success',
      data: result
    });
  } catch (error: any) {
    console.error('Error in generate-meals API:', error);
    
    return NextResponse.json({
      status: 'error',
      message: 'Failed to generate meal recommendations',
      error: error.message
    }, { status: 500 });
  }
}