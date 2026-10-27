import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GemmaArchiveService } from './server/gemmaService.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

const gemmaService = new GemmaArchiveService();

// Engine status endpoint
app.get('/api/engine/status', (_req, res) => {
  try {
    const status = gemmaService.getStatus();
    res.json(status);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// Summon the Ghost endpoint
app.post('/api/archive/ghost', async (req, res) => {
  try {
    const { project, question, persona } = req.body;
    if (!project || !question) {
      return res.status(400).json({ error: 'Missing required project or question payload' });
    }
    const ghostMessage = await gemmaService.summonGhost({ project, question, persona });
    res.json(ghostMessage);
  } catch (error) {
    console.error('Ghost invocation error:', error);
    res.status(500).json({ error: (error as Error).message });
  }
});

// Resurrection Report endpoint
app.post('/api/archive/resurrect', async (req, res) => {
  try {
    const { project } = req.body;
    if (!project) {
      return res.status(400).json({ error: 'Missing required project payload' });
    }
    const report = await gemmaService.generateResurrectionReport(project);
    res.json(report);
  } catch (error) {
    console.error('Resurrection report error:', error);
    res.status(500).json({ error: (error as Error).message });
  }
});

// Ingestion parser endpoint
app.post('/api/archive/parse-file', (req, res) => {
  try {
    const { filename, content } = req.body;
    if (!filename || content === undefined) {
      return res.status(400).json({ error: 'Missing filename or content' });
    }

    const lines = content.split('\n');
    const obsoleteList: string[] = [];

    const lower = content.toLowerCase();
    if (lower.includes('md5')) obsoleteList.push('MD5 Insecure Hashing');
    if (lower.includes('select(') || lower.includes('fd_set')) obsoleteList.push('select(2) Socket Multiplexing');
    if (lower.includes('python 2') || lower.includes('urllib.urlopen') || lower.includes('bsddb')) obsoleteList.push('Python 2.x Legacy Runtime & BSDDB');
    if (lower.includes('strcpy(') || lower.includes('gets(')) obsoleteList.push('Unbounded C Buffer Copy (strcpy/gets)');
    if (lower.includes('xor-cbc') || lower.includes('des') || lower.includes('rc4')) obsoleteList.push('Legacy Cipher (XOR / DES / RC4)');
    if (lower.includes('nasm') && lower.includes('32-bit')) obsoleteList.push('32-Bit x86 Real/Protected Mode');

    const result = {
      filename,
      title: filename.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ').toUpperCase(),
      lineCount: lines.length,
      detectedObsolete: obsoleteList,
      language: filename.endsWith('.md') ? 'markdown' : filename.endsWith('.c') || filename.endsWith('.h') ? 'c' : filename.endsWith('.py') ? 'python' : 'plaintext',
    };

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true, hmr: process.env.DISABLE_HMR !== 'true' },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Archive Afterlife] Ghost in the Machine server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
