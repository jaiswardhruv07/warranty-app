import pool from '../config/database';
import { ResultSetHeader, RowDataPacket } from 'mysql2/promise';

export interface Product {
  id: number;
  product_code: string;
  name: string;
  category: string;
  manufacturer: string;
  warranty_months: number;
  created_at: Date;
  updated_at: Date;
}

export interface CreateProductInput {
  product_code: string;
  name: string;
  category: string;
  manufacturer: string;
  warranty_months: number;
}

export interface UpdateProductInput {
  product_code?: string;
  name?: string;
  category?: string;
  manufacturer?: string;
  warranty_months?: number;
}

interface ProductRow extends RowDataPacket, Product {}

export async function createProduct(
  data: CreateProductInput
): Promise<Product> {
  const [result] = await pool.execute<ResultSetHeader>(
    `
      INSERT INTO products
      (
        product_code,
        name,
        category,
        manufacturer,
        warranty_months
      )
      VALUES (?, ?, ?, ?, ?)
    `,
    [
      data.product_code,
      data.name,
      data.category,
      data.manufacturer,
      data.warranty_months
    ]
  );

  const product = await getProductById(result.insertId);

  if (!product) {
    throw new Error('Product was created but could not be retrieved.');
  }

  return product;
}

export async function getAllProducts(): Promise<Product[]> {
  const [rows] = await pool.execute<ProductRow[]>(
    `
      SELECT
        id,
        product_code,
        name,
        category,
        manufacturer,
        warranty_months,
        created_at,
        updated_at
      FROM products
      ORDER BY created_at DESC
    `
  );

  return rows;
}

export async function getProductById(
  id: number
): Promise<Product | null> {
  const [rows] = await pool.execute<ProductRow[]>(
    `
      SELECT
        id,
        product_code,
        name,
        category,
        manufacturer,
        warranty_months,
        created_at,
        updated_at
      FROM products
      WHERE id = ?
      LIMIT 1
    `,
    [id]
  );

  return rows.length > 0 ? rows[0] : null;
}

export async function updateProduct(
  id: number,
  data: UpdateProductInput
): Promise<Product | null> {
  const fields: string[] = [];
  const values: unknown[] = [];

  if (data.product_code !== undefined) {
    fields.push('product_code = ?');
    values.push(data.product_code);
  }

  if (data.name !== undefined) {
    fields.push('name = ?');
    values.push(data.name);
  }

  if (data.category !== undefined) {
    fields.push('category = ?');
    values.push(data.category);
  }

  if (data.manufacturer !== undefined) {
    fields.push('manufacturer = ?');
    values.push(data.manufacturer);
  }

  if (data.warranty_months !== undefined) {
    fields.push('warranty_months = ?');
    values.push(data.warranty_months);
  }

  if (fields.length === 0) {
    return getProductById(id);
  }

  values.push(id);

  await pool.execute<ResultSetHeader>(
    `
      UPDATE products
      SET ${fields.join(', ')}
      WHERE id = ?
    `,
    values
  );

  return getProductById(id);
}

export async function deleteProduct(id: number): Promise<boolean> {
  const [result] = await pool.execute<ResultSetHeader>(
    `
      DELETE FROM products
      WHERE id = ?
    `,
    [id]
  );

  return result.affectedRows > 0;
}