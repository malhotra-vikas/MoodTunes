# MoodTunes Architecture

## Overview
MoodTunes is a modern web application that analyzes user text input to determine mood and provides personalized music recommendations with integrated playback functionality.

## Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Modern UI component library
- **Lucide React** - Icon library

### Backend
- **Next.js API Routes** - Server-side API endpoints
- **Server Actions** - Server-side form handling
- **AI SDK** - Vercel's AI toolkit for LLM integration

### External APIs
- **OpenAI API** - GPT-4 for mood analysis and song recommendations
- **YouTube Data API v3** - Music search and playback

### State Management
- **React Context** - Global music player state
- **React Hooks** - Local component state management

## Application Architecture

\`\`\`
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (Next.js)                   │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌──────────────┐ │
│  │   User Input    │  │  Mood Analysis  │  │    Music     │ │
│  │   Component     │  │    Results      │  │   Player     │ │
│  └─────────────────┘  └─────────────────┘  └──────────────┘ │
│                                                             │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │              Music Player Context                       │ │
│  │         (Global State Management)                       │ │
│  └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                    Server Actions & API Routes              │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐              ┌─────────────────────────┐ │
│  │  Mood Analysis  │              │   YouTube Search API   │ │
│  │ Server Action   │              │       Route             │ │
│  └─────────────────┘              └─────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                │                              │
                ▼                              ▼
┌─────────────────────┐              ┌─────────────────────────┐
│    OpenAI API       │              │   YouTube Data API      │
│                     │              │                         │
│ • Mood Detection    │              │ • Song Search           │
│ • Song Recommendations │           │ • Video ID Retrieval    │
│ • Emotion Analysis  │              │ • Metadata Extraction   │
└─────────────────────┘              └─────────────────────────┘
\`\`\`

## Data Flow

### 1. User Input Processing
\`\`\`
User Text Input → Server Action → OpenAI API → Mood Analysis
\`\`\`

### 2. Song Recommendation & Preparation
\`\`\`
Mood Analysis → Song Recommendations → YouTube Search → Pre-loaded Song IDs
\`\`\`

### 3. Music Playback
\`\`\`
Song Selection → YouTube Player → Audio Playback → Player Controls
\`\`\`

## Component Architecture

### Core Components
- **`app/page.tsx`** - Main application page
- **`components/music-player.tsx`** - Persistent music player
- **`components/song-card.tsx`** - Individual song display with play controls
- **`components/play-all-button.tsx`** - Playlist control component

### Context Providers
- **`contexts/music-player-context.tsx`** - Global music state management

### Server-Side Logic
- **`app/actions.ts`** - Server actions for mood analysis
- **`app/api/youtube-search/route.ts`** - YouTube API integration

### Utilities
- **`lib/share-utils.ts`** - Social sharing functionality
- **`lib/utils.ts`** - Common utility functions

## Key Features

### 1. AI-Powered Mood Analysis
- Uses OpenAI GPT-4 to analyze text input
- Extracts mood, intensity (1-10 scale), and emotions
- Provides contextual song recommendations

### 2. Music Discovery & Playback
- Integrates with YouTube for music search
- Pre-loads song IDs for instant playback
- Supports playlist functionality with skip/previous controls

### 3. Social Sharing
- Multi-platform sharing (Twitter, Facebook, WhatsApp, LinkedIn)
- Custom share content generation
- Native share API integration with fallbacks

### 4. Responsive Design
- Mobile-first approach
- Glassmorphism UI design
- Smooth animations and transitions

## Performance Optimizations

### 1. Pre-loading Strategy
- YouTube IDs fetched during mood analysis
- Eliminates loading delays during playback
- Parallel processing for multiple songs

### 2. Caching & State Management
- Context-based state management
- Efficient re-renders with React optimization
- Local state for UI interactions

### 3. Error Handling & Fallbacks
- Demo mode when APIs unavailable
- Graceful degradation for missing features
- Comprehensive error boundaries

## Security Considerations

### Environment Variables
- `OPENAI_API_KEY` - OpenAI API authentication
- `YOUTUBE_API_KEY` - YouTube Data API authentication

### API Security
- Server-side API key management
- No client-side exposure of sensitive keys
- Rate limiting considerations for external APIs

## Deployment Architecture

### Development
- Local Next.js development server
- Environment variable configuration
- Hot reloading for rapid development

### Production
- Static generation where possible
- Server-side rendering for dynamic content
- Edge function deployment for API routes

## Future Enhancements

### Planned Features
- Spotify Web Playback SDK integration
- User authentication and playlist saving
- Advanced mood analytics and history
- Collaborative playlist features
- Audio visualization components

### Scalability Considerations
- Database integration for user data
- Caching layer for API responses
- CDN integration for static assets
- Microservices architecture for complex features
\`\`\`

Now let's update the README to focus on local development:
