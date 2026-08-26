import { Router } from 'express';

import {
  createBatchController,
  deleteBatchController,
  getBatchController,
  getBatchesController,
  getProductBatchesController,
  updateBatchController
} from '../controllers/batch.controller';

const router = Router();

router.post('/', createBatchController);

router.get('/', getBatchesController);

router.get('/product/:productId', getProductBatchesController);

router.get('/:id', getBatchController);

router.put('/:id', updateBatchController);

router.delete('/:id', deleteBatchController);

export default router;