import { FaShoppingBag, FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  const year = new Date().getFullYear();
  
  return (
    <footer className="bg-dark text-white pt-10 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and Description */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <FaShoppingBag className="text-2xl text-primary" />
              <span className="text-xl font-bold">UI Store</span>
            </div>
            <p className="text-gray-400">
              Your one-stop shop for all your shopping needs. Discover great products from various stores.
            </p>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/" className="text-gray-400 hover:text-primary transition">Home</a></li>
              <li><a href="/products" className="text-gray-400 hover:text-primary transition">Products</a></li>
              <li><a href="/auth" className="text-gray-400 hover:text-primary transition">Login/Register</a></li>
            </ul>
          </div>
          
          {/* Connect With Us */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Connect With Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-primary transition text-xl">
                <FaFacebook />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition text-xl">
                <FaTwitter />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition text-xl">
                <FaInstagram />
              </a>
            </div>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-gray-400">
          <p>&copy; {year} UIStore. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;