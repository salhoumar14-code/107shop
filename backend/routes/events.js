const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const { upload } = require('../config/cloudinary');

// Get all active events
router.get('/', async (req, res) => {
    try {
        const events = await Event.find({ isActive: true });
        res.json(events);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get all events (for admin)
router.get('/all', async (req, res) => {
    try {
        const events = await Event.find();
        res.json(events);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Toggle event status
router.patch('/toggle/:id', async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ message: 'Event not found' });

        event.isActive = !event.isActive;
        await event.save();
        res.json(event);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create an event
router.post('/', upload.single('image'), async (req, res) => {
    const event = new Event({
        title_fr: req.body.title_fr,
        title_ar: req.body.title_ar,
        description_fr: req.body.description_fr,
        description_ar: req.body.description_ar,
        image: req.file ? req.file.path : '',
        isActive: req.body.isActive === 'true',
    });

    try {
        const newEvent = await event.save();
        res.status(201).json(newEvent);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete an event
router.delete('/:id', async (req, res) => {
    try {
        await Event.findByIdAndDelete(req.params.id);
        res.json({ message: 'Event deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
