import asyncHandler from 'express-async-handler';
import Site from '../models/site.js';

// @desc    Get all sites
export const getSites = asyncHandler(async (req, res) => {
  const sites = await Site.find();
  res.json(sites);
});

// @desc    Create a new site
export const createSite = asyncHandler(async (req, res) => {
  const { name } = req.body;

  const site = await Site.create({
    name,
  });

  if (site) {
    res.status(201).json(site);
  } else {
    res.status(400);
    throw new Error('Invalid site data');
  }
});

// @desc    Delete a site
export const deleteSite = asyncHandler(async (req, res) => {
  try {
    const site = await Site.findById(req.params.id);
    if (site) {
      await site.deleteOne();  // Use deleteOne instead of remove
      res.json({ message: 'site removed' });
    } else {
      res.status(404).json({ error: 'site not found' });
    }
  } catch (error) {
    console.error('Error deleting site:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export const updateSite = asyncHandler(async (req, res) => {
  const { name } = req.body;
  try {
    const updatedSite = await Site.findByIdAndUpdate(
      req.params.id,
      { $set: { name } },
      { new: true, runValidators: true }
    );
    if (updatedSite) {
      res.json(updatedSite);
    } else {
      res.status(404);
      throw new Error('Site not found');
    }
  } catch (error) {
    console.error('Error updating Site:', error);
    res.status(400).json({ error: error.message });
  }
});
