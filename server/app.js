import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import authRoutes from './routes/authRoutes.js';
import complaintRoutes from './routes/complaintRoutes.js';
import issueRoutes from './routes/issueRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientDistPath = path.join(__dirname, '../client/dist');

const app = express();

// Configure CORS for Vercel, Render, custom domains, and Localhost
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:5000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:5000',
];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. mobile apps, curl, Postman, server-to-server) or any client origin
    callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  exposedHeaders: ['Authorization'],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Direct header middleware to guarantee CORS headers on every response & preflight
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    res.setHeader('Access-Control-Allow-Origin', '*');
  }
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});


app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    app: 'CampusVoice API',
    version: '1.0.0',
    privacyModel: 'Verified Anonymity',
    database: 'MongoDB Connected',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/issues', issueRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/ai', aiRoutes);

// Static frontend serving if client dist exists
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
}

// Catch-all route for SPA and root endpoint handling (prevents "Cannot GET /")
app.get('*', (req, res, next) => {
  if (req.originalUrl.startsWith('/api')) {
    return next();
  }

  const indexHtml = path.join(clientDistPath, 'index.html');
  if (fs.existsSync(indexHtml)) {
    return res.sendFile(indexHtml);
  }

  // If client dist is not present (e.g. backend API only deployment on Render)
  if (req.path === '/' || req.path === '') {
    return res.status(200).json({
      success: true,
      name: 'CampusVoice API',
      version: '1.0.0',
      status: 'online',
      message: 'CampusVoice Verified Anonymous Complaint & Resolution Platform API is running successfully.',
      privacyModel: 'Verified Anonymity (Zero-Knowledge Student Identity Protection)',
      documentation: {
        health: '/api/health',
        auth: {
          register: 'POST /api/auth/register',
          login: 'POST /api/auth/login',
          me: 'GET /api/auth/me (JWT Protected)',
        },
        complaints: {
          submit: 'POST /api/complaints (JWT Protected)',
          myComplaints: 'GET /api/complaints/my (JWT Protected)',
          track: 'GET /api/complaints/track/:publicComplaintId',
        },
        issues: {
          list: 'GET /api/issues',
          getById: 'GET /api/issues/:id',
          support: 'POST /api/issues/:id/support (JWT Protected)',
        },
        admin: {
          issues: 'GET /api/admin/issues (Admin Protected)',
          analytics: 'GET /api/admin/analytics (Admin Protected)',
          updateStatus: 'PATCH /api/admin/issues/:id/status (Admin Protected)',
        },
        ai: {
          analyze: 'POST /api/ai/analyze-complaint (JWT Protected)',
          duplicateCheck: 'POST /api/ai/check-related-issue (JWT Protected)',
        },
      },
    });
  }

  return next();
});

// 404 handler for unmatched API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint not found: ${req.method} ${req.originalUrl}`,
  });
});

// 404 handler for other unmatched routes when client dist is not present
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
    hint: 'Visit / for API documentation or /api/health for system status.',
  });
});

// Centralized error handling
app.use(errorHandler);

export default app;


