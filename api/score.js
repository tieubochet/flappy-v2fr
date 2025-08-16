
let leaderboard = global.leaderboard || [];
global.leaderboard = leaderboard;

export default async function handler(req, res){
  if (req.method !== 'POST') return res.status(405).json({ ok:false, error:'Method not allowed' });
  try {
    const { fid, score } = req.body || {};
    if (typeof fid !== 'number' || typeof score !== 'number') {
      return res.status(400).json({ ok:false, error:'Invalid payload'});
    }
    const idx = leaderboard.findIndex(x=>x.fid===fid);
    if (idx === -1) leaderboard.push({ fid, score });
    else leaderboard[idx].score = Math.max(leaderboard[idx].score, score);
    res.json({ ok:true });
  } catch (e) {
    res.status(500).json({ ok:false, error: e.message });
  }
}
