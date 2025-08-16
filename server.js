
import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// Simple JSON file storage for local/demo deploys
const dbPath = path.join(__dirname, 'db.json');
if(!fs.existsSync(dbPath)) fs.writeFileSync(dbPath, '[]');

app.post('/api/score', (req, res) => {
  const { fid, score } = req.body || {};
  if (typeof fid !== 'number' || typeof score !== 'number') {
    return res.status(400).json({ ok: false, error: 'Invalid payload' });
  }
  let data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  // Keep highest score per fid
  const existing = data.find(x => x.fid === fid);
  if (!existing || score > existing.score) {
    if (existing) existing.score = score;
    else data.push({ fid, score });
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
  }
  res.json({ ok: true });
});

app.get('/api/leaderboard', (req, res) => {
  let data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  data.sort((a,b) => b.score - a.score);
  res.json(data.slice(0, 20));
});

app.use(express.static(path.join(__dirname, 'public')));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
