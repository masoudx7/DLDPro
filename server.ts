import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Google Gen AI if key exists
let aiClient: GoogleGenAI | null = null;
try {
  if (process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
} catch (e) {
  console.error("Failed to initialize Gemini AI", e);
}

// API: Parse link (YouTube, Instagram, Telegram, Direct URL) using Gemini AI or URL heuristics
app.post("/api/parse-link", async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ error: "URL is required" });
    }

    let platform: 'youtube' | 'instagram' | 'telegram' | 'direct' = 'direct';
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      platform = 'youtube';
    } else if (url.includes('instagram.com')) {
      platform = 'instagram';
    } else if (url.includes('t.me') || url.includes('telegram.org')) {
      platform = 'telegram';
    }

    let title = "فایل دانلودی جدید";
    let fileSize = Math.floor(Math.random() * 800 * 1024 * 1024) + 15 * 1024 * 1024; // 15MB - 800MB
    let category = 'other';
    let thumbnail = '';
    let qualityOptions = ['1080p (MP4)', '720p (MP4)', '480p (MP4)', 'فقط صوت (MP3)'];

    if (platform === 'youtube') {
      title = "ویدیو آموزشی و بررسی تخصصی یوتیوب";
      category = 'video';
      thumbnail = 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600&auto=format&fit=crop&q=80';
    } else if (platform === 'instagram') {
      title = "محتوای ویدیو اینستاگرام ریلز";
      category = 'video';
      thumbnail = 'https://images.unsplash.com/photo-1611262588024-d12430b98920?w=600&auto=format&fit=crop&q=80';
    } else if (platform === 'telegram') {
      title = "فایل رسانه یا سند تلگرام";
      category = 'document';
      thumbnail = 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80';
    } else {
      if (url.endsWith('.mp4') || url.endsWith('.mkv')) category = 'video';
      else if (url.endsWith('.mp3') || url.endsWith('.wav')) category = 'audio';
      else if (url.endsWith('.zip') || url.endsWith('.rar')) category = 'archive';
      else if (url.endsWith('.exe') || url.endsWith('.dmg') || url.endsWith('.apk')) category = 'software';
      else if (url.endsWith('.pdf') || url.endsWith('.docx')) category = 'document';
      
      const parts = url.split('/');
      const lastPart = parts[parts.length - 1];
      if (lastPart && lastPart.length < 50) {
        title = decodeURIComponent(lastPart.split('?')[0]);
      }
    }

    // If Gemini is available, enhance metadata title and category
    if (aiClient) {
      try {
        const response = await aiClient.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: `Analyze this download URL: "${url}". Return a strict JSON response with keys: "title" (a clean descriptive Persian title), "category" (one of: video, audio, software, document, archive, other), and "estimatedSizeMB" (number between 10 and 1500).`,
        });
        const text = response.text;
        if (text) {
          const jsonMatch = text.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            if (parsed.title) title = parsed.title;
            if (parsed.category) category = parsed.category;
            if (parsed.estimatedSizeMB) fileSize = parsed.estimatedSizeMB * 1024 * 1024;
          }
        }
      } catch (aiErr) {
        console.warn("AI metadata enrichment skipped:", aiErr);
      }
    }

    res.json({
      success: true,
      data: {
        title,
        url,
        platform,
        fileSize,
        category,
        thumbnail,
        qualityOptions,
      }
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to parse link" });
  }
});

// API: FFmpeg simulation/processing
app.post("/api/ffmpeg/process", (req, res) => {
  const { fileName, operation, targetFormat } = req.body;
  res.json({
    success: true,
    job: {
      id: 'job_' + Date.now(),
      fileName: fileName || 'media_file.mp4',
      operation: operation || 'convert',
      targetFormat: targetFormat || 'mp4',
      status: 'processing',
      progress: 0,
      createdAt: new Date().toISOString()
    }
  });
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
