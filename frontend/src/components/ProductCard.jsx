import React from 'react';

export default function ProductCard({ product, onAdd }) {
    const isOutOfStock = product.stock <= 0;

    return (
        <div className={`card ${isOutOfStock ? 'out-of-stock' : ''}`}>
            {product.img && <img src={product.img} alt={product.name} />}
            <div className="card-content">
                <h3>{product.name}</h3>
                <p className="rice-type"><strong>Type:</strong> {product.riceType}</p>
                <p className="quantity-unit"><strong>Unit:</strong> {product.quantityPerUnit}</p>
                <div className="stock-status-container">
                    <span className={`stock-status ${isOutOfStock ? 'out-of-stock-status' : ''}`}>
                        {isOutOfStock ? 'Out of Stock' : `${product.stock} units available`}
                    </span>
                </div>
                <p className="price">₹{product.price.toLocaleString()}</p>
                <button
                    onClick={() => onAdd(product)}
                    disabled={isOutOfStock}
                    className={isOutOfStock ? 'disabled-btn' : ''}
                >
                    {isOutOfStock ? 'Currently Unavailable' : 'Add to Cart'}
                </button>
            </div>
        </div>
    );
}
