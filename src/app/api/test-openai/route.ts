import { NextResponse } from 'next/server';
import { testOpenAIConnection } from '@/lib/openai';

export async function GET() {
  try {
    const result = await testOpenAIConnection();
    
    return NextResponse.json({
      status: result.success ? 'success' : 'error',
      data: result
    });
  } catch (error: unknown) {
    return NextResponse.json({
      status: 'error',
      message: 'Failed to test OpenAI connection',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}