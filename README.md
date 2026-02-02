# Anime News Hub

A modern, mobile-first web application for live updates on Anime, Manga, Manhwa, Manhua, Light Novels, and Web Novels. Features real-time data from verified sources including AniList, MangaDex, and more.

![Anime News Hub](https://via.placeholder.com/800x400/0a0a0f/8b5cf6?text=Anime+News+Hub)

## 🌟 Features

### Core Features
- ✅ **Live Updates** - Real-time data from AniList GraphQL API and MangaDex API
- ✅ **Auto-refresh** every 30 minutes
- ✅ **Manual refresh** with loading indicator
- ✅ **Last updated timestamp**

### Content Categories
- 📺 Anime
- 📖 Manga
- 🇰🇷 Manhwa
- 🇨🇳 Manhua
- 📚 Light Novels
- 🌐 Web Novels

### Search & Filter
- 🔍 Real-time search with debouncing
- 🏷️ Filter by category
- 📊 Sort by popularity, trending, latest

### User Features
- ❤️ Favorites system with local storage
- 🔗 Share content with source links
- 📱 Responsive design (mobile, tablet, desktop)
- 🌙 Dark mode anime aesthetic

### Data Authenticity
- ✅ Verified sources only
- 🔗 Clickable source links on every item
- 📋 Source attribution (AniList, MangaDex)
- ⏰ Published timestamps

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone or download the project**
```bash
cd anime-news-hub
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm run dev
```

4. **Open in browser**
```
http://localhost:5173
```

### Build for Production

```bash
npm run build
```

The built files will be in the `dist/` folder.

## 📁 Project Structure

```
anime-news-hub/
├── src/
│   ├── components/
│   │   └── ui/           # UI components (cards, modals, etc.)
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # API integrations and utilities
│   ├── types/            # TypeScript type definitions
│   ├── App.tsx           # Main application component
│   ├── index.css         # Global styles
│   └── main.tsx          # Entry point
├── public/               # Static assets
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

## 🔌 API Integrations

### Primary Sources
| Source | Type | Endpoint |
|--------|------|----------|
| AniList | GraphQL | `https://graphql.anilist.co` |
| MangaDex | REST | `https://api.mangadex.org` |

### API Features Used
- **AniList**: Trending anime/manga, popular content, search, seasonal anime
- **MangaDex**: Manga, manhwa, manhua with cover images

## 🎨 Customization

### Colors
Edit `src/index.css` to customize the color scheme:

```css
:root {
  --background: 240 20% 4%;    /* Dark background */
  --primary: 263 70% 66%;       /* Violet accent */
  --secondary: 330 80% 60%;     /* Pink accent */
  --accent: 187 80% 45%;        /* Cyan accent */
}
```

### Category Colors
- Anime: Violet (`#8b5cf6`)
- Manga: Pink (`#ec4899`)
- Manhwa: Cyan (`#06b6d4`)
- Manhua: Amber (`#f59e0b`)
- Light Novel: Emerald (`#10b981`)
- Web Novel: Blue (`#3b82f6`)

## 📱 PWA Support

The app includes Progressive Web App support:
- Offline caching
- Add to home screen
- App-like experience

## 🚀 Deployment Options

### Option 1: Vercel (Recommended)
```bash
npm i -g vercel
vercel
```

### Option 2: Netlify
```bash
npm run build
# Drag and drop the dist/ folder to Netlify
```

### Option 3: GitHub Pages
```bash
npm run build
# Push dist/ folder to gh-pages branch
```

### Option 4: Firebase Hosting
```bash
npm i -g firebase-tools
firebase init hosting
firebase deploy
```

## 🔧 Environment Variables

Create a `.env` file for custom configuration:

```env
# Optional: Custom API endpoints
VITE_ANILIST_API_URL=https://graphql.anilist.co
VITE_MANGADEX_API_URL=https://api.mangadex.org

# Optional: Cache duration in minutes
VITE_CACHE_DURATION=5
```

## 📝 Data Structure

```typescript
interface ContentItem {
  id: string;
  title: string;
  alternativeTitles?: string[];
  summary: string;
  category: 'anime' | 'manga' | 'manhwa' | 'manhua' | 'light-novel' | 'web-novel';
  imageUrl: string;
  sourceUrl: string;
  sourceName: string;
  releaseDate: string;
  updatedAt: string;
  status: 'ongoing' | 'upcoming' | 'finished';
  popularity?: number;
  score?: number;
  isTrending?: boolean;
  episodes?: number;
  chapters?: number;
}
```

## 🤝 Contributing

Feel free to fork and customize for your needs!

## 📄 License

MIT License - feel free to use for personal or commercial projects.

## 🙏 Credits

- Data provided by [AniList](https://anilist.co) and [MangaDex](https://mangadex.org)
- Icons by [Lucide](https://lucide.dev)
- UI components by [shadcn/ui](https://ui.shadcn.com)

---

Built with ❤️ using React, TypeScript, and Tailwind CSS
