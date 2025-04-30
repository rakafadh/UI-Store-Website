import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '/src/context/AuthContext.jsx';
import { FaShoppingBag, FaUser, FaBars, FaTimes } from 'react-icons/fa';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-dark text-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <FaShoppingBag className="text-2xl text-primary" />
            <span className="text-xl font-bold">UI Store</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="hover:text-primary transition">Home</Link>
            <Link to="/products" className="hover:text-primary transition">Products</Link>
            
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-secondary">Balance: ${user.balance}</span>
                <div className="relative group">
                  <button className="flex items-center space-x-1 btn btn-primary">
                    <FaUser />
                    <span>{user.name}</span>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg overflow-hidden z-20 hidden group-hover:block">
                    <Link to="/profile" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Profile</Link>
                    <button 
                      onClick={logout} 
                      className="w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link to="/auth" className="btn btn-primary">Login / Register</Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-2xl" onClick={toggleMenu}>
            {isMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 space-y-4 py-4 border-t border-gray-700">
            <Link to="/" className="block hover:text-primary transition" onClick={toggleMenu}>Home</Link>
            <Link to="/products" className="block hover:text-primary transition" onClick={toggleMenu}>Products</Link>
            
            {user ? (
              <>
                <div className="py-2">Balance: ${user.balance}</div>
                <Link to="/profile" className="block hover:text-primary transition" onClick={toggleMenu}>Profile</Link>
                <button onClick={logout} className="w-full text-left hover:text-primary transition">Logout</button>
              </>
            ) : (
              <Link to="/auth" className="block btn btn-primary text-center" onClick={toggleMenu}>Login / Register</Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;