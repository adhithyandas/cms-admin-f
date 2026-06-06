import { useState } from 'react';
import { Plus, Trash2, Edit } from 'lucide-react';
import { useCourseQuery, useAddCourseMutation, useUpdateCourseMutation, useDeleteCourseMutation } from '../hooks/useCourse';
import Modal from '../components/Modal';

const Courses = () => {
  const { data: courses = [], isLoading } = useCourseQuery();
  const { mutateAsync: addCourse, isPending: isAdding } = useAddCourseMutation();
  const { mutateAsync: updateCourse, isPending: isUpdating } = useUpdateCourseMutation();
  const { mutateAsync: deleteCourse } = useDeleteCourseMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [formData, setFormData] = useState({ title: '', description: '', price: '', icon: null });

  const handleOpenAdd = () => {
    setEditingCourse(null);
    setFormData({ title: '', description: '', price: '', icon: null });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (course) => {
    setEditingCourse(course);
    setFormData({ title: course.title, description: course.description, price: course.price, icon: null });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append('title', formData.title);
    fd.append('description', formData.description);
    fd.append('price', formData.price);

    if (formData.icon) {
      fd.append('icon', formData.icon);
    } else if (!editingCourse) {
      alert('Please upload an icon');
      return;
    }

    try {
      if (editingCourse) {
        await updateCourse({ id: editingCourse._id, formData: fd });
      } else {
        await addCourse(fd);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
      alert('Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      await deleteCourse(id);
    }
  };

  if (isLoading) return <div className="text-slate-600">Loading courses...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-indigo-600">Courses</h1>

        <button 
          onClick={handleOpenAdd}
          className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded font-bold transition"
        >
          <Plus size={20} />
          <span>Add Course</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map(course => (
          <div key={course._id} className="bg-white border border-indigo-200 rounded-lg overflow-hidden p-6 flex flex-col relative group hover:border-indigo-600/50 transition">
            <div className="flex items-center space-x-4 mb-4">
              <img src={course.icon} alt={course.title} className="w-16 h-16 object-cover rounded bg-slate-100" />

              <div>
                <h3 className="font-bold text-xl text-slate-900">{course.title}</h3>
                <span className="inline-block bg-indigo-50 text-indigo-600 px-2 py-1 rounded text-sm font-bold mt-1">
                  ${course.price}
                </span>
              </div>
            </div>

            <p className="text-slate-600 text-sm mb-6 flex-1 line-clamp-4">{course.description}</p>

            <div className="flex justify-end space-x-2 border-t border-indigo-100 pt-4 mt-auto">
              <button
                onClick={() => handleOpenEdit(course)}
                className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded transition"
              >
                <Edit size={18} />
              </button>

              <button
                onClick={() => handleDelete(course._id)}
                className="p-2 bg-indigo-100 hover:bg-indigo-600 text-indigo-700 hover:text-white rounded transition"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}

        {courses.length === 0 && <p className="text-slate-500 col-span-full">No courses found.</p>}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCourse ? 'Edit Course' : 'Add New Course'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-slate-600 mb-1">Title</label>
            <input
              type="text"
              required
              className="w-full p-2 rounded bg-slate-100 border border-indigo-200 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600/50 text-slate-900"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-slate-600 mb-1">Description</label>
            <textarea
              required
              className="w-full p-2 rounded bg-slate-100 border border-indigo-200 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600/50 text-slate-900 h-24"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-slate-600 mb-1">Price</label>
            <input
              type="number"
              step="0.01"
              required
              className="w-full p-2 rounded bg-slate-100 border border-indigo-200 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600/50 text-slate-900"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-slate-600 mb-1">Icon/Image</label>
            {formData.icon instanceof File ? (
              <img src={URL.createObjectURL(formData.icon)} alt="Preview" className="w-16 h-16 object-cover rounded mb-2 border border-indigo-200 bg-slate-100" />
            ) : editingCourse?.icon ? (
              <img src={editingCourse.icon} alt="Current" className="w-16 h-16 object-cover rounded mb-2 border border-indigo-200 bg-slate-100" />
            ) : null}
            <input
              type="file"
              accept="image/*"
              className="w-full p-2 rounded bg-slate-100 border border-indigo-200 focus:outline-none text-slate-800 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100 transition"
              onChange={(e) => setFormData({ ...formData, icon: e.target.files[0] })}
            />
            {editingCourse && !formData.icon && <p className="text-sm text-slate-500 mt-1">Leave empty to keep current icon</p>}
          </div>

          <button
            type="submit"
            disabled={isAdding || isUpdating}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold p-2 rounded transition disabled:opacity-50 mt-4"
          >
            {isAdding || isUpdating ? 'Saving...' : 'Save Course'}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default Courses;
