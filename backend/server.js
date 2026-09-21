import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { initDatabase, getDbStatus } from './db.js';
import authRoutes from './routes/auth.js';
import listingsRoutes from './routes/listings.js';
import applicationsRoutes from './routes/applications.js';
import bookmarksRoutes from './routes/bookmarks.js';
import studentPostsRoutes from './routes/studentPosts.js';
import resumeRoutes from './routes/resume.js';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  // Standard Middlewares with Secure CORS for deployment
  app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
      ? ['https://nexhire-job-board.onrender.com'] // Update this after Render gives you your live URL
      : '*'
  }));
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Initialize Database (MongoDB Atlas)
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
  app.use('/api/student-posts', studentPostsRoutes);
  app.use('/api/resume', resumeRoutes);

  // Vite middleware for development or Static files for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      configFile: path.resolve(process.cwd(), 'frontend/vite.config.js'),
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    app.use('*', async (req, res, next) => {
      const url = req.originalUrl;
      try {
        const indexPath = path.resolve(process.cwd(), 'frontend/index.html');
        if (fs.existsSync(indexPath)) {
          let template = fs.readFileSync(indexPath, 'utf-8');
          template = await vite.transformIndexHtml(url, template);
          res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
        } else {
          res.status(404).send('frontend/index.html not found');
        }
      } catch (e) {
        vite.ssrFixStacktrace(e);
        next(e);
      }
    });
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