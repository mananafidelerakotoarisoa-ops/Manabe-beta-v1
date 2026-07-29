import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { requireAuth, AuthRequest } from './src/middleware/auth.ts';
import { getOrCreateUser } from './src/db/users.ts';
import { db } from './src/db/index.ts';
import { lessonPlans, driveFiles } from './src/db/schema.ts';
import { eq, desc } from 'drizzle-orm';


const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory store for Cloud Sync across devices
const cloudSyncStore = new Map<string, any>();

// Initialize Gemini Client lazily or safely
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY || '';
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}


// Sync user profile to Cloud SQL
app.get('/api/auth/me', requireAuth, async (req: AuthRequest, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ error: 'No user' });
    
    const dbUser = await getOrCreateUser(user.uid, user.email || '');
    res.json({ success: true, user: dbUser });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});


// Cloud SQL: Save plan
app.post('/api/plans', requireAuth, async (req: AuthRequest, res) => {
  try {
    const { title, data } = req.body;
    const uid = req.user?.uid;
    const dbUser = await getOrCreateUser(uid, req.user?.email || '');
    
    const result = await db.insert(lessonPlans).values({
      teacherId: dbUser.id,
      title: title || 'Untitled Plan',
      data: data,
    }).returning();
    
    res.json({ success: true, plan: result[0] });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Cloud SQL: Load plans
app.get('/api/plans', requireAuth, async (req: AuthRequest, res) => {
  try {
    const uid = req.user?.uid;
    const dbUser = await getOrCreateUser(uid, req.user?.email || '');
    
    const results = await db.select().from(lessonPlans)
      .where(eq(lessonPlans.teacherId, dbUser.id))
      .orderBy(desc(lessonPlans.updatedAt));
      
    res.json({ success: true, plans: results });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Google Drive Sync API wrapper
app.post('/api/drive/upload', requireAuth, async (req: AuthRequest, res) => {
  try {
    const authHeader = req.headers.authorization; // Using the Firebase ID Token for our own API
    // We expect the client to pass the Google OAuth token in a separate header, e.g., X-Goog-Token
    const googleToken = req.headers['x-goog-token'];
    if (!googleToken) return res.status(401).json({ error: 'Missing Google Token' });

    const { fileName, content } = req.body;
    
    const metadata = {
      name: fileName,
      mimeType: 'application/json',
    };

    const form = new FormData();
    form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
    form.append('file', new Blob([JSON.stringify(content)], { type: 'application/json' }));

    const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${googleToken}`,
      },
      body: form
    });
    
    const driveData = await response.json();
    
    const uid = req.user?.uid;
    const dbUser = await getOrCreateUser(uid, req.user?.email || '');
    
    // Save to DB
    const result = await db.insert(driveFiles).values({
      teacherId: dbUser.id,
      fileId: driveData.id,
      fileName: driveData.name,
      mimeType: driveData.mimeType,
    }).returning();
    
    res.json({ success: true, file: result[0], driveData });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Cloud Sync Endpoint: Save plan with code
app.post('/api/sync/save', (req, res) => {
  try {
    const { syncCode, plan } = req.body;
    if (!syncCode || !plan) {
      res.status(400).json({ error: 'Missing syncCode or plan' });
      return;
    }
    const cleanCode = String(syncCode).trim().toUpperCase();
    cloudSyncStore.set(cleanCode, {
      plan,
      updatedAt: new Date().toISOString()
    });
    res.json({ success: true, syncCode: cleanCode, message: 'Plan synced to cloud!' });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Cloud sync error' });
  }
});

// Cloud Sync Endpoint: Load plan by code
app.get('/api/sync/load/:code', (req, res) => {
  try {
    const code = req.params.code.trim().toUpperCase();
    const data = cloudSyncStore.get(code);
    if (!data) {
      res.status(404).json({ error: 'Sync code not found. Please check the code.' });
      return;
    }
    res.json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Cloud sync fetch error' });
  }
});

// Gemini AI Lesson Plan Generator Endpoint
app.post('/api/generate-lesson-plan', async (req, res) => {
  try {
    const { grammarPoint, targetLevel, durationMinutes = 50, textbookRef = '', additionalNotes = '' } = req.body;

    if (!grammarPoint) {
      res.status(400).json({ error: 'Grammar point is required.' });
      return;
    }

    const ai = getGeminiClient();

    const prompt = `You are an expert Japanese language master teacher specializing in the PCPP (Presentation, Comprehension Check, Practice, Production) communicative teaching methodology.
Generate a structured, highly effective, lightweight PCPP lesson plan for Japanese class.

Teacher Input:
- Target Grammar Point: "${grammarPoint}"
- Target Level: "${targetLevel || 'N5'}"
- Total Class Duration: ${durationMinutes} minutes
- Textbook Reference: "${textbookRef || 'General Japanese'}"
- Additional Teacher Notes: "${additionalNotes}"

Requirement for PCPP Method:
1. Presentation (導入 - ~10-12 mins): Contextual introduction with visual/gestural cues, real-life scenario, clear form/meaning.
2. Comprehension Check (理解確認 - ~8-10 mins): Concept Check Questions (CCQs) and true/false to check form & meaning BEFORE drilling.
3. Practice (練習 - ~15-20 mins): Controlled & guided substitution/transformation drills and pair practice.
4. Production (運用 - ~15-20 mins): Communicative free activity, roleplay, or real-life task.

Return ONLY a valid JSON object strictly matching this schema with no markdown formatting outside JSON:

{
  "title": "Lesson title with grammar pattern and theme",
  "targetLevel": "${targetLevel || 'N5'}",
  "textbookRef": "${textbookRef || 'Japanese Class'}",
  "totalDurationMinutes": ${durationMinutes},
  "grammarPoint": "${grammarPoint}",
  "grammarPointMeaning": "Clear English & Japanese meaning",
  "targetVocab": ["Vocab 1 (ひらがな/漢字)", "Vocab 2", "Vocab 3", "Vocab 4", "Vocab 5"],
  "targetKanji": ["Kanji 1", "Kanji 2"],
  "phases": [
    {
      "id": "p1",
      "type": "presentation",
      "title": "Presentation (導入)",
      "titleJa": "提示",
      "durationMinutes": 10,
      "objective": "Clear goal for introduction",
      "teacherAction": "What teacher says and does",
      "studentAction": "What students do",
      "materialsNeeded": ["Material 1", "Material 2"],
      "boardPlanNote": "What to write on board"
    },
    {
      "id": "p2",
      "type": "comprehension",
      "title": "Comprehension Check (理解確認)",
      "titleJa": "理解確認",
      "durationMinutes": 10,
      "objective": "Clear goal for understanding check",
      "teacherAction": "What teacher asks and verifies",
      "studentAction": "What students answer",
      "materialsNeeded": ["CCQ slides/cards"],
      "conceptCheckQuestions": [
        "CCQ 1: Japanese example question -> expected answer",
        "CCQ 2: Japanese example question -> expected answer",
        "CCQ 3: Form/Meaning verification question"
      ]
    },
    {
      "id": "p3",
      "type": "practice",
      "title": "Practice (練習)",
      "titleJa": "練習",
      "durationMinutes": 15,
      "objective": "Controlled drill & transformation goal",
      "teacherAction": "Drill conductor steps",
      "studentAction": "Choral and pair drill actions",
      "materialsNeeded": ["Drill flashcards", "Worksheet"]
    },
    {
      "id": "p4",
      "type": "production",
      "title": "Production (運用)",
      "titleJa": "運用",
      "durationMinutes": 15,
      "objective": "Communicative real-world task goal",
      "teacherAction": "Facilitator and monitoring steps",
      "studentAction": "Roleplay or survey activity in pairs",
      "materialsNeeded": ["Roleplay scenario cards"]
    }
  ],
  "boardPlan": {
    "title": "【黒板レイアウト (Board Plan)】",
    "grammarPattern": "Exact Japanese formula",
    "exampleSentenceJa": "Main Japanese example sentence",
    "exampleSentenceRomaji": "Romaji reading",
    "exampleSentenceEn": "English translation",
    "notes": ["Usage note 1 in Japanese/English", "Nuance note 2"]
  },
  "teacherNotes": "Teacher tip to maximize Student Talk Time (STT) and keep explanation lightweight."
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.3
      }
    });

    const text = response.text || '';
    const cleanJson = text.replace(/```json\n?/gi, '').replace(/```\n?/gi, '').trim();
    const planData = JSON.parse(cleanJson);

    res.json({ success: true, plan: planData });
  } catch (err: any) {
    console.error('Error generating lesson plan:', err);
    res.status(500).json({
      error: 'Failed to generate AI lesson plan. Please check your Gemini API configuration or retry.',
      details: err.message
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

startServer();
