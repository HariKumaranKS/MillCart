import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Package, MapPin, Award, User, Lock, Edit2, LogOut, Settings } from 'lucide-react';

export default function ProfilePage() {
    const { user, fetchProfile, logout, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState({
        name: user?.name || '',
        email: user?.email || '',
        address: user?.address || { street: '', city: '', state: '', pincode: '', phone: '' },
        password: '',
        profilePhoto: user?.profilePhoto || ''
    });
    const [uploading, setUploading] = useState(false);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5005';

    useEffect(() => {
        if (!authLoading && !user) {
            navigate('/login');
            return;
        }
        if (user) {
            fetchData();
        }
    }, [user, authLoading]);

    const fetchData = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/orders/myorders`);
            setOrders(res.data);
        } catch (error) {
            toast.error('Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    const handlePhotoUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('image', file);

        try {
            const res = await axios.post(`${API_URL}/api/products/upload-img`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setForm({ ...form, profilePhoto: res.data.imgUrl });
            // Update profile with new photo immediately
            await axios.put(`${API_URL}/api/users/profile`, { ...form, profilePhoto: res.data.imgUrl });
            toast.success('Profile photo updated!');
            fetchProfile();
        } catch (error) {
            toast.error('Upload failed');
        } finally {
            setUploading(false);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`${API_URL}/api/users/profile`, form);
            toast.success('Profile updated!');
            fetchProfile();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Update failed');
        }
    };

    const getTierColor = (tier) => {
        switch (tier) {
            case 'Platinum': return '#E5E4E2';
            case 'Gold': return '#FFD700';
            default: return '#C0C0C0';
        }
    };

    return (
        <div className="container" style={{ paddingTop: '150px', paddingBottom: '100px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '50px', alignItems: 'start' }}>
                {/* Left: User Card & Stats */}
                <div style={{ position: 'sticky', top: '120px' }}>
                    <div className="profile-card" style={{ background: '#fff', padding: '40px', borderRadius: '30px', boxShadow: 'var(--shadow)', borderTop: `8px solid ${getTierColor(user?.loyaltyTier)}`, textAlign: 'center' }}>
                        <div style={{ width: '120px', height: '120px', background: 'var(--bg-light)', borderRadius: '50%', margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '3px solid #fff', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', position: 'relative' }}>
                            {user?.profilePhoto ? (
                                <img src={user.profilePhoto.startsWith('/uploads') ? API_URL + user.profilePhoto : user.profilePhoto} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                            ) : (
                                <User size={50} color="var(--primary)" />
                            )}
                            <label style={{ position: 'absolute', bottom: '0', right: '0', background: 'var(--secondary)', padding: '8px', borderRadius: '50%', border: '2px solid #fff', color: 'var(--primary)', cursor: uploading ? 'wait' : 'pointer' }}>
                                <Edit2 size={14} />
                                <input type="file" onChange={handlePhotoUpload} style={{ display: 'none' }} accept="image/*" disabled={uploading} />
                            </label>
                            {uploading && <div className="loader loader-small" style={{ position: 'absolute' }}></div>}
                        </div>
                        <h2 style={{ fontSize: '24px', marginBottom: '5px' }}>{user?.name}</h2>
                        <p style={{ color: '#888', marginBottom: '20px' }}>{user?.email}</p>

                        <div style={{ background: 'var(--bg-light)', padding: '15px', borderRadius: '20px', display: 'flex', justifyContent: 'space-around', marginBottom: '30px' }}>
                            <div><div style={{ fontWeight: '900', color: 'var(--secondary)' }}>{user?.loyaltyPoints}</div><div style={{ fontSize: '10px', fontWeight: '800' }}>POINTS</div></div>
                            <div style={{ width: '1px', background: '#ddd' }}></div>
                            <div><div style={{ fontWeight: '900', color: 'var(--primary-dark)' }}>{user?.loyaltyTier}</div><div style={{ fontSize: '10px', fontWeight: '800' }}>TIER</div></div>
                        </div>

                        <div className="profile-stats" style={{ textAlign: 'left' }}>
                            <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
                                <Award color="var(--primary)" fill="rgba(212,175,55,0.1)" />
                                <div><div style={{ fontSize: '14px', fontWeight: '700' }}>Loyalty Member</div><p style={{ fontSize: '12px', color: '#888' }}>Joined on {new Date(user?.createdAt).toLocaleDateString()}</p></div>
                            </div>
                        </div>

                        <button onClick={logout} className="logout-btn-nav" style={{ width: '100%', padding: '15px', borderRadius: '15px', marginTop: '20px' }}>
                            <LogOut size={20} /> Logout Account
                        </button>
                    </div>
                </div>

                {/* Right: Forms & History */}
                <div className="profile-tabs">


                    <div style={{ background: '#fff', padding: '40px', borderRadius: '30px', boxShadow: 'var(--shadow)' }}>
                        <h3 style={{ marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '10px' }}><Settings color="var(--primary)" /> Update Details</h3>
                        <form onSubmit={handleUpdate}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                                <div className="form-group"><label>Full Name</label><input className="form-input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
                                <div className="form-group"><label>Email Address</label><input className="form-input" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} disabled /></div>
                            </div>

                            <h4 style={{ marginBottom: '15px', fontSize: '16px', color: '#888' }}>Address Management</h4>
                            <div className="form-group"><label>Street</label><input className="form-input" value={form.address.street} onChange={e => setForm({ ...form, address: { ...form.address, street: e.target.value } })} /></div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                                <div className="form-group"><label>City</label><input className="form-input" value={form.address.city} onChange={e => setForm({ ...form, address: { ...form.address, city: e.target.value } })} /></div>
                                <div className="form-group"><label>State</label><input className="form-input" value={form.address.state} onChange={e => setForm({ ...form, address: { ...form.address, state: e.target.value } })} /></div>
                                <div className="form-group"><label>Pincode</label><input className="form-input" value={form.address.pincode} onChange={e => setForm({ ...form, address: { ...form.address, pincode: e.target.value } })} /></div>
                            </div>

                            <button type="submit" className="auth-submit-btn">Update Profile</button>
                        </form>
                    </div>

                    <div style={{ marginTop: '40px' }}>
                        <h3 style={{ marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px' }}><Package color="var(--primary)" /> Recent Orders</h3>
                        {orders.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '50px', background: '#f9f9f9', borderRadius: '24px' }}>No orders yet.</div>
                        ) : (
                            orders.map(order => (
                                <div key={order._id} style={{ background: '#fff', padding: '25px', borderRadius: '24px', boxShadow: 'var(--shadow)', marginBottom: '20px', borderLeft: '10px solid var(--secondary)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <div style={{ fontWeight: '900', fontSize: '18px' }}>#{order._id.slice(-6).toUpperCase()}</div>
                                            <div style={{ fontSize: '13px', color: '#888' }}>Placed on {new Date(order.createdAt).toLocaleDateString()}</div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontWeight: '900', color: 'var(--secondary)', fontSize: '20px' }}>₹{order.total}</div>
                                            <div style={{
                                                fontSize: '11px', fontWeight: '800', background: 'var(--accent)',
                                                color: 'var(--primary-dark)', padding: '5px 12px', borderRadius: '50px',
                                                textTransform: 'uppercase', display: 'inline-block', marginTop: '5px'
                                            }}>{order.status}</div>
                                        </div>
                                    </div>
                                    <div style={{ marginTop: '15px', display: 'flex', gap: '10px', overflowX: 'auto' }}>
                                        {order.items.map((item, i) => (
                                            <div key={i} style={{ minWidth: '60px', textAlign: 'center' }}>
                                                <img src={item.product?.img?.startsWith('/uploads') ? API_URL + item.product.img : (item.product?.img || 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=60')} style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }} />
                                                <div style={{ fontSize: '10px' }}>x{item.quantity}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
