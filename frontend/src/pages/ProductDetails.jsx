import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { ShoppingCart, ArrowLeft, Star, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function ProductDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5005';

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                // Since our generic GET /api/products returns all, 
                // we'll filter here or add a specific route.
                // Let's assume we have /api/products/:id for a full-featured app.
                const res = await axios.get(`${API_URL}/api/products`);
                const found = res.data.find(p => p._id === id);
                if (found) setProduct(found);
                else toast.error('Product not found');
            } catch (error) {
                toast.error('Failed to load product');
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const addToCart = () => {
        const cart = JSON.parse(localStorage.getItem('millcart_cart') || '[]');
        const existing = cart.find(i => i._id === product._id);
        if (existing) {
            localStorage.setItem('millcart_cart', JSON.stringify(
                cart.map(i => i._id === product._id ? { ...i, quantity: i.quantity + quantity } : i)
            ));
        } else {
            localStorage.setItem('millcart_cart', JSON.stringify([...cart, { ...product, quantity }]));
        }
        toast.success(`${product.name} added to cart!`);
    };

    if (loading) return <div className="loader-container"><div className="loader"></div></div>;
    if (!product) return <div className="container" style={{ paddingTop: '150px' }}><h2>Product not found</h2><Link to="/products">Back to products</Link></div>;

    return (
        <div className="container" style={{ paddingTop: '150px', paddingBottom: '100px' }}>
            <button onClick={() => navigate(-1)} className="btn-outline" style={{ border: 'none', background: '#f0f0f0', marginBottom: '40px', padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ArrowLeft size={18} /> Back
            </button>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'start' }}>
                {/* Product Image */}
                <div style={{ background: '#fff', borderRadius: '40px', padding: '30px', boxShadow: 'var(--shadow-lg)' }}>
                    <img src={product.img?.startsWith('/uploads') ? API_URL + product.img : (product.img || 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=800')} style={{ width: '100%', borderRadius: '25px', objectFit: 'cover' }} alt={product.name} />
                </div>

                {/* Product Details */}
                <div className="product-details-content">
                    <div style={{ color: 'var(--primary-dark)', fontWeight: '800', fontSize: '14px', letterSpacing: '2px', marginBottom: '15px', textTransform: 'uppercase' }}>
                        Premium {product.riceType} Selection
                    </div>
                    <h1 style={{ fontSize: '48px', marginBottom: '10px' }}>{product.name}</h1>
                    <div style={{ display: 'flex', gap: '5px', color: 'var(--primary)', marginBottom: '30px' }}>
                        {[...Array(5)].map((_, i) => <Star key={i} size={18} fill="currentColor" />)}
                        <span style={{ color: '#888', marginLeft: '10px', fontSize: '14px' }}>(4.9/5 based on 200+ reviews)</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '20px', marginBottom: '40px' }}>
                        <span style={{ fontSize: '42px', fontWeight: '900', color: 'var(--secondary)' }}>₹{product.price}</span>
                        <span style={{ fontSize: '18px', color: '#888', textDecoration: 'line-through' }}>₹{product.price + 50}</span>
                        <div style={{ background: 'var(--primary)', color: 'var(--secondary)', padding: '5px 12px', borderRadius: '50px', fontSize: '12px', fontWeight: '800' }}>BEST VALUE</div>
                    </div>

                    <p style={{ fontSize: '18px', color: '#666', lineHeight: '1.8', marginBottom: '40px' }}>
                        Experience the authentic taste of the finest {product.riceType} from Sri Sastha Modern Rice Mill.
                        Our grains are aged to perfection and processed with state-of-the-art technology to
                        preserve nutrition and aroma. Packaged in a {product.quantityPerUnit} moisture-proof bag.
                    </p>

                    <div style={{ display: 'flex', gap: '20px', marginBottom: '50px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', border: '1.5px solid #E5E7EB', padding: '10px 20px', borderRadius: '50px' }}>
                            <button onClick={() => setQuantity(Math.max(1, quantity - 1))} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '20px' }}>-</button>
                            <span style={{ fontWeight: '800', width: '30px', textAlign: 'center' }}>{quantity}</span>
                            <button onClick={() => setQuantity(quantity + 1)} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '20px' }}>+</button>
                        </div>
                        <button
                            onClick={addToCart}
                            style={{ flex: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', background: 'var(--secondary)', color: 'var(--white)', border: 'none', borderRadius: '50px', padding: '15px 40px', fontWeight: '800', fontSize: '18px', cursor: 'pointer' }}
                        >
                            <ShoppingCart size={22} color="var(--primary)" /> Add to Cart
                        </button>
                    </div>

                    {/* Trust Badges */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div style={{ display: 'flex', gap: '15px', padding: '20px', background: '#f9f9f9', borderRadius: '20px', border: '1px solid #eee' }}>
                            <ShieldCheck color="var(--primary)" />
                            <div><div style={{ fontWeight: '700', fontSize: '14px' }}>100% Organic</div><div style={{ fontSize: '12px', color: '#888' }}>Pesticide free grains</div></div>
                        </div>
                        <div style={{ display: 'flex', gap: '15px', padding: '20px', background: '#f9f9f9', borderRadius: '20px', border: '1px solid #eee' }}>
                            <RefreshCw color="var(--primary)" />
                            <div><div style={{ fontWeight: '700', fontSize: '14px' }}>Easy Returns</div><div style={{ fontSize: '12px', color: '#888' }}>15 days replacement</div></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
