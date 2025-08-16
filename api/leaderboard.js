
let leaderboard = global.leaderboard || [];
global.leaderboard = leaderboard;

export default async function handler(req, res){
  leaderboard.sort((a,b)=>b.score - a.score);
  res.json(leaderboard.slice(0, 20));
}
