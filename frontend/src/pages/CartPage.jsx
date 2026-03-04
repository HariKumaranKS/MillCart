import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Trash2, Plus, Minus, CreditCard, Truck, ExternalLink, ShoppingCart } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function CartPage() {
    const { user, token } = useAuth();
    const navigate = useNavigate();
    const [cart, setCart] = useState(JSON.parse(localStorage.getItem('millcart_cart') || '[]'));
    const [loading, setLoading] = useState(false);
    const [address, setAddress] = useState(user?.address || {
        street: '', city: '', state: '', pincode: '', phone: ''
    });

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5005';

    useEffect(() => {
        localStorage.setItem('millcart_cart', JSON.stringify(cart));
    }, [cart]);

    const updateQty = (id, delta) => {
        setCart(cart.map(i => i._id === id ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i));
    };

    const removeItem = (id) => {
        setCart(cart.filter(i => i._id !== id));
        toast.info('Item removed from cart');
    };

    const subtotal = cart.reduce((acc, i) => acc + (i.price * i.quantity), 0);
    const shipping = subtotal > 500 ? 0 : 50;
    const total = subtotal + shipping;

    const handleCheckout = async () => {
        if (!user) {
            toast.error('Please login to place an order');
            navigate('/login');
            return;
        }

        if (!address.street || !address.phone || !address.pincode) {
            toast.error('Please complete your shipping address');
            return;
        }

        setLoading(true);
        try {
            const res = await axios.post(`${API_URL}/api/orders`, {
                orderItems: cart,
                customerDetails: {
                    name: user.name,
                    ...address,
                    address: address.street // Mapping for legacy backend compatibility
                },
                total
            });

            if (res.data.success) {
                toast.success('🎉 Order placed successfully!');
                setCart([]);
                navigate('/profile');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Checkout failed');
        } finally {
            setLoading(false);
        }
    };

    if (cart.length === 0) {
        return (
            <div className="container" style={{ paddingTop: '150px', textAlign: 'center', minHeight: '80vh' }}>
                <div style={{ background: '#fff', padding: '60px', borderRadius: '30px', boxShadow: 'var(--shadow)' }}>
                    <ShoppingCart size={80} style={{ color: 'var(--primary)', marginBottom: '30px' }} />
                    <h2 style={{ fontSize: '36px', marginBottom: '15px' }}>Your Cart is Empty</h2>
                    <p style={{ color: '#888', marginBottom: '30px' }}>Fill your basket with our premium rice varieties.</p>
                    <button onClick={() => navigate('/products')} className="btn-primary" style={{ margin: '0 auto' }}>
                        Browse Products
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container" style={{ paddingTop: '150px', paddingBottom: '100px' }}>
            <div className="section-header">
                <h2>Your Shopping Cart</h2>
                <div className="underline"></div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '40px', alignItems: 'start' }}>
                <div className="cart-items" style={{ background: '#fff', borderRadius: '24px', padding: '20px', boxShadow: 'var(--shadow)' }}>
                    {cart.map(item => (
                        <div key={item._id} style={{ display: 'flex', gap: '20px', padding: '20px 0', borderBottom: '1px solid #f0f0f0', alignItems: 'center' }}>
                            <img src={item.img?.startsWith('/uploads') ? API_URL + item.img : (item.img || 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=200')} style={{ width: '100px', height: '100px', borderRadius: '12px', objectFit: 'cover' }} />
                            <div style={{ flex: '1' }}>
                                <h3 style={{ fontSize: '18px' }}>{item.name}</h3>
                                <p style={{ fontSize: '14px', color: '#888' }}>{item.quantityPerUnit}</p>
                                <div style={{ fontWeight: '800', fontSize: '18px', color: 'var(--secondary)', marginTop: '5px' }}>₹{item.price}</div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', background: '#f9f9f9', padding: '5px 15px', borderRadius: '50px' }}>
                                <button onClick={() => updateQty(item._id, -1)} style={{ border: 'none', background: 'none', cursor: 'pointer' }}><Minus size={16} /></button>
                                <span style={{ fontWeight: '700' }}>{item.quantity}</span>
                                <button onClick={() => updateQty(item._id, 1)} style={{ border: 'none', background: 'none', cursor: 'pointer' }}><Plus size={16} /></button>
                            </div>
                            <button onClick={() => removeItem(item._id)} style={{ color: '#ff6b6b', border: 'none', background: 'none', cursor: 'pointer', padding: '10px' }}>
                                <Trash2 size={24} />
                            </button>
                        </div>
                    ))}
                </div>

                <div className="cart-summary" style={{ position: 'sticky', top: '120px' }}>
                    {/* Shipping Address */}
                    <div style={{ background: '#fff', borderRadius: '24px', padding: '30px', boxShadow: 'var(--shadow)', marginBottom: '30px' }}>
                        <h3 style={{ fontSize: '20px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Truck size={22} color="var(--primary)" />
                            Shipping Address
                        </h3>
                        <div className="form-group">
                            <input
                                className="form-input"
                                placeholder="Street Address"
                                value={address.street}
                                onChange={e => setAddress({ ...address, street: e.target.value })}
                            />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                            <input className="form-input" placeholder="City" value={address.city} onChange={e => setAddress({ ...address, city: e.target.value })} />
                            <input className="form-input" placeholder="PIN Code" value={address.pincode} onChange={e => setAddress({ ...address, pincode: e.target.value })} />
                        </div>
                        <div className="form-group" style={{ marginTop: '10px' }}>
                            <input className="form-input" placeholder="Phone Number" value={address.phone} onChange={e => setAddress({ ...address, phone: e.target.value })} />
                        </div>
                    </div>

                    {/* Order Total */}
                    <div style={{ background: 'var(--secondary)', borderRadius: '24px', padding: '30px', boxShadow: 'var(--shadow-lg)', color: '#fff' }}>
                        <h3 style={{ fontSize: '22px', marginBottom: '25px', color: 'var(--primary)' }}>Order Summary</h3>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', color: 'rgba(255,255,255,0.7)' }}>
                            <span>Subtotal</span>
                            <span>₹{subtotal}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '25px', color: 'rgba(255,255,255,0.7)' }}>
                            <span>Shipping</span>
                            <span>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
                        </div>
                        <div style={{ height: '1.5px', background: 'rgba(255,255,255,0.1)', marginBottom: '20px' }}></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px' }}>
                            <span style={{ fontSize: '20px', fontWeight: '700' }}>Total</span>
                            <span style={{ fontSize: '24px', fontWeight: '900', color: 'var(--primary)' }}>₹{total}</span>
                        </div>

                        <button
                            onClick={handleCheckout}
                            disabled={loading || cart.length === 0}
                            style={{
                                width: '100%',
                                padding: '18px',
                                background: 'var(--primary)',
                                color: 'var(--secondary)',
                                border: 'none',
                                borderRadius: '14px',
                                fontWeight: '800',
                                fontSize: '18px',
                                cursor: 'pointer',
                                transition: 'transform 0.2s',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '15px'
                            }}
                        >
                            {loading ? <div className="loader loader-small"></div> : <><CreditCard size={22} /> Complete Order</>}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
