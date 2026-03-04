import React, { useState } from 'react';

export default function Profile({ user, onUpdate, onLogout }) {
    const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '', password: '' });
    const [editing, setEditing] = useState(false);
    const [message, setMessage] = useState('');
    const handleSubmit = e => { e.preventDefault(); onUpdate(form, setMessage); setEditing(false); };
    return (
        <div className="section"><div className="container"><div className="profile-layout">
            <aside className="profile-sidebar">
                <div className="profile-avatar">{form.name[0]?.toUpperCase()}</div>
                <div className="profile-name">{form.name}</div>
                <div className="profile-email">{form.email}</div>
                <button className="profile-btn active" onClick={() => setEditing(false)}>Overview</button>
                <button className="profile-btn logout" onClick={onLogout}>Logout</button>
            </aside>
            <main className="profile-main">
                <h2>My Account</h2>
                {editing ? (
                    <form onSubmit={handleSubmit} style={{ maxWidth: 400 }}>
                        <div className="form-group"><input className="auth-input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required /></div>
                        <div className="form-group"><input className="auth-input" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required /></div>
                        <button type="submit" className="auth-btn">Save Changes</button>
                    </form>
                ) : (
                    <div style={{ marginTop: 20 }}>
                        <p><strong>Name:</strong> {form.name}</p>
                        <p><strong>Email:</strong> {form.email}</p>
                        <button onClick={() => setEditing(true)} className="profile-btn" style={{ background: 'var(--primary)', color: 'white', width: 'auto', padding: '10px 20px', marginTop: '20px' }}>Edit Profile</button>
                    </div>
                )}
                {message && <div style={{ color: 'green', marginTop: '10px' }}>{message}</div>}
            </main>
        </div></div></div>
    );
}
