import {type Request,type Response} from "express";
import { Product, type ProductType } from "../models/Product";
import { generateSlug } from "../utils/generateSlug";
import cloudinary from "../lib/cloudinary";
import redisClient from "../lib/redisClient";
import { clearProductCache } from "../utils/clearCache";

export const getProducts = async(req:Request,res:Response) => {
    try {
        const { sort, category, search } = req.query as { sort?: string, category?: string, search?: string };
        let query: any = {};
        if (category && category !== 'all') {
            query.category = category;
        }
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }
        let sortOption: any = { createdAt: 1 };
        if (sort === 'price_asc') {
            sortOption = { price: 1 };
        } else if (sort === 'price_desc') {
            sortOption = { price: -1 };
        } else if(sort === "latest"){
            sortOption = {createdAt:-1}
        }

        const cacheKey = `products:${JSON.stringify(query)}:sort:${JSON.stringify(sortOption)}`;
        const cachedData = await redisClient.get(cacheKey);
        if(cachedData){
            return res.status(200).json({
                message:"Products fetched Successfully",
                source:"cache",
                products:JSON.parse(cachedData)
            })
        }

        // query db if not present in cache

        const products = await Product.find(query).sort(sortOption);

        //save in redis and track key
        await redisClient.setEx(cacheKey,60,JSON.stringify(products)); //60s
        await redisClient.sAdd("product:cacheKeys",cacheKey);

        res.status(200).json({
            message: "Products fetched Successfully",
            source:"db",
            products
        });
    } catch (error) {
        console.error("error in getProduct controller",error);
        res.status(500).json({message:"Internal Server Error"});
    }
}

export const getMyProducts = async(req:Request,res:Response) => {
    try {
        const products = await Product.find({ createdBy: req.user?._id });
        res.status(200).json({
            message: "My products fetched Successfully",
            products
        });
    } catch (error) {
        console.error("error in getMyProducts controller",error);
        res.status(500).json({message:"Internal Server Error"});
    }
}

export const addProduct = async (req:Request,res:Response)=>{
    const {name,price,description,category} = req.body;
    let image = req.body.image as string | undefined;
    try {
        let imageUrl = "";
        let imagePublicId = "";

        if (image && image.startsWith('data:image/')) {
        // Extract base64 data
        const base64Data = image.split(';base64,').pop() || '';
        const buffer = Buffer.from(base64Data, 'base64');

        // Check image size (5MB limit)
        if (buffer.length > 5 * 1024 * 1024) {
          return res.status(400).json({ message: 'Image size exceeds 5MB' });
        }

        // Upload to Cloudinary
        const uploadResult = await cloudinary.uploader.upload(image, {
          resource_type: 'image',
          folder: 'prodManager',
        });
        imageUrl = uploadResult.secure_url;
        imagePublicId = uploadResult.public_id;
      }

        const addedProduct = await Product.create({
            name,
            price,
            description,
            category,
            image:imageUrl,
            imagePublicId:imagePublicId,
            slug:generateSlug(name),
            createdBy:req.user?._id
        });

        if(!addedProduct){
            return res.status(500).json({message:"Failed to add product"});
        }else{
            await clearProductCache();
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

export const editProduct = async (req: Request, res: Response) => {
  const productId = req.params.id;
  const { price, description, category, image } = req.body;

  try {

    const existingProduct = await Product.findById(productId);
    if (!existingProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const updateData: Partial<ProductType> = {
      price,
      description,
      category,
    };

    if (image && image.startsWith('data:image/')) {
      const base64Data = image.split(';base64,').pop() || '';
      const buffer = Buffer.from(base64Data, 'base64');

      if (buffer.length > 5 * 1024 * 1024) {
        return res.status(400).json({ message: 'Image size exceeds 5MB' });
      }

      // Delete old image from Cloudinary if it exists
      if (existingProduct.imagePublicId) {
        try {
          await cloudinary.uploader.destroy(existingProduct.imagePublicId);
          console.log('Old image deleted from Cloudinary:', existingProduct.imagePublicId);
        } catch (deleteError) {
          console.error('Error deleting old image from Cloudinary:', deleteError);
        }
      }


      const uploadResult = await cloudinary.uploader.upload(image, {
        resource_type: 'image',
        folder: 'prodManager',
      });
      updateData.image = uploadResult.secure_url;
      updateData.imagePublicId = uploadResult.public_id; // Update with new public ID
    }

    const updatedProduct = await Product.findByIdAndUpdate(productId, updateData, { new: true });

    console.log('updated product = ', updatedProduct);

    await clearProductCache();

    res.status(200).json({
      message: 'Product updated successfully',
      product: updatedProduct,
    });
  } catch (error) {
    console.error('error in edit product controller', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const deleteProduct = async (req:Request,res:Response)=>{
    const productId = req.params.id;
    try {
        const deletedProduct = await Product.findByIdAndDelete(productId);
        if(!deletedProduct){
            return res.status(404).json({message:"Product not found"});
        }else{
            if (deletedProduct.imagePublicId) {
                try {
                    await cloudinary.uploader.destroy(deletedProduct.imagePublicId);
                    console.log('Image deleted from Cloudinary:', deletedProduct.imagePublicId);
                } catch (deleteError) {
                    console.error('Error deleting image from Cloudinary:', deleteError);
                }
            }

            await clearProductCache();
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