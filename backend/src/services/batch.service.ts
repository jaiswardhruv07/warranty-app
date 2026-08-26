import pool from '../config/database';
import { ResultSetHeader, RowDataPacket } from 'mysql2/promise';

export interface Batch {
  id: number;
  product_id: number;
  batch_code: string;
  manufacturing_date: string;
  factory: string;
  production_quantity: number;
  created_at: Date;
  updated_at: Date;
}

export interface CreateBatchInput {
  product_id: number;
  batch_code: string;
  manufacturing_date: string;
  factory: string;
  production_quantity: number;
}

export interface UpdateBatchInput {
  batch_code?: string;
  manufacturing_date?: string;
  factory?: string;
  production_quantity?: number;
}

interface BatchRow extends RowDataPacket, Batch {}

export async function createBatch(
  data: CreateBatchInput
): Promise<Batch> {
  const [result] = await pool.execute<ResultSetHeader>(
    `
      INSERT INTO batches
      (
        product_id,
        batch_code,
        manufacturing_date,
        factory,
        production_quantity
      )
      VALUES (?, ?, ?, ?, ?)
    `,
    [
      data.product_id,
      data.batch_code,
      data.manufacturing_date,
      data.factory,
      data.production_quantity
    ]
  );

  const batch = await getBatchById(result.insertId);

  if (!batch) {
    throw new Error('Batch was created but could not be retrieved.');
  }

  return batch;
}

export async function getAllBatches(): Promise<Batch[]> {
  const [rows] = await pool.execute<BatchRow[]>(
    `
      SELECT
        id,
        product_id,
        batch_code,
        manufacturing_date,
        factory,
        production_quantity,
        created_at,
        updated_at
      FROM batches
      ORDER BY manufacturing_date DESC, id DESC
    `
  );

  return rows;
}

export async function getBatchById(
  id: number
): Promise<Batch | null> {
  const [rows] = await pool.execute<BatchRow[]>(
    `
      SELECT
        id,
        product_id,
        batch_code,
        manufacturing_date,
        factory,
        production_quantity,
        created_at,
        updated_at
      FROM batches
      WHERE id = ?
      LIMIT 1
    `,
    [id]
  );

  return rows.length > 0 ? rows[0] : null;
}

export async function getBatchesByProductId(
  productId: number
): Promise<Batch[]> {
  const [rows] = await pool.execute<BatchRow[]>(
    `
      SELECT
        id,
        product_id,
        batch_code,
        manufacturing_date,
        factory,
        production_quantity,
        created_at,
        updated_at
      FROM batches
      WHERE product_id = ?
      ORDER BY manufacturing_date DESC, id DESC
    `,
    [productId]
  );

  return rows;
}

export async function updateBatch(
  id: number,
  data: UpdateBatchInput
): Promise<Batch | null> {
  const fields: string[] = [];
  const values: unknown[] = [];

  if (data.batch_code !== undefined) {
    fields.push('batch_code = ?');
    values.push(data.batch_code);
  }

  if (data.manufacturing_date !== undefined) {
    fields.push('manufacturing_date = ?');
    values.push(data.manufacturing_date);
  }

  if (data.factory !== undefined) {
    fields.push('factory = ?');
    values.push(data.factory);
  }

  if (data.production_quantity !== undefined) {
    fields.push('production_quantity = ?');
    values.push(data.production_quantity);
  }

  if (fields.length === 0) {
    return getBatchById(id);
  }

  values.push(id);

  await pool.execute<ResultSetHeader>(
    `
      UPDATE batches
      SET ${fields.join(', ')}
      WHERE id = ?
    `,
    values
  );

  return getBatchById(id);
}

export async function deleteBatch(id: number): Promise<boolean> {
  const [result] = await pool.execute<ResultSetHeader>(
    `
      DELETE FROM batches
      WHERE id = ?
    `,
    [id]
  );

  return result.affectedRows > 0;
}