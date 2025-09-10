import express from "express";
import { addProduct, deleteProduct, editProduct, getProducts, getMyProducts } from "../controllers/product.controller";
import { authMiddleware } from "../middleware/authMiddleware";
import { canModifyProduct } from "../middleware/canModifyProduct";
import { zodValidate } from "../middleware/zodValidate";
import { addProductZodSchema, editProductZodSchema, filterQueryZodSchema } from "../validate/zodSchema";
const router = express.Router();

router.get("/",zodValidate(filterQueryZodSchema,false,true),getProducts);
router.get("/my", authMiddleware, getMyProducts);
router.post("/",zodValidate(addProductZodSchema),authMiddleware,addProduct);
router.put("/:id",zodValidate(editProductZodSchema),authMiddleware,canModifyProduct,editProduct);
router.delete("/:id",authMiddleware,canModifyProduct,deleteProduct);

export default router;