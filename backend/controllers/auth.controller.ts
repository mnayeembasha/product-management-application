import {type Request,type Response} from "express";
import { User } from "../models/User";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken";

export const signup = async (req:Request,res:Response)=>{
    const {fullName,email,password} = req.body;
    try {
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({message:"User already exists"});
        }

        const idx = Math.floor(Math.random()*100)+1;
        const randomAvatarUrl = `https://avatar.iran.liara.run/public/${idx}.png`;

        const newUser = await User.create({fullName,email,password,profilePic:randomAvatarUrl});
        if(newUser){
            generateToken(newUser._id.toString(),res);
            res.status(201).json({
                message:"User created successfully",
                user:{
                    _id:newUser._id,
                    fullName:newUser.fullName,
                    email:newUser.email,
                    profilePic:newUser.profilePic
                }
            });
        }else{
            res.status(400).json({message:"User creation failed"});
        }

    } catch (error) {
        res.status(500).json({message:"Internal Server Error"});
    }

}
export const login = async (req:Request,res:Response)=>{
    const {email,password} = req.body;

    try{
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({message:"Invalid Email"});
        }

        const isPasswordCorrect = await bcrypt.compare(password,user.password);
        if(!isPasswordCorrect){
            return res.status(400).json({message:"Invalid Password"});
        }

        generateToken(user._id.toString(),res);
        res.status(200).json({
            _id:user._id,
            fullName:user.fullName,
            email:user.email,
            profilePic:user.profilePic
        });

    }catch(error){
        console.log("Error in login controller",error);
        res.status(500).json({message:"Internal Server Error"});
    }

}


export const logout = async (req:Request,res:Response)=>{
    res.clearCookie("jwt");
    res.status(200).json({success:true,message:"Logout successfull"});

}
export const checkAuth = (req:Request,res:Response)=>{
    try {
        res.status(200).json(req.user);
    } catch (error:any) {
        console.error("Error in checkAuth controller",error.message);
        res.status(500).json({message:"Internal Server Error"});
    }
}


// {
//     "name": "Mechanical Keyboard",
//     "price": "2499",
//     "description": "RGB backlit mechanical keyboard with blue switches for gaming and typing.",
//     "category": "electronics"
// }