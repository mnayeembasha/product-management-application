import mongoose from "mongoose"

export type UserType = {
    fullName: string,
    email: string,
    password: string
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
    }
});

export const User = mongoose.model("User", userSchema);