import mongoose from "mongoose";

export type ProductType = {
    name:string;
    price:string;
    description:string;
    category:string;
    slug:string;
    image?:string;
}

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
        required: true
    },
    image: {
        type: String,
        default: ""
    },
});

export const Product = mongoose.model("Product", productSchema);