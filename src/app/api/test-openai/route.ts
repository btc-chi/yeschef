import { NextRequest, NextResponse } from 'next/server';
import { testOpenAIConnection } from '@/lib/openai';

export async function GET() {
  try {
    const result = await testOpenAIConnection();
    
    return NextResponse.json({
      status: result.success ? 'success' : 'error',
      data: result
    });
  } catch (error: any) {
    return NextResponse.json({
      status: 'error',
      message: 'Failed to test OpenAI connection',
      error: error.message
    }, { status: 500 });
  }
}