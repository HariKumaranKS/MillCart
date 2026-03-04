import React, { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5005';

export default function Products({ onAdd }) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            setError('');
            try {
                const response = await fetch(`${API_BASE_URL}/api/products`);
                if (!response.ok) throw new Error('Failed to fetch products');
                const data = await response.json();
                setProducts(data);
            } catch (err) {
                setError('Failed to load products. Please check if backend is running.');
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    if (loading) return <section className="section"><div className="container"><h2>Our Rice Selection</h2><p style={{ textAlign: 'center', padding: '100px' }}>Loading the finest grains...</p></div></section>;

    return (
        <section className="section">
            <div className="container">
                <h2>Premium Rice Mill Products</h2>
                {error && <div className="auth-error" style={{ background: '#fef2f2', padding: '15px', borderRadius: '12px' }}>{error}</div>}
                <div className="products">
                    {products.map((p) => <ProductCard key={p._id || p.id} product={p} onAdd={onAdd} />)}
                </div>
            </div>
        </section>
    );
}
