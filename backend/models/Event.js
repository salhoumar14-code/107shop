const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title_fr: { type: String, required: true },
    title_ar: { type: String, required: true },
    description_fr: { type: String },
    description_ar: { type: String },
    image: { type: String }, // Cloudinary URL
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
