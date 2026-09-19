import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { initDatabase, getDbStatus } from './server/db.js';
import authRoutes from './server/routes/auth.js';
import listingsRoutes from './server/routes/listings.js';
import applicationsRoutes from './server/routes/applications.js';
import bookmarksRoutes from './server/routes/bookmarks.js';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Standard Middlewares with Secure CORS for deployment
  app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
      ? ['https://nexhire-job-board.onrender.com'] // Update this after Render gives you your live URL
      : '*'
  }));
  app.use(express.json());

  // Initialize Database (MongoDB Atlas with fallback)
  await initDatabase();

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });
  
  app.get('/api/db-status', (req, res) => {
    res.json(getDbStatus());
  });

  app.use('/api/auth', authRoutes);
  app.use('/api/listings', listingsRoutes);
  app.use('/api/applications', applicationsRoutes);
  app.use('/api/bookmarks', bookmarksRoutes);

  // Vite middleware for development or Static files for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`NexHire MERN Job Board Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Fatal error starting server:', err);
  process.exit(1);
});