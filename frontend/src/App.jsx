import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetails from './pages/ProductDetails';
import CartPage from './pages/CartPage';
import ProfilePage from './pages/ProfilePage';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { Toaster } from 'react-hot-toast';
import './styles/index.css';

function App() {
    return (
        <Router>
            <div className="App" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
                <Toaster position="top-center" />
                <Navbar />
                <main style={{ flex: '1' }}>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/products" element={<ProductsPage />} />
                        <Route path="/products/:id" element={<ProductDetails />} />
                        <Route path="/cart" element={<CartPage />} />
                        <Route path="/profile" element={<ProfilePage />} />
                        <Route path="/admin/*" element={<AdminDashboard />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />
                        <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                </main>
                <Footer />
            </div>
        </Router>
    );
}

export default App;
