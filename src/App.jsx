import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import Posts from './pages/Posts';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Layout />}>
          <Route index element={<Navigate to="/blog" replace />} />
          <Route path="blog" element={<Posts />} />
          <Route path="courses" element={<div>Courses Placeholder</div>} />
          <Route path="gallery" element={<div>Gallery Placeholder</div>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
