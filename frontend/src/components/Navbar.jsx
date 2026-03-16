import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ShoppingCart, LogOut, User, Menu, X, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
    const { user, logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const navigate = useNavigate();

    // Handle scroll for sticky effect
    React.useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
            <div className="container nav-content">
                <Link to="/" className="logo-section">
                    <img src="../logo.jpeg" alt="Sri Sastha Logo" className="navbar-logo" />
                    <div className="logo-text">
                        <span className="name-main">Sri Sastha</span>
                        <span className="name-sub">Modern Rice Mill</span>
                    </div>
                </Link>

                <div className={`nav-links ${isOpen ? 'open' : ''}`}>
                    <NavLink to="/" onClick={() => setIsOpen(false)} end>Home</NavLink>
                    <NavLink to="/products" onClick={() => setIsOpen(false)}>Products</NavLink>
                    {user && (
                        <NavLink to="/profile" onClick={() => setIsOpen(false)}>Profile</NavLink>
                    )}
                    {user?.isAdmin && (
                        <NavLink to="/admin" onClick={() => setIsOpen(false)} className="admin-link">
                            <ShieldCheck size={18} /> Admin
                        </NavLink>
                    )}
                    {!user ? (
                        <Link to="/login" className="login-btn" onClick={() => setIsOpen(false)}>Login</Link>
                    ) : (
                        <button onClick={handleLogout} className="logout-btn-nav">
                            <LogOut size={18} /> Logout
                        </button>
                    )}
                </div>

                <div className="nav-actions">
                    <Link to="/cart" className="cart-badge-container">
                        <ShoppingCart size={24} />
                        <span className="cart-count">0</span>
                    </Link>

                    <button className="mobile-toggle" onClick={() => setIsOpen(!isOpen)}>
                        {isOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>
            </div>
        </nav>
    );
}
