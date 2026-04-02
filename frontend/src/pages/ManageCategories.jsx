import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ManageCategories = () => {
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({ name_fr: '', name_ar: '' });
    const [image, setImage] = useState(null);
    const [editingCategory, setEditingCategory] = useState(null);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/categories`);
            setCategories(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Supprimer cette catégorie ?')) {
            try {
                await axios.delete(`${import.meta.env.VITE_API_URL}/api/categories/${id}`);
                fetchCategories();
            } catch (err) {
                console.error(err);
            }
        }
    };

    const handleEdit = (category) => {
        setEditingCategory(category);
        setFormData({
            name_fr: category.name_fr,
            name_ar: category.name_ar,
        });
        setImage(null); // Optional: keep old image if null
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        setEditingCategory(null);
        setFormData({ name_fr: '', name_ar: '' });
        setImage(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('name_fr', formData.name_fr);
        data.append('name_ar', formData.name_ar);
        if (image) data.append('image', image);

        try {
            if (editingCategory) {
                await axios.put(`${import.meta.env.VITE_API_URL}/api/categories/${editingCategory._id}`, data);
                alert('Catégorie mise à jour !');
            } else {
                await axios.post(`${import.meta.env.VITE_API_URL}/api/categories`, data);
                alert('Catégorie ajoutée !');
            }
            
            handleCancelEdit();
            fetchCategories();
        } catch (err) {
            console.error(err);
            alert('Erreur lors de l\'enregistrement de la catégorie');
        }
    };

    return (
        <div className="manage-section">
            <h2>{editingCategory ? 'Éditer la Catégorie' : 'Gérer les Catégories'}</h2>
            <form onSubmit={handleSubmit} className="admin-form">
                <div className="form-group grid-2">
                    <input type="text" value={formData.name_fr} placeholder="Nom (FR)" onChange={e => setFormData({ ...formData, name_fr: e.target.value })} required />
                    <input type="text" value={formData.name_ar} placeholder="الاسم (AR)" dir="rtl" onChange={e => setFormData({ ...formData, name_ar: e.target.value })} required />
                </div>
                <div className="form-group">
                    <label style={{ display: 'block', marginBottom: '8px', color: '#666', fontSize: '0.9rem' }}>
                        Image de la catégorie (Optionnel)
                    </label>
                    <input type="file" onChange={e => setImage(e.target.files[0])} />
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button type="submit" className="btn btn-primary">{editingCategory ? 'Mettre à jour' : 'Créer la Catégorie'}</button>
                    {editingCategory && (
                        <button type="button" className="btn" style={{ background: '#eee', color: '#333' }} onClick={handleCancelEdit}>
                            Annuler
                        </button>
                    )}
                </div>
            </form>

            <div className="admin-list">
                <h3>Catégories existantes</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Image</th>
                            <th>Français</th>
                            <th>Arabe</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map(cat => (
                            <tr key={cat._id}>
                                <td><img src={cat.image} alt="" style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} /></td>
                                <td>{cat.name_fr}</td>
                                <td>{cat.name_ar}</td>
                                <td>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <button onClick={() => handleEdit(cat)} className="edit-btn">Éditer</button>
                                        <button onClick={() => handleDelete(cat._id)} className="delete-btn">Supprimer</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <style jsx="true">{`
                .admin-form { background: white; padding: 2rem; border-radius: 12px; box-shadow: var(--shadow); max-width: 600px; margin-bottom: 3rem; }
                .form-group { margin-bottom: 1.5rem; }
                .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
                input { width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 8px; }
                .admin-list { background: white; padding: 2rem; border-radius: 12px; box-shadow: var(--shadow); }
                .admin-list h3 { margin-bottom: 1.5rem; }
                table { width: 100%; border-collapse: collapse; }
                th, td { padding: 1rem; border-bottom: 1px solid #eee; text-align: left; }
                .delete-btn { color: #ff4d4d; border: 1px solid #ff4d4d; background: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; transition: var(--transition); }
                .delete-btn:hover { background: #ff4d4d; color: white; }
                .edit-btn { color: var(--primary); border: 1px solid var(--primary); background: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; transition: var(--transition); }
                .edit-btn:hover { background: var(--primary); color: white; }
            `}</style>
        </div>
    );
};

export default ManageCategories;
