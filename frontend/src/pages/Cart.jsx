import React, { useState } from 'react';

export default function Cart({ items, onRemove, onClear, onCheckout, loading, user }) {
    const total = items.reduce((s, i) => s + i.price * (i.qty || i.quantity || 1), 0);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showCheckoutForm, setShowCheckoutForm] = useState(false);
    const [shippingDetails, setShippingDetails] = useState({
        name: user?.name || '',
        phone: '',
        address: '',
        city: '',
        state: '',
        pincode: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setShippingDetails(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckout = (e) => {
        e.preventDefault();
        if (!showCheckoutForm) {
            setShowCheckoutForm(true);
            return;
        }
        if (!shippingDetails.name || !shippingDetails.phone || !shippingDetails.address || !shippingDetails.city || !shippingDetails.state || !shippingDetails.pincode) {
            setError('Please fill in all shipping details');
            return;
        }
        onCheckout(setError, setSuccess, shippingDetails);
    };

    return (
        <section className="section">
            <div className="container">
                <h2>Your Shopping Cart</h2>
                {items.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '100px 40px' }}>
                        <p style={{ fontSize: '1.2rem', color: '#666' }}>Your cart is empty.</p>
                        <button className="hero button" style={{ marginTop: '30px', padding: '15px 40px' }} onClick={() => window.location.hash = '#products'}>Start Shopping</button>
                    </div>
                ) : (
                    <div className="cart-container" style={{ maxWidth: 900, margin: '0 auto' }}>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            {items.map((it) => (
                                <li key={it._id || it.id} style={{ display: 'flex', marginBottom: 20, alignItems: 'center', background: '#fff', padding: '20px', borderRadius: '16px', boxShadow: 'var(--shadow)' }}>
                                    {it.img && <img src={it.img} alt={it.name} style={{ width: 100, height: 80, objectFit: 'cover', borderRadius: 12, marginRight: 20 }} />}
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '4px' }}>{it.name}</div>
                                        <div style={{ fontSize: '0.85rem', color: '#666', marginBottom: '8px' }}>{it.riceType} • {it.quantityPerUnit}</div>
                                        <div style={{ fontSize: '0.95rem' }}>Qty: {it.qty || it.quantity || 1} • ₹{it.price.toLocaleString()} each</div>
                                        <div style={{ marginTop: '8px', color: 'var(--primary-dark)', fontWeight: 800, fontSize: '1.1rem' }}>Subtotal: ₹{(it.price * (it.qty || it.quantity || 1)).toLocaleString()}</div>
                                    </div>
                                    <button onClick={() => onRemove(it._id || it.id)} style={{ padding: '10px 18px', borderRadius: 10, background: '#fff', color: '#991b1b', border: '1.5px solid #fee2e2', cursor: 'pointer', fontWeight: '600' }} disabled={loading}>Remove</button>
                                </li>
                            ))}
                        </ul>
                        <div style={{ background: '#fff', padding: '30px', borderRadius: '20px', marginTop: '30px', boxShadow: 'var(--shadow)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                                <span style={{ fontSize: '1.2rem', fontWeight: 600, color: '#666' }}>Order Total</span>
                                <span style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--secondary)' }}>₹{total.toLocaleString()}</span>
                            </div>
                            {showCheckoutForm && (
                                <div className="checkout-form" style={{ borderTop: '1px solid #f0f0f0', marginTop: '25px', paddingTop: '25px' }}>
                                    <h3>Shipping Information</h3>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                        <div className="form-group"><label>Recipient Name</label><input type="text" className="auth-input" name="name" value={shippingDetails.name} onChange={handleInputChange} required /></div>
                                        <div className="form-group"><label>Phone Number</label><input type="text" className="auth-input" name="phone" value={shippingDetails.phone} onChange={handleInputChange} required /></div>
                                        <div className="form-group" style={{ gridColumn: 'span 2' }}><label>Address</label><input type="text" className="auth-input" name="address" value={shippingDetails.address} onChange={handleInputChange} required /></div>
                                        <div className="form-group"><label>City</label><input type="text" className="auth-input" name="city" value={shippingDetails.city} onChange={handleInputChange} required /></div>
                                        <div className="form-group"><label>State</label><input type="text" className="auth-input" name="state" value={shippingDetails.state} onChange={handleInputChange} required /></div>
                                        <div className="form-group"><label>Pincode</label><input type="text" className="auth-input" name="pincode" value={shippingDetails.pincode} onChange={handleInputChange} required /></div>
                                    </div>
                                </div>
                            )}
                            {error && <div className="auth-error" style={{ background: '#fef2f2', padding: '10px', borderRadius: '10px', marginTop: '15px' }}>{error}</div>}
                            {success && <div style={{ color: '#166534', background: '#f0fdf4', padding: '10px', borderRadius: '10px', marginTop: '15px' }}>{success}</div>}
                            <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end', marginTop: '30px' }}>
                                <button onClick={onClear} className="profile-btn" style={{ width: 'auto', background: '#f8f9fa', color: '#666', border: '1px solid #ddd' }}>Clear Cart</button>
                                <button onClick={handleCheckout} className="auth-btn" style={{ width: 'auto', padding: '15px 40px', marginTop: 0 }}>{loading ? 'Processing...' : showCheckoutForm ? 'Confirm Order' : 'Checkout'}</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
