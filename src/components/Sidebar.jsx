import { NavLink, useNavigate } from 'react-router-dom';
import { FileText, BookOpen, LogOut, Image } from 'lucide-react';
import axiosInstance from '../lib/axios';

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axiosInstance.post('/auth/logout');
      navigate('/login');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  const linkClass = ({ isActive }) => 
    `flex items-center space-x-3 p-3 rounded transition ${isActive ? 'bg-red-900/50 text-red-500' : 'hover:bg-red-950/40 hover:text-red-400'}`;

  return (
    <aside className="w-64 bg-[#0a0a0a] border-r border-red-900/30 p-6 flex flex-col">
      <h1 className="text-2xl font-bold mb-8 text-red-600">CMS Admin</h1>
      <nav className="flex-1 space-y-2">
        <NavLink to="/courses" className={linkClass}>
          <BookOpen size={20} />
          <span>Courses</span>
        </NavLink>
        <NavLink to="/blog" className={linkClass}>
          <FileText size={20} />
          <span>Blog</span>
        </NavLink>
        <NavLink to="/gallery" className={linkClass}>
          <Image size={20} />
          <span>Gallery</span>
        </NavLink>
      </nav>
      <button onClick={handleLogout} className="flex items-center space-x-3 p-3 rounded transition mt-auto text-red-500 hover:bg-red-600 hover:text-white">
        <LogOut size={20} />
        <span>Logout</span>
      </button>
    </aside>
  );
};

export default Sidebar;
