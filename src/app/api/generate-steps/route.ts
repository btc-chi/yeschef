import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { recipe } = await request.json();

    if (!recipe) {
      return NextResponse.json({ error: 'Recipe is required' }, { status: 400 });
    }

    const prompt = `You are a professional chef instructor. Create detailed, confidence-building step-by-step cooking instructions for this recipe:

Recipe: ${recipe.name}
Ingredients: ${recipe.ingredients.join(', ')}
Basic Instructions: ${recipe.instructions.join(' ')}

Create 8-12 very specific, detailed steps that will help a beginner cook this meal with confidence. Each step should:
- Be actionable and specific (include times, temperatures, visual cues)
- Build confidence by explaining what to expect
- Include helpful tips for success
- Be written in an encouraging, supportive tone

Return ONLY a JSON object with this format:
{
  "steps": ["Step 1 text", "Step 2 text", ...]
}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 1500,
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) {
      throw new Error('No response from OpenAI');
    }

    const parsedResponse = JSON.parse(response);
    
    return NextResponse.json(parsedResponse);
  } catch (error) {
    console.error('Error generating step-by-step instructions:', error);
    return NextResponse.json(
      { error: 'Failed to generate instructions' },
      { status: 500 }
    );
  }
}