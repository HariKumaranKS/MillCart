import React, { useState, useEffect } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5005';

export default function AdminPanel({ onLogout }) {
    const [products, setProducts] = useState([]);
    const [users, setUsers] = useState([]);
    const [orders, setOrders] = useState([]);
    const [form, setForm] = useState({ name: '', riceType: '', quantityPerUnit: '', stock: '', price: '', img: '' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [pRes, uRes, oRes] = await Promise.all([
                    fetch(`${API_BASE_URL}/api/products`),
                    fetch(`${API_BASE_URL}/api/users`),
                    fetch(`${API_BASE_URL}/api/orders`)
                ]);
                setProducts(await pRes.json());
                setUsers(await uRes.json());
                setOrders(await oRes.json());
            } catch (err) {
                setError('Failed to load admin data');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleAddProduct = async e => {
        e.preventDefault();
        try {
            const res = await fetch(`${API_BASE_URL}/api/products`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            });
            const data = await res.json();
            setProducts(p => [...p, data]);
            setForm({ name: '', riceType: '', quantityPerUnit: '', stock: '', price: '', img: '' });
            setSuccess('Product added!');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError('Failed to add product');
        }
    };

    if (loading) return <section className="section"><div className="container"><h2>Admin</h2><p>Loading...</p></div></section>;

    return (
        <section className="section">
            <div className="container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                    <h2>Mill Administration</h2>
                    <button onClick={onLogout} className="profile-btn logout" style={{ width: 'auto', padding: '10px 25px' }}>Logout Admin</button>
                </div>
                <div style={{ background: '#fff', padding: '40px', borderRadius: '24px', marginBottom: '40px', boxShadow: 'var(--shadow)' }}>
                    <h3 style={{ marginBottom: '25px' }}>Add New Product</h3>
                    <form onSubmit={handleAddProduct} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div className="form-group"><label>Name</label><input name="name" className="auth-input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required /></div>
                        <div className="form-group"><label>Type</label><input name="riceType" className="auth-input" value={form.riceType} onChange={e => setForm({ ...form, riceType: e.target.value })} required /></div>
                        <div className="form-group"><label>Unit</label><input name="quantityPerUnit" className="auth-input" value={form.quantityPerUnit} onChange={e => setForm({ ...form, quantityPerUnit: e.target.value })} required /></div>
                        <div className="form-group"><label>Stock</label><input name="stock" type="number" className="auth-input" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} required /></div>
                        <div className="form-group"><label>Price (₹)</label><input name="price" type="number" className="auth-input" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required /></div>
                        <div className="form-group"><label>Image URL</label><input name="img" className="auth-input" value={form.img} onChange={e => setForm({ ...form, img: e.target.value })} /></div>
                        <div style={{ gridColumn: 'span 2' }}><button type="submit" className="auth-btn" style={{ width: 'auto', padding: '15px 40px' }}>Add Product</button></div>
                    </form>
                </div>
                <div style={{ background: '#fff', padding: '40px', borderRadius: '24px', boxShadow: 'var(--shadow)' }}>
                    <h3>Recent Orders</h3>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead><tr style={{ textAlign: 'left', borderBottom: '2px solid #f0f0f0' }}><th style={{ padding: '15px' }}>Order ID</th><th style={{ padding: '15px' }}>Customer</th><th style={{ padding: '15px' }}>Total</th><th style={{ padding: '15px' }}>Status</th></tr></thead>
                            <tbody>
                                {orders.map(o => (
                                    <tr key={o._id} style={{ borderBottom: '1px solid #f9f9f9' }}>
                                        <td style={{ padding: '15px' }}>{o._id.slice(-6).toUpperCase()}</td>
                                        <td style={{ padding: '15px' }}>{o.customerDetails?.name || o.user?.name}</td>
                                        <td style={{ padding: '15px' }}>₹{o.total?.toLocaleString()}</td>
                                        <td style={{ padding: '15px' }}>{o.status}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </section>
    );
}
