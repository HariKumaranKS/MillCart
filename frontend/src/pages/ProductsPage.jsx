import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Search, Filter, ShoppingBag, Info, AlertTriangle } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function ProductsPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const [cart, setCart] = useState(JSON.parse(localStorage.getItem('millcart_cart') || '[]'));

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5005';

    useEffect(() => {
        fetchProducts();
    }, [category]);

    useEffect(() => {
        localStorage.setItem('millcart_cart', JSON.stringify(cart));
    }, [cart]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${API_URL}/api/products${category ? `?category=${category}` : ''}`);
            setProducts(res.data);
        } catch (error) {
            console.error('Fetch error:', error);
            toast.error('Failed to load products');
        } finally {
            setLoading(false);
        }
    };

    const addToCart = (product) => {
        const existing = cart.find(i => i._id === product._id);
        if (existing) {
            setCart(cart.map(i => i._id === product._id ? { ...i, quantity: i.quantity + 1 } : i));
        } else {
            setCart([...cart, { ...product, quantity: 1 }]);
        }
        toast.success(`${product.name} added to cart!`);
    };

    const filteredProducts = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

    return (
        <section className="section" style={{ paddingTop: '120px' }}>
            <div className="container">
                <div className="section-header">
                    <h2>Our Rice Varieties</h2>
                    <div className="underline"></div>
                </div>

                <div className="discovery-header" style={{ display: 'flex', gap: '20px', marginBottom: '40px', flexWrap: 'wrap' }}>
                    <div className="search-bar" style={{ flex: '2', minWidth: '280px', position: 'relative' }}>
                        <Search style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#888' }} size={20} />
                        <input
                            placeholder="Search by name..."
                            className="form-input"
                            style={{ paddingLeft: '50px' }}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="filter-tabs" style={{ display: 'flex', gap: '10px', flex: '1', minWidth: '280px', overflowX: 'auto', paddingBottom: '10px' }}>
                        {['', 'Rice', 'Lentils', 'Oil'].map(cat => (
                            <button
                                key={cat}
                                onClick={() => setCategory(cat)}
                                className={`filter-btn ${category === cat ? 'active' : ''}`}
                                style={{
                                    padding: '10px 20px',
                                    borderRadius: '50px',
                                    border: '1.5px solid var(--secondary)',
                                    background: category === cat ? 'var(--secondary)' : 'transparent',
                                    color: category === cat ? 'var(--primary)' : 'var(--secondary)',
                                    fontWeight: '700',
                                    cursor: 'pointer'
                                }}
                            >
                                {cat || 'All'}
                            </button>
                        ))}
                    </div>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '100px' }}>
                        <div className="loader"></div>
                        <p>Loading our finest grains...</p>
                    </div>
                ) : (
                    <div className="product-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '30px' }}>
                        {filteredProducts.map(product => (
                            <div key={product._id} className="product-card" style={{
                                background: '#fff',
                                borderRadius: '24px',
                                padding: '15px',
                                boxShadow: 'var(--shadow)',
                                transition: 'var(--transition)',
                                border: '1px solid #f0f0f0',
                                position: 'relative',
                                display: 'flex',
                                flexDirection: 'column'
                            }}>
                                <Link to={`/products/${product._id}`} style={{ textDecoration: 'none', color: 'inherit', flex: '1' }}>
                                    <div className="product-img-wrapper" style={{
                                        height: '220px',
                                        background: '#f9f9f9',
                                        borderRadius: '18px',
                                        overflow: 'hidden',
                                        marginBottom: '20px'
                                    }}>
                                        <img
                                            src={product.img?.startsWith('/uploads') ? API_URL + product.img : (product.img || 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=500')}
                                            alt={product.name}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                    </div>

                                    <div className="product-info" style={{ padding: '0 10px 10px' }}>
                                        <div style={{ fontSize: '12px', color: 'var(--primary-dark)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '5px' }}>
                                            {product.riceType}
                                        </div>
                                        <h3 style={{ fontSize: '18px', marginBottom: '10px' }}>{product.name}</h3>

                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div>
                                                <div style={{ fontSize: '22px', fontWeight: '800', color: 'var(--secondary)' }}>₹{product.price}</div>
                                                <div style={{ fontSize: '14px', color: '#888' }}>{product.quantityPerUnit}</div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>

                                <button
                                    onClick={(e) => { e.preventDefault(); addToCart(product); }}
                                    disabled={product.stock <= 0}
                                    className="add-to-cart-btn"
                                    style={{
                                        position: 'absolute',
                                        bottom: '25px',
                                        right: '25px',
                                        width: '45px',
                                        height: '45px',
                                        background: product.stock > 0 ? 'var(--secondary)' : '#ccc',
                                        color: 'var(--primary)',
                                        border: 'none',
                                        borderRadius: '14px',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        transition: 'transform 0.2s',
                                        zIndex: 10
                                    }}
                                >
                                    {product.stock > 0 ? <ShoppingBag size={20} /> : <AlertTriangle size={20} color="#fff" />}
                                </button>

                                {product.stock < 10 && product.stock > 0 && (
                                    <div style={{ fontSize: '11px', color: '#ff6b6b', marginTop: '10px', fontWeight: '600', padding: '0 10px' }}>
                                        Only {product.stock} left in stock!
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
