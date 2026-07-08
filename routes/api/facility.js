const express = require('express');
const router = express.Router();
const Facility = require('../../models/facility');
const auth = require('../../middleware/auth');

// GET all facilities — public, sorted by displayOrder
router.get('/', async (req, res) => {
  try {
    const facilities = await Facility.find({}).sort({ displayOrder: 1, created: 1 });
    res.status(200).json({ facilities });
  } catch (error) {
    res.status(400).json({ error: 'Your request could not be processed. Please try again.' });
  }
});

// POST add facility — admin only
router.post('/add', auth, async (req, res) => {
  try {
    const { name, icon, description, displayOrder, status } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Facility name is required.' });
    }

    // Auto-assign displayOrder if not provided
    let order = displayOrder;
    if (order === undefined || order === null) {
      const last = await Facility.findOne({}).sort({ displayOrder: -1 });
      order = last ? last.displayOrder + 1 : 0;
    }

    const facility = new Facility({
      name: name.trim(),
      icon: icon || '',
      description: description || '',
      displayOrder: order,
      status: status || 'active',
    });

    const saved = await facility.save();

    res.status(200).json({
      success: true,
      message: 'Facility has been added successfully!',
      facility: saved,
    });
  } catch (error) {
    res.status(400).json({ error: 'Your request could not be processed. Please try again.' });
  }
});

// PUT update facility — admin only
router.put('/:id', auth, async (req, res) => {
  try {
    const facilityId = req.params.id;
    const { name, icon, description, displayOrder, status } = req.body;

    const update = {};
    if (name !== undefined) update.name = name.trim();
    if (icon !== undefined) update.icon = icon;
    if (description !== undefined) update.description = description;
    if (displayOrder !== undefined) update.displayOrder = displayOrder;
    if (status !== undefined) update.status = status;

    const updated = await Facility.findOneAndUpdate(
      { _id: facilityId },
      update,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: 'Facility not found.' });
    }

    res.status(200).json({
      success: true,
      message: 'Facility has been updated successfully!',
      facility: updated,
    });
  } catch (error) {
    res.status(400).json({ error: 'Your request could not be processed. Please try again.' });
  }
});

// PUT batch reorder — admin only
router.put('/reorder/batch', auth, async (req, res) => {
  try {
    const { order } = req.body; // array of { id, displayOrder }
    if (!Array.isArray(order)) {
      return res.status(400).json({ error: 'order must be an array.' });
    }

    const updates = order.map(({ id, displayOrder }) =>
      Facility.updateOne({ _id: id }, { displayOrder })
    );
    await Promise.all(updates);

    res.status(200).json({ success: true, message: 'Facilities reordered successfully!' });
  } catch (error) {
    res.status(400).json({ error: 'Your request could not be processed. Please try again.' });
  }
});

// DELETE facility — admin only
router.delete('/delete/:id', auth, async (req, res) => {
  try {
    const facility = await Facility.deleteOne({ _id: req.params.id });

    res.status(200).json({
      success: true,
      message: 'Facility has been deleted successfully!',
      facility,
    });
  } catch (error) {
    res.status(400).json({ error: 'Your request could not be processed. Please try again.' });
  }
});

module.exports = router;
