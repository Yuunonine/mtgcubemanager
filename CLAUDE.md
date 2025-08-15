# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
- `npm run dev` - Start both client and server in development mode (concurrently)
- `npm run server:dev` - Start server only in development mode (uses nodemon)
- `npm run client:dev` - Start client only in development mode
- `npm run install:all` - Install dependencies for root, server, and client

### Build & Production
- `npm run build` - Build client for production
- `npm start` - Start server in production mode
- Server runs on port 3001, client on port 3000 (proxied to server in development)

### Testing
- `cd server && npm test` - Run server tests (Jest)
- `cd client && npm test` - Run client tests (React Testing Library)

## Architecture

### Project Structure
This is a full-stack MTG Cube management application with separate client/server directories:

```
/
├── client/          # React + TypeScript frontend
│   ├── src/
│   │   ├── components/  # React components (CubeList, CubeView, CubeAnalysis)
│   │   ├── services/    # API client (api.ts)
│   │   └── types/       # TypeScript definitions (Card.ts)
│   └── package.json
├── server/          # Node.js + Express backend
│   ├── controllers/ # Request handlers
│   ├── routes/      # API routes (cards.js, cubes.js)
│   ├── models/      # Database layer (database.js)
│   ├── services/    # External API integration (scryfallService.js)
│   └── utils/       # Business logic (cubeAnalysis.js)
└── package.json     # Root package with dev scripts
```

### Data Flow
- **Frontend**: React app with Material-UI, routing via react-router-dom
- **Backend**: Express REST API with SQLite database
- **External**: Integrates with Scryfall API for Magic card data
- **Database**: SQLite with two main tables: `cubes` and `cube_cards`

### Key Components
- **Database Model** (`server/models/database.js`): Singleton SQLite wrapper with Promise-based methods
- **API Client** (`client/src/services/api.ts`): Axios-based client with separate card/cube APIs
- **Cube Analysis** (`server/utils/cubeAnalysis.js`): Business logic for color distribution, mana curve, and card type analysis
- **TypeScript Types** (`client/src/types/Card.ts`): Shared interfaces for Card, CubeCard, and CubeAnalysis

### Database Schema
- `cubes`: id (TEXT), name, description, timestamps
- `cube_cards`: cube_id (FK), card data from Scryfall, quantity, notes, tags

### API Endpoints
- Cards: `/api/cards/search`, `/api/cards/:name`
- Cubes: `/api/cubes` (CRUD), `/api/cubes/:id/cards` (card management), `/api/cubes/:id/analysis`

## Development Notes
- Client uses proxy to backend in development (`"proxy": "http://localhost:3001"`)
- Server serves static client build in production
- All JSON fields in database are stored as TEXT and parsed in application layer
- Card data follows Scryfall API structure