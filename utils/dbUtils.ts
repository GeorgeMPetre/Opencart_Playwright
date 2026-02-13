// utils/dbUtils.ts
import mysql from 'mysql2/promise';

let connection: mysql.Connection | null = null;

async function getConnection(): Promise<mysql.Connection> {
  if (!connection) {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'opencart_db',
    });
  }
  return connection;
}

export async function resetLoginAttempts(email: string): Promise<void> {
  try {
    const conn = await getConnection();
    
    await conn.execute(
      'DELETE FROM oc_customer_login WHERE email = ?',
      [email]
    );
    
    await conn.execute(
      'UPDATE oc_customer SET status = 1 WHERE email = ?',
      [email]
    );
  } catch (error) {
    console.warn(`Failed to reset login attempts for ${email}:`, error);
  }
}

export async function closeConnection(): Promise<void> {
  if (connection) {
    await connection.end();
    connection = null;
  }
}