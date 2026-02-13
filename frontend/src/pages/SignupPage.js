import { useState } from 'react';
import axios from 'axios';
import { UisLockAlt, UisAt } from '@iconscout/react-unicons-solid';
import { UisUserMd } from '@iconscout/react-unicons-solid';
import logo from '../Images/Logo.png';

export default function SignupPage({ onSignupSuccess }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:3001/api/auth/signup', formData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      onSignupSuccess(response.data.user);
    } catch (err) {
      setError(err.response?.data?.error || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center relative overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute top-[-50px] left-[-50px] w-[200px] h-[200px] bg-white bg-opacity-10 rounded-full" />

      <div className="absolute bottom-[-100px] right-[-100px] w-[300px] h-[300px] bg-white bg-opacity-5 rounded-full" />

      <div className='relative z-10 w-full flex flex-col items-center'>
        {/* Logo and Title */}
        <div className="text-center mb-6">
          <div className='text-center flex flex-row items-center justify-center'>
            <img 
              src={logo} 
              alt="FinFlow" 
              className="w-16 h-16 mx-3 rounded-xl shadow-lg object-cover" 
            />
            <h2 className="text-5xl font-bold text-white d">FinFlow</h2>
          </div>
          <p className='text-white text-lg font-light mt-3 drop-shadow-md'>
            Smart financial tracking for modern life
          </p>
        </div>

        {/* Main card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md relative z-10">
          <h1 className="text-2xl font-bold text-gray-800 mb-2 text-center">
            Create Account
          </h1>
          <p className="text-gray-600 text-center text-sm mb-8">
            Join FinFlow to start tracking your finances
          </p>

          <form onSubmit={handleSignup} className="space-y-4">
            {/* Email Input */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Email
              </label>

              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 pl-10 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent h-12"
                  required
                />

                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                  <UisAt size="20" />
                </span>
              </div>
            </div>

            {/* First Name Input */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                First Name
              </label>

              <div className="relative">
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  placeholder="Karim"
                  className="w-full px-4 py-3 pl-10 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent h-12"
                  required
                />

                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                <UisUserMd size="20" />
                </span>
              </div>
            </div>

            {/* Last Name Input */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Last Name
              </label>

              <div className="relative">
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  placeholder="Farag"
                  className="w-full px-4 py-3 pl-10 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent h-12"
                  required
                />

                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                  <UisUserMd></UisUserMd>
                </span>
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Password
              </label>

              <div className="relative">
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pl-10 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent h-12"
                  required
                />

                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                  <UisLockAlt size="20" />
                </span>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            {/* Signup Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold py-3 px-4 rounded-lg hover:from-blue-600 hover:to-purple-700 transition duration-200 disabled:opacity-50 h-13"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-gray-600 mt-6 text-sm">
            Already have an account?{' '}
            <a href="/login" className="text-blue-500 hover:underline font-semibold">
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}