import { useEffect, useState } from 'react';
import api from '../utils/axios';

const Dashboard = () => {
  const [stats, setStats] = useState({ posts: 0, courses: 0, messages: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [postsRes, coursesRes, messagesRes] = await Promise.all([
          api.get('/posts').catch(() => ({ data: [] })),
          api.get('/courses').catch(() => ({ data: [] })),
          api.get('/messages').catch(() => ({ data: [] }))
        ]);
        setStats({
          posts: postsRes.data.length || 0,
          courses: coursesRes.data.length || 0,
          messages: messagesRes.data.length || 0
        });
      } catch (err) {
        console.error('Failed to fetch stats', err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
          <h2 className="text-gray-400 text-lg mb-2">Total Posts</h2>
          <p className="text-4xl font-bold text-purple-400">{stats.posts}</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
          <h2 className="text-gray-400 text-lg mb-2">Total Courses</h2>
          <p className="text-4xl font-bold text-blue-400">{stats.courses}</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
          <h2 className="text-gray-400 text-lg mb-2">Messages</h2>
          <p className="text-4xl font-bold text-green-400">{stats.messages}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
