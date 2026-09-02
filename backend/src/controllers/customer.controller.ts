import { Request, Response } from "express";

import {
  createCustomer,
  deleteCustomer,
  getAllCustomers,
  getCustomerById,
  updateCustomer
} from "../services/customer service";

function parseId(value: string): number | null {
  const id = Number(value);

  if (!Number.isInteger(id) || id <= 0) {
    return null;
  }

  return id;
}

export async function createCustomerController(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const {
      customer_code,
      name,
      email,
      phone,
      address,
      city,
      state,
      country
    } = req.body;

    if (!customer_code || !name) {
      res.status(400).json({
        status: "error",
        message: "customer_code and name are required."
      });

      return;
    }

    const customer = await createCustomer({
      customer_code: String(customer_code).trim(),
      name: String(name).trim(),

      email:
        email !== undefined && email !== null
          ? String(email).trim()
          : undefined,

      phone:
        phone !== undefined && phone !== null
          ? String(phone).trim()
          : undefined,

      address:
        address !== undefined && address !== null
          ? String(address).trim()
          : undefined,

      city:
        city !== undefined && city !== null
          ? String(city).trim()
          : undefined,

      state:
        state !== undefined && state !== null
          ? String(state).trim()
          : undefined,

      country:
        country !== undefined && country !== null
          ? String(country).trim()
          : undefined
    });

    res.status(201).json({
      status: "success",
      data: customer
    });
  } catch (error: any) {
    console.error("Create customer error:", error);

    if (error.code === "ER_DUP_ENTRY") {
      res.status(409).json({
        status: "error",
        message:
          "A customer with this customer_code or email already exists."
      });

      return;
    }

    res.status(500).json({
      status: "error",
      message: "Failed to create customer."
    });
  }
}

export async function getCustomersController(
  _req: Request,
  res: Response
): Promise<void> {
  try {
    const customers = await getAllCustomers();

    res.status(200).json({
      status: "success",
      count: customers.length,
      data: customers
    });
  } catch (error) {
    console.error("Get customers error:", error);

    res.status(500).json({
      status: "error",
      message: "Failed to retrieve customers."
    });
  }
}

export async function getCustomerController(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const id = parseId(req.params.id);

    if (!id) {
      res.status(400).json({
        status: "error",
        message: "Invalid customer ID."
      });

      return;
    }

    const customer = await getCustomerById(id);

    if (!customer) {
      res.status(404).json({
        status: "error",
        message: "Customer not found."
      });

      return;
    }

    res.status(200).json({
      status: "success",
      data: customer
    });
  } catch (error) {
    console.error("Get customer error:", error);

    res.status(500).json({
      status: "error",
      message: "Failed to retrieve customer."
    });
  }
}

export async function updateCustomerController(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const id = parseId(req.params.id);

    if (!id) {
      res.status(400).json({
        status: "error",
        message: "Invalid customer ID."
      });

      return;
    }

    const {
      customer_code,
      name,
      email,
      phone,
      address,
      city,
      state,
      country
    } = req.body;

    const customer = await updateCustomer(id, {
      customer_code:
        customer_code !== undefined
          ? String(customer_code).trim()
          : undefined,

      name: name !== undefined ? String(name).trim() : undefined,

      email:
        email !== undefined
          ? email === null
            ? null
            : String(email).trim()
          : undefined,

      phone:
        phone !== undefined
          ? phone === null
            ? null
            : String(phone).trim()
          : undefined,

      address:
        address !== undefined
          ? address === null
            ? null
            : String(address).trim()
          : undefined,

      city:
        city !== undefined
          ? city === null
            ? null
            : String(city).trim()
          : undefined,

      state:
        state !== undefined
          ? state === null
            ? null
            : String(state).trim()
          : undefined,

      country:
        country !== undefined
          ? country === null
            ? null
            : String(country).trim()
          : undefined
    });

    if (!customer) {
      res.status(404).json({
        status: "error",
        message: "Customer not found."
      });

      return;
    }

    res.status(200).json({
      status: "success",
      data: customer
    });
  } catch (error: any) {
    console.error("Update customer error:", error);

    if (error.code === "ER_DUP_ENTRY") {
      res.status(409).json({
        status: "error",
        message:
          "A customer with this customer_code or email already exists."
      });

      return;
    }

    res.status(500).json({
      status: "error",
      message: "Failed to update customer."
    });
  }
}

export async function deleteCustomerController(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const id = parseId(req.params.id);

    if (!id) {
      res.status(400).json({
        status: "error",
        message: "Invalid customer ID."
      });

      return;
    }

    const deleted = await deleteCustomer(id);

    if (!deleted) {
      res.status(404).json({
        status: "error",
        message: "Customer not found."
      });

      return;
    }

    res.status(200).json({
      status: "success",
      message: "Customer deleted successfully."
    });
  } catch (error) {
    console.error("Delete customer error:", error);

    res.status(500).json({
      status: "error",
      message: "Failed to delete customer."
    });
  }
}