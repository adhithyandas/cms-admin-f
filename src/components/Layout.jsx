import { Outlet, Link, useNavigate } from 'react-router-dom';
import { FileText, BookOpen, LogOut, Image } from 'lucide-react';
import api from '../utils/services';

const Layout = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
      navigate('/login');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <div className="flex h-screen bg-black text-gray-200">
      <aside className="w-64 bg-[#0a0a0a] border-r border-red-900/30 p-6 flex flex-col">
        <h1 className="text-2xl font-bold mb-8 text-red-600">CMS Admin</h1>
        <nav className="flex-1 space-y-2">
          <Link to="/courses" className="flex items-center space-x-3 p-3 rounded hover:bg-red-950/40 hover:text-red-400 transition">
            <BookOpen size={20} />
            <span>Courses</span>
          </Link>
          <Link to="/blog" className="flex items-center space-x-3 p-3 rounded hover:bg-red-950/40 hover:text-red-400 transition">
            <FileText size={20} />
            <span>Blog</span>
          </Link>
          <Link to="/gallery" className="flex items-center space-x-3 p-3 rounded hover:bg-red-950/40 hover:text-red-400 transition">
            <Image size={20} />
            <span>Gallery</span>
          </Link>
        </nav>
        <button onClick={handleLogout} className="flex items-center space-x-3 p-3 rounded transition mt-auto text-red-500 hover:bg-red-600 hover:text-white">
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </aside>
      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
