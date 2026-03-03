# AI Resume Analyzer - Frontend

React frontend for the AI Resume Analyzer application.

## Tech Stack
- React 18 with TypeScript
- Axios for API calls
- CSS3 with modern animations

## Getting Started

### Installation
```bash
cd frontend
npm install
```

### Development
```bash
npm start
```
Runs on http://localhost:3000

### Build for Production
```bash
npm run build
```

## Environment Variables
Create a `.env` file:
```
REACT_APP_API_URL=http://localhost:3001
```

## Features
- Drag & drop file upload
- Real-time file validation
- Beautiful gradient UI
- Responsive design
- TypeScript type safety
- Error handling
- Loading states

## API Integration
The app expects a NestJS backend running on port 3001 with the following endpoint:
- `POST /api/resume/analyze` - Upload and analyze resume

## Project Structure
```
src/
  ├── components/       # React components
  ├── services/         # API services
  ├── types/           # TypeScript types
  ├── App.tsx          # Main app component
  └── index.tsx        # Entry point
```
