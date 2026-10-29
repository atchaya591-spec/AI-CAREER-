import { ChatMessage, UserProfile, CareerScoreResult } from '../types';

export async function sendChatMessage(
  message: string,
  history: ChatMessage[],
  userProfile: Partial<UserProfile> & { targetCareer?: string; assessed?: boolean }
): Promise<{ reply: string; source: 'gemini' | 'fallback' | 'fallback_error' }> {
  try {
    const formattedHistory = history.map((m) => ({
      role: m.sender === 'user' ? 'user' : 'model',
      text: m.text,
    }));

    const res = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message,
        history: formattedHistory,
        userProfile,
      }),
    });

    if (!res.ok) {
      throw new Error(`Chat API error: ${res.statusText}`);
    }

    const data = await res.json();
    return {
      reply: data.reply || 'No response returned from career counselor.',
      source: data.source || 'gemini',
    };
  } catch (err: any) {
    console.error('Chat API request failed:', err);
    return {
      reply: `I am currently operating in offline mode. For ${userProfile.targetCareer || 'your chosen career'}, prioritize mastering core technical fundamentals, building two end-to-end portfolio projects, and tracking milestones in the Roadmap tab.`,
      source: 'fallback_error',
    };
  }
}

export async function fetchAiCareerInsights(
  careerResult: CareerScoreResult,
  userProfile: UserProfile
): Promise<{
  personalizedWhy?: string;
  suggestedProjects?: string[];
  learningStrategy?: string;
  source: string;
}> {
  try {
    const res = await fetch('/api/ai/recommend-insights', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        careerId: careerResult.c.name,
        profile: userProfile,
        scores: {
          iFit: careerResult.iFit,
          aFit: careerResult.aFit,
          sFit: careerResult.sFit,
          kFit: careerResult.kFit,
        },
      }),
    });

    if (!res.ok) {
      throw new Error(`Insights API error: ${res.statusText}`);
    }

    return await res.json();
  } catch (err) {
    console.warn('AI Insights fallback:', err);
    return {
      personalizedWhy: `Your high alignment in analytical thinking and practical implementation makes ${careerResult.c.name} an exceptional match for your trajectory.`,
      suggestedProjects: [
        `Production-grade ${careerResult.c.name} Portfolio System with Cloud Firestore`,
        `Automated Analytics Pipeline with unit test coverage`,
      ],
      learningStrategy: `Focus on mastering ${careerResult.missing[0] || 'core algorithms'} first before advancing to complex integrations.`,
      source: 'fallback',
    };
  }
}
