# 🤖 AI Integration Setup Guide

This guide will help you set up AI-powered decision analysis for your ThinkBetter application using **FREE** AI APIs.

## 🚀 Quick Start

### 1. Choose Your AI Provider(s)

You can use one or multiple free AI providers. I recommend starting with **Groq** for the best performance:

#### Option A: Groq (Recommended - Fastest & Free)
- **Free Tier**: 14,400 tokens per day
- **Speed**: Very fast inference
- **Models**: Llama 3, Mixtral, Gemma
- **Setup**: 
  1. Visit [https://console.groq.com/](https://console.groq.com/)
  2. Sign up for a free account
  3. Go to "API Keys" and create a new key
  4. Add to your `.env.local`: `NEXT_PUBLIC_GROQ_API_KEY=your_key_here`

#### Option B: Google Gemini (Also Great)
- **Free Tier**: 60 requests per minute, 1500 requests per day
- **Models**: Gemini Pro
- **Setup**:
  1. Visit [https://ai.google.dev/](https://ai.google.dev/)
  2. Click "Get API key in Google AI Studio"
  3. Create a new project and generate an API key
  4. Add to your `.env.local`: `NEXT_PUBLIC_GEMINI_API_KEY=your_key_here`

#### Option C: Hugging Face (Good Backup)
- **Free Tier**: 1000 requests per hour
- **Models**: Various open-source models
- **Setup**:
  1. Visit [https://huggingface.co/](https://huggingface.co/)
  2. Sign up and go to Settings > Access Tokens
  3. Create a new token with "Read" permissions
  4. Add to your `.env.local`: `NEXT_PUBLIC_HUGGINGFACE_API_KEY=your_key_here`

### 2. Environment Variables

Create a `.env.local` file in your project root with your chosen API keys:

```bash
# Choose one or more AI providers
NEXT_PUBLIC_GROQ_API_KEY=your_groq_key_here
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_key_here
NEXT_PUBLIC_HUGGINGFACE_API_KEY=your_hf_key_here

# Your existing Firebase config...
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_key
# ... other Firebase variables
```

### 3. Test the Integration

1. Restart your development server: `npm run dev`
2. Navigate to your decision-making page
3. Add a decision title and at least 2 options with some pros/cons
4. Click the blue AI Assistant button (bottom-right)
5. Click "Analyze Decision" to get AI insights!

## 🎯 Features You Get

### Comprehensive AI Analysis
- **Smart Recommendations**: AI analyzes all options and suggests the best choice
- **Risk Assessment**: Identifies potential risks and concerns
- **Opportunity Identification**: Highlights benefits and opportunities
- **Long-term Perspective**: Considers short, medium, and long-term implications
- **Alternative Suggestions**: Proposes alternative approaches or modifications

### Enhanced Decision Insights
- **Confidence Scoring**: AI provides confidence levels for recommendations
- **Factor Analysis**: Breaks down key decision factors and their weights
- **Time Horizon Planning**: Short/medium/long-term impact analysis
- **Uncertainty Areas**: Identifies areas needing more information

### Intelligent Suggestions
- **Missing Pros/Cons**: AI suggests additional factors you might have missed
- **Critical Questions**: Proposes important questions to research
- **Risk Warnings**: Alerts about potential pitfalls
- **Process Improvements**: Suggests ways to enhance your decision-making

## 🔧 Technical Architecture

### API Endpoints
- `POST /api/ai/analyze` - Get comprehensive decision analysis
- `POST /api/ai/suggestions` - Get intelligent suggestions
- `GET /api/ai/config` - Check AI service status

### AI Service Layer
```
src/lib/ai/
├── aiService.ts          # Main AI service manager
├── prompts.ts           # Sophisticated AI prompts
└── providers/
    ├── groq.ts          # Groq/Llama integration
    ├── gemini.ts        # Google Gemini integration
    └── huggingface.ts   # Hugging Face integration
```

### Fallback System
The system includes intelligent fallbacks:
1. If primary AI provider fails, tries backup providers
2. If all AI providers fail, provides rule-based analysis
3. Always provides meaningful insights even without AI

## 📊 Usage Limits & Costs

| Provider | Free Tier | Rate Limits | Cost After Free |
|----------|-----------|-------------|-----------------|
| **Groq** | 14,400 tokens/day | Very generous | Pay-per-use |
| **Gemini** | 60 req/min | 1,500 req/day | Pay-per-use |
| **Hugging Face** | 1,000 req/hour | Community models | Pay-per-use |

### Estimation for Your Use Case
- **Average decision analysis**: ~500-800 tokens
- **Daily decisions with Groq**: ~18-28 analyses per day
- **Typical user**: Well within free limits

## 🚀 Advanced Features

### 1. Multi-Provider Setup
You can configure multiple providers for redundancy:

```typescript
// The system automatically tries providers in order:
// 1. Groq (if configured)
// 2. Gemini (if configured)  
// 3. Hugging Face (if configured)
// 4. Fallback analysis
```

### 2. Custom Prompts
Modify `src/lib/ai/prompts.ts` to customize AI behavior:

```typescript
// Add domain-specific knowledge
// Adjust analysis depth
// Include company-specific criteria
```

### 3. Provider Switching
Users can switch AI providers via API:

```typescript
POST /api/ai/config
{
  "provider": "groq" | "gemini" | "huggingface"
}
```

## 🛠 Troubleshooting

### AI Button Not Visible
1. Ensure you have at least 2 options in your decision
2. Check browser console for errors
3. Verify API keys are set correctly

### API Errors
1. Check your API keys are valid and active
2. Verify you haven't exceeded rate limits
3. Check network connectivity

### Poor Analysis Quality
1. Provide more detailed pros/cons for better AI analysis
2. Try different AI providers (Groq usually best)
3. Ensure decision title is clear and specific

## 🎓 Best Practices

### For Better AI Analysis
1. **Be Specific**: Clear decision titles get better analysis
2. **Add Context**: More pros/cons = better insights
3. **Use Real Scenarios**: AI works best with realistic options

### For Performance
1. **Start with Groq**: Fastest response times
2. **Set Reasonable Expectations**: Complex decisions may take 5-10 seconds
3. **Implement Caching**: For repeated analyses (future enhancement)

## 🔐 Security Notes

1. **API Keys**: Store in `.env.local`, never commit to git
2. **Client-Side**: API keys are exposed to client (normal for these services)
3. **Rate Limiting**: Implement user-based rate limiting for production
4. **Data Privacy**: AI providers may log requests (check their policies)

## 📈 Monitoring & Analytics

Monitor your AI usage:

```typescript
// Check provider status
GET /api/ai/config

// Returns:
{
  "availableProviders": ["groq", "gemini"],
  "currentProvider": "groq",
  "status": "healthy"
}
```

## 🎯 Next Steps

1. **Set up your first AI provider** (Groq recommended)
2. **Test with a real decision** 
3. **Add more providers** for redundancy
4. **Customize prompts** for your use case
5. **Monitor usage** and optimize

Need help? The system includes comprehensive error handling and fallbacks, so even if something goes wrong, users still get valuable insights!
