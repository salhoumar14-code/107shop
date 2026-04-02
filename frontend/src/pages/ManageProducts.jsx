import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ManageProducts = () => {
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [formData, setFormData] = useState({
        name_fr: '', name_ar: '', price: '', category: '',
        description_fr: '', description_ar: '', isSoldOut: false, isBestSeller: false
    });
    const [images, setImages] = useState([]);
    const [editingProduct, setEditingProduct] = useState(null);
    const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('');

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/products`);
            setProducts(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchCategories = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/categories`);
            setCategories(res.data);
        } catch (err) {
            console.error('Error fetching categories:', err);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Supprimer ce produit ?')) {
            try {
                await axios.delete(`${import.meta.env.VITE_API_URL}/api/products/${id}`);
                fetchProducts();
            } catch (err) {
                console.error(err);
            }
        }
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setFormData({
            name_fr: product.name_fr,
            name_ar: product.name_ar,
            price: product.price,
            category: product.category?._id || '',
            description_fr: product.description_fr || '',
            description_ar: product.description_ar || '',
            isSoldOut: product.isSoldOut,
            isBestSeller: product.isBestSeller
        });
        setImages([]);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        setEditingProduct(null);
        setFormData({
            name_fr: '', name_ar: '', price: '', category: '',
            description_fr: '', description_ar: '', isSoldOut: false, isBestSeller: false
        });
        setImages([]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        Object.keys(formData).forEach(key => data.append(key, formData[key]));
        images.forEach(img => data.append('images', img));

        try {
            if (editingProduct) {
                await axios.put(`${import.meta.env.VITE_API_URL}/api/products/${editingProduct._id}`, data);
                alert('Produit mis à jour !');
            } else {
                await axios.post(`${import.meta.env.VITE_API_URL}/api/products`, data);
                alert('Produit ajouté !');
            }
            handleCancelEdit();
            fetchProducts();
        } catch (err) {
            console.error(err);
            alert('Erreur lors de l\'enregistrement du produit');
        }
    };

    return (
        <div className="manage-section">
            <h2>{editingProduct ? 'Éditer un Produit' : 'Ajouter un Produit'}</h2>
            <form onSubmit={handleSubmit} className="admin-form">
                <div className="form-group grid-2">
                    <input type="text" value={formData.name_fr} placeholder="Nom (FR)" onChange={e => setFormData({ ...formData, name_fr: e.target.value })} required />
                    <input type="text" value={formData.name_ar} placeholder="الاسم (AR)" dir="rtl" onChange={e => setFormData({ ...formData, name_ar: e.target.value })} required />
                </div>
                <div className="form-group grid-2">
                    <input type="number" value={formData.price} placeholder="Prix (MRU)" onChange={e => setFormData({ ...formData, price: e.target.value })} required />
                    <select
                        value={formData.category}
                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                        required
                    >
                        <option value="">Choisir une catégorie</option>
                        {categories.map(cat => (
                            <option key={cat._id} value={cat._id}>
                                {cat.name_fr} | {cat.name_ar}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label style={{ display: 'block', marginBottom: '8px', color: '#666', fontSize: '0.9rem' }}>
                        Photos du produit (Max 5) {editingProduct && '(Optionnel : laissez vide pour conserver les images actuelles)'}
                    </label>
                    <input type="file" multiple onChange={e => setImages(Array.from(e.target.files))} required={!editingProduct} />
                </div>
                <div className="form-group checkbox-group">
                    <label><input type="checkbox" checked={formData.isSoldOut} onChange={e => setFormData({ ...formData, isSoldOut: e.target.checked })} /> Sold Out</label>
                    <label><input type="checkbox" checked={formData.isBestSeller} onChange={e => setFormData({ ...formData, isBestSeller: e.target.checked })} /> Best Seller</label>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button type="submit" className="btn btn-primary">{editingProduct ? 'Mettre à jour le Produit' : 'Enregistrer le Produit'}</button>
                    {editingProduct && (
                        <button type="button" className="btn" style={{ background: '#eee', color: '#333' }} onClick={handleCancelEdit}>
                            Annuler
                        </button>
                    )}
                </div>
            </form>

            <div className="admin-list">
                <div className="list-header">
                    <h3>Produits existants</h3>
                    <select 
                        value={selectedCategoryFilter} 
                        onChange={e => setSelectedCategoryFilter(e.target.value)}
                        className="filter-select"
                    >
                        <option value="">Toutes les catégories</option>
                        {categories.map(cat => (
                            <option key={cat._id} value={cat._id}>{cat.name_fr} | {cat.name_ar}</option>
                        ))}
                    </select>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Image</th>
                            <th>Nom</th>
                            <th>Prix</th>
                            <th>État</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products
                            .filter(p => selectedCategoryFilter ? (p.category?._id || p.category) === selectedCategoryFilter : true)
                            .map(p => (
                            <tr key={p._id}>
                                <td><img src={p.images[0]} alt="" style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} /></td>
                                <td>{p.name_fr}</td>
                                <td>{p.price} MRU</td>
                                <td>
                                    {p.isSoldOut && <span style={{ color: '#ff4d4d', fontSize: '0.8rem', fontWeight: 'bold' }}>SOLD OUT</span>}
                                    {p.isBestSeller && <span style={{ color: '#d4af37', fontSize: '0.8rem', fontWeight: 'bold' }}> BEST SELLER</span>}
                                </td>
                                <td>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <button onClick={() => handleEdit(p)} className="edit-btn">Éditer</button>
                                        <button onClick={() => handleDelete(p._id)} className="delete-btn">Supprimer</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <style jsx="true">{`
                .admin-form { background: white; padding: 2rem; border-radius: 12px; box-shadow: var(--shadow); max-width: 800px; margin-bottom: 3rem; }
                .form-group { margin-bottom: 1.5rem; }
                .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
                input[type="text"], input[type="number"], select { width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 8px; }
                .checkbox-group { display: flex; gap: 2rem; }
                .admin-list { background: white; padding: 2rem; border-radius: 12px; box-shadow: var(--shadow); }
                .list-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
                .list-header h3 { margin: 0; }
                .filter-select { max-width: 250px; padding: 10px; border: 1px solid #ddd; border-radius: 8px; }
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

export default ManageProducts;
