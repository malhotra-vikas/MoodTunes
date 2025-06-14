# MoodTunes 🎭🎵

**AI-Powered Mood-Based Music Discovery & Playback**

MoodTunes analyzes your text to understand your current mood and recommends personalized music that matches or complements your emotional state. Discover new songs, play them instantly, and share your mood-based playlists with friends.

![MoodTunes Demo](https://img.shields.io/badge/Status-Live-brightgreen?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)

## ✨ Features

- 🤖 **AI Mood Analysis** - Advanced text analysis using OpenAI GPT-4
- 🎵 **Instant Music Playback** - YouTube integration with pre-loaded songs
- 🎨 **Beautiful UI** - Modern glassmorphism design with smooth animations
- 📱 **Responsive Design** - Perfect experience on mobile and desktop
- 🔗 **Social Sharing** - Share your mood and playlist across platforms
- ⚡ **Fast Performance** - Optimized loading with parallel processing

## 🚀 Quick Start

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.0.0 or higher)
- **npm** or **yarn** or **pnpm**
- **Git**

### Required API Keys

1. **OpenAI API Key** (Required for mood analysis)
   - Visit [OpenAI Platform](https://platform.openai.com/api-keys)
   - Create an account and generate an API key
   - Note: This requires OpenAI credits/subscription

2. **YouTube Data API Key** (Optional - app works with demo mode)
   - Visit [Google Cloud Console](https://console.cloud.google.com/)
   - Enable YouTube Data API v3
   - Create credentials and get API key

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone https://github.com/your-username/moodtunes.git
   cd moodtunes
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   \`\`\`

3. **Set up environment variables**
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`
   
   Edit `.env.local` and add your API keys:
   \`\`\`env
   OPENAI_API_KEY=your_openai_api_key_here
   YOUTUBE_API_KEY=your_youtube_api_key_here  # Optional
   \`\`\`

4. **Run the development server**
   \`\`\`bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   \`\`\`

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🛠️ Tech Stack

### Core Technologies
- **[Next.js 15](https://nextjs.org/)** - React framework with App Router
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[shadcn/ui](https://ui.shadcn.com/)** - Modern UI components

### AI & APIs
- **[AI SDK](https://sdk.vercel.ai/)** - Vercel's AI toolkit
- **[OpenAI API](https://openai.com/api/)** - GPT-4 for mood analysis
- **[YouTube Data API](https://developers.google.com/youtube/v3)** - Music search & playback

### Additional Tools
- **[Lucide React](https://lucide.dev/)** - Beautiful icons
- **[React Context](https://react.dev/reference/react/useContext)** - State management

## 📁 Project Structure

\`\`\`
moodtunes/
├── app/
│   ├── actions.ts              # Server actions for mood analysis
│   ├── api/
│   │   └── youtube-search/     # YouTube API integration
│   ├── globals.css             # Global styles
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Main application page
├── components/
│   ├── ui/                     # shadcn/ui components
│   ├── music-player.tsx        # Music player component
│   ├── song-card.tsx           # Individual song display
│   └── ...                     # Other components
├── contexts/
│   └── music-player-context.tsx # Global music state
├── lib/
│   ├── utils.ts                # Utility functions
│   └── share-utils.ts          # Social sharing logic
└── public/                     # Static assets
\`\`\`

## 🔧 Configuration

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `OPENAI_API_KEY` | Yes | OpenAI API key for mood analysis |
| `YOUTUBE_API_KEY` | No | YouTube Data API key (falls back to demo mode) |

### Demo Mode

If you don't have API keys, MoodTunes runs in demo mode with:
- Pre-defined mood analysis responses
- Sample song recommendations
- Full UI functionality for testing

## 🚀 Deployment

### Local Production Build

\`\`\`bash
npm run build
npm start
\`\`\`

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically on push

### Deploy to Other Platforms

MoodTunes is a standard Next.js app and can be deployed to:
- **Netlify**
- **Railway**
- **DigitalOcean App Platform**
- **AWS Amplify**
- **Any Node.js hosting provider**

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Run tests: `npm test`
5. Commit changes: `git commit -m 'Add amazing feature'`
6. Push to branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenAI** for providing powerful AI capabilities
- **YouTube** for music discovery and playback
- **Vercel** for the AI SDK and deployment platform
- **shadcn** for beautiful UI components
- **The open-source community** for amazing tools and libraries

## 📞 Support

- 📧 **Email**: support@moodtunes.app
- 🐛 **Issues**: [GitHub Issues](https://github.com/your-username/moodtunes/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/your-username/moodtunes/discussions)

---

**Made with ❤️ by the MoodTunes Team**

*Discover your perfect soundtrack, powered by AI* 🎵✨
