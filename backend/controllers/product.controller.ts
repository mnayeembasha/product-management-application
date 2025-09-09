import {type Request,type Response} from "express";
import { Product } from "../models/Product";
import { generateSlug } from "../utils/generateSlug";

export const getProducts = async(req:Request,res:Response)=>{
    try {
        const products = await Product.find();
        if(!products){
            res.status(404).json({message:"No products found"});
        }else{
            res.status(200).json({
                message:"Products fetched Successfully",
                products
            });
        }

    } catch (error) {
        console.error("error in getProduct controller",error);
        res.status(500).json({message:"Internal Server Error"});
    }
}
export const addProduct = async (req:Request,res:Response)=>{
    const {name,price,description,category} = req.body;

    if(!name || !price || !description || !category){
        return res.status(400).json({message:"All fields are required"});
    }
    if(price < 0){
        return res.status(400).json({message:"Price cannot be negative"});
    }

    try {
        const addedProduct = await Product.create({
            name,
            price,
            description,
            category,
            slug:generateSlug(name),
            // createdBy:req.user?._id
        });

        if(!addedProduct){
            return res.status(500).json({message:"Failed to add product"});
        }else{
            res.status(201).json({
                message:"Product added successfully",
                product:addedProduct
            });
        }
    } catch (error) {
        console.error("error in add product controller",error);
        res.status(500).json({message:"Internal Server Error"});
    }
}

export const editProduct = async (req:Request,res:Response)=>{
    const productId = req.params.id;

    const {price,description,category} = req.body;
    try {
        const updatedProduct = await Product.findByIdAndUpdate(productId,{
            price,
            description,
            category
        },{new:true});

        console.log("updated product = ",updatedProduct);

        if(!updatedProduct){
            return res.status(404).json({message:"Product not found"});
        }else{
            res.status(200).json({
                message:"Product updated successfully",
                product:updatedProduct
            });
        }
    } catch (error) {
        console.error("error in edit product controller",error);
        res.status(500).json({message:"Internal Server Error"});
    }
}

export const deleteProduct = async (req:Request,res:Response)=>{
    const productId = req.params.id;
    try {
        const deletedProduct = await Product.findByIdAndDelete(productId);
        if(!deletedProduct){
            return res.status(404).json({message:"Product not found"});
        }else{
            res.status(200).json({
                message:"Product deleted successfully",
                product:deletedProduct
            });
        }
    } catch (error) {
        console.error("error in delete product controller",error);
        res.status(500).json({message:"Internal Server Error"});
    }
}