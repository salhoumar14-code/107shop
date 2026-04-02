import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Pencil, Trash2, X, ImagePlus, Star, AlertCircle, ChevronDown } from 'lucide-react';

const emptyForm = {
  name_fr: '', name_ar: '', price: '', category: '',
  description_fr: '', description_ar: '', isSoldOut: false, isBestSeller: false
};

const ManageProducts = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [filterCat, setFilterCat] = useState('');
  const [filterSearch, setFilterSearch] = useState('');
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/products`);
      setProducts(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/categories`);
      setCategories(res.data);
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer ce produit ?')) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/products/${id}`);
      showToast('Produit supprimé');
      fetchProducts();
    } catch (err) { showToast('Erreur suppression', 'error'); }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name_fr: product.name_fr, name_ar: product.name_ar,
      price: product.price, category: product.category?._id || '',
      description_fr: product.description_fr || '', description_ar: product.description_ar || '',
      isSoldOut: product.isSoldOut, isBestSeller: product.isBestSeller
    });
    setImages([]);
    setPreviews(product.images || []);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = () => {
    setEditingProduct(null);
    setFormData(emptyForm);
    setImages([]);
    setPreviews([]);
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    setPreviews(files.map(f => URL.createObjectURL(f)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const data = new FormData();
    Object.keys(formData).forEach(k => data.append(k, formData[k]));
    images.forEach(img => data.append('images', img));
    try {
      if (editingProduct) {
        await axios.put(`${import.meta.env.VITE_API_URL}/api/products/${editingProduct._id}`, data);
        showToast('Produit mis à jour ✓');
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/api/products`, data);
        showToast('Produit ajouté ✓');
      }
      handleCancel();
      fetchProducts();
    } catch (err) {
      showToast('Erreur lors de l\'enregistrement', 'error');
    } finally {
      setSaving(false);
    }
  };

  const visibleProducts = products.filter(p => {
    const matchCat = filterCat ? (p.category?._id || p.category) === filterCat : true;
    const q = filterSearch.toLowerCase();
    const matchSearch = q === '' || p.name_fr.toLowerCase().includes(q) || p.name_ar.includes(q);
    return matchCat && matchSearch;
  });

  const set = (key, val) => setFormData(f => ({ ...f, [key]: val }));

  return (
    <div className="mp-wrap">
      {/* Toast */}
      {toast && (
        <div className={`toast ${toast.type}`}>
          {toast.type === 'error' ? <AlertCircle size={16} /> : '✓'} {toast.msg}
        </div>
      )}

      {/* ── FORM CARD ── */}
      <div className="card form-card">
        <div className="card-header">
          <div className="card-title">
            {editingProduct ? <><Pencil size={18} /> Modifier le produit</> : <><Plus size={18} /> Nouveau produit</>}
          </div>
          {editingProduct && (
            <button className="btn-ghost" onClick={handleCancel}><X size={18} /> Annuler</button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="pform">
          {/* Names */}
          <div className="field-row">
            <div className="field">
              <label>Nom français <span className="req">*</span></label>
              <input value={formData.name_fr} onChange={e => set('name_fr', e.target.value)}
                placeholder="ex: Boubou traditionnel bleu" required />
            </div>
            <div className="field">
              <label>الاسم بالعربية <span className="req">*</span></label>
              <input value={formData.name_ar} onChange={e => set('name_ar', e.target.value)}
                placeholder="مثال: جلباب تقليدي أزرق" dir="rtl" required />
            </div>
          </div>

          {/* Price + Category */}
          <div className="field-row">
            <div className="field">
              <label>Prix (MRU) <span className="req">*</span></label>
              <input type="number" value={formData.price} onChange={e => set('price', e.target.value)}
                placeholder="0" min="0" required />
            </div>
            <div className="field">
              <label>Catégorie <span className="req">*</span></label>
              <div className="select-wrap">
                <select value={formData.category} onChange={e => set('category', e.target.value)} required>
                  <option value="">Choisir une catégorie</option>
                  {categories.map(c => (
                    <option key={c._id} value={c._id}>{c.name_fr} | {c.name_ar}</option>
                  ))}
                </select>
                <ChevronDown size={16} className="select-icon" />
              </div>
            </div>
          </div>

          {/* Descriptions */}
          <div className="field-row">
            <div className="field">
              <label>Description française</label>
              <textarea value={formData.description_fr} onChange={e => set('description_fr', e.target.value)}
                placeholder="Description du produit..." rows={3} />
            </div>
            <div className="field">
              <label>الوصف بالعربية</label>
              <textarea value={formData.description_ar} onChange={e => set('description_ar', e.target.value)}
                placeholder="وصف المنتج..." rows={3} dir="rtl" />
            </div>
          </div>

          {/* Images */}
          <div className="field">
            <label>Photos <span className="req">*{editingProduct && ' (optionnel — laisser vide pour garder les actuelles)'}</span></label>
            <label className="file-drop">
              <ImagePlus size={22} />
              <span>{images.length > 0 ? `${images.length} fichier(s) sélectionné(s)` : 'Cliquer pour ajouter des photos (max 5)'}</span>
              <input type="file" multiple accept="image/*" onChange={handleImageChange} required={!editingProduct} hidden />
            </label>
            {previews.length > 0 && (
              <div className="preview-row">
                {previews.map((src, i) => (
                  <img key={i} src={src} alt="" className="preview-thumb" />
                ))}
              </div>
            )}
          </div>

          {/* Flags */}
          <div className="flags-row">
            <label className={`flag-toggle ${formData.isSoldOut ? 'active-flag sold' : ''}`}>
              <input type="checkbox" checked={formData.isSoldOut} onChange={e => set('isSoldOut', e.target.checked)} />
              <AlertCircle size={15} /> Rupture de stock
            </label>
            <label className={`flag-toggle ${formData.isBestSeller ? 'active-flag best' : ''}`}>
              <input type="checkbox" checked={formData.isBestSeller} onChange={e => set('isBestSeller', e.target.checked)} />
              <Star size={15} /> Meilleure vente
            </label>
          </div>

          <button type="submit" className="btn-primary-full" disabled={saving}>
            {saving ? 'Enregistrement...' : editingProduct ? 'Mettre à jour' : 'Ajouter le produit'}
          </button>
        </form>
      </div>

      {/* ── LIST CARD ── */}
      <div className="card">
        <div className="card-header">
          <div className="card-title"><Package size={18} /> Produits ({visibleProducts.length})</div>
          <div className="list-filters">
            <input className="search-input" placeholder="Rechercher..." value={filterSearch}
              onChange={e => setFilterSearch(e.target.value)} />
            <div className="select-wrap sm">
              <select value={filterCat} onChange={e => setFilterCat(e.target.value)}>
                <option value="">Toutes catégories</option>
                {categories.map(c => <option key={c._id} value={c._id}>{c.name_fr}</option>)}
              </select>
              <ChevronDown size={14} className="select-icon" />
            </div>
          </div>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Photo</th>
                <th>Nom</th>
                <th>Prix</th>
                <th>Catégorie</th>
                <th>État</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {visibleProducts.length === 0 ? (
                <tr><td colSpan={6} className="empty-row">Aucun produit trouvé</td></tr>
              ) : visibleProducts.map(p => (
                <tr key={p._id}>
                  <td>
                    <img src={p.images?.[0]} alt="" className="table-thumb" />
                  </td>
                  <td>
                    <div className="product-name">{p.name_fr}</div>
                    <div className="product-name-ar">{p.name_ar}</div>
                  </td>
                  <td><span className="price-badge">{p.price} MRU</span></td>
                  <td className="cat-cell">{p.category?.name_fr || '—'}</td>
                  <td>
                    <div className="flags-cell">
                      {p.isSoldOut && <span className="chip chip-red">Sold Out</span>}
                      {p.isBestSeller && <span className="chip chip-gold">Best Seller</span>}
                    </div>
                  </td>
                  <td>
                    <div className="action-btns">
                      <button className="act-btn edit" onClick={() => handleEdit(p)}><Pencil size={15} /></button>
                      <button className="act-btn del" onClick={() => handleDelete(p._id)}><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <style jsx="true">{`
        .mp-wrap { display: flex; flex-direction: column; gap: 1.5rem; }

        /* Toast */
        .toast {
          position: fixed; top: 80px; right: 20px; z-index: 9999;
          background: #1C2B3A; color: white;
          padding: 12px 20px; border-radius: 10px;
          font-size: 0.88rem; font-weight: 600;
          display: flex; align-items: center; gap: 8px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.2);
          animation: slideIn 0.3s ease;
        }
        .toast.error { background: #e74c3c; }
        @keyframes slideIn { from { opacity:0; transform:translateY(-10px); } to { opacity:1; transform:translateY(0); } }

        /* Cards */
        .card { background: white; border-radius: 14px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); border: 1px solid #eee; overflow: hidden; }
        .card-header {
          display: flex; justify-content: space-between; align-items: center;
          padding: 1.2rem 1.5rem; border-bottom: 1px solid #f0f0f0;
          flex-wrap: wrap; gap: 0.75rem;
        }
        .card-title { display: flex; align-items: center; gap: 8px; font-weight: 700; font-size: 0.95rem; color: #1C2B3A; }
        .btn-ghost {
          display: flex; align-items: center; gap: 6px;
          background: none; border: 1px solid #ddd; color: #666;
          padding: 6px 12px; border-radius: 8px; cursor: pointer; font-size: 0.83rem;
          transition: all 0.2s;
        }
        .btn-ghost:hover { border-color: #e74c3c; color: #e74c3c; background: rgba(231,76,60,0.05); }

        /* Form */
        .pform { padding: 1.5rem; display: flex; flex-direction: column; gap: 1.2rem; }
        .field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .field { display: flex; flex-direction: column; gap: 6px; }
        label { font-size: 0.82rem; font-weight: 600; color: #555; }
        .req { color: #C9963E; }
        input[type="text"], input[type="number"], select, textarea {
          padding: 10px 14px; border: 1.5px solid #e8e8e8; border-radius: 8px;
          font-size: 0.9rem; color: #1C2B3A; background: #fafafa;
          transition: border 0.2s; font-family: inherit; outline: none; width: 100%;
        }
        input:focus, select:focus, textarea:focus { border-color: #C9963E; background: white; }
        textarea { resize: vertical; }
        .select-wrap { position: relative; }
        .select-wrap select { appearance: none; padding-right: 36px; }
        .select-icon { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); color: #aaa; pointer-events: none; }
        .select-wrap.sm select { padding: 8px 32px 8px 12px; font-size: 0.82rem; }

        /* File drop */
        .file-drop {
          display: flex; align-items: center; gap: 10px;
          padding: 14px; border: 2px dashed #e0e0e0; border-radius: 10px;
          cursor: pointer; color: #888; font-size: 0.88rem; font-weight: 500;
          transition: all 0.2s;
        }
        .file-drop:hover { border-color: #C9963E; color: #C9963E; background: rgba(201,150,62,0.03); }
        .preview-row { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 10px; }
        .preview-thumb { width: 70px; height: 70px; object-fit: cover; border-radius: 8px; border: 2px solid #eee; }

        /* Flags */
        .flags-row { display: flex; gap: 1rem; flex-wrap: wrap; }
        .flag-toggle {
          display: flex; align-items: center; gap: 7px;
          padding: 8px 14px; border: 1.5px solid #e8e8e8; border-radius: 8px;
          cursor: pointer; font-size: 0.85rem; font-weight: 500; color: #666;
          transition: all 0.2s; user-select: none;
        }
        .flag-toggle input { display: none; }
        .flag-toggle:hover { border-color: #aaa; }
        .active-flag.sold { border-color: #e74c3c; color: #e74c3c; background: rgba(231,76,60,0.05); }
        .active-flag.best { border-color: #C9963E; color: #C9963E; background: rgba(201,150,62,0.05); }

        /* Submit */
        .btn-primary-full {
          width: 100%; padding: 13px; background: #1C2B3A; color: white;
          border: none; border-radius: 10px; font-weight: 700; font-size: 0.95rem;
          cursor: pointer; transition: all 0.2s;
        }
        .btn-primary-full:hover:not(:disabled) { background: #2E4460; transform: translateY(-1px); }
        .btn-primary-full:disabled { background: #aaa; cursor: not-allowed; }

        /* Table */
        .list-filters { display: flex; gap: 0.75rem; flex-wrap: wrap; align-items: center; }
        .search-input {
          padding: 8px 14px; border: 1.5px solid #e8e8e8; border-radius: 8px;
          font-size: 0.85rem; outline: none; transition: border 0.2s;
        }
        .search-input:focus { border-color: #C9963E; }
        .table-wrap { overflow-x: auto; }
        table { width: 100%; border-collapse: collapse; }
        th { padding: 11px 14px; text-align: left; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #888; background: #fafafa; border-bottom: 1px solid #eee; white-space: nowrap; }
        td { padding: 12px 14px; border-bottom: 1px solid #f5f5f5; vertical-align: middle; }
        tr:last-child td { border-bottom: none; }
        tr:hover td { background: #fafef8; }
        .table-thumb { width: 48px; height: 48px; object-fit: cover; border-radius: 8px; border: 1px solid #eee; }
        .product-name { font-weight: 600; font-size: 0.88rem; color: #1C2B3A; }
        .product-name-ar { font-size: 0.78rem; color: #aaa; direction: rtl; }
        .price-badge { background: rgba(28,43,58,0.07); color: #1C2B3A; font-weight: 700; font-size: 0.82rem; padding: 3px 9px; border-radius: 6px; white-space: nowrap; }
        .cat-cell { font-size: 0.83rem; color: #666; }
        .flags-cell { display: flex; gap: 4px; flex-wrap: wrap; }
        .chip { font-size: 0.7rem; font-weight: 700; padding: 3px 8px; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.04em; }
        .chip-red { background: rgba(231,76,60,0.1); color: #e74c3c; }
        .chip-gold { background: rgba(201,150,62,0.12); color: #C9963E; }
        .action-btns { display: flex; gap: 6px; }
        .act-btn { width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; border-radius: 8px; border: 1.5px solid #eee; background: none; cursor: pointer; transition: all 0.2s; }
        .act-btn.edit { color: #1C2B3A; }
        .act-btn.edit:hover { border-color: #1C2B3A; background: #1C2B3A; color: white; }
        .act-btn.del { color: #e74c3c; }
        .act-btn.del:hover { border-color: #e74c3c; background: #e74c3c; color: white; }
        .empty-row { text-align: center; color: #aaa; padding: 2rem; font-size: 0.9rem; }
        .form-card {}
        @media (max-width: 640px) {
          .field-row { grid-template-columns: 1fr; }
          .list-filters { flex-direction: column; align-items: stretch; }
          .search-input { width: 100%; }
        }
      `}</style>
    </div>
  );
};

export default ManageProducts;
