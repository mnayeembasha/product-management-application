import express from "express";
import { addProduct, deleteProduct, editProduct, getProducts } from "../controllers/product.controller";
const router = express.Router();

router.get("/",getProducts);
router.post("/",addProduct);
router.put("/:id",editProduct);
router.delete("/:id",deleteProduct);

export default router;


