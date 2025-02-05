import asyncHandler from 'express-async-handler';
import Country from '../models/country.js';
import Company from '../models/company.js';
import Category from '../models/category.js';

// @desc    Get all countries
export const getCountries = asyncHandler(async (req, res) => {
  const countries = await Country.find().sort({ name: 1 }); 
  res.json(countries);
});

// @desc    Create a new country
export const createCountry = asyncHandler(async (req, res) => {
  const { name } = req.body;

  const country = await Country.create({
    name,
  });

  if (country) {
    res.status(201).json(country);
  } else {
    res.status(400);
    throw new Error('Invalid country data');
  }
});

// @desc    Delete a country
export const deleteCountry = asyncHandler(async (req, res) => {
  try {
    const country = await Country.findById(req.params.id);

    if (country) {
      await country.deleteOne();  // Use deleteOne instead of remove
      res.json({ message: 'Country removed' });
    } else {
      res.status(404).json({ error: 'Country not found' });
    }
  } catch (error) {
    console.error('Error deleting country:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// @desc    Update a country
export const updateCountry = asyncHandler(async (req, res) => {
  const { name } = req.body;
  try {
    const updatedCountry = await Country.findByIdAndUpdate(
      req.params.id,
      { $set: { name } },
      { new: true, runValidators: true }
    );
    if (updatedCountry) {
      res.json(updatedCountry);
    } else {
      res.status(404);
      throw new Error('Country not found');
    }
  } catch (error) {
    console.error('Error updating country:', error);
    res.status(400).json({ error: error.message });
  }
});

export const getCountryCompanies = async (req, res) => {
  try {
    const countryName = req.params.countryName;
    const country = await Country.findOne({ name: countryName });
    if (!country) {
      return res.status(404).json({ error: 'Country not found' });
    }
    const companies = await Company.aggregate([
      { 
        $match: { country_id: country._id } 
      },
      {
        $lookup: {
          from: 'categories',
          localField: 'category_id',
          foreignField: '_id',
          as: 'category'
        }
      },
      {
        $project: {
          _id: 1,
          name: '$company',
          company_slug: 1,
          categoryName: { $arrayElemAt: ['$category.name', 0] }
        }
      }
    ]);

    if (companies.length === 0) {
      return res.status(404).json({ error: 'No companies found in the specified country' });
    }
    res.status(200).json(companies);
  } catch (error) {
    console.error('Error fetching companies in country:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};






