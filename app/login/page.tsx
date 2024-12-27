'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { findUser } from '@/store/userSlice';

const LoginPage = () => {
  const dispatch = useDispatch();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // const handleLogin = () => {
  //   if (username.trim()) {
  //     localStorage.setItem('username', username);
  //     router.push('/home');
  //   }
  // };
  const handleLogin = async () => {
    try {
      const result = await dispatch(findUser({ username, password })).unwrap(); // Unwrap to handle success or failure
      router.push('/home');
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6">Login</h1>
      <div className="w-full max-w-md bg-white p-6 rounded-md shadow-md space-y-4">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          onClick={handleLogin}
          className="w-full px-6 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default LoginPage;