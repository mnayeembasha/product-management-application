import { type Request, type Response, type NextFunction } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "../config";
import { User } from "../models/User";
import { Product } from "../models/Product";

interface CustomJWTPayload extends JwtPayload {
    userId: string;
}

export const canModifyProduct = async (req: Request, res: Response, next: NextFunction) => {
    const productId = req.params.id;
    try {
        const userId = req.user?._id;
        const product = await Product.findById(productId);
        if(product){
            if(product.createdBy?.toString() !== userId.toString()){
                return res.status(403).json({message:"You are not authorized to modify this product"});
            }
            next();
        }else{
            return res.status(404).json({message:"Product not found"});
        }

    } catch (error) {
        console.error("Error in auth middleware", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};