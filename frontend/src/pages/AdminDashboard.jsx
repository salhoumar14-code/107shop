import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, Calendar, Tags } from 'lucide-react';
import ManageProducts from './ManageProducts';
import ManageCategories from './ManageCategories';

const AdminDashboard = () => {
  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <h3>Admin Rimy</h3>
        <nav>
          <Link to="/admin"><LayoutDashboard size={20} /> Dashboard</Link>
          <Link to="/admin/products"><PlusCircle size={20} /> Products</Link>
          <Link to="/admin/categories"><Tags size={20} /> Categories</Link>
        </nav>
      </aside>

      <main className="admin-main">
        <Routes>
          <Route path="/" element={<AdminHome />} />
          <Route path="/products" element={<ManageProducts />} />
          <Route path="/categories" element={<ManageCategories />} />
        </Routes>
      </main>

      <style jsx="true">{`
        .admin-layout {
          display: flex;
          min-height: calc(100vh - 80px);
        }
        .admin-sidebar {
          width: 250px;
          background: #2c3e50;
          color: white;
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }
        .admin-sidebar h3 {
          color: var(--accent);
          font-family: 'Inter', sans-serif;
        }
        .admin-sidebar nav {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .admin-sidebar a {
          color: #ecf0f1;
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px;
          border-radius: 8px;
          transition: var(--transition);
        }
        .admin-sidebar a:hover {
          background: rgba(255,255,255,0.1);
        }
        .admin-main {
          flex: 1;
          padding: 3rem;
          background: #f8f9fa;
        }
      `}</style>
    </div>
  );
};

const AdminHome = () => {
  const [stats, setStats] = React.useState({ products: 0, categories: 0 });
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchStats = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_URL}/api/products`).then(r => r.json()),
          fetch(`${import.meta.env.VITE_API_URL}/api/categories`).then(r => r.json())
        ]);
        setStats({
          products: Array.isArray(prodRes) ? prodRes.length : 0,
          categories: Array.isArray(catRes) ? catRes.length : 0
        });
      } catch (err) {
        console.error("Erreur stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div>
      <h1 style={{ marginBottom: '0.5rem' }}>Tableau de Bord</h1>
      <p style={{ color: '#666', marginBottom: '2rem' }}>Bienvenue dans l'espace de gestion de votre boutique Rimy.</p>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon products-icon">
            <Tags size={24} />
          </div>
          <div className="stat-info">
            <h3>Produits</h3>
            <p className="stat-value">{loading ? '...' : stats.products}</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon categories-icon">
            <LayoutDashboard size={24} />
          </div>
          <div className="stat-info">
            <h3>Catégories</h3>
            <p className="stat-value">{loading ? '...' : stats.categories}</p>
          </div>
        </div>
      </div>

      <style jsx="true">{`
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
          margin-top: 2rem;
        }
        .stat-card {
          background: white;
          padding: 1.5rem;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0,0,0,0.05);
          display: flex;
          align-items: center;
          gap: 1.5rem;
          border: 1px solid #f0f0f0;
        }
        .stat-icon {
          width: 60px;
          height: 60px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }
        .products-icon {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        .categories-icon {
          background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
        }
        .stat-info h3 {
          font-size: 0.9rem;
          color: #666;
          margin-bottom: 0.5rem;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .stat-value {
          font-size: 2rem;
          font-weight: 700;
          color: #2c3e50;
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
