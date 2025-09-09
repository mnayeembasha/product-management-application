import express from "express";
import { PORT } from "./config";
import cors from "cors";
import path from "path";
const app = express();
import productRoutes from "./routes/product.routes";
import authRoutes from "./routes/auth.routes";
import { connectDB } from "./lib/db";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
dotenv.config();

app.use(cors({
    origin: "http://localhost:5173",
    credentials:true
}));

app.use(express.json({limit:"5MB"}));
app.use(express.urlencoded({extended:true,limit:"5MB"}));
app.use(cookieParser());

app.use("/api/auth",authRoutes);
app.use("/api/products",productRoutes);

const __dirname = path.resolve();
if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname,"../frontend/dist")));
    app.get(/.*/,(req,res)=>{
        res.sendFile(path.join(__dirname,"../frontend/dist/index.html"));
    });
}


app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`);
    connectDB();
});