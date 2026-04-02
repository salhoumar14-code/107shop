const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name_fr: { type: String, required: true },
    name_ar: { type: String, required: true },
    image: { type: String }, // Cloudinary URL
}, { timestamps: true });

module.exports = mongoose.model('Category', categorySchema);
