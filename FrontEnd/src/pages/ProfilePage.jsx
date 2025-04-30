import { useContext, useState } from 'react';
import { AuthContext } from '/src/context/AuthContext.jsx';
import { updateUserProfile, topupBalance } from '../services/api';
import { toast } from 'react-hot-toast';

const ProfilePage = () => {
  const { user, updateUser, logout } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });
  const [balance, setBalance] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await updateUserProfile(formData);
      if (response.success) {
        updateUser(response.payload);
        toast.success('Profile updated successfully');
      } else {
        toast.error(response.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('An error occurred while updating profile');
    } finally {
      setLoading(false);
    }
  };

  const handleTopup = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await topupBalance({ amount: parseFloat(balance) });
      if (response.success) {
        updateUser({ ...user, balance: user.balance + parseFloat(balance) });
        toast.success('Balance topped up successfully');
        setBalance('');
      } else {
        toast.error(response.message || 'Failed to top up balance');
      }
    } catch (error) {
      console.error('Error topping up balance:', error);
      toast.error('An error occurred while topping up balance');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg overflow-hidden p-6">
        <h2 className="text-2xl font-bold mb-6 text-center">Profile</h2>

        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleChange}
              className="input-field"
              placeholder="Your name"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              className="input-field"
              placeholder="Your email"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full btn btn-primary ${loading ? 'bg-gray-400' : ''}`}
          >
            {loading ? 'Updating...' : 'Update Profile'}
          </button>
        </form>

        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Top Up Balance</h3>
          <form onSubmit={handleTopup} className="space-y-4">
            <div>
              <label htmlFor="balance" className="block text-sm font-medium text-gray-700">
                Amount
              </label>
              <input
                type="number"
                name="balance"
                id="balance"
                value={balance}
                onChange={(e) => setBalance(e.target.value)}
                className="input-field"
                placeholder="Enter amount"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !balance}
              className={`w-full btn btn-secondary ${loading ? 'bg-gray-400' : ''}`}
            >
              {loading ? 'Processing...' : 'Top Up'}
            </button>
          </form>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={logout}
            className="btn bg-red-500 text-white hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;