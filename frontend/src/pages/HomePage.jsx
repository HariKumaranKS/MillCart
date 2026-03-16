import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, ShieldCheck, Truck, TrendingUp } from 'lucide-react';

export default function HomePage() {
    return (
        <div className="homepage">
            {/* Hero Section */}
            <section className="hero">
                <div className="container" style={{ display: 'flex', alignItems: 'center' }}>
                    <div className="hero-content">
                        <div className="hero-pill">
                            <Star size={16} fill="var(--primary)" />
                            Premium Quality Rice Since 1990
                        </div>
                        <h1>Pure <span>Tradition</span>, <br />Modern <span>Trust</span>.</h1>
                        <p className="hero-desc">
                            Sri Sastha Modern Rice Mill delivers the finest, sustainably processed rice directly
                            from the heart of the fields to your dining table. Experience the premium taste of tradition.
                        </p>
                        <div className="hero-btns">
                            <Link to="/products" className="btn-primary">
                                Shop Our Products <ArrowRight size={20} />
                            </Link>
                            <Link to="/about" className="btn-outline">Our Story</Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features" style={{ padding: '100px 0', background: '#fff' }}>
                <div className="container">
                    <div className="section-header">
                        <h2>Why Choose Us?</h2>
                        <div className="underline"></div>
                    </div>

                    <div className="features-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '30px' }}>
                        {[
                            { icon: <ShieldCheck size={40} />, title: "Quality Guaranteed", desc: "Rigorous quality checks at every stage of milling." },
                            { icon: <Truck size={40} />, title: "Direct Delivery", desc: "Fast and secure delivery from our mill to your home." },
                            { icon: <TrendingUp size={40} />, title: "Best Value", desc: "Premium quality at the most competitive mill prices." },
                            { icon: <Star size={40} />, title: "Loyalty Rewards", desc: "Join our membership for exclusive discounts and rewards." }
                        ].map((item, idx) => (
                            <div key={idx} className="feature-card" style={{
                                padding: '40px',
                                border: '1px solid #f0f0f0',
                                borderRadius: '20px',
                                textAlign: 'center',
                                transition: 'var(--transition)'
                            }}>
                                <div style={{ color: 'var(--primary)', marginBottom: '20px', display: 'flex', justifyContent: 'center' }}>{item.icon}</div>
                                <h3 style={{ marginBottom: '15px', color: 'var(--secondary)' }}>{item.title}</h3>
                                <p style={{ color: 'var(--text-muted)' }}>{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section >
        </div >
    );
}
