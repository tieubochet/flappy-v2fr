import Redis from 'ioredis';

// Create a new Redis instance.
// The connection string is automatically read from the REDIS_URL environment variable.
const redis = new Redis(process.env.REDIS_URL);

export default async function handler(req, res) {
  try {
    const leaderboardRaw = await redis.get('leaderboard');
    let leaderboard = leaderboardRaw ? JSON.parse(leaderboardRaw) : [];
    
    leaderboard.sort((a, b) => b.score - a.score);
    
    // It's good practice to disconnect after the operation in serverless environments
    redis.quit();

    res.json(leaderboard.slice(0, 20));
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    // Ensure redis connection is closed in case of an error
    if (redis.status === 'ready') {
      redis.quit();
    }
    res.status(500).json({ ok: false, error: 'Failed to fetch leaderboard' });
  }
}