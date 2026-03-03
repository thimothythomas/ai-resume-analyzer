# AI Resume Analyzer

A full-stack ATS (Applicant Tracking System) resume analyzer powered entirely by xAI's Grok with zero hardcoded logic.

## Tech Stack

### Frontend
- React 18 with TypeScript
- Axios for API calls
- Modern glassmorphic UI with animations

### Backend
- NestJS (Node.js framework)
- xAI Grok Beta (100% AI-powered analysis)
- PDF/DOC parsing
- Multer for file uploads

## Features

- 📤 Drag & drop resume upload
- 🤖 **100% AI-powered analysis** - No hardcoded dictionaries or rules
- 🎯 **ATS-style scoring** across 6 categories:
  - Keywords (0-35 points)
  - Skills (0-20 points)
  - Experience (0-25 points)
  - Education (0-10 points)
  - Formatting (0-10 points)
  - Quantification (0-10 points)
- 🏢 **Multi-industry support** - Automatically detects domain (technology, finance, marketing, hr, healthcare, sales, operations, architecture, engineering, legal, education, design, hospitality, retail, manufacturing, construction, media, consulting)
- 📝 **Job description matching** - Compare resume against specific JD
- 💡 **Tailored suggestions** - AI-generated recommendations to improve match
- ✅ File validation (PDF, DOC, DOCX)
- 🎨 Professional glassmorphic dark theme UI
- 📱 Responsive design

## Setup Instructions

### 1. Get Grok API Key

1. Go to [xAI Console](https://console.x.ai/)
2. Sign in or create an account
3. Navigate to API Keys section
4. Create a new API key
5. Copy your API key

### 2. Backend Setup

```bash
cd backend
npm install

# Create .env file
cp .env.example .env
```

Edit `.env` and add your Grok API key:
```env
GROK_API_KEY=your_actual_api_key_here
PORT=3001
FRONTEND_URL=http://localhost:3000
```

### 3. Frontend Setup

```bash
cd frontend
npm install
```

### 4. Run the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run start:dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

- Frontend: http://localhost:3000
- Backend: http://localhost:3001

## Project Structure

```
Ai_resume_analyser/
├── frontend/                  # React frontend
│   ├── src/
│   │   ├── components/       # React components
│   │   │   ├── ResumeUpload.tsx
│   │   │   └── ResultsDisplay.tsx
│   │   ├── services/         # API services
│   │   ├── types/           # TypeScript types
│   │   └── App.tsx
│   └── package.json
│
└── backend/                   # NestJS backend
    ├── src/
    │   ├── resume/
    │   │   ├── resume.controller.ts
    │   │   ├── resume.service.ts
    │   │   ├── gemini.service.ts    # Gemini AI integration
    │   │   └── resume.module.ts
    │   ├── app.module.ts
    │   └── main.ts
    └── package.json
```

## API Endpoints

### POST /api/resume/analyze
Upload and analyze a resume

**Request:**
- Method: POST
- Content-Type: multipart/form-data
- Body: `resume` (file)

**Response:**
```json
{
  "success": true,
  "data": {
    "score": 85,
    "strengths": ["Strong technical skills", "..."],
    "improvements": ["Add quantifiable achievements", "..."],
    "recommendations": ["Include certifications", "..."],
    "skills": ["JavaScript", "React", "..."],
    "experience": ["5 years in software development", "..."]
  }
}
```

## Grok AI Model

This project uses **xAI Grok Beta** which is:
- 🧠 Advanced reasoning and natural language understanding
- 🎯 Multi-domain expertise across all industries
- 📝 Supports long context (resumes + job descriptions)
- ⚡ Fast and accurate ATS analysis
- 🔍 Intelligent skill extraction and domain detection
- 🌐 Real-time knowledge and industry insights

**Why Pure AI?**
- No hardcoded skill dictionaries or keyword lists
- AI naturally understands synonyms and context
- Adapts to evolving industry terminology
- Handles niche and emerging skills automatically
- More accurate than rule-based systems

## Troubleshooting

### Backend won't start
- Make sure you added your Grok API key to `.env`
- Ensure port 3001 is not in use
- Verify your API key is valid at https://console.x.ai/

### Frontend errors
- Run `npm install` in the frontend directory
- Check that backend is running on port 3001

### File upload issues
- Create `uploads/` folder in backend directory
- Check file size (must be < 10MB)
- Verify file format (PDF, DOC, DOCX only)

## License

MIT
