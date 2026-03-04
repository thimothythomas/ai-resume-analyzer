# AI Resume Analyzer

A full-stack ATS (Applicant Tracking System) resume analyzer powered entirely by Hugging Face AI (Meta-Llama-3-8B) .

## Tech Stack

### Frontend
- React with TypeScript
- Axios for API calls


### Backend
- NestJS (Node.js framework)
- Hugging Face AI with Meta-Llama-3-8B-Instruct 
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

### 1. Get Hugging Face API Key

1. Go to [Hugging Face](https://huggingface.co/settings/tokens)
2. Sign in or create an account
3. Click "New token" to create an access token
4. Give it a name and select "Read" access
5. Copy your API token

### 2. Backend Setup

```bash
cd backend
npm install

# Create .env file
cp .env.example .env
```

Edit `.env` and add your Hugging Face API key:
```env
HUGGINGFACE_API_KEY=your_actual_api_key_here
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
    │   │   ├── ai.service.ts        # Hugging Face AI integration
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


## Hugging Face AI Model

This project uses **Meta-Llama-3-8B-Instruct** via Hugging Face which provides:
- 🧠 Advanced reasoning and natural language understanding
- 🎯 Multi-domain expertise across all industries
- 📝 Supports long context (resumes + job descriptions)
- ⚡ Fast and accurate ATS analysis
- 🔍 Intelligent skill extraction and domain detection
- 🆓 Free tier available for testing
