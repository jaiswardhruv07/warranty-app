import pool from './database';

export async function testDatabaseConnection(): Promise<void> {
  try {
    const connection = await pool.getConnection();

    await connection.query('SELECT 1');

    connection.release();

    console.log('✓ MySQL database connected');
  } catch (error) {
    console.error('✗ MySQL database connection failed');
    console.error(error);

    throw error;
  }
}