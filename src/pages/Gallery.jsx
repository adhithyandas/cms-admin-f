import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useGalleryQuery, useAddGalleryMutation, useDeleteGalleryMutation } from '../hooks/useGallery';
import Modal from '../components/Modal';

const Gallery = () => {
  const { data: gallery = [], isLoading } = useGalleryQuery();
  const { mutateAsync: addGallery, isPending: isAdding } = useAddGalleryMutation();
  const { mutateAsync: deleteGallery } = useDeleteGalleryMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile) {
      alert('Please select an image to upload');
      return;
    }

    const fd = new FormData();
    fd.append('image', imageFile);

    try {
      await addGallery(fd);
      setIsModalOpen(false);
      setImageFile(null);
    } catch (error) {
      console.error(error);
      alert('Upload failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this image?')) {
      await deleteGallery(id);
    }
  };

  if (isLoading) return <div className="text-slate-400">Loading gallery...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-indigo-600">Gallery</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded font-bold transition"
        >
          <Plus size={20} />
          <span>Add Image</span>
        </button>
      </div>

      <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
        {gallery.map(item => (
          <div key={item._id} className="relative group rounded-lg overflow-hidden break-inside-avoid shadow-lg bg-slate-800">
            <img src={item.image} alt="Gallery item" className="w-full h-auto block" />
            <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button 
                onClick={() => handleDelete(item._id)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-full shadow-lg transform hover:scale-110 transition"
              >
                <Trash2 size={24} />
              </button>
            </div>
          </div>
        ))}
      </div>
      {gallery.length === 0 && <p className="text-slate-500">No images found in the gallery.</p>}

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Upload Image to Gallery"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-slate-400 mb-2">Select Image</label>
            <input 
              type="file" 
              accept="image/*"
              required
              className="w-full p-4 rounded bg-slate-800 border border-indigo-900/50 focus:outline-none text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-indigo-900/30 file:text-indigo-400 hover:file:bg-indigo-900/50 transition cursor-pointer"
              onChange={(e) => setImageFile(e.target.files[0])}
            />
          </div>
          <button 
            type="submit" 
            disabled={isAdding}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold p-3 rounded transition disabled:opacity-50"
          >
            {isAdding ? 'Uploading...' : 'Upload Image'}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default Gallery;
