import { NextRequest, NextResponse } from 'next/server';
import { aiService } from '@/lib/ai/aiService';
import { Decision } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { decision }: { decision: Decision } = body;
    console.log(decision, "decisionssss");

    if (!decision || !decision.title) {
      return NextResponse.json(
        { error: 'Invalid decision data' },
        { status: 400 }
      );
    }

    if (!decision.options || decision.options.length < 1) {
      return NextResponse.json(
        { error: 'At least one option is required for analysis' },
        { status: 400 }
      );
    }

    const analysis = await aiService.analyzeDecision(decision);
    console.log(analysis, "analysisss");

    return NextResponse.json({
      success: true,
      analysis,
      provider: aiService.getCurrentProvider(),
      timestamp: new Date().toISOString() 
    });

  } catch (error) {
    console.error('AI Analysis API error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to analyze decision',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    availableProviders: aiService.getAvailableProviders(),
    currentProvider: aiService.getCurrentProvider(),
    status: 'AI service is running'
  });
}
