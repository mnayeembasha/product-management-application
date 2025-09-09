import express from "express";
import { addProduct, deleteProduct, editProduct, getProducts } from "../controllers/product.controller";
import { authMiddleware } from "../middleware/authMiddleware";
import { canModifyProduct } from "../middleware/canModifyProduct";
const router = express.Router();

// router.get("/",getProducts);
// router.post("/",authMiddleware,addProduct);
// router.put("/:id",authMiddleware,canModifyProduct,editProduct);
// router.delete("/:id",authMiddleware,canModifyProduct,deleteProduct);

router.get("/",getProducts);
router.post("/",addProduct);
router.put("/:id",editProduct);
router.delete("/:id",deleteProduct);

export default router;


