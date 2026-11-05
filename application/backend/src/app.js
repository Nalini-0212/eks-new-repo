const express = require('express');
const { Pool } = require('pg');

const app = express();

app.use(express.json({ limit: '16kb' }));

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 5000
});

const init = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS tasks (
      id SERIAL PRIMARY KEY,
      title VARCHAR(120) NOT NULL,
      status VARCHAR(20) NOT NULL DEFAULT 'pending',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      processed_at TIMESTAMPTZ
    )
  `);
};

app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'backend'
  });
});

app.get('/ready', async (_req, res) => {
  try {
    await pool.query('SELECT 1');

    return res.json({
      status: 'ready'
    });
  } catch (error) {
    console.error('Readiness check failed', error);

    return res.status(503).json({
      status: 'not ready'
    });
  }
});

app.get('/api/tasks', async (_req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM tasks ORDER BY id DESC LIMIT 100'
    );

    res.json(rows);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: 'Database unavailable'
    });
  }
});

app.post('/api/tasks', async (req, res) => {
  const title = req.body?.title;

  if (
    typeof title !== 'string' ||
    !title.trim() ||
    title.trim().length > 120
  ) {
    return res.status(400).json({
      error: 'Title must be 1-120 characters'
    });
  }

  try {
    const { rows } = await pool.query(
      'INSERT INTO tasks(title) VALUES($1) RETURNING *',
      [title.trim()]
    );

    res.status(201).json(rows[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: 'Could not create task'
    });
  }
});

const port = Number(process.env.PORT || 3000);

/*
 * IMPORTANT:
 * Start HTTP server first.
 * Database initialization happens in background.
 */
app.listen(port, '0.0.0.0', async () => {
  console.log(`Backend listening on ${port}`);

  try {
    await init();
    console.log('Database initialized');
  } catch (error) {
    console.error('Database initialization failed', error);
  }
});

process.on('SIGTERM', async () => {
  await pool.end();
  process.exit(0);
});
