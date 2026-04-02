const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name_fr: { type: String, required: true },
    name_ar: { type: String, required: true },
    description_fr: { type: String },
    description_ar: { type: String },
    price: { type: Number, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    images: [{ type: String }], // Array of Cloudinary URLs
    isSoldOut: { type: Boolean, default: false },
    isBestSeller: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
