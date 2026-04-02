import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import ProductCard from '../components/ProductCard';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X } from 'lucide-react';

const Home = () => {
  const { t, i18n } = useTranslation();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL;
        const [prodRes, catRes] = await Promise.all([
          axios.get(`${apiUrl}/api/products`),
          axios.get(`${apiUrl}/api/categories`),
        ]);
        setProducts(prodRes.data);
        setCategories(catRes.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => setSearchQuery(searchInput.trim()), 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const clearSearch = () => {
    setSearchInput('');
    setSearchQuery('');
  };

  const filteredProducts = (Array.isArray(products) ? products : []).filter(p => {
    const matchCategory = selectedCategory === 'all' || p.category?._id === selectedCategory;
    const min = minPrice === '' ? 0 : Number(minPrice);
    const max = maxPrice === '' ? Infinity : Number(maxPrice);
    const matchPrice = p.price >= min && p.price <= max;
    const q = searchQuery.toLowerCase();
    const matchSearch = q === ''
      || (p.name_fr || '').toLowerCase().includes(q)
      || (p.name_ar || '').includes(searchQuery)
      || (p.description_fr || '').toLowerCase().includes(q)
      || (p.description_ar || '').includes(searchQuery);
    return matchCategory && matchPrice && matchSearch;
  });

  const isFiltered = searchQuery !== '' || selectedCategory !== 'all' || minPrice !== '' || maxPrice !== '';

  return (
    <main className="home">
      {/* Hero Section */}
      <motion.section
        className="hero"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="container hero-content">
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            {t('welcome')}
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            {t('tagline')}
          </motion.p>

          {/* Hero Search Bar */}
          <motion.div
            className="hero-search"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.8 }}
          >
            <div className="hero-search-inner">
              <Search size={20} className="search-icon" />
              <input
                type="text"
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                placeholder={i18n.language === 'ar' ? 'ابحث عن منتج...' : 'Rechercher un produit...'}
                className="hero-search-input"
              />
              {searchInput && (
                <button className="search-clear" onClick={clearSearch}>
                  <X size={16} />
                </button>
              )}
            </div>
          </motion.div>

          <motion.a
            href="#products"
            className="btn btn-primary"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.3, duration: 0.6 }}
          >
            {t('shop_now')}
          </motion.a>
        </div>
      </motion.section>

      {/* Catalog */}
      <section id="products" className="container main-catalog">

        {/* Search bar (visible below hero on scroll) */}
        <div className="catalog-search-wrap">
          <div className="catalog-search-inner">
            <Search size={18} className="catalog-search-icon" />
            <input
              type="text"
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              placeholder={i18n.language === 'ar' ? 'ابحث عن منتج...' : 'Rechercher un produit...'}
              className="catalog-search-input"
            />
            {searchInput && (
              <button className="catalog-search-clear" onClick={clearSearch}>
                <X size={15} />
              </button>
            )}
          </div>
          {searchQuery && (
            <div className="search-results-hint">
              {filteredProducts.length} résultat{filteredProducts.length !== 1 ? 's' : ''} pour &ldquo;<strong>{searchQuery}</strong>&rdquo;
            </div>
          )}
        </div>

        {/* Category Filter */}
        <div className="filter-bar">
          <button
            className={`filter-btn ${selectedCategory === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('all')}
          >
            {t('all')}
          </button>
          {(Array.isArray(categories) ? categories : []).map(cat => (
            <button
              key={cat._id}
              className={`filter-btn ${selectedCategory === cat._id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat._id)}
            >
              {i18n.language === 'ar' ? cat.name_ar : cat.name_fr}
            </button>
          ))}
        </div>

        {/* Price Filter */}
        <div className="filter-bar price-filter-bar">
          <div className="price-inputs">
            <input
              type="number"
              placeholder={t('price_min')}
              value={minPrice}
              onChange={e => setMinPrice(e.target.value)}
              className="price-input"
            />
            <span className="price-separator">—</span>
            <input
              type="number"
              placeholder={t('price_max')}
              value={maxPrice}
              onChange={e => setMaxPrice(e.target.value)}
              className="price-input"
            />
          </div>
          {isFiltered && (
            <button className="reset-btn" onClick={() => {
              setSelectedCategory('all');
              setMinPrice('');
              setMaxPrice('');
              clearSearch();
            }}>
              <X size={14} /> Réinitialiser
            </button>
          )}
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="loading-state">{t('loading')}</div>
        ) : (
          <motion.div className="product-grid" layout>
            <AnimatePresence mode='popLayout'>
              {filteredProducts.map(product => (
                <motion.div
                  key={product._id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.25 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {!loading && filteredProducts.length === 0 && (
          <div className="empty-state">
            {searchQuery
              ? <>Aucun résultat pour &ldquo;<strong>{searchQuery}</strong>&rdquo;</>
              : t('no_products')
            }
          </div>
        )}
      </section>

      <style jsx="true">{`
        /* Hero */
        .hero {
          height: 80vh;
          background: linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)), url('/port.jpg');
          background-size: cover;
          background-position: center;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          color: white;
          margin-bottom: 4rem;
        }
        .hero-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.2rem;
        }
        .hero h1 {
          font-size: 4rem;
          text-transform: uppercase;
          letter-spacing: 4px;
          margin: 0;
        }
        .hero p {
          font-size: 1.5rem;
          font-family: 'Playfair Display', serif;
          font-style: italic;
          opacity: 0.9;
          margin: 0;
        }

        /* Hero Search */
        .hero-search { width: 100%; max-width: 520px; }
        .hero-search-inner {
          position: relative;
          display: flex;
          align-items: center;
          background: rgba(255,255,255,0.15);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1.5px solid rgba(255,255,255,0.35);
          border-radius: 50px;
          padding: 0 18px;
          transition: all 0.3s;
        }
        .hero-search-inner:focus-within {
          background: rgba(255,255,255,0.25);
          border-color: rgba(255,255,255,0.7);
        }
        .search-icon { color: rgba(255,255,255,0.75); flex-shrink: 0; }
        .hero-search-input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          padding: 14px 12px;
          color: white;
          font-size: 1rem;
          font-family: inherit;
        }
        .hero-search-input::placeholder { color: rgba(255,255,255,0.6); }
        .search-clear {
          background: rgba(255,255,255,0.2);
          border: none;
          color: white;
          cursor: pointer;
          border-radius: 50%;
          width: 26px; height: 26px;
          display: flex; align-items: center; justify-content: center;
          transition: background 0.2s;
          flex-shrink: 0;
        }
        .search-clear:hover { background: rgba(255,255,255,0.35); }

        /* Catalog search (below hero) */
        .catalog-search-wrap {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
        }
        .catalog-search-inner {
          position: relative;
          display: flex;
          align-items: center;
          background: white;
          border: 1.5px solid #e8e8e8;
          border-radius: 50px;
          padding: 0 16px;
          flex: 1;
          max-width: 480px;
          transition: border 0.2s;
        }
        .catalog-search-inner:focus-within {
          border-color: var(--accent);
          box-shadow: 0 0 0 3px rgba(201,150,62,0.1);
        }
        .catalog-search-icon { color: #aaa; flex-shrink: 0; }
        .catalog-search-input {
          flex: 1;
          border: none;
          outline: none;
          padding: 12px 10px;
          font-size: 0.92rem;
          font-family: inherit;
          color: var(--text-dark);
          background: transparent;
        }
        .catalog-search-input::placeholder { color: #bbb; }
        .catalog-search-clear {
          background: #f0f0f0;
          border: none;
          color: #888;
          cursor: pointer;
          border-radius: 50%;
          width: 24px; height: 24px;
          display: flex; align-items: center; justify-content: center;
          transition: background 0.2s;
          flex-shrink: 0;
        }
        .catalog-search-clear:hover { background: #e0e0e0; }
        .search-results-hint {
          font-size: 0.85rem;
          color: #888;
          white-space: nowrap;
        }
        .search-results-hint strong { color: var(--accent); }

        /* Filters */
        .main-catalog { padding-bottom: 5rem; }
        .filter-bar {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1rem;
          overflow-x: auto;
          padding: 5px 0;
          scrollbar-width: none;
        }
        .filter-bar::-webkit-scrollbar { display: none; }
        .filter-btn {
          background: white;
          border: 1.5px solid #eee;
          padding: 9px 22px;
          border-radius: 50px;
          cursor: pointer;
          font-weight: 600;
          font-size: 0.8rem;
          letter-spacing: 0.5px;
          transition: var(--transition);
          white-space: nowrap;
          flex-shrink: 0;
        }
        .filter-btn:hover { border-color: var(--accent); color: var(--accent); }
        .filter-btn.active {
          background: var(--primary);
          color: white;
          border-color: var(--primary);
        }
        .price-filter-bar {
          margin-bottom: 2.5rem;
          justify-content: flex-start;
          gap: 1rem;
        }
        .price-inputs {
          display: flex;
          align-items: center;
          gap: 8px;
          background: white;
          padding: 6px 14px;
          border-radius: 50px;
          border: 1.5px solid #eee;
        }
        .price-input {
          border: none;
          outline: none;
          padding: 6px;
          width: 90px;
          font-family: inherit;
          font-size: 0.85rem;
          color: var(--text-dark);
          text-align: center;
          background: transparent;
        }
        .price-separator { color: #bbb; font-size: 1rem; }
        .reset-btn {
          display: flex; align-items: center; gap: 5px;
          background: none;
          border: 1.5px solid #ddd;
          color: #888;
          padding: 8px 16px;
          border-radius: 50px;
          cursor: pointer;
          font-size: 0.8rem;
          font-weight: 600;
          transition: all 0.2s;
          white-space: nowrap;
        }
        .reset-btn:hover { border-color: #e74c3c; color: #e74c3c; background: rgba(231,76,60,0.04); }

        /* Grid */
        .product-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 2.5rem;
        }
        .loading-state, .empty-state {
          text-align: center;
          padding: 4rem 1rem;
          color: #aaa;
          font-size: 1rem;
        }
        .empty-state strong { color: var(--accent); }

        /* Mobile */
        @media (max-width: 768px) {
          .hero { height: 60vh; margin-bottom: 2rem; }
          .hero h1 { font-size: 2rem; letter-spacing: 2px; }
          .hero p { font-size: 1.1rem; }
          .hero-search { max-width: 100%; }
          .hero-search-input { font-size: 0.9rem; padding: 11px 10px; }
          .catalog-search-wrap { flex-direction: column; align-items: stretch; }
          .catalog-search-inner { max-width: 100%; }
          .filter-bar { padding: 5px 4px; }
          .product-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 10px !important;
          }
          .filter-btn { padding: 7px 14px; font-size: 0.72rem; }
          .price-inputs { padding: 4px 10px; }
          .price-input { width: 75px; font-size: 0.78rem; }
        }
      `}</style>
    </main>
  );
};

export default Home;
