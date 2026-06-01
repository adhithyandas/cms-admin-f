import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLoginMutation } from '../hooks/useAuth';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { mutateAsync: login, isPending } = useLoginMutation();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login({ email, password });
      navigate('/home');
    } catch (error) {
      alert('Login failed. Check credentials.');
      console.error(error);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-black text-gray-200">
      <div className="bg-[#0a0a0a] p-8 rounded-lg shadow-lg w-96 border border-red-900/30">
        <h2 className="text-2xl font-bold mb-6 text-center text-red-600">Admin Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block mb-1 text-gray-400">Email</label>
            <input
              type="email"
              className="w-full p-2 rounded bg-[#111] border border-red-900/50 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600/50 transition-colors"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-gray-400">Password</label>
            <input
              type="password"
              className="w-full p-2 rounded bg-[#111] border border-red-900/50 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600/50 transition-colors"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button 
            type="submit" 
            disabled={isPending}
            className={`w-full bg-red-600 hover:bg-red-700 p-2 rounded font-bold transition ${isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isPending ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
