import { Request, Response } from 'express';

import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  updateProduct
} from '../services/product.services'

function parseId(value: string): number | null {
  const id = Number(value);

  if (!Number.isInteger(id) || id <= 0) {
    return null;
  }

  return id;
}

export async function createProductController(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const {
      product_code,
      name,
      category,
      manufacturer,
      warranty_months
    } = req.body;

    if (
      !product_code ||
      !name ||
      !category ||
      !manufacturer ||
      warranty_months === undefined
    ) {
      res.status(400).json({
        status: 'error',
        message:
          'product_code, name, category, manufacturer and warranty_months are required.'
      });

      return;
    }

    const warrantyMonths = Number(warranty_months);

    if (!Number.isInteger(warrantyMonths) || warrantyMonths < 0) {
      res.status(400).json({
        status: 'error',
        message: 'warranty_months must be a non-negative integer.'
      });

      return;
    }

    const product = await createProduct({
      product_code: String(product_code).trim(),
      name: String(name).trim(),
      category: String(category).trim(),
      manufacturer: String(manufacturer).trim(),
      warranty_months: warrantyMonths
    });

    res.status(201).json({
      status: 'success',
      data: product
    });
  } catch (error: any) {
    console.error('Create product error:', error);

    if (error.code === 'ER_DUP_ENTRY') {
      res.status(409).json({
        status: 'error',
        message: 'A product with this product_code already exists.'
      });

      return;
    }

    res.status(500).json({
      status: 'error',
      message: 'Failed to create product.'
    });
  }
}

export async function getProductsController(
  _req: Request,
  res: Response
): Promise<void> {
  try {
    const products = await getAllProducts();

    res.status(200).json({
      status: 'success',
      count: products.length,
      data: products
    });
  } catch (error) {
    console.error('Get products error:', error);

    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve products.'
    });
  }
}

export async function getProductController(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const id = parseId(req.params.id);

    if (!id) {
      res.status(400).json({
        status: 'error',
        message: 'Invalid product ID.'
      });

      return;
    }

    const product = await getProductById(id);

    if (!product) {
      res.status(404).json({
        status: 'error',
        message: 'Product not found.'
      });

      return;
    }

    res.status(200).json({
      status: 'success',
      data: product
    });
  } catch (error) {
    console.error('Get product error:', error);

    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve product.'
    });
  }
}

export async function updateProductController(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const id = parseId(req.params.id);

    if (!id) {
      res.status(400).json({
        status: 'error',
        message: 'Invalid product ID.'
      });

      return;
    }

    const {
      product_code,
      name,
      category,
      manufacturer,
      warranty_months
    } = req.body;

    if (warranty_months !== undefined) {
      const warrantyMonths = Number(warranty_months);

      if (!Number.isInteger(warrantyMonths) || warrantyMonths < 0) {
        res.status(400).json({
          status: 'error',
          message: 'warranty_months must be a non-negative integer.'
        });

        return;
      }
    }

    const product = await updateProduct(id, {
      product_code:
        product_code !== undefined
          ? String(product_code).trim()
          : undefined,

      name:
        name !== undefined
          ? String(name).trim()
          : undefined,

      category:
        category !== undefined
          ? String(category).trim()
          : undefined,

      manufacturer:
        manufacturer !== undefined
          ? String(manufacturer).trim()
          : undefined,

      warranty_months:
        warranty_months !== undefined
          ? Number(warranty_months)
          : undefined
    });

    if (!product) {
      res.status(404).json({
        status: 'error',
        message: 'Product not found.'
      });

      return;
    }

    res.status(200).json({
      status: 'success',
      data: product
    });
  } catch (error: any) {
    console.error('Update product error:', error);

    if (error.code === 'ER_DUP_ENTRY') {
      res.status(409).json({
        status: 'error',
        message: 'A product with this product_code already exists.'
      });

      return;
    }

    res.status(500).json({
      status: 'error',
      message: 'Failed to update product.'
    });
  }
}

export async function deleteProductController(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const id = parseId(req.params.id);

    if (!id) {
      res.status(400).json({
        status: 'error',
        message: 'Invalid product ID.'
      });

      return;
    }

    const deleted = await deleteProduct(id);

    if (!deleted) {
      res.status(404).json({
        status: 'error',
        message: 'Product not found.'
      });

      return;
    }

    res.status(200).json({
      status: 'success',
      message: 'Product deleted successfully.'
    });
  } catch (error) {
    console.error('Delete product error:', error);

    res.status(500).json({
      status: 'error',
      message: 'Failed to delete product.'
    });
  }
}
