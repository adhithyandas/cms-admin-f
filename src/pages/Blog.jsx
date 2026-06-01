import { useState } from 'react';
import { Plus, Trash2, Edit } from 'lucide-react';
import { useBlogQuery, useAddBlogMutation, useUpdateBlogMutation, useDeleteBlogMutation } from '../hooks/useBlog';
import Modal from '../components/Modal';

const Blog = () => {
  const { data: blogs = [], isLoading } = useBlogQuery();
  const { mutateAsync: addBlog, isPending: isAdding } = useAddBlogMutation();
  const { mutateAsync: updateBlog, isPending: isUpdating } = useUpdateBlogMutation();
  const { mutateAsync: deleteBlog } = useDeleteBlogMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [formData, setFormData] = useState({ title: '', description: '', thumbnail: null });

  const handleOpenAdd = () => {
    setEditingBlog(null);
    setFormData({ title: '', description: '', thumbnail: null });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (blog) => {
    setEditingBlog(blog);
    setFormData({ title: blog.title, description: blog.description, thumbnail: null });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append('title', formData.title);
    fd.append('description', formData.description);
    if (formData.thumbnail) {
      fd.append('thumbnail', formData.thumbnail);
    } else if (!editingBlog) {
      alert('Please upload a thumbnail');
      return;
    }

    try {
      if (editingBlog) {
        await updateBlog({ id: editingBlog._id, formData: fd });
      } else {
        await addBlog(fd);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
      alert('Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      await deleteBlog(id);
    }
  };

  if (isLoading) return <div className="text-gray-400">Loading blogs...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-red-600">Blog Posts</h1>
        <button 
          onClick={handleOpenAdd}
          className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-bold transition"
        >
          <Plus size={20} />
          <span>Add Blog</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map(blog => (
          <div key={blog._id} className="bg-[#0a0a0a] border border-red-900/30 rounded-lg overflow-hidden flex flex-col">
            <img src={blog.thumbnail} alt={blog.title} className="w-full h-48 object-cover" />
            <div className="p-4 flex-1 flex flex-col">
              <h3 className="font-bold text-lg text-gray-200 mb-2">{blog.title}</h3>
              <p className="text-gray-400 text-sm mb-4 line-clamp-3 flex-1">{blog.description}</p>
              <div className="flex justify-end space-x-2 mt-auto">
                <button 
                  onClick={() => handleOpenEdit(blog)}
                  className="p-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded transition"
                >
                  <Edit size={18} />
                </button>
                <button 
                  onClick={() => handleDelete(blog._id)}
                  className="p-2 bg-red-900/50 hover:bg-red-600 text-red-300 hover:text-white rounded transition"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
        {blogs.length === 0 && <p className="text-gray-500 col-span-full">No blog posts found.</p>}
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingBlog ? 'Edit Blog' : 'Add New Blog'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-400 mb-1">Title</label>
            <input 
              type="text" 
              required
              className="w-full p-2 rounded bg-[#111] border border-red-900/50 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600/50 text-gray-200"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-gray-400 mb-1">Description</label>
            <textarea 
              required
              className="w-full p-2 rounded bg-[#111] border border-red-900/50 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600/50 text-gray-200 h-32"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-gray-400 mb-1">Thumbnail Image</label>
            <input 
              type="file" 
              accept="image/*"
              className="w-full p-2 rounded bg-[#111] border border-red-900/50 focus:outline-none text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-red-900/30 file:text-red-400 hover:file:bg-red-900/50 transition"
              onChange={(e) => setFormData({...formData, thumbnail: e.target.files[0]})}
            />
            {editingBlog && !formData.thumbnail && <p className="text-sm text-gray-500 mt-1">Leave empty to keep current thumbnail</p>}
          </div>
          <button 
            type="submit" 
            disabled={isAdding || isUpdating}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold p-2 rounded transition disabled:opacity-50"
          >
            {isAdding || isUpdating ? 'Saving...' : 'Save Blog'}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default Blog;
