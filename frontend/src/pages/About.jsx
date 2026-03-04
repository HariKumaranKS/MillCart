import React from 'react';

export default function About() {
    return (
        <section className="section">
            <div className="container" style={{ textAlign: 'center' }}>
                <h2>Our Milling Legacy</h2>
                <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'left', background: '#fff', padding: '50px', borderRadius: '24px', boxShadow: 'var(--shadow)' }}>
                    <p style={{ fontSize: '1.2rem', marginBottom: '20px', color: 'var(--secondary)', fontWeight: '600' }}>RiceMillCart brings harvest-fresh quality directly to you.</p>
                    <p>We bridge the gap between farmers and consumers using technology to ensure natural nutrition and aroma in every grain. We specialize in premium Basmati, Ponni, and long-grain varieties.</p>
                </div>
            </div>
        </section>
    );
}
