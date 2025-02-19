import React, { useEffect, useState } from 'react';
import axios from '../api/axiosConfig';
import ProductCard from '../components/ProductCard';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [searchName, setSearchName] = useState('');
  const [searchedProduct, setSearchedProduct] = useState(null);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [loading, setLoading] = useState(true); // State to track loading status

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('/products');
        setProducts(response.data);
        setLoading(false); // Set loading to false once data is fetched
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleSearch = async () => {
    setSearchPerformed(true); // Mark search as performed
    setLoading(true); // Set loading true while searching

    try {
      const response = await axios.get(`/products/search/${searchName}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.data && response.data.length > 0) {
        setSearchedProduct(response.data[0]?.fields);
      } else {
        setSearchedProduct(null);
      }
    } catch (error) {
      console.error('Error fetching product by name:', error.response?.data?.message || error.message);
      alert('Error fetching product by name');
    } finally {
      setLoading(false); // Set loading to false after the search completes
    }
  };

  return (
    <div className="home-container">
      <h1 className="welcome-title">Welcome to Our Marketplace!</h1>
      <h2 className="search-title">Search for a Product</h2>

      {/* Search Section */}
      <div className="search-section">
        <input
          id="search-input"
          type="text"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          placeholder="Enter Product Name"
          className="search-input"
        />
        <button className="search-button" onClick={handleSearch}>Search Product</button>
      </div>

      {/* Display loading indicator while searching */}
      {loading ? (
        <p className="loading-message">Loading...</p>
      ) : (
        // Display search result or "No product found"
        searchedProduct ? (
          <div className="searched-product">
            <h3>Product Found:</h3>
            <p>Name: {searchedProduct.Name}</p>
            <p>Description: {searchedProduct.Description}</p>
            <p>Price: ${searchedProduct.Price}</p>
            <img src={searchedProduct["Image URL"]} alt={searchedProduct.Name} className="product-image" />
          </div>
        ) : (
          searchPerformed && <p className="no-product-found">No product found with that name.</p> // Only show if search has been performed
        )
      )}

      <h2 className="all-products-title">All Products</h2>
      <div className="product-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Home;
