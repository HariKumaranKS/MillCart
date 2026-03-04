import React from 'react';

export default function Hero({ onNavigate }) {
    return (
        <section className="hero">
            <div>
                <h1>Experience the Purity of Freshly Milled Rice</h1>
                <p>Premium quality grains delivered directly from our mill to your doorstep. Pure, nutritious, and harvest-fresh.</p>
                <button onClick={() => onNavigate('products')}>Exlpore Products</button>
            </div>
        </section>
    );
}
