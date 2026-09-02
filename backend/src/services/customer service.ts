import pool from "../config/database";
import { ResultSetHeader, RowDataPacket } from "mysql2/promise";

export interface Customer {
  id: number;
  customer_code: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface CreateCustomerInput {
  customer_code: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
}

export interface UpdateCustomerInput {
  customer_code?: string;
  name?: string;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
}

interface CustomerRow extends RowDataPacket, Customer {}

export async function createCustomer(
  data: CreateCustomerInput
): Promise<Customer> {
  const [result] = await pool.execute<ResultSetHeader>(
    `
      INSERT INTO customers
      (
        customer_code,
        name,
        email,
        phone,
        address,
        city,
        state,
        country
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      data.customer_code,
      data.name,
      data.email ?? null,
      data.phone ?? null,
      data.address ?? null,
      data.city ?? null,
      data.state ?? null,
      data.country ?? null
    ]
  );

  const customer = await getCustomerById(result.insertId);

  if (!customer) {
    throw new Error("Customer was created but could not be retrieved.");
  }

  return customer;
}

export async function getAllCustomers(): Promise<Customer[]> {
  const [rows] = await pool.execute<CustomerRow[]>(
    `
      SELECT
        id,
        customer_code,
        name,
        email,
        phone,
        address,
        city,
        state,
        country,
        created_at,
        updated_at
      FROM customers
      ORDER BY created_at DESC
    `
  );

  return rows;
}

export async function getCustomerById(
  id: number
): Promise<Customer | null> {
  const [rows] = await pool.execute<CustomerRow[]>(
    `
      SELECT
        id,
        customer_code,
        name,
        email,
        phone,
        address,
        city,
        state,
        country,
        created_at,
        updated_at
      FROM customers
      WHERE id = ?
      LIMIT 1
    `,
    [id]
  );

  return rows.length > 0 ? rows[0] : null;
}

export async function updateCustomer(
  id: number,
  data: UpdateCustomerInput
): Promise<Customer | null> {
  const fields: string[] = [];
  const values: unknown[] = [];

  if (data.customer_code !== undefined) {
    fields.push("customer_code = ?");
    values.push(data.customer_code);
  }

  if (data.name !== undefined) {
    fields.push("name = ?");
    values.push(data.name);
  }

  if (data.email !== undefined) {
    fields.push("email = ?");
    values.push(data.email);
  }

  if (data.phone !== undefined) {
    fields.push("phone = ?");
    values.push(data.phone);
  }

  if (data.address !== undefined) {
    fields.push("address = ?");
    values.push(data.address);
  }

  if (data.city !== undefined) {
    fields.push("city = ?");
    values.push(data.city);
  }

  if (data.state !== undefined) {
    fields.push("state = ?");
    values.push(data.state);
  }

  if (data.country !== undefined) {
    fields.push("country = ?");
    values.push(data.country);
  }

  if (fields.length === 0) {
    return getCustomerById(id);
  }

  values.push(id);

  await pool.execute<ResultSetHeader>(
    `
      UPDATE customers
      SET ${fields.join(", ")}
      WHERE id = ?
    `,
    values
  );

  return getCustomerById(id);
}

export async function deleteCustomer(id: number): Promise<boolean> {
  const [result] = await pool.execute<ResultSetHeader>(
    `
      DELETE FROM customers
      WHERE id = ?
    `,
    [id]
  );

  return result.affectedRows > 0;
}