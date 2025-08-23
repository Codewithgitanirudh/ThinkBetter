import { NextRequest, NextResponse } from 'next/server';
import { aiService } from '@/lib/ai/aiService';
import { Decision } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { decision }: { decision: Decision } = body;

    if (!decision || !decision.title) {
      return NextResponse.json(
        { error: 'Invalid decision data' },
        { status: 400 }
      );
    }

    const suggestions = await aiService.generateSuggestions(decision);

    return NextResponse.json({
      success: true,
      suggestions,
      provider: aiService.getCurrentProvider(),
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('AI Suggestions API error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate suggestions',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'AI Suggestions endpoint',
    method: 'POST',
    expectedBody: {
      decision: {
        title: 'string',
        options: 'Array<Option>'
      }
    }
  });
}
