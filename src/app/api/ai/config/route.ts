import { NextRequest, NextResponse } from 'next/server';
import { aiService } from '@/lib/ai/aiService';

export async function GET() {
  return NextResponse.json({
    availableProviders: aiService.getAvailableProviders(),
    currentProvider: aiService.getCurrentProvider(),
    status: 'healthy'
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { provider }: { provider: string } = body;

    if (!provider) {
      return NextResponse.json(
        { error: 'Provider name is required' },
        { status: 400 }
      );
    }

    const success = aiService.setProvider(provider);

    if (!success) {
      return NextResponse.json(
        { error: 'Invalid or unavailable provider' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      currentProvider: aiService.getCurrentProvider(),
      message: `Switched to ${provider} provider`
    });

  } catch (error) {
    console.error('AI Config API error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to update configuration',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
