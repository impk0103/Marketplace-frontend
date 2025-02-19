import React, { useState, useEffect } from 'react';
import axios from '../api/axiosConfig';
import ProductCard from '../components/ProductCard';
import { getRole } from '../utils/Auth';

const Orders = () => {
  const [products, setProducts] = useState([]);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [orderDetails, setOrderDetails] = useState({
    name: '',
    address: '',
    phone: '',
    quantity: '1',
  });
  const [buyerOrders, setBuyerOrders] = useState([]);

  const role = getRole();

  // ✅ Fetch buyer orders function (Now accessible everywhere)
  const fetchOrders = async () => {
    try {
      const response = await axios.get('/orders/my-orders');
      setBuyerOrders(response.data);
    } catch (error) {
      console.error('Failed to fetch buyer orders:', error);
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('/products');
        setProducts(response.data);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
    };

    if (role === 'Buyer') {
      fetchOrders(); // ✅ Now fetchOrders is accessible here
    }

    fetchProducts();
  }, [role]);

  const handleBuyNow = (product) => {
    setSelectedProduct(product);
    setShowOrderForm(true);
  };

  const handleCloseForm = () => {
    setShowOrderForm(false);
    setSelectedProduct(null);
  };

  const handleChange = (e) => {
    setOrderDetails({
      ...orderDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const orderData = {
        productName: selectedProduct.fields.Name,
        quantity: orderDetails.quantity,
        buyerName: orderDetails.name,
        buyerPhone: orderDetails.phone,
        buyerAddress: orderDetails.address,
      };

      const response = await axios.post('/orders/placeOrder', orderData);
      
      setShowOrderForm(false);
      setSelectedProduct(null);
      
      // ✅ Immediately fetch updated orders after placing one
      await fetchOrders();

      // Reset form after submission
      setOrderDetails({
        name: '',
        address: '',
        phone: '',
        quantity: '1',
      });

    } catch (error) {
      console.error('Failed to place order:', error.response?.data?.message);
    }
  };

  return (
    <div className="orders-page">
      <h1 className="orders-title">Orders Page</h1>

      {/* Side-by-side layout */}
      <div className="orders-content">
        {/* Product List */}
        <div className="product-list">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              handleBuyNow={() => handleBuyNow(product)}
            />
          ))}
        </div>

        {/* Order Form (Visible only when showOrderForm is true) */}
        {showOrderForm && role === 'Buyer' && (
          <div className="order-form">
            <h3 className="form-title">Order Details</h3>
            <form onSubmit={handleSubmit} className="order-details-form">
              <div className="form-group">
                <label>Name:</label>
                <input
                  type="text"
                  name="name"
                  value={orderDetails.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Phone:</label>
                <input
                  type="text"
                  name="phone"
                  value={orderDetails.phone}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Address:</label>
                <input
                  type="text"
                  name="address"
                  value={orderDetails.address}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Quantity:</label>
                <input
                  type="text"
                  name="quantity"
                  value={orderDetails.quantity}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="submit-order-btn">
                  Submit Order
                </button>
                <button type="button" className="cancel-order-btn" onClick={handleCloseForm}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Buyer's Orders in Table Format */}
      {role === 'Buyer' && (
        <div className="buyer-orders">
          <h2 className="orders-subtitle">Your Orders</h2>
          {buyerOrders.length > 0 ? (
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Quantity</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {buyerOrders.map((order) => (
                  <tr key={order.id}>
                    <td>{Array.isArray(order.productName) ? order.productName[0] : 'Unknown'}</td>
                    <td>{order.quantity}</td>
                    <td>
                      <span className={`order-status status-${order.status ? order.status.toLowerCase() : 'unknown'}`}>
                        {order.status || 'Unknown'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="no-orders">No orders placed yet.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Orders;
