import { kv } from '@vercel/kv';

export default async function handler(req, res){
  let leaderboard = await kv.get('leaderboard') || [];
  leaderboard.sort((a,b)=>b.score - a.score);
  res.json(leaderboard.slice(0, 20));
}