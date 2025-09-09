import mongoose from "mongoose";
import bcrypt from "bcryptjs";

export type UserType = {
    fullName: string,
    email: string,
    password: string,
    profilePic?:string
}

const userSchema = new mongoose.Schema<UserType>({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    profilePic:{
        type: String,
        default:"https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
    },
},{
    timestamps:true
});

userSchema.pre("save",async function(next){
    if(!this.isModified("password")){ //If password isn't modified(User may be updating some other fields) then dont generate the hash
        return next();
    }
    try{
        this.password = await bcrypt.hash(this.password,10);
        next();
    }catch(error:any){
        next(error);
    }
  });


export const User = mongoose.model<UserType>("User", userSchema);