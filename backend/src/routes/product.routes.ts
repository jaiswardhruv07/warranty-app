import { Router } from 'express';

import {
  createProductController,
  deleteProductController,
  getProductController,
  getProductsController,
  updateProductController
} from '../controllers/product.controller';

const router = Router();

router.post('/', createProductController);

router.get('/', getProductsController);

router.get('/:id', getProductController);

router.put('/:id', updateProductController);

router.delete('/:id', deleteProductController);

export default router;
