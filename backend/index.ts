import express from "express";
import { PORT } from "./config";
import cors from "cors";
const app = express();
import productRoutes from "./routes/product.routes";
import { connectDB } from "./lib/db";

app.use(cors({
    origin: "http://localhost:5173",
    credentials:true
}));

app.use(express.json({limit:"5MB"}));
app.use(express.urlencoded({extended:true,limit:"5MB"}));

app.use("/api/products",productRoutes);

app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`);
    connectDB();
});