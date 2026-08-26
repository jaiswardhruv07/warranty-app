import express from 'express';
import cors from 'cors';

import pool from './config/database';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', async (_req, res) => {
  try {
    await pool.query('SELECT 1');

    res.status(200).json({
      status: 'ok',
      service: 'warranty-arbiter-api',
      database: 'connected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Health check database error:', error);

    res.status(503).json({
      status: 'error',
      service: 'warranty-arbiter-api',
      database: 'disconnected',
      timestamp: new Date().toISOString()
    });
  }
});

export default app;