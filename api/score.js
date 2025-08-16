import { kv } from '@vercel/kv';

export default async function handler(req, res){
  if (req.method !== 'POST') {
    return res.status(405).json({ ok:false, error:'Method not allowed' });
  }

  try {
    const { fid, score } = req.body || {};
    if (typeof fid !== 'number' || typeof score !== 'number') {
      return res.status(400).json({ ok:false, error:'Invalid payload'});
    }

    let leaderboard = await kv.get('leaderboard') || [];
    const playerIndex = leaderboard.findIndex(p => p.fid === fid);

    if (playerIndex !== -1) {
      // Player exists, update score only if it's higher
      leaderboard[playerIndex].score = Math.max(leaderboard[playerIndex].score, score);
    } else {
      // New player, add to leaderboard
      leaderboard.push({ fid, score });
    }

    await kv.set('leaderboard', leaderboard);
    
    res.json({ ok:true });
  } catch (e) {
    res.status(500).json({ ok:false, error: e.message });
  }
}