import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Pencil, Trash2, X, ImagePlus, AlertCircle } from 'lucide-react';

const emptyForm = { name_fr: '', name_ar: '' };

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => { fetchCategories(); }, []);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/categories`);
      setCategories(res.data);
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cette catégorie ?')) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/categories/${id}`);
      showToast('Catégorie supprimée');
      fetchCategories();
    } catch (err) { showToast('Erreur suppression', 'error'); }
  };

  const handleEdit = (cat) => {
    setEditingCategory(cat);
    setFormData({ name_fr: cat.name_fr, name_ar: cat.name_ar });
    setImage(null);
    setPreview(cat.image || null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = () => {
    setEditingCategory(null);
    setFormData(emptyForm);
    setImage(null);
    setPreview(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const data = new FormData();
    data.append('name_fr', formData.name_fr);
    data.append('name_ar', formData.name_ar);
    if (image) data.append('image', image);
    try {
      if (editingCategory) {
        await axios.put(`${import.meta.env.VITE_API_URL}/api/categories/${editingCategory._id}`, data);
        showToast('Catégorie mise à jour ✓');
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/api/categories`, data);
        showToast('Catégorie créée ✓');
      }
      handleCancel();
      fetchCategories();
    } catch (err) {
      showToast('Erreur lors de l\'enregistrement', 'error');
    } finally {
      setSaving(false);
    }
  };

  const set = (key, val) => setFormData(f => ({ ...f, [key]: val }));

  return (
    <div className="mc-wrap">
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
            {editingCategory ? <><Pencil size={18} /> Modifier la catégorie</> : <><Plus size={18} /> Nouvelle catégorie</>}
          </div>
          {editingCategory && (
            <button className="btn-ghost" onClick={handleCancel}><X size={18} /> Annuler</button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="cform">
          <div className="field-row">
            <div className="field">
              <label>Nom français <span className="req">*</span></label>
              <input value={formData.name_fr} onChange={e => set('name_fr', e.target.value)}
                placeholder="ex: Boubous Mauritaniens" required />
            </div>
            <div className="field">
              <label>الاسم بالعربية <span className="req">*</span></label>
              <input value={formData.name_ar} onChange={e => set('name_ar', e.target.value)}
                placeholder="مثال: البوبو الموريتاني" dir="rtl" required />
            </div>
          </div>

          <div className="field">
            <label>Image de la catégorie <span className="req-soft">(optionnel)</span></label>
            <label className="file-drop">
              <ImagePlus size={22} />
              <span>{image ? image.name : 'Cliquer pour choisir une image'}</span>
              <input type="file" accept="image/*" onChange={handleImageChange} hidden />
            </label>
            {preview && (
              <div className="preview-row">
                <img src={preview} alt="preview" className="preview-thumb" />
              </div>
            )}
          </div>

          <button type="submit" className="btn-primary-full" disabled={saving}>
            {saving ? 'Enregistrement...' : editingCategory ? 'Mettre à jour' : 'Créer la catégorie'}
          </button>
        </form>
      </div>

      {/* ── LIST CARD ── */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            Catégories ({categories.length})
          </div>
        </div>

        <div className="cat-grid">
          {categories.length === 0 ? (
            <p className="empty-msg">Aucune catégorie. Créez-en une ci-dessus.</p>
          ) : categories.map(cat => (
            <div key={cat._id} className="cat-item">
              <div className="cat-img-wrap">
                {cat.image
                  ? <img src={cat.image} alt={cat.name_fr} className="cat-img" />
                  : <div className="cat-img-placeholder">{cat.name_fr[0]}</div>
                }
              </div>
              <div className="cat-info">
                <div className="cat-name-fr">{cat.name_fr}</div>
                <div className="cat-name-ar">{cat.name_ar}</div>
              </div>
              <div className="cat-actions">
                <button className="act-btn edit" onClick={() => handleEdit(cat)}><Pencil size={15} /></button>
                <button className="act-btn del" onClick={() => handleDelete(cat._id)}><Trash2 size={15} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx="true">{`
        .mc-wrap { display: flex; flex-direction: column; gap: 1.5rem; }

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

        .card { background: white; border-radius: 14px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); border: 1px solid #eee; overflow: hidden; }
        .card-header { display: flex; justify-content: space-between; align-items: center; padding: 1.2rem 1.5rem; border-bottom: 1px solid #f0f0f0; flex-wrap: wrap; gap: 0.75rem; }
        .card-title { display: flex; align-items: center; gap: 8px; font-weight: 700; font-size: 0.95rem; color: #1C2B3A; }
        .btn-ghost { display: flex; align-items: center; gap: 6px; background: none; border: 1px solid #ddd; color: #666; padding: 6px 12px; border-radius: 8px; cursor: pointer; font-size: 0.83rem; transition: all 0.2s; }
        .btn-ghost:hover { border-color: #e74c3c; color: #e74c3c; background: rgba(231,76,60,0.05); }

        .cform { padding: 1.5rem; display: flex; flex-direction: column; gap: 1.2rem; }
        .field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .field { display: flex; flex-direction: column; gap: 6px; }
        label { font-size: 0.82rem; font-weight: 600; color: #555; }
        .req { color: #C9963E; }
        .req-soft { color: #aaa; font-weight: 400; }
        input[type="text"] { padding: 10px 14px; border: 1.5px solid #e8e8e8; border-radius: 8px; font-size: 0.9rem; color: #1C2B3A; background: #fafafa; transition: border 0.2s; font-family: inherit; outline: none; width: 100%; }
        input:focus { border-color: #C9963E; background: white; }

        .file-drop { display: flex; align-items: center; gap: 10px; padding: 14px; border: 2px dashed #e0e0e0; border-radius: 10px; cursor: pointer; color: #888; font-size: 0.88rem; font-weight: 500; transition: all 0.2s; }
        .file-drop:hover { border-color: #C9963E; color: #C9963E; background: rgba(201,150,62,0.03); }
        .preview-row { margin-top: 10px; }
        .preview-thumb { width: 80px; height: 80px; object-fit: cover; border-radius: 10px; border: 2px solid #eee; }

        .btn-primary-full { width: 100%; padding: 13px; background: #1C2B3A; color: white; border: none; border-radius: 10px; font-weight: 700; font-size: 0.95rem; cursor: pointer; transition: all 0.2s; }
        .btn-primary-full:hover:not(:disabled) { background: #2E4460; transform: translateY(-1px); }
        .btn-primary-full:disabled { background: #aaa; cursor: not-allowed; }

        /* Category grid */
        .cat-grid { padding: 1.2rem 1.5rem; display: flex; flex-direction: column; gap: 0.75rem; }
        .empty-msg { text-align: center; color: #aaa; font-size: 0.9rem; padding: 1.5rem 0; }
        .cat-item { display: flex; align-items: center; gap: 1rem; padding: 10px 12px; border: 1px solid #f0f0f0; border-radius: 10px; transition: box-shadow 0.2s; }
        .cat-item:hover { box-shadow: 0 3px 12px rgba(0,0,0,0.06); }
        .cat-img-wrap { flex-shrink: 0; }
        .cat-img { width: 52px; height: 52px; object-fit: cover; border-radius: 10px; border: 1px solid #eee; }
        .cat-img-placeholder { width: 52px; height: 52px; border-radius: 10px; background: linear-gradient(135deg, #1C2B3A, #2E4460); color: white; font-size: 1.4rem; font-weight: 800; display: flex; align-items: center; justify-content: center; }
        .cat-info { flex: 1; }
        .cat-name-fr { font-weight: 700; font-size: 0.92rem; color: #1C2B3A; }
        .cat-name-ar { font-size: 0.82rem; color: #aaa; direction: rtl; }
        .cat-actions { display: flex; gap: 6px; }
        .act-btn { width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; border-radius: 8px; border: 1.5px solid #eee; background: none; cursor: pointer; transition: all 0.2s; }
        .act-btn.edit { color: #1C2B3A; }
        .act-btn.edit:hover { border-color: #1C2B3A; background: #1C2B3A; color: white; }
        .act-btn.del { color: #e74c3c; }
        .act-btn.del:hover { border-color: #e74c3c; background: #e74c3c; color: white; }

        @media (max-width: 640px) {
          .field-row { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
};

export default ManageCategories;
