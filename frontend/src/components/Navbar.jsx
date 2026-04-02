import React from 'react';
import { useTranslation } from 'react-i18next';
import { ShoppingBag, Menu, X, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = React.useState(false);

  const toggleLanguage = () => {
    const newLang = i18n.language === 'fr' ? 'ar' : 'fr';
    i18n.changeLanguage(newLang);
  };

  return (
    <nav className="navbar">
      <div className="container nav-content">
        <Link to="/" className="logo">
          <img src="/logo.jpg" alt="RIMY" className="logo-img" />
        </Link>

        {/* Desktop Links */}
        <div className="nav-links desktop-only">
          <Link to="/">{t('categories')}</Link>
          <button onClick={toggleLanguage} className="lang-btn">
            <Globe size={18} />
            {t('lang_toggle')}
          </button>
        </div>

        {/* Mobile Toggle */}
        <button className="mobile-toggle mobile-only" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="mobile-menu mobile-only">
          <Link to="/" onClick={() => setIsOpen(false)}>{t('categories')}</Link>
          <button onClick={() => { toggleLanguage(); setIsOpen(false); }} className="lang-btn">
            <Globe size={18} />
            {t('lang_toggle')}
          </button>
        </div>
      )}

      <style jsx="true">{`
        .navbar {
          background-color: var(--bg-light);
          padding: 1rem 0;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
          position: sticky;
          top: 0;
          z-index: 1000;
          transition: var(--transition);
        }
        .nav-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .logo-img {
          height: 60px;
          width: auto;
          display: block;
          transition: var(--transition);
        }
        .nav-links {
          display: flex;
          gap: 2rem;
          align-items: center;
        }
        .nav-links a {
          text-decoration: none;
          color: var(--text-dark);
          font-weight: 600;
          text-transform: uppercase;
          font-size: 0.9rem;
          letter-spacing: 1px;
          transition: var(--transition);
        }
        .nav-links a:hover {
          color: var(--accent);
        }
        .lang-btn {
          background: none;
          border: 1.5px solid var(--primary);
          color: var(--primary);
          padding: 6px 14px;
          border-radius: 4px;
          display: flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
          font-weight: 700;
          text-transform: uppercase;
          font-size: 0.8rem;
          transition: var(--transition);
        }
        .lang-btn:hover {
          background-color: var(--primary);
          color: white;
        }
        .admin-link {
          background-color: var(--primary);
          color: white !important;
          padding: 8px 18px;
          border-radius: 4px;
        }
        .admin-link:hover {
          background-color: #333;
        }
        .mobile-only { display: none; }
        @media (max-width: 768px) {
          .navbar { padding: 0.8rem 0; }
          .logo-img { height: 45px; }
          .desktop-only { display: none; }
          .mobile-only { display: block; }
          .mobile-toggle { 
            background: none; 
            border: none; 
            cursor: pointer; 
            color: var(--primary);
            padding: 5px;
          }
          .mobile-menu {
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: white;
            padding: 1.5rem;
            display: flex;
            flex-direction: column;
            gap: 1rem;
            box-shadow: 0 10px 20px rgba(0,0,0,0.1);
            border-top: 1px solid #eee;
          }
          .mobile-menu a {
            font-weight: 700;
            text-decoration: none;
            color: var(--text-dark);
            text-transform: uppercase;
            font-size: 1.1rem;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
