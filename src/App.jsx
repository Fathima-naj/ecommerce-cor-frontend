
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Routes } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/login";
import Register from "./pages/register";
import ProductList from "./components/ProductList";
import ProductDetails from "./components/ProductDetails";
import ProductForm from "./components/ProductForm";
import UpdateProduct from "./components/UpdateProduct";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

import PublicLayout from "./layouts/PublicLayout";
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./admin/AdminDashboard";
import AdminProductList from "./admin/ProductList";

import { getProfile } from "./redux/userSlice";
import "./App.css";

export default function App() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getProfile());
    }, [dispatch]);

    return (
        <div className="app-shell">
            <Routes>
                {/* Customer/storefront layout */}
                <Route element={<PublicLayout />}>
                     <Route path="/" element={<Home />} />
                    <Route path="/products" element={<ProductList />} />
                    <Route path="/product/:id" element={<ProductDetails />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    <Route element={<ProtectedRoute />}>
                        <Route
                            path="/profile"
                            element={
                                <main className="page-section">
                                    <h1>My Profile</h1>
                                </main>
                            }
                        />
                        
                    </Route>
                </Route>

                {/* Admin-only layout and pages */}
                <Route element={<AdminRoute />}>
                    <Route element={<AdminLayout />}>
                        <Route
                            path="/admin/dashboard"
                            element={<AdminDashboard />}
                        />
                        <Route
                            path="/admin/products"
                            element={<AdminProductList />}
                        />
                        <Route
                            path="/admin/add-product"
                            element={<ProductForm />}
                        />
                        <Route
                            path="/admin/products/:id/edit"
                            element={<UpdateProduct />}
                        />
                    </Route>
                </Route>

                <Route path="*" element={<Home />} />
            </Routes>
        </div>
    );
}
