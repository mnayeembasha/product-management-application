import mongoose from "mongoose";

export type ProductType = {
    name:string;
    price:string;
    description:string;
    category:string;
    slug:string;
    image?:string;
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
]

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
        type: String,
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
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    }

},{
    timestamps: true
});

export const Product = mongoose.model("Product", productSchema);