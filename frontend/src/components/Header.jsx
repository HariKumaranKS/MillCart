import React from 'react';

export default function Header({ cartCount, onNavigate, active, user, onLogout }) {
    return (
        <header className="header">
            <div className="logo">RiceMillCart</div>
            <nav>
                <button className={active === 'home' ? 'nav-link active' : 'nav-link'} onClick={() => onNavigate('home')}>Home</button>
                <button className={active === 'products' ? 'nav-link active' : 'nav-link'} onClick={() => onNavigate('products')}>Products</button>
                <button className={active === 'cart' ? 'nav-link active' : 'nav-link'} onClick={() => onNavigate('cart')}>
                    Cart <span id="cart-count">{cartCount}</span>
                </button>
                <button className={active === 'about' ? 'nav-link active' : 'nav-link'} onClick={() => onNavigate('about')}>About</button>
                {user?.isAdmin && (
                    <button className={active === 'admin' ? 'nav-link active' : 'nav-link'} onClick={() => onNavigate('admin')}>Admin</button>
                )}
                <button className={active === 'profile' ? 'nav-link active' : 'nav-link'} onClick={() => onNavigate('profile')}>
                    {user ? user.name : 'Profile'}
                </button>
                {user && (
                    <button className="nav-link" onClick={onLogout} style={{ color: '#e74c3c' }}>Logout</button>
                )}
            </nav>
        </header>
    );
}
