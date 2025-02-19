import React, { useEffect, useState } from 'react';
import axios from '../api/axiosConfig';
import { getRole } from '../utils/Auth';
import { toast } from 'react-hot-toast';  // Import react-hot-toast

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    imageUrl: ''
  });
  const [editingProduct, setEditingProduct] = useState(null); // State to track the product being edited

  // Fetch seller products function
  const fetchSellerProducts = async () => {
    if (getRole() === 'Seller') {
      try {
        const response = await axios.get('/products/sellerProducts', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error.response?.data || error.message);
        toast.error('Error fetching products');
      }
    }
  };

  const fetchReceivedOrders = async () => {
    if (getRole() === 'Seller') {
      try {
        const response = await axios.get('/orders/seller-orders', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setOrders(response.data);
      } catch (error) {
        toast.error('Error fetching orders');
      }
    }
  };

  // Fetch seller products on initial load
  useEffect(() => {
    fetchSellerProducts();
    fetchReceivedOrders();
  }, []);

  // Watch for changes in the editingProduct state and update formData accordingly
  useEffect(() => {
    if (editingProduct) {
      setFormData({
        name: editingProduct.fields.Name,
        description: editingProduct.fields.Description,
        price: editingProduct.fields.Price,
        imageUrl: editingProduct.fields['Image URL'] // Keep the image URL for the update
      });
    }
  }, [editingProduct]); // Runs every time editingProduct changes

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle adding new product
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingProduct) {
      // If editing, update product
      try {
        const updatedData = { ...formData, 'Image URL': editingProduct.fields['Image URL'] }; // Keep the same image URL
        await axios.put(`/products/${editingProduct.id}`, updatedData, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        toast.success('Product updated successfully!');
        setEditingProduct(null);
        setFormData({ name: '', description: '', price: '', imageUrl: '' });
        // Refetch products after updating
        fetchSellerProducts();
      } catch (error) {
        toast.error('Error updating product');
      }
    } else {
      // If not editing, add new product
      try {
        await axios.post('/products', formData, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        toast.success('Product added successfully!');
        setFormData({ name: '', description: '', price: '', imageUrl: '' });
        // Refetch products after adding
        fetchSellerProducts();
      } catch (error) {
        toast.error('Error adding product');
      }
    }
  };

  // Handle deleting product
  const handleDelete = async (id) => {
    try {
      await axios.delete(`/products/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      toast.success('Product deleted successfully!');
      setProducts(products.filter((product) => product.id !== id));
    } catch (error) {
      toast.error('Error deleting product');
    }
  };

  // Handle updating product (clicking the update button)
  const handleUpdateClick = (product) => {
    setEditingProduct(product); // Set the product to edit
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await axios.post(`/orders/update-status/${orderId}`, { orderStatus: newStatus }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      toast.success('Order status updated successfully!');
      fetchReceivedOrders(); // Refresh orders
    } catch (error) {
      toast.error('Error updating order status');
    }
  };
  

  return (
    <div className="dashboard-container">
      <h2 className="form-heading">{editingProduct ? 'Edit Product' : 'Add Product'}</h2>

      {/* Add/Edit Product Form */}
      <form onSubmit={handleSubmit} className="product-form">
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={formData.name}
          onChange={handleChange}
          required
          className="input-field"
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          required
          className="input-field"
        />
        <input
          type="text"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          required
          className="input-field"
        />
        <input
          type="text"
          name="imageUrl"
          placeholder="Image URL"
          value={formData.imageUrl}
          onChange={handleChange}
          className="input-field"
        />
        <button type="submit" className="submit-btn">
          {editingProduct ? 'Update Product' : 'Add Product'}
        </button>
      </form>

      {/* Product List */}
      <div className="product-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <img src={product.fields["Image URL"]} alt={product.fields.Name} className="product-image" />
            <h3 className="product-name">{product.fields.Name}</h3>
            <p className="product-description">{product.fields.Description}</p>
            <p className="product-price">Price: ${product.fields.Price}</p>
            <button onClick={() => handleDelete(product.id)} className="delete-btn">Delete</button>
            <button onClick={() => handleUpdateClick(product)} className="update-btn">Update</button>
          </div>
        ))}
      </div>

      <h2 className="section-heading">Received Orders</h2>
      <table className="orders-table">
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Buyer Name</th>
            <th>Phone</th>
            <th>Address</th>
            <th>Quantity</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.productName}</td>
              <td>{order.buyerName}</td>
              <td>{order.phone}</td>
              <td>{order.address}</td>
              <td>{order.quantity}</td>
              <td>{order.status}</td>
              <td>
                <select onChange={(e) => updateOrderStatus(order.id, e.target.value)} value={order.status}>
                  <option value="Placed">Placed</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>


    </div>

    
  );
};

export default Dashboard;
