import {z} from "zod";
import { CATEGORIES } from "../models/Product";
export const signupZodSchema = z.object({
    fullName: z.string({message:"Full name is required"}).min(3,"Full name should contain atlest 3 characters"),
    email: z.string().email({message:"Invalid email"}),
    password: z.string({message:"Password is required"}).min(6,"Password should contain atlest 6 characters"),
});

export const loginZodSchema = z.object({
    email: z.string().email({message:"Invalid email"}),
    password: z.string({message:"Password is required"}).min(6,"Password should contain atlest 6 characters"),
});

export const addProductZodSchema = z.object({
    name: z.string({message:"Name is required"}).min(3,"Name should contain atlest 3 characters"),
    price: z.number({message:"Price is required"}).min(0,"Price should be greater than 0"),
    description: z.string({message:"Description is required"}).min(10,"Description should contain atlest 10 characters"),
    category: z.enum(CATEGORIES,{message:"Invalid Category"}),
});

export const editProductZodSchema = z.object({
    price: z.number({message:"Price is required"}).min(0,"Price should be greater than 0"),
    description: z.string({message:"Description is required"}).min(10,"Description should contain atlest 10 characters"),
    category: z.enum(CATEGORIES,{message:"Invalid Category"}),
});

export const filterQueryZodSchema = z.object({
    sort: z.enum(['price_asc', 'price_desc', 'latest',"oldest"],{message:"Invalid sort option"}).optional(),
    category: z.enum([...CATEGORIES, 'all'],{message:"Invalid category filter"}).optional(),
    search: z.string().max(100).regex(/^[a-zA-Z0-9\s\-_. ]*$/,{message:"Invalid search query"}).optional()
});
