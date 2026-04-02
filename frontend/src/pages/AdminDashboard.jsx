import React, { useState } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, Tags, LogOut, Menu, X, TrendingUp, ShoppingBag } from 'lucide-react';
import ManageProducts from './ManageProducts';
import ManageCategories from './ManageCategories';

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    navigate('/login');
  };

  const navItems = [
    { to: '/admin', label: 'Tableau de bord', icon: <LayoutDashboard size={20} />, exact: true },
    { to: '/admin/products', label: 'Produits', icon: <Package size={20} /> },
    { to: '/admin/categories', label: 'Catégories', icon: <Tags size={20} /> },
  ];

  const isActive = (path, exact) => {
    if (exact) return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  return (
    <div className="admin-layout">
      {/* Overlay mobile */}
      {sidebarOpen && <div className="sidebar-overlay mobile-only" onClick={() => setSidebarOpen(false)} />}

      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <img src="/logo_107.png" alt="107 Shop" className="sidebar-logo" />
          <button className="sidebar-close mobile-only" onClick={() => setSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <div className="sidebar-label">NAVIGATION</div>

        <nav className="sidebar-nav">
          {navItems.map(item => (
            <Link
              key={item.to}
              to={item.to}
              className={`nav-item ${isActive(item.to, item.exact) ? 'active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
              {isActive(item.to, item.exact) && <span className="active-bar" />}
            </Link>
          ))}
        </nav>

        <button className="logout-btn" onClick={handleLogout}>
          <LogOut size={18} />
          <span>Déconnexion</span>
        </button>
      </aside>

      {/* Main */}
      <div className="admin-body">
        {/* Top bar */}
        <header className="admin-topbar">
          <button className="menu-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <Menu size={22} />
          </button>
          <div className="topbar-title">
            {navItems.find(n => isActive(n.to, n.exact))?.label || 'Administration'}
          </div>
          <div className="topbar-badge">107 Shop Admin</div>
        </header>

        <main className="admin-main">
          <Routes>
            <Route path="/" element={<AdminHome />} />
            <Route path="/products" element={<ManageProducts />} />
            <Route path="/categories" element={<ManageCategories />} />
          </Routes>
        </main>
      </div>

      <style jsx="true">{`
        .admin-layout {
          display: flex;
          min-height: calc(100vh - 77px);
          background: #F0F2F5;
          position: relative;
        }

        /* ── SIDEBAR ── */
        .admin-sidebar {
          width: 260px;
          min-width: 260px;
          background: #0F1923;
          display: flex;
          flex-direction: column;
          padding: 0;
          transition: all 0.3s ease;
          z-index: 200;
          overflow: hidden;
        }
        .admin-sidebar.closed {
          width: 0;
          min-width: 0;
        }
        .sidebar-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.5rem 1.5rem 1rem;
          border-bottom: 1px solid rgba(201,150,62,0.15);
        }
        .sidebar-logo {
          height: 48px;
          width: auto;
          object-fit: contain;
        }
        .sidebar-close {
          background: none;
          border: none;
          color: #aaa;
          cursor: pointer;
          padding: 4px;
        }
        .sidebar-label {
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.15em;
          color: rgba(255,255,255,0.25);
          padding: 1.5rem 1.5rem 0.5rem;
          white-space: nowrap;
        }
        .sidebar-nav {
          display: flex;
          flex-direction: column;
          gap: 4px;
          padding: 0.5rem 1rem;
          flex: 1;
        }
        .nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 14px;
          border-radius: 10px;
          color: rgba(255,255,255,0.55);
          text-decoration: none;
          font-size: 0.9rem;
          font-weight: 500;
          transition: all 0.2s ease;
          position: relative;
          white-space: nowrap;
        }
        .nav-item:hover {
          background: rgba(255,255,255,0.06);
          color: white;
        }
        .nav-item.active {
          background: rgba(201,150,62,0.15);
          color: #C9963E;
          font-weight: 600;
        }
        .active-bar {
          position: absolute;
          right: 10px;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #C9963E;
        }
        .nav-icon { display: flex; align-items: center; }
        .logout-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          margin: 1rem;
          padding: 11px 14px;
          background: rgba(255, 77, 77, 0.08);
          border: 1px solid rgba(255, 77, 77, 0.2);
          border-radius: 10px;
          color: #ff6b6b;
          font-size: 0.88rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
        }
        .logout-btn:hover {
          background: rgba(255, 77, 77, 0.18);
          border-color: rgba(255,77,77,0.4);
          color: #ff4d4d;
        }

        /* ── BODY ── */
        .admin-body {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        .admin-topbar {
          background: white;
          height: 60px;
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0 1.5rem;
          box-shadow: 0 1px 4px rgba(0,0,0,0.07);
          border-bottom: 1px solid #eee;
          position: sticky;
          top: 0;
          z-index: 100;
        }
        .menu-toggle {
          background: none;
          border: none;
          cursor: pointer;
          color: #444;
          padding: 6px;
          border-radius: 8px;
          transition: background 0.2s;
          display: flex;
        }
        .menu-toggle:hover { background: #f0f0f0; }
        .topbar-title {
          font-size: 1rem;
          font-weight: 700;
          color: #1C2B3A;
          flex: 1;
        }
        .topbar-badge {
          background: #0F1923;
          color: #C9963E;
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          padding: 5px 12px;
          border-radius: 20px;
        }
        .admin-main {
          flex: 1;
          padding: 2rem;
          overflow-y: auto;
        }

        /* ── RESPONSIVE ── */
        .mobile-only { display: none; }
        .sidebar-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.4);
          z-index: 199;
        }
        @media (max-width: 768px) {
          .mobile-only { display: flex; }
          .admin-sidebar {
            position: fixed;
            top: 0;
            left: 0;
            height: 100vh;
            width: 260px !important;
            min-width: 260px !important;
            transform: translateX(-100%);
          }
          .admin-sidebar.open {
            transform: translateX(0);
          }
          .admin-sidebar.closed {
            transform: translateX(-100%);
            width: 260px !important;
          }
          .admin-main { padding: 1rem; }
        }
      `}</style>
    </div>
  );
};

/* ── DASHBOARD HOME ── */
const AdminHome = () => {
  const [stats, setStats] = React.useState({ products: 0, categories: 0, soldOut: 0, bestSellers: 0 });
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchStats = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_URL}/api/products`).then(r => r.json()),
          fetch(`${import.meta.env.VITE_API_URL}/api/categories`).then(r => r.json())
        ]);
        const products = Array.isArray(prodRes) ? prodRes : [];
        setStats({
          products: products.length,
          categories: Array.isArray(catRes) ? catRes.length : 0,
          soldOut: products.filter(p => p.isSoldOut).length,
          bestSellers: products.filter(p => p.isBestSeller).length,
        });
      } catch (err) {
        console.error('Erreur stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const cards = [
    { label: 'Total Produits', value: stats.products, icon: <Package size={22} />, gradient: 'linear-gradient(135deg,#1C2B3A,#2E4460)', light: 'rgba(28,43,58,0.08)' },
    { label: 'Catégories', value: stats.categories, icon: <Tags size={22} />, gradient: 'linear-gradient(135deg,#C9963E,#A67C2E)', light: 'rgba(201,150,62,0.1)' },
    { label: 'Rupture de stock', value: stats.soldOut, icon: <ShoppingBag size={22} />, gradient: 'linear-gradient(135deg,#e74c3c,#c0392b)', light: 'rgba(231,76,60,0.08)' },
    { label: 'Meilleures ventes', value: stats.bestSellers, icon: <TrendingUp size={22} />, gradient: 'linear-gradient(135deg,#27ae60,#1e8449)', light: 'rgba(39,174,96,0.08)' },
  ];

  return (
    <div className="dash-home">
      <div className="dash-welcome">
        <div>
          <h1>Bienvenue 👋</h1>
          <p>Voici un aperçu de votre boutique <strong>107 Shop</strong></p>
        </div>
        <div className="dash-date">
          {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
        </div>
      </div>

      <div className="stats-grid">
        {cards.map((card, i) => (
          <div key={i} className="stat-card" style={{ '--light': card.light }}>
            <div className="stat-icon" style={{ background: card.gradient }}>
              {card.icon}
            </div>
            <div className="stat-info">
              <p className="stat-label">{card.label}</p>
              <p className="stat-value">{loading ? <span className="skeleton" /> : card.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="dash-tips">
        <h3>Actions rapides</h3>
        <div className="tips-grid">
          <Link to="/admin/products" className="tip-card">
            <Package size={20} />
            <span>Ajouter un produit</span>
          </Link>
          <Link to="/admin/categories" className="tip-card">
            <Tags size={20} />
            <span>Gérer les catégories</span>
          </Link>
        </div>
      </div>

      <style jsx="true">{`
        .dash-home { display: flex; flex-direction: column; gap: 2rem; }
        .dash-welcome {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 1rem;
          flex-wrap: wrap;
        }
        .dash-welcome h1 { font-size: 1.6rem; color: #1C2B3A; margin-bottom: 0.3rem; }
        .dash-welcome p { color: #666; font-size: 0.95rem; }
        .dash-date {
          background: white;
          border: 1px solid #eee;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 0.8rem;
          color: #666;
          white-space: nowrap;
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 1.2rem;
        }
        .stat-card {
          background: white;
          border-radius: 14px;
          padding: 1.4rem;
          display: flex;
          align-items: center;
          gap: 1.2rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
          border: 1px solid #f0f0f0;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .stat-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 20px rgba(0,0,0,0.08);
        }
        .stat-icon {
          width: 52px; height: 52px;
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          color: white;
          flex-shrink: 0;
        }
        .stat-label {
          font-size: 0.78rem;
          color: #888;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 4px;
        }
        .stat-value {
          font-size: 2rem;
          font-weight: 800;
          color: #1C2B3A;
          line-height: 1;
        }
        .skeleton {
          display: inline-block;
          width: 40px; height: 28px;
          background: linear-gradient(90deg, #eee 25%, #f5f5f5 50%, #eee 75%);
          background-size: 200% 100%;
          animation: shimmer 1.2s infinite;
          border-radius: 6px;
        }
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        .dash-tips { }
        .dash-tips h3 { font-size: 0.85rem; color: #888; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 1rem; font-family: 'Inter', sans-serif; }
        .tips-grid { display: flex; gap: 1rem; flex-wrap: wrap; }
        .tip-card {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 20px;
          background: white;
          border: 1.5px solid #eee;
          border-radius: 10px;
          color: #1C2B3A;
          text-decoration: none;
          font-weight: 600;
          font-size: 0.88rem;
          transition: all 0.2s;
        }
        .tip-card:hover {
          border-color: #C9963E;
          color: #C9963E;
          background: rgba(201,150,62,0.05);
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
