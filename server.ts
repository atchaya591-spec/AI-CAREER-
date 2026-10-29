import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// ----------------------------------------------------
// AI Chatbot Route (Career Guidance Counselor)
// ----------------------------------------------------
app.post('/api/ai/chat', async (req: Request, res: Response) => {
  try {
    const { message, history, userProfile } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (!ai) {
      // Fallback rule-based guidance if Gemini API Key is not yet configured
      return res.json({
        reply: getFallbackChatResponse(message, userProfile),
        source: 'fallback',
      });
    }

    const systemPrompt = `You are the senior Career Guidance Counselor AI inside the "AI Enhanced Career Guidance System" mobile application.
You are helping an ambitious student navigate technology and modern industry careers.
Student Profile Context:
- Name: ${userProfile?.name || 'Student'}
- Degree/Education: ${userProfile?.edu || 'Undergraduate'}
- Current Stage: ${userProfile?.year || 'In college'}
- Stated Aspiration: ${userProfile?.aspiration || 'Undecided'}
- Top Career Fit: ${userProfile?.targetCareer || 'Software Engineer'}
- Current Skills: ${userProfile?.skills?.join(', ') || 'General fundamentals'}
- Assessment Completed: ${userProfile?.assessed ? 'Yes' : 'Not yet'}

Guidelines:
1. Provide encouraging, highly practical, realistic, and actionable advice tailored to their specific skills and aspirations.
2. Structure responses cleanly with short paragraphs or bullet points. Avoid excessive fluff.
3. If they ask about programming languages, roadmaps, interview prep, resumes, or skill gaps, break it down into sequential phases (Foundation -> Practical Projects -> Advanced Mastery -> Placement).
4. Keep the tone empathetic, professional, inspiring, and clear.`;

    const chatContents: any[] = [];
    if (Array.isArray(history)) {
      for (const h of history.slice(-6)) {
        chatContents.push({
          role: h.role === 'user' ? 'user' : 'model',
          parts: [{ text: h.text }],
        });
      }
    }
    chatContents.push({
      role: 'user',
      parts: [{ text: message }],
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: chatContents,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
      },
    });

    const reply = response.text || 'I could not generate an answer right now. Please try asking again.';
    return res.json({ reply, source: 'gemini' });
  } catch (error: any) {
    console.error('Error calling Gemini API for chat:', error);
    // Graceful fallback on API error
    const fallback = getFallbackChatResponse(req.body.message || '', req.body.userProfile);
    return res.json({ reply: fallback, source: 'fallback_error', error: error?.message });
  }
});

// ----------------------------------------------------
// AI Enhanced Career Recommendation & Strategy Route
// ----------------------------------------------------
app.post('/api/ai/recommend-insights', async (req: Request, res: Response) => {
  try {
    const { profile, scores, careerId } = req.body;

    if (!ai) {
      return res.json({
        personalizedWhy: `Based on your high alignment in logical reasoning and practical problem solving, this career provides a natural growth path.`,
        suggestedProjects: [
          'Full-Stack Portfolio Dashboard with real-time analytics',
          'Automated Workflow Manager with Cloud Firestore integration',
        ],
        learningStrategy: 'Focus 60% on hands-on building, 20% on core algorithms, and 20% on open-source code reviews.',
        source: 'fallback',
      });
    }

    const prompt = `As an AI Career Strategist, analyze this student's multi-factor career profile:
Career Target: ${careerId}
Student Name: ${profile?.name}
Education: ${profile?.edu} (${profile?.year})
Aspiration: ${profile?.aspiration}
Existing Skills: ${profile?.skills?.join(', ')}
Interests: ${profile?.interests?.join(', ')}
Scores: Interest=${scores?.iFit}%, Aptitude=${scores?.aFit}%, WorkStyle=${scores?.sFit}%, SkillCoverage=${scores?.kFit}%

Generate a concise JSON response with:
1. "personalizedWhy": A clear 2-3 sentence personalized justification for why this career matches their unique combination of aptitude, interests, and style.
2. "suggestedProjects": Array of 3 specific, impressive portfolio projects suitable for college resume/internship applications.
3. "learningStrategy": A 1-2 sentence high-impact study recommendation to close their remaining skill gap.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '{}';
    const parsed = JSON.parse(text);
    return res.json({ ...parsed, source: 'gemini' });
  } catch (error: any) {
    console.error('Error generating AI recommendation insights:', error);
    return res.json({
      personalizedWhy: 'Your structured problem-solving scores and interest profiles align closely with this role\'s daily responsibilities.',
      suggestedProjects: [
        'Cloud-Connected Mobile Task & Analytics Suite',
        'End-to-End Microservice Prototype with Database Persistence',
      ],
      learningStrategy: 'Dedicate 30 minutes daily to data structures & 1 hour to mini-project implementations.',
      source: 'fallback_error',
    });
  }
});

function getFallbackChatResponse(query: string, userProfile: any): string {
  const q = query.toLowerCase();
  const name = userProfile?.name ? userProfile.name.split(' ')[0] : 'there';
  const target = userProfile?.targetCareer || 'Software Engineer';

  if (q.includes('learn') || q.includes('start') || q.includes('first')) {
    return `Hi ${name}! For a career in **${target}**, start by cementing your core fundamentals (Data Structures, OOP in Java or Python), followed by building 2 real full-cycle projects. Check the **Roadmap** tab to follow the curated milestones!`;
  }
  if (q.includes('interview') || q.includes('prep') || q.includes('resume')) {
    return `For interview readiness:\n1. Master 50 standard DSA problems (Arrays, HashMaps, Trees, Graphs).\n2. Write STAR format bullets for your portfolio projects.\n3. Practice explaining trade-offs (e.g., SQL vs NoSQL, memory vs time complexity).`;
  }
  if (q.includes('project') || q.includes('portfolio')) {
    return `Great project ideas for **${target}**:\n• A mobile app with Firebase Auth & Cloud Firestore sync\n• A RESTful microservice with automated testing & CI/CD\n• A domain-specific analytics dashboard with data visualizations.`;
  }
  return `I'm here to guide your career pathway for **${target}**! You can ask about recommended certifications, portfolio projects, interview strategies, or how to bridge specific technical skill gaps.`;
}

// ----------------------------------------------------
// Project ZIP Download Routes
// ----------------------------------------------------
app.get('/api/download/android-project.zip', (_req: Request, res: Response) => {
  const filePath = path.resolve(__dirname, 'public', 'AI_Career_Guidance_Android_Project.zip');
  res.download(filePath, 'AI_Career_Guidance_Android_Project.zip', (err) => {
    if (err && !res.headersSent) {
      res.status(404).send('Android Project ZIP not found');
    }
  });
});

app.get(['/api/download/full-system.zip', '/api/download-zip'], (_req: Request, res: Response) => {
  const filePath = path.resolve(__dirname, 'public', 'AI_Career_Guidance_Full_System.zip');
  res.download(filePath, 'AI_Career_Guidance_Full_System.zip', (err) => {
    if (err && !res.headersSent) {
      res.status(404).send('Full Project ZIP not found');
    }
  });
});

// ----------------------------------------------------
// Vite Dev Server / Static Hosting
// ----------------------------------------------------
async function startServer() {
  app.use(express.static(path.resolve(__dirname, 'public')));

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
