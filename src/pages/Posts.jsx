import { useEffect, useState } from 'react';
import api from '../utils/services';

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await api.get('/posts');
      setPosts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/posts', { title, content });
      setTitle('');
      setContent('');
      fetchPosts();
    } catch (err) {
      console.error(err);
      alert('Failed to create post. Are you logged in as admin?');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/posts/${id}`);
      fetchPosts();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-red-600">Manage Posts</h1>
      <div className="bg-[#0a0a0a] p-6 rounded-lg shadow-lg mb-8 border border-red-900/30">
        <h2 className="text-xl font-bold mb-4 text-red-500">Create New Post</h2>
        <form onSubmit={handleCreate} className="space-y-4">
          <input
            type="text"
            placeholder="Post Title"
            className="w-full p-2 rounded bg-[#111] border border-red-900/50 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600/50 transition-colors"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            placeholder="Post Content"
            className="w-full p-2 rounded bg-[#111] border border-red-900/50 h-32 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600/50 transition-colors"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          ></textarea>
          <button type="submit" className="bg-red-600 hover:bg-red-700 p-2 rounded font-bold px-6 transition">
            Publish
          </button>
        </form>
      </div>

      <div className="grid gap-4">
        {posts.map(post => (
          <div key={post._id} className="bg-[#0a0a0a] p-4 rounded-lg flex justify-between items-center border border-red-900/30">
            <div>
              <h3 className="font-bold text-lg text-gray-200">{post.title}</h3>
              <p className="text-gray-400 text-sm truncate w-96">{post.content}</p>
            </div>
            <button
              onClick={() => handleDelete(post._id)}
              className="bg-red-900/80 hover:bg-red-600 text-white p-2 px-4 rounded text-sm font-bold transition"
            >
              Delete
            </button>
          </div>
        ))}
        {posts.length === 0 && <p className="text-gray-400">No posts found.</p>}
      </div>
    </div>
  );
};

export default Posts;
