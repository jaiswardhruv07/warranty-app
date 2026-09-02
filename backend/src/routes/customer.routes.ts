import { Router } from "express";

import {
  createCustomerController,
  deleteCustomerController,
  getCustomerController,
  getCustomersController,
  updateCustomerController
} from "../controllers/customer.controller";

const router = Router();

router.post("/", createCustomerController);

router.get("/", getCustomersController);

router.get("/:id", getCustomerController);

router.put("/:id", updateCustomerController);

router.delete("/:id", deleteCustomerController);

export default router;