
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
  const { fid, score, username } = req.body || {};
  if (typeof fid !== 'number' || typeof score !== 'number' || !username || typeof username !== 'string') {
    return res.status(400).json({ ok: false, error: 'Invalid payload' });
  }
  let data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  
  const playerIndex = data.findIndex(p => p.fid === fid);

  if (playerIndex !== -1) {
    // Player exists, update username and update score only if it's higher
    data[playerIndex].username = username;
    data[playerIndex].score = Math.max(data[playerIndex].score, score);
  } else {
    // New player, add to leaderboard
    data.push({ fid, username, score });
  }
  
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
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
