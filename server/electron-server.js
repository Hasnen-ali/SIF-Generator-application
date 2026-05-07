/**
 * SIF Generator - Electron-embedded Express Server
 *
 * This version:
 * - Uses mongodb-memory-server (no external MongoDB needed)
 * - Serves the React production build as static files
 * - Saves generated files to the Electron userData directory
 */

require('express-async-errors');

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const sifRoutes = require('./routes/sifRoutes');
const errorMiddleware = require('./middleware/errorMiddleware');

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Resolve generated-files directory ───────────────────────────────────────
// In Electron mode, use the userData path passed from main process
const generatedFilesDir = process.env.GENERATED_FILES_DIR
  || path.join(__dirname, 'generated-files');

if (!fs.existsSync(generatedFilesDir)) {
  fs.mkdirSync(generatedFilesDir, { recursive: true });
}

// Make it available globally so controllers can use it
process.env.GENERATED_FILES_DIR = generatedFilesDir;

// ─── Start embedded MongoDB and then Express ──────────────────────────────────
async function startApp() {
  try {
    // Start in-memory MongoDB
    const mongod = await MongoMemoryServer.create();
    const mongoUri = mongod.getUri();

    await mongoose.connect(mongoUri);
    console.log('✅ Embedded MongoDB connected');

    // ── Middleware ──────────────────────────────────────────────────────────
    app.use(cors({ origin: '*' }));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // ── Serve generated SIF files ───────────────────────────────────────────
    app.use('/generated-files', express.static(generatedFilesDir));

    // ── API Routes ──────────────────────────────────────────────────────────
    app.use('/api', sifRoutes);

    // ── Serve React production build ────────────────────────────────────────
    const clientBuild = process.env.CLIENT_BUILD_DIR
      || path.join(__dirname, '..', 'client', 'build');
    app.use(express.static(clientBuild));

    // Health check
    app.get('/health', (req, res) => {
      res.json({ status: 'OK', timestamp: new Date().toISOString() });
    });

    // All other routes → React app
    app.get('*', (req, res) => {
      res.sendFile(path.join(clientBuild, 'index.html'));
    });

    // ── Error middleware ────────────────────────────────────────────────────
    app.use(errorMiddleware);

    // ── Start listening ─────────────────────────────────────────────────────
    app.listen(PORT, () => {
      console.log(`✅ SIF Generator server running on http://localhost:${PORT}`);
    });

  } catch (err) {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  }
}

startApp();
