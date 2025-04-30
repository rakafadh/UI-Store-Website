import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllStores, getAllItems } from '../services/api';
import { FaShoppingBag, FaStore, FaArrowRight } from 'react-icons/fa';
import ProductCard from '../components/ProductCard';

const Home = () => {
  const [stores, setStores] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch stores
        const storesResponse = await getAllStores();
        setStores(storesResponse.payload || []);
        
        // Fetch products for featured section
        const items = await getAllItems();
        
        // Get random featured products (up to 4)
        const randomItems = items.sort(() => 0.5 - Math.random()).slice(0, 4);
        setFeaturedProducts(randomItems);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-accent text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Welcome to UI Store</h1>
          <p className="text-xl mb-8">Your one-stop shop for all your shopping needs</p>
          <Link to="/products" className="btn bg-white text-primary hover:bg-gray-100 inline-flex items-center">
            <FaShoppingBag className="mr-2" />
            Browse Products
          </Link>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Featured Products</h2>
            <Link to="/products" className="text-primary hover:underline flex items-center">
              View All <FaArrowRight className="ml-1" />
            </Link>
          </div>
          
          {loading ? (
            <div className="flex justify-center">
              <div className="spinner">Loading...</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Our Stores */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-center">Our Stores</h2>
          
          {loading ? (
            <div className="flex justify-center">
              <div className="spinner">Loading...</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {stores.map(store => (
                <div key={store.id} className="card p-6 text-center">
                  <div className="bg-primary bg-opacity-10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaStore className="text-primary text-2xl" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{store.name}</h3>
                  <p className="text-gray-600 mb-4">{store.address}</p>
                  <Link to="/products" className="text-primary hover:underline">
                    View Products
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;