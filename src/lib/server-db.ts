'use server';
/**
 * @fileOverview PostgreSQL Telemetry Engine (Layer 3)
 * Handles persistence for local LLM insights with resilient connection handling.
 */
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@127.0.0.1:5432/telemetry_db',
  connectionTimeoutMillis: 5000,
});

pool.on('error', (err) => {
  console.error('[DB] Unexpected error on idle client:', err.message);
});

export async function initDatabase() {
  let client;
  try {
    client = await pool.connect();
    await client.query(`
      CREATE TABLE IF NOT EXISTS telemetry_logs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        machine_id TEXT NOT NULL,
        model_name TEXT NOT NULL,
        prompt_tokens INTEGER,
        completion_tokens INTEGER,
        insight_json JSONB NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('[DB] Telemetry schema verified.');
    return { success: true };
  } catch (error: any) {
    console.error('[DB] Schema init failed:', error.message);
    return { success: false, error: error.message };
  } finally {
    if (client) client.release();
  }
}

export async function saveTelemetry(payload: any) {
  const { machine_id, model_name, prompt_tokens, completion_tokens, insight_json } = payload;
  let client;
  try {
    client = await pool.connect();
    const result = await client.query(
      'INSERT INTO telemetry_logs (machine_id, model_name, prompt_tokens, completion_tokens, insight_json) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      [machine_id, model_name, prompt_tokens, completion_tokens, insight_json]
    );
    return { success: true, id: result.rows[0].id };
  } catch (error: any) {
    return { success: false, error: error.message };
  } finally {
    if (client) client.release();
  }
}

export async function getHealthStatus() {
  let client;
  try {
    client = await pool.connect();
    const res = await client.query('SELECT NOW() as time');
    return { status: 'healthy', database: 'connected', time: res.rows[0].time };
  } catch (e: any) {
    return { status: 'degraded', database: 'disconnected', error: e.message };
  } finally {
    if (client) client.release();
  }
}
