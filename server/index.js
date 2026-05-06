/**
 * SIF Generator - Express Server Entry Point
 */

require('dotenv').config();
require('express-async-errors'); // Enables async error handling without try/catch

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const connectDB = require('./config/db');
const sifRoutes = require('./routes/sifRoutes');
const errorMiddleware = require('./middleware/errorMiddleware');

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Ensure generated-files directory exists ─────────────────────────────────
const generatedFilesDir = path.join(__dirname, 'generated-files');
if (!fs.existsSync(generatedFilesDir)) {
  fs.mkdirSync(generatedFilesDir, { recursive: true });
}

// ─── Connect to MongoDB ───────────────────────────────────────────────────────
connectDB();

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Serve generated SIF files as static assets ──────────────────────────────
app.use('/generated-files', express.static(generatedFilesDir));

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api', sifRoutes);

// ─── Health check ─────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// ─── Centralized Error Middleware ─────────────────────────────────────────────
app.use(errorMiddleware);

// ─── Start Server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅ SIF Generator server running on http://localhost:${PORT}`);
});
