import { Request, Response } from 'express';

import {
  createBatch,
  deleteBatch,
  getAllBatches,
  getBatchById,
  getBatchesByProductId,
  updateBatch
} from '../services/batch.service';

function parseId(value: string): number | null {
  const id = Number(value);

  if (!Number.isInteger(id) || id <= 0) {
    return null;
  }

  return id;
}

export async function createBatchController(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const {
      product_id,
      batch_code,
      manufacturing_date,
      factory,
      production_quantity
    } = req.body;

    const productId = Number(product_id);
    const quantity = Number(production_quantity);

    if (
      !Number.isInteger(productId) ||
      productId <= 0 ||
      !batch_code ||
      !manufacturing_date ||
      !factory ||
      !Number.isInteger(quantity) ||
      quantity <= 0
    ) {
      res.status(400).json({
        status: 'error',
        message:
          'product_id, batch_code, manufacturing_date, factory and a positive production_quantity are required.'
      });

      return;
    }

    const batch = await createBatch({
      product_id: productId,
      batch_code: String(batch_code).trim(),
      manufacturing_date: String(manufacturing_date),
      factory: String(factory).trim(),
      production_quantity: quantity
    });

    res.status(201).json({
      status: 'success',
      data: batch
    });
  } catch (error: any) {
    console.error('Create batch error:', error);

    if (error.code === 'ER_DUP_ENTRY') {
      res.status(409).json({
        status: 'error',
        message: 'A batch with this batch_code already exists.'
      });

      return;
    }

    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      res.status(400).json({
        status: 'error',
        message: 'The specified product does not exist.'
      });

      return;
    }

    res.status(500).json({
      status: 'error',
      message: 'Failed to create batch.'
    });
  }
}

export async function getBatchesController(
  _req: Request,
  res: Response
): Promise<void> {
  try {
    const batches = await getAllBatches();

    res.status(200).json({
      status: 'success',
      count: batches.length,
      data: batches
    });
  } catch (error) {
    console.error('Get batches error:', error);

    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve batches.'
    });
  }
}

export async function getBatchController(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const id = parseId(req.params.id);

    if (!id) {
      res.status(400).json({
        status: 'error',
        message: 'Invalid batch ID.'
      });

      return;
    }

    const batch = await getBatchById(id);

    if (!batch) {
      res.status(404).json({
        status: 'error',
        message: 'Batch not found.'
      });

      return;
    }

    res.status(200).json({
      status: 'success',
      data: batch
    });
  } catch (error) {
    console.error('Get batch error:', error);

    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve batch.'
    });
  }
}

export async function getProductBatchesController(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const productId = parseId(req.params.productId);

    if (!productId) {
      res.status(400).json({
        status: 'error',
        message: 'Invalid product ID.'
      });

      return;
    }

    const batches = await getBatchesByProductId(productId);

    res.status(200).json({
      status: 'success',
      product_id: productId,
      count: batches.length,
      data: batches
    });
  } catch (error) {
    console.error('Get product batches error:', error);

    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve product batches.'
    });
  }
}

export async function updateBatchController(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const id = parseId(req.params.id);

    if (!id) {
      res.status(400).json({
        status: 'error',
        message: 'Invalid batch ID.'
      });

      return;
    }

    const {
      batch_code,
      manufacturing_date,
      factory,
      production_quantity
    } = req.body;

    let quantity: number | undefined;

    if (production_quantity !== undefined) {
      quantity = Number(production_quantity);

      if (!Number.isInteger(quantity) || quantity <= 0) {
        res.status(400).json({
          status: 'error',
          message: 'production_quantity must be a positive integer.'
        });

        return;
      }
    }

    const batch = await updateBatch(id, {
      batch_code:
        batch_code !== undefined
          ? String(batch_code).trim()
          : undefined,

      manufacturing_date:
        manufacturing_date !== undefined
          ? String(manufacturing_date)
          : undefined,

      factory:
        factory !== undefined
          ? String(factory).trim()
          : undefined,

      production_quantity: quantity
    });

    if (!batch) {
      res.status(404).json({
        status: 'error',
        message: 'Batch not found.'
      });

      return;
    }

    res.status(200).json({
      status: 'success',
      data: batch
    });
  } catch (error: any) {
    console.error('Update batch error:', error);

    if (error.code === 'ER_DUP_ENTRY') {
      res.status(409).json({
        status: 'error',
        message: 'A batch with this batch_code already exists.'
      });

      return;
    }

    res.status(500).json({
      status: 'error',
      message: 'Failed to update batch.'
    });
  }
}

export async function deleteBatchController(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const id = parseId(req.params.id);

    if (!id) {
      res.status(400).json({
        status: 'error',
        message: 'Invalid batch ID.'
      });

      return;
    }

    const deleted = await deleteBatch(id);

    if (!deleted) {
      res.status(404).json({
        status: 'error',
        message: 'Batch not found.'
      });

      return;
    }

    res.status(200).json({
      status: 'success',
      message: 'Batch deleted successfully.'
    });
  } catch (error) {
    console.error('Delete batch error:', error);

    res.status(500).json({
      status: 'error',
      message: 'Failed to delete batch.'
    });
  }
}