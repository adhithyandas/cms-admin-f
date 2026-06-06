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
    <div className="flex h-screen items-center justify-center bg-slate-50 text-slate-900">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96 border border-indigo-200">
        <h2 className="text-2xl font-bold mb-6 text-center text-indigo-600">Admin Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block mb-1 text-slate-600">Email</label>
            <input
              type="email"
              className="w-full p-2 rounded bg-slate-100 border border-indigo-200 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600/50 transition-colors"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-slate-600">Password</label>
            <input
              type="password"
              className="w-full p-2 rounded bg-slate-100 border border-indigo-200 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600/50 transition-colors"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className={`w-full bg-indigo-600 hover:bg-indigo-700 p-2 rounded font-bold transition ${isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isPending ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
