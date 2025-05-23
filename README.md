# PokerMaster Arena - Client

## Introduction

PokerMaster Arena is a modern web-based Texas Hold'em poker platform featuring real-time multiplayer gameplay, AI-powered assistance, and comprehensive statistics tracking. This repository contains the frontend client implementation built with Next.js and React.

**Goal**: Provide an intuitive, responsive interface that makes online poker accessible to players of all skill levels while offering advanced features for improvement.

**Motivation**: Create a visually appealing and user-friendly poker experience that seamlessly integrates AI assistance and social features to enhance both casual and competitive play.

## Technologies Used

- **Next.js 14** - React framework
- **TypeScript** - Type-safe development
- **Ant Design** - UI component library
- **CSS Modules** - Scoped styling
- **Vercel** - Deployment platform

## High-level Components

### 1. Game Table Component ([GameTable.tsx](app/components/Gametable/Gametable.tsx))
The main gaming interface that provides:
- Real-time game state visualization
- Player positioning and card display
- Action controls (fold, check, call, raise, bet)
- Integration with AI advisor
- Timer display for turn management

### 2. API Client ([apiClient.ts](app/api/apiClient.ts))
Centralized API management handling:
- Authentication token persistence
- All backend communications
- Error handling and response processing
- Game password management
- Request/response type safety

### 3. User Profile System ([UserProfilePage.tsx](app/components/profile/UserProfilePage.tsx))
Comprehensive user management featuring:
- Profile display and editing
- Game history tracking
- Statistics visualization with time filters
- Leaderboard integration (global/friends)
- Friend request management

### 4. Room Management
- [CreateRoomForm](app/components/CreateRoom/CreateRoomForm.tsx) - Game creation interface
- [RoomBrowser](app/components/RoomBrowser/RoomBrowser.tsx) - Game discovery and joining
- Private game password handling

### 5. Authentication Flow
- [Login Page](app/login/page.tsx) - User authentication
- [Register Page](app/register/page.tsx) - New user registration
- Token-based session management

## Launch & Deployment

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/sopra-fs25-group-45/sopra-fs25-group-45-client.git
cd sopra-fs25-group-45-client
```

2. Run Frontend Locally:
```bash
cd client
npm install
npm run dev
```
### Running Tests
```bash
npm run test
```
### Deployment to Vercel
1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```
3. Set environment variables in Vercel dashboard

## Illustrations
### Main User Flow
1. Landing Page (Users choose between Login, Register, or Tutorial)
2. Game Lobby (Browse available games
, Create new tables
, Access profile and friends)
3. Game Table (Gameplay with real-time updates
, AI advisor available via help button
, Action controls appear on player's turn)
4. AI Assistance (Context-aware advice based on current game state)
5. User Profile (View statistics and game history
, Check leaderboard rankings)

## Roadmap
### Mobile Optimization
Enhance mobile experience with:
- Responsive game table layout
- Touch-optimized controls

## Enhanced Customization
Personalization options
- Table themes and card designs
- Avatar customization
- UI layout options


## Authors & Acknowledgments
- Yunyi (Aaron) Zhang - @TauSigma
- Lydia Gattiker - @lydia-milena
- Guanqiao Li - @unscttp
- Maorong Lin  - @Qavrox
- Yutian Lei - @IsSaudade

Special thanks to:
- SoPra teaching team for guidance
- Google Gemini team for AI API access

## License
This project is licensed under the MIT License - see below:

MIT License

Copyright (c) 2025 SoPra Group 45

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
