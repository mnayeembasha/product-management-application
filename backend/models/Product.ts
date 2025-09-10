import mongoose from "mongoose";

export type ProductType = {
    name:string;
    price:number;
    description:string;
    category:string;
    slug:string;
    image?:string;
    imagePublicId?:string; // Added field to store Cloudinary public ID
    createdAt?:Date;
    updatedAt?:Date;
    createdBy?:string;
}

export const CATEGORIES = [
    "electronics",
    "fashion",
    "wearables",
    "home-and-living",
    "sports-and-outdoors",
    "toys-and-games",
    "health-and-beauty",
    "groceries",
    "books-and-media",
    "automotive",
    "jewellery",
] as const;

const productSchema = new mongoose.Schema<ProductType>({
    name: {
        type: String,
        required: true
    },
    slug:{
        type: String,
        required: true,
        unique:true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: CATEGORIES
    },
    image: {
        type: String,
        default: ""
    },
    imagePublicId: {
        type: String,
        default: ""
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    }

},{
    timestamps: true
});

export const Product = mongoose.model("Product", productSchema);