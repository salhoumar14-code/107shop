const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const { upload } = require('../config/cloudinary');

// Get all categories
router.get('/', async (req, res) => {
    try {
        const categories = await Category.find();
        res.json(categories);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create a category
router.post('/', upload.single('image'), async (req, res) => {
    try {
        const category = new Category({
            name_fr: req.body.name_fr,
            name_ar: req.body.name_ar,
            image: req.file ? req.file.path : '',
        });

        const newCategory = await category.save();
        res.status(201).json(newCategory);
    } catch (err) {
        res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
});

// Update a category
router.put('/:id', upload.single('image'), async (req, res) => {
    try {
        let updateData = {
            name_fr: req.body.name_fr,
            name_ar: req.body.name_ar,
        };

        if (req.file) {
            updateData.image = req.file.path;
        }

        const updatedCategory = await Category.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );

        if (!updatedCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }

        res.json(updatedCategory);
    } catch (err) {
        res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
});

// Delete a category
router.delete('/:id', async (req, res) => {
    try {
        await Category.findByIdAndDelete(req.params.id);
        res.json({ message: 'Category deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
