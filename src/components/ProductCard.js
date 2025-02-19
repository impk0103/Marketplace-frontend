import React from 'react';
import { getRole } from '../utils/Auth';

const ProductCard = ({ product, handleBuyNow }) => {
  const role = getRole();

  return (
    <div className="product-card" id={`product-${product.id}`}>
      <img className="product-image" src={product.fields["Image URL"]} alt={product.fields.Name} />
      <h3 className="product-name">{product.fields.Name}</h3>
      <p className="product-description">{product.fields.Description}</p>
      <p className="product-price">Price: ${product.fields.Price}</p>
      {role === 'Buyer' && <button className="buy-now-button" onClick={() => handleBuyNow(product)}>Buy Now</button>}
    </div>
  );
};

export default ProductCard;
