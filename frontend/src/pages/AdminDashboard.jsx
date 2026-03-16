import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    LayoutDashboard, Package, ShoppingCart, Users, Settings,
    LogOut, TrendingUp, DollarSign, Activity, ChevronRight,
    Edit, Trash2, Plus, Search, Filter, AlertCircle, Clock
} from 'lucide-react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, AreaChart, Area, BarChart, Bar, Cell
} from 'recharts';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
    const { user, logout, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [stats, setStats] = useState({ metrics: {}, charts: [], frequentBuyers: [], logs: [] });
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    // Form States
    const [productForm, setProductForm] = useState({
        name: '', riceType: '', category: 'Rice', quantityPerUnit: '',
        stock: '', price: '', costPrice: '', img: ''
    });
    const [editId, setEditId] = useState(null);
    const [imageLoading, setImageLoading] = useState(false);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5005';

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setImageLoading(true);
        const formData = new FormData();
        formData.append('image', file);

        try {
            const res = await axios.post(`${API_URL}/api/products/upload-img`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setProductForm({ ...productForm, img: res.data.imgUrl });
            toast.success('Image uploaded!');
        } catch (error) {
            toast.error('Image upload failed');
        } finally {
            setImageLoading(false);
        }
    };

    useEffect(() => {
        if (authLoading) return;
        if (!user || !user.isAdmin) {
            navigate('/');
            return;
        }
        fetchData();
    }, [activeTab, authLoading, user]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [statsRes, productsRes, ordersRes] = await Promise.all([
                axios.get(`${API_URL}/api/admin/analytics`),
                axios.get(`${API_URL}/api/products`),
                axios.get(`${API_URL}/api/orders`)
            ]);
            setStats(statsRes.data);
            setProducts(productsRes.data);
            setOrders(ordersRes.data);
        } catch (error) {
            toast.error('Failed to load admin data');
        } finally {
            setLoading(false);
        }
    };

    const handleProductSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = {
                ...productForm,
                price: Number(productForm.price),
                costPrice: Number(productForm.costPrice),
                stock: Number(productForm.stock)
            };

            if (editId) {
                await axios.put(`${API_URL}/api/products/${editId}`, data);
                toast.success('Product updated!');
            } else {
                await axios.post(`${API_URL}/api/products`, data);
                toast.success('Product added!');
            }
            setProductForm({ name: '', riceType: '', category: 'Rice', quantityPerUnit: '', stock: '', price: '', costPrice: '', img: '' });
            setEditId(null);
            fetchData();
        } catch (error) {
            toast.error('Operation failed');
        }
    };

    const deleteProduct = async (id) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;
        try {
            await axios.delete(`${API_URL}/api/products/${id}`);
            toast.success('Product removed');
            fetchData();
        } catch (error) {
            toast.error('Failed to delete');
        }
    };

    const updateOrderStatus = async (id, status) => {
        try {
            await axios.put(`${API_URL}/api/orders/${id}/status`, { status });
            toast.success(`Order ${status}`);
            fetchData();
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    if (loading && activeTab === 'dashboard') {
        return <div className="loader-container"><div className="loader"></div></div>;
    }

    return (
        <div className="admin-layout" style={{ display: 'flex', minHeight: '100vh', background: '#F4F7F6' }}>
            {/* Sidebar */}
            <aside className="admin-sidebar" style={{
                width: '280px', background: 'var(--secondary)', color: '#fff',
                padding: '40px 20px', display: 'flex', flexDirection: 'column',
                boxShadow: '10px 0 30px rgba(0,0,0,0.1)'
            }}>
                <div className="sidebar-brand" style={{ marginBottom: '60px', textAlign: 'center' }}>

                    <h2 style={{ color: 'var(--primary)', fontSize: '20px' }}>Mill Admin </h2>
                </div>

                <nav className="sidebar-nav" style={{ flex: '1' }}>
                    {[
                        { id: 'dashboard', icon: <LayoutDashboard />, label: 'Analytics' },
                        { id: 'products', icon: <Package />, label: 'Products' },
                        { id: 'orders', icon: <ShoppingCart />, label: 'Orders' },
                        { id: 'users', icon: <Users />, label: 'Users' },
                        { id: 'logs', icon: <Activity />, label: 'Activity Logs' }
                    ].map(item => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`sidebar-link ${activeTab === item.id ? 'active' : ''}`}
                            style={{
                                width: '100%', padding: '15px 20px', display: 'flex', alignItems: 'center', gap: '15px',
                                background: activeTab === item.id ? 'var(--primary)' : 'transparent',
                                color: activeTab === item.id ? 'var(--secondary)' : 'rgba(255,255,255,0.7)',
                                border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: '700',
                                marginBottom: '10px', transition: 'all 0.3s'
                            }}
                        >
                            {React.cloneElement(item.icon, { size: 20 })}
                            {item.label}
                        </button>
                    ))}
                </nav>

                <button onClick={logout} className="sidebar-logout" style={{
                    padding: '15px', color: '#ff6b6b', background: 'rgba(255,107,107,0.1)',
                    border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: '700',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'
                }}>
                    <LogOut size={20} /> Logout
                </button>
            </aside>

            {/* Main Content */}
            <main className="admin-main" style={{ flex: '1', padding: '50px', overflowY: 'auto', maxHeight: '100vh' }}>
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                    <h1 style={{ fontSize: '32px', textTransform: 'capitalize' }}>{activeTab} Overview</h1>
                    <div className="admin-profile" style={{ display: 'flex', alignItems: 'center', gap: '15px', background: '#fff', padding: '10px 20px', borderRadius: '50px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontWeight: '800' }}>{user.name}</div>
                            <div style={{ fontSize: '11px', color: 'var(--primary-dark)', fontWeight: '700' }}>MILL ADMINISTRATOR</div>
                        </div>
                        <div style={{ width: '40px', height: '40px', background: 'var(--primary)', borderRadius: '50%', border: '2px solid #fff' }}></div>
                    </div>
                </header>

                {/* Dashboard Tab */}
                {activeTab === 'dashboard' && (
                    <div className="dashboard-content">
                        {/* Metrics Grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '25px', marginBottom: '40px' }}>
                            {[
                                { label: 'Total Sales', value: stats.metrics.totalSales, icon: <DollarSign />, color: '#4CAF50' },
                                { label: 'Total Profit', value: stats.metrics.totalProfit, icon: <TrendingUp />, color: '#D4AF37' },
                                { label: 'Orders', value: stats.metrics.orderCount, icon: <ShoppingCart />, color: '#2196F3' },
                                { label: 'Customers', value: stats.metrics.users, icon: <Users />, color: '#9C27B0' }
                            ].map((m, i) => (
                                <div key={i} style={{ background: '#fff', padding: '30px', borderRadius: '24px', boxShadow: 'var(--shadow)', borderBottom: `5px solid ${m.color}` }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                                        <div style={{ background: `${m.color}10`, color: m.color, padding: '10px', borderRadius: '12px' }}>{m.icon}</div>
                                        <div style={{ fontSize: '12px', color: '#888', fontWeight: '700' }}>TODAY</div>
                                    </div>
                                    <div style={{ fontSize: '28px', fontWeight: '900', color: 'var(--secondary)' }}>
                                        {typeof m.value === 'number' && i < 2 ? `₹${m.value.toLocaleString()}` : m.value}
                                    </div>
                                    <div style={{ fontSize: '14px', color: '#888', marginTop: '5px' }}>{m.label}</div>
                                </div>
                            ))}
                        </div>

                        {/* Charts Section */}
                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' }}>
                            <div style={{ background: '#fff', padding: '30px', borderRadius: '24px', boxShadow: 'var(--shadow)' }}>
                                <h3 style={{ marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '10px' }}><Activity /> Sales & Profit Analytics</h3>
                                <div style={{ height: '350px' }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={stats.charts}>
                                            <defs>
                                                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="var(--secondary)" stopOpacity={0.1} />
                                                    <stop offset="95%" stopColor="var(--secondary)" stopOpacity={0} />
                                                </linearGradient>
                                                <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.2} />
                                                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                            <XAxis dataKey="_id" />
                                            <YAxis />
                                            <Tooltip />
                                            <Area type="monotone" dataKey="sales" stroke="var(--secondary)" fillOpacity={1} fill="url(#colorSales)" strokeWidth={3} />
                                            <Area type="monotone" dataKey="profit" stroke="var(--primary)" fillOpacity={1} fill="url(#colorProfit)" strokeWidth={3} />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            <div style={{ background: '#fff', padding: '30px', borderRadius: '24px', boxShadow: 'var(--shadow)' }}>
                                <h3 style={{ marginBottom: '30px' }}>Frequent Buyers</h3>
                                {stats.frequentBuyers.map(buyer => (
                                    <div key={buyer._id} style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px', padding: '15px', background: '#f9f9f9', borderRadius: '15px' }}>
                                        <div style={{ width: '40px', height: '40px', background: 'var(--accent)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontStyle: 'bold' }}>{buyer.name[0]}</div>
                                        <div style={{ flex: '1' }}>
                                            <div style={{ fontWeight: '700' }}>{buyer.name}</div>
                                            <div style={{ fontSize: '12px', color: 'var(--primary-dark)' }}>{buyer.loyaltyTier} Member</div>
                                        </div>
                                        <div style={{ textAlign: 'center' }}>
                                            <div style={{ fontWeight: '900' }}>{buyer.purchaseFrequency}</div>
                                            <div style={{ fontSize: '10px', color: '#888' }}>Orders</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Products Tab */}
                {activeTab === 'products' && (
                    <div className="products-admin">
                        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(400px, 1fr) 2fr', gap: '40px' }}>
                            {/* Product Form */}
                            <div style={{ background: '#fff', padding: '35px', borderRadius: '24px', boxShadow: 'var(--shadow)' }}>
                                <h3 style={{ marginBottom: '25px' }}>{editId ? 'Edit Product' : 'Add New Product'}</h3>
                                <form onSubmit={handleProductSubmit}>
                                    <div className="form-group"><label>Product Name</label><input className="form-input" value={productForm.name} onChange={e => setProductForm({ ...productForm, name: e.target.value })} required /></div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                        <div className="form-group"><label>Rice Type</label><input className="form-input" value={productForm.riceType} onChange={e => setProductForm({ ...productForm, riceType: e.target.value })} required /></div>
                                        <div className="form-group"><label>Category</label><select className="form-input" value={productForm.category} onChange={e => setProductForm({ ...productForm, category: e.target.value })}><option>Rice</option><option>Lentils</option><option>Oil</option></select></div>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                        <div className="form-group"><label>Selling Price (₹)</label><input type="number" className="form-input" value={productForm.price} onChange={e => setProductForm({ ...productForm, price: e.target.value })} required /></div>
                                        <div className="form-group"><label>Cost Price (₹)</label><input type="number" className="form-input" value={productForm.costPrice} onChange={e => setProductForm({ ...productForm, costPrice: e.target.value })} required /></div>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                        <div className="form-group"><label>Unit Size</label><input className="form-input" placeholder="e.g. 25kg" value={productForm.quantityPerUnit} onChange={e => setProductForm({ ...productForm, quantityPerUnit: e.target.value })} required /></div>
                                        <div className="form-group"><label>Initial Stock</label><input type="number" className="form-input" value={productForm.stock} onChange={e => setProductForm({ ...productForm, stock: e.target.value })} required /></div>
                                    </div>
                                    <div className="form-group">
                                        <label>Product Image</label>
                                        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                                            <input type="file" onChange={handleImageUpload} style={{ flex: '1' }} accept="image/*" />
                                            {imageLoading && <div className="loader loader-small"></div>}
                                            {productForm.img && <img src={productForm.img.startsWith('/uploads') ? API_URL + productForm.img : productForm.img} alt="preview" style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }} />}
                                        </div>
                                    </div>
                                    <button type="submit" className="auth-submit-btn" disabled={imageLoading} style={{ background: 'var(--primary)', color: 'var(--secondary)' }}>
                                        {editId ? 'Update Product' : 'Register Product'}
                                    </button>
                                    {editId && <button type="button" onClick={() => { setEditId(null); setProductForm({ name: '', riceType: '', category: 'Rice', quantityPerUnit: '', stock: '', price: '', costPrice: '', img: '' }) }} className="auth-submit-btn" style={{ background: '#eee', color: '#666', marginTop: '10px' }}>Cancel Edit</button>}
                                </form>
                            </div>

                            {/* Product List */}
                            <div style={{ background: '#fff', padding: '35px', borderRadius: '24px', boxShadow: 'var(--shadow)' }}>
                                <h3 style={{ marginBottom: '25px' }}>Inventory List</h3>
                                <div style={{ overflowX: 'auto' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <thead><tr style={{ background: '#f9f9f9', textAlign: 'left' }}><th style={{ padding: '15px' }}>Product</th><th style={{ padding: '15px' }}>Stock</th><th style={{ padding: '15px' }}>Price</th><th style={{ padding: '15px' }}>Actions</th></tr></thead>
                                        <tbody>
                                            {products.map(p => (
                                                <tr key={p._id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                                                    <td style={{ padding: '15px' }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                            <img src={p.img?.startsWith('/uploads') ? API_URL + p.img : (p.img || 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=50')} style={{ width: '35px', height: '35px', borderRadius: '6px', objectFit: 'cover' }} />
                                                            <div>
                                                                <div style={{ fontWeight: '700' }}>{p.name}</div>
                                                                <div style={{ fontSize: '11px', color: '#888' }}>{p.riceType} • {p.quantityPerUnit}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td style={{ padding: '15px' }}>
                                                        <span style={{
                                                            padding: '5px 12px', background: p.stock < 10 ? '#fff0f0' : '#f0fff0',
                                                            color: p.stock < 10 ? '#ff6b6b' : '#4caf50',
                                                            borderRadius: '50px', fontSize: '12px', fontWeight: '800'
                                                        }}>{p.stock} units</span>
                                                    </td>
                                                    <td style={{ padding: '15px', fontWeight: '800' }}>₹{p.price}</td>
                                                    <td style={{ padding: '15px' }}>
                                                        <div style={{ display: 'flex', gap: '10px' }}>
                                                            <button onClick={() => { setEditId(p._id); setProductForm(p) }} style={{ border: 'none', background: '#e3f2fd', color: '#2196f3', padding: '8px', borderRadius: '8px', cursor: 'pointer' }}><Edit size={16} /></button>
                                                            <button onClick={() => deleteProduct(p._id)} style={{ border: 'none', background: '#ffebee', color: '#ff6b6b', padding: '8px', borderRadius: '8px', cursor: 'pointer' }}><Trash2 size={16} /></button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Orders Tab */}
                {activeTab === 'orders' && (
                    <div style={{ background: '#fff', padding: '35px', borderRadius: '24px', boxShadow: 'var(--shadow)' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead><tr style={{ background: '#f9f9f9', textAlign: 'left' }}><th style={{ padding: '15px' }}>Order ID</th><th style={{ padding: '15px' }}>Customer</th><th style={{ padding: '15px' }}>Date</th><th style={{ padding: '15px' }}>Total</th><th style={{ padding: '15px' }}>Status</th><th style={{ padding: '15px' }}>Profit</th></tr></thead>
                            <tbody>
                                {orders.map(o => (
                                    <tr key={o._id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                                        <td style={{ padding: '15px', fontWeight: '700' }}>#{o._id.slice(-6).toUpperCase()}</td>
                                        <td style={{ padding: '15px' }}>{o.user?.name || o.customerDetails?.name}</td>
                                        <td style={{ padding: '15px', color: '#888' }}>{new Date(o.createdAt).toLocaleDateString()}</td>
                                        <td style={{ padding: '15px', fontWeight: '800' }}>₹{o.total}</td>
                                        <td style={{ padding: '15px' }}>
                                            <select
                                                value={o.status}
                                                onChange={(e) => updateOrderStatus(o._id, e.target.value)}
                                                style={{ padding: '8px', borderRadius: '8px', border: '1.5px solid #eee', fontWeight: '700' }}
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="processing">Processing</option>
                                                <option value="shipped">Shipped</option>
                                                <option value="delivered">Delivered</option>
                                                <option value="cancelled">Cancelled</option>
                                            </select>
                                        </td>
                                        <td style={{ padding: '15px', color: '#4caf50', fontWeight: '900' }}>+₹{o.totalProfit || 0}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Logs Tab */}
                {activeTab === 'logs' && (
                    <div style={{ background: '#fff', padding: '35px', borderRadius: '24px', boxShadow: 'var(--shadow)' }}>
                        <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '30px' }}>
                            <div style={{ background: 'var(--secondary)', color: 'var(--primary)', padding: '15px', borderRadius: '15px' }}><Clock /></div>
                            <div>
                                <h3 style={{ margin: 0 }}>System Activity Logs</h3>
                                <p style={{ fontSize: '14px', color: '#888' }}>Trace all admin and user significant actions</p>
                            </div>
                        </div>
                        {stats.logs.map((log, i) => (
                            <div key={i} style={{ display: 'flex', gap: '20px', padding: '20px', borderBottom: '1px solid #f9f9f9', alignItems: 'center' }}>
                                <div style={{ fontSize: '12px', color: '#888', minWidth: '150px' }}>{new Date(log.timestamp).toLocaleString()}</div>
                                <div style={{ fontWeight: '700', minWidth: '120px' }}>{log.user?.name || 'Guest'}</div>
                                <div style={{ padding: '5px 12px', background: '#e8f5e9', color: '#2e7d32', borderRadius: '50px', fontSize: '11px', fontWeight: '800' }}>{log.action}</div>
                                <div style={{ flex: '1', fontSize: '14px' }}>{log.details}</div>
                                <div style={{ fontSize: '11px', color: '#ccc' }}>IP: {log.ip}</div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
