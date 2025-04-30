import { useContext, useState } from 'react';
import { AuthContext } from '/src/context/AuthContext.jsx';
import { createTransaction } from '../services/api';
import { toast } from 'react-hot-toast';
import { FaStore, FaShoppingCart } from 'react-icons/fa';

const ProductCard = ({ product }) => {
  const { user } = useContext(AuthContext);
  const [quantity, setQuantity] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    if (!user) {
      toast.error('Please login to buy products');
      return;
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setQuantity(1);
  };

  const handleBuy = async () => {
    if (quantity > product.stock) {
      toast.error(`Only ${product.stock} items available`);
      return;
    }

    try {
      const transactionData = {
        item_id: product.id,
        quantity: quantity,
        user_id: user.id
      };

      const response = await createTransaction(transactionData);
      
      toast.success('Transaction created successfully!');
      handleCloseModal();
    } catch (error) {
      toast.error('Failed to create transaction');
      console.error('Error creating transaction:', error);
    }
  };

  return (
    <>
      <div className="card h-full flex flex-col">
        <div className="h-48 overflow-hidden">
          <img 
            src={product.image_url || '/placeholder-image.jpg'} 
            alt={product.name} 
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = '/placeholder-image.jpg';
            }}
          />
        </div>
        
        <div className="p-4 flex-grow flex flex-col">
          <h3 className="text-lg font-semibold">{product.name}</h3>
          
          <div className="flex items-center text-gray-600 mt-1">
            <FaStore className="mr-1" size={14} />
            <span className="text-sm">{product.store_name}</span>
          </div>
          
          <div className="mt-2 text-gray-700">
            <p className="text-primary font-bold">${product.price}</p>
            <p className="text-sm">Stock: {product.stock}</p>
          </div>
          
          <button 
            onClick={handleOpenModal}
            className="mt-auto btn btn-primary flex items-center justify-center"
            disabled={product.stock <= 0}
          >
            <FaShoppingCart className="mr-2" />
            {product.stock > 0 ? 'Buy Now' : 'Out of Stock'}
          </button>
        </div>
      </div>

      {/* Purchase Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md overflow-hidden">
            <div className="p-4 border-b">
              <h3 className="text-lg font-semibold">Purchase {product.name}</h3>
            </div>
            
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <span>Price per item:</span>
                <span className="font-bold">${product.price}</span>
              </div>
              
              <div className="mb-4">
                <label className="block mb-2">Quantity:</label>
                <div className="flex items-center">
                  <button 
                    onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                    className="px-3 py-1 bg-gray-200 rounded-l"
                  >
                    -
                  </button>
                  <input 
                    type="number" 
                    value={quantity} 
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-16 text-center border-t border-b py-1" 
                    min="1"
                    max={product.stock}
                  />
                  <button 
                    onClick={() => setQuantity(prev => Math.min(product.stock, prev + 1))}
                    className="px-3 py-1 bg-gray-200 rounded-r"
                  >
                    +
                  </button>
                </div>
              </div>
              
              <div className="flex items-center justify-between border-t pt-4 mt-4">
                <span className="font-bold">Total Price:</span>
                <span className="font-bold text-primary">${(product.price * quantity).toFixed(2)}</span>
              </div>
              
              {user.balance < product.price * quantity && (
                <p className="text-red-500 mt-2 text-sm">
                  Insufficient balance. Please top up your account.
                </p>
              )}
            </div>
            
            <div className="flex justify-end space-x-2 p-4 bg-gray-50">
              <button onClick={handleCloseModal} className="btn bg-gray-200 hover:bg-gray-300">
                Cancel
              </button>
              <button 
                onClick={handleBuy} 
                className="btn btn-primary"
                disabled={user.balance < product.price * quantity}
              >
                Confirm Purchase
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductCard;