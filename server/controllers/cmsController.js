import CMS from '../models/cms.js';
import asyncHandler from 'express-async-handler';

// Create a new category

export const createCms  =  asyncHandler(async (req, res) => {
    try {
        const { cms_title, cms_key, cms_content, seo_title, seo_description, seo_keywords, status } = req.body;
        const newCms = new CMS({ cms_title, cms_key, cms_content, seo_title, seo_description, seo_keywords, status });
        const savedCms = await newCms.save();
        res.status(201).json(savedCms);
    } catch (error) {
        console.error('Error creating category:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get all categories for frontend
export const fetchCmsAll = async (req, res) => {
    try {
      const cmsdetails = await CMS.find({}, 'cms_key cms_content');
      res.json(cmsdetails);
    } catch (error) {
      console.error('Error fetching CMS data:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Get all categories
export const fetchCms = async (req, res) => {
    try {
        const cmsdetails = await CMS.find();
        res.json(cmsdetails)
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Update a category
export const updateCms = async (req, res) => {
    try {
        const currentCMS = await CMS.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(currentCMS);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const fetchSingleCms = async (req, res) => {
    const key = req.params.key; 
    try {
        const existingCMS = await CMS.findOne({ cms_key: key }, 'cms_content seo_title seo_description seo_keywords');
        res.json(existingCMS);
    } catch (error) {
        console.error('Error fetching single CMS data:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
// Delete a category
export const deleteCms = async (req, res) => {
    try {
        await CMS.findByIdAndDelete(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

