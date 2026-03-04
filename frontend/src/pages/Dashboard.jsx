import React, { useState, useEffect } from "react";
import Products from './Products';
import Cart from './Cart';
import About from './About';
import Profile from './Profile';
import Signup from './Signup';
import Login from './Login';
import AdminPanel from './AdminPanel';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Footer from '../components/Footer';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5005';

function Dashboard() {
    const [cartItems, setCartItems] = useState([]);
    const [route, setRoute] = useState('home');
    const [user, setUser] = useState(null);
    const [authMode, setAuthMode] = useState('signup'); // 'signup' or 'login'
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem('millcart_user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                localStorage.removeItem('millcart_user');
            }
        }
    }, []);

    useEffect(() => {
        if (user) {
            localStorage.setItem('millcart_user', JSON.stringify(user));
        } else {
            localStorage.removeItem('millcart_user');
        }
    }, [user]);

    const handleSignup = async (name, email, password, setError) => {
        setLoading(true);
        setError('');
        try {
            const response = await fetch(`${API_BASE_URL}/api/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password })
            });
            const data = await response.json();

            if (data.success) {
                setUser(data.user);
                setAuthMode(null);
            } else {
                setError(data.message || 'Signup failed');
            }
        } catch (error) {
            setError('Network error. Please check if backend is running.');
            console.error('Signup error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = async (email, password, isAdmin, setError) => {
        setLoading(true);
        setError('');
        try {
            const response = await fetch(`${API_BASE_URL}/api/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, isAdmin })
            });
            const data = await response.json();

            if (data.success) {
                setUser(data.user);
                setAuthMode(null);
            } else {
                setError(data.message || 'Login failed');
            }
        } catch (error) {
            setError('Network error. Please check if backend is running.');
            console.error('Login error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleProfileUpdate = (form, setMessage) => {
        setUser(u => ({ ...u, name: form.name, email: form.email }));
        setMessage('Profile updated!');
    };

    const handleLogout = () => {
        setUser(null);
        setAuthMode('signup');
        setCartItems([]);
    };

    const addToCart = (product) => {
        setCartItems((items) => {
            const exists = items.find(i => (i._id || i.id) === (product._id || product.id));
            if (exists) {
                return items.map(i =>
                    (i._id || i.id) === (product._id || product.id)
                        ? { ...i, qty: (i.qty || i.quantity) + 1 }
                        : i
                );
            }
            return [...items, { ...product, qty: 1 }];
        });
    };

    const removeFromCart = (id) => {
        setCartItems((items) => items.filter(i => (i._id || i.id) !== id));
    };

    const clearCart = () => setCartItems([]);

    const handleCheckout = async (setError, setSuccess, customerDetails) => {
        if (!user || !user._id) {
            setError('Please login to place an order');
            return;
        }

        if (cartItems.length === 0) {
            setError('Cart is empty');
            return;
        }

        if (!customerDetails) {
            setError('Shipping details are required');
            return;
        }

        setLoading(true);
        setError('');
        try {
            const orderItems = cartItems.map(item => ({
                productId: item._id || item.id,
                quantity: item.qty || item.quantity || 1
            }));

            const response = await fetch(`${API_BASE_URL}/api/orders`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user._id,
                    items: orderItems,
                    customerDetails
                })
            });

            const data = await response.json();

            if (data.success) {
                setSuccess('Order placed successfully! We will contact you soon.');
                setCartItems([]);
                setTimeout(() => {
                    setSuccess('');
                    setRoute('home');
                }, 3000);
            } else {
                setError(data.message || 'Failed to place order');
            }
        } catch (error) {
            setError('Network error. Please try again.');
            console.error('Checkout error:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return (
            <div className="auth-bg">
                {authMode === 'signup' ? (
                    <Signup onSignup={handleSignup} loading={loading} onSwitchToLogin={() => setAuthMode('login')} />
                ) : (
                    <Login onLogin={handleLogin} loading={loading} onSwitchToSignup={() => setAuthMode('signup')} />
                )}
            </div>
        );
    }

    return (
        <div>
            <Header
                cartCount={cartItems.reduce((s, i) => s + (i.qty || i.quantity || 1), 0)}
                onNavigate={setRoute}
                active={route}
                user={user}
                onLogout={handleLogout}
            />
            {route === 'home' && <Hero onNavigate={setRoute} />}
            {route === 'products' && <Products onAdd={addToCart} />}
            {route === 'cart' && (
                <Cart
                    items={cartItems}
                    onRemove={removeFromCart}
                    onClear={clearCart}
                    onCheckout={handleCheckout}
                    loading={loading}
                    user={user}
                />
            )}
            {route === 'about' && <About />}
            {route === 'admin' && user.isAdmin && (
                <AdminPanel onLogout={handleLogout} />
            )}
            {route === 'profile' && (
                <Profile user={user} onUpdate={handleProfileUpdate} onLogout={handleLogout} />
            )}
            <Footer />
        </div>
    );
}

export default Dashboard;
