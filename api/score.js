import Redis from 'ioredis';

// Create a new Redis instance.
// The connection string is automatically read from the REDIS_URL environment variable.
const redis = new Redis(process.env.REDIS_URL);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    redis.quit();
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  try {
    const { fid, score } = req.body || {};
    if (typeof fid !== 'number' || typeof score !== 'number') {
      redis.quit();
      return res.status(400).json({ ok: false, error: 'Invalid payload' });
    }

    const leaderboardRaw = await redis.get('leaderboard');
    let leaderboard = leaderboardRaw ? JSON.parse(leaderboardRaw) : [];

    const playerIndex = leaderboard.findIndex(p => p.fid === fid);

    if (playerIndex !== -1) {
      // Player exists, update score only if it's higher
      leaderboard[playerIndex].score = Math.max(leaderboard[playerIndex].score, score);
    } else {
      // New player, add to leaderboard
      leaderboard.push({ fid, score });
    }

    await redis.set('leaderboard', JSON.stringify(leaderboard));

    // It's good practice to disconnect after the operation in serverless environments
    redis.quit();
    
    res.json({ ok: true });
  } catch (e) {
    console.error('Error updating score:', e);
    // Ensure redis connection is closed in case of an error
    if (redis.status === 'ready') {
      redis.quit();
    }
    res.status(500).json({ ok: false, error: e.message });
  }
}