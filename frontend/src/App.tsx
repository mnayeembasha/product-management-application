import { Route, Routes } from "react-router-dom";
import "./index.css";
import {Product} from "./components/products/ProductDashboard";

export default function App () {
    return (<Routes>
        <Route path="/products" element={<Product/>}/>
    </Routes>);
}

