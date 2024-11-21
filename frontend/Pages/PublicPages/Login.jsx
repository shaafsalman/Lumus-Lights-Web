import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../ui/Button';
import backendUrl from '../../Util/backendURL';
import { useDarkMode } from '../../Util/DarkModeContext';

const apiUrl = import.meta.env.VITE_API_URL || backendUrl;

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Use dark mode from context
  const { darkMode, toggleDarkMode } = useDarkMode();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading
    setError(''); // Clear previous errors

    try {
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Successful login
        onLogin(); // Trigger authentication state change
        navigate('/dashboard'); // Redirect to dashboard
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div
      className={`flex min-h-screen items-center justify-center ${
        darkMode ? 'bg-gray-800 text-white' : 'bg-secondary text-black'
      } p-8`}
    >
      <div
        className={`w-full max-w-md ${
          darkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'
        } p-8 rounded-lg shadow-lg`}
      >
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Login</h1>
          <button
            onClick={toggleDarkMode}
            className="p-2 bg-gray-200 rounded dark:bg-gray-700"
          >
            {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              className={`w-full p-3 border ${
                darkMode ? 'border-gray-600' : 'border-gray-300'
              } rounded bg-transparent`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              className={`w-full p-3 border ${
                darkMode ? 'border-gray-600' : 'border-gray-300'
              } rounded bg-transparent`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="text-red-500 mb-4">{error}</p>}

          <p className="mt-4 text-center">
            Don't have an account?{' '}
            <button
              className="text-blue-500 hover:underline"
              onClick={() => navigate('/register')}
              type="button"
            >
              Register here
            </button>
          </p>

          <Button text={loading ? 'Logging in...' : 'Login'} disabled={loading} />
        </form>
      </div>
    </div>
  );
};

export default Login;
