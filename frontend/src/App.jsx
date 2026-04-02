import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './i18n';
import './index.css';
import './styles/animations.css';

// Components
import Navbar from './components/Navbar';
import Home from './pages/Home';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';

function App() {
  const { i18n } = useTranslation();
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem('adminAuth') === 'true'
  );

  useEffect(() => {
    document.body.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
  }, [i18n.language]);

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login setAuth={setIsAuthenticated} />} />
        <Route
          path="/admin/*"
          element={isAuthenticated ? <AdminDashboard /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
