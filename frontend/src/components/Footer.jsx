import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
    return (
        <footer style={{ background: 'var(--secondary)', color: 'rgba(255,255,255,0.7)', padding: '100px 0 50px' }}>
            <div className="container">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '50px', marginBottom: '80px' }}>
                    <div className="footer-brand">
                        <Link to="/" className="logo-section" style={{ marginBottom: '25px', display: 'flex' }}>
                            <div className="logo-mark">S</div>
                            <div className="logo-text">
                                <span className="name-main" style={{ color: 'var(--primary)' }}>Sri Sastha</span>
                                <span className="name-sub" style={{ color: 'rgba(255,255,255,0.5)' }}>Modern Rice Mill</span>
                            </div>
                        </Link>
                        <p style={{ lineHeight: '1.8', marginBottom: '30px' }}>
                            Dedicated to providing premium quality rice since 1990. We bridge the gap between
                            traditional rice farming and modern automated milling.
                        </p>
                    </div>

                    <div className="footer-links">
                        <h4 style={{ color: 'var(--primary)', marginBottom: '30px', fontSize: '20px' }}>Quick Links</h4>
                        <ul style={{ listStyle: 'none' }}>
                            {['About Us', 'Our Products', 'Pricing', 'Testimonials', 'Contact'].map(link => (
                                <li key={link} style={{ marginBottom: '15px' }}>
                                    <Link to={`/${link.toLowerCase().replace(' ', '-')}`} style={{ color: 'inherit', textDecoration: 'none', transition: 'var(--transition)' }}>{link}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="footer-support">
                        <h4 style={{ color: 'var(--primary)', marginBottom: '30px', fontSize: '20px' }}>Support</h4>
                        <ul style={{ listStyle: 'none' }}>
                            {['Privacy Policy', 'Terms of Service', 'Refund Policy', 'Shipping Info'].map(link => (
                                <li key={link} style={{ marginBottom: '15px' }}>
                                    <Link to="#" style={{ color: 'inherit', textDecoration: 'none' }}>{link}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="footer-contact">
                        <h4 style={{ color: 'var(--primary)', marginBottom: '30px', fontSize: '20px' }}>Contact Mill</h4>
                        <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
                            <MapPin size={24} color="var(--primary)" />
                            <span>10/3, Kodiyampalayam Nall Road, <br />Uthukuli R.S, 638752</span>
                        </div>
                        <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
                            <Phone size={24} color="var(--primary)" />
                            <span>+91 9865260259</span>
                        </div>
                        <div style={{ display: 'flex', gap: '15px' }}>
                            <Mail size={24} color="var(--primary)" />
                            <span>srisasthamodernricemill@gmail.com</span>
                        </div>
                    </div>
                </div>

                <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', marginBottom: '40px' }}></div>
                <div style={{ textAlign: 'center', fontSize: '14px' }}>
                    &copy; {new Date().getFullYear()} Sri Sastha Modern Rice Mill. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
