import Favorite from "../models/favorite.js";
import asyncHandler from 'express-async-handler';
import Company from "../models/company.js";

export const addFavorite = asyncHandler(async (req, res) => {
  const companyId  = req.params.id;
  const userid  = req.params.userid;
  try {
      const favorite = new Favorite({
        user_id: userid,
        company_id: companyId
      });
      await favorite.save();
      res.status(201).send();
  } catch (error) {
      console.error('Error adding company to favorites:', error);
      res.status(500).send({ error: 'Internal Server Error' });
  }
});

export const deleteFavorite = asyncHandler(async (req, res) => {
    const company = await Favorite.findOne({user_id: req.params.userid, company_id: req.params.id});
    if (company) {
      await company.deleteOne();  
      res.json({ message: 'Company removed' });
    } else {
      res.status(404).json({ error: 'company not found' });
    }
});

export const checkFavorite = asyncHandler(async (req, res) => {
  const companyId = req.params.id;
  const userId = req.params.userid;
  try {
    const company = await Favorite.findOne({ user_id: userId, company_id: companyId });
    if (company) {
      res.json({ isFavorite: "favorite" });
    } else {
      res.json({ isFavorite: "not favorite" });
    }
  } catch (error) {
    console.error('Error checking favorite:', error);
    res.status(500).json({ error: 'Internal Server Error' }); // Send an error response
  }
});

export const getFavorite = asyncHandler(async (req, res) => {
  const userId = req.params.userid;
  try {
    const favoriteCompanyIds = await Favorite.find({ user_id: userId }).distinct('company_id');
    const favoriteCompanies = await Company.aggregate([
      {
        $match: { _id: { $in: favoriteCompanyIds } } 
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
        $lookup: {
          from: 'countries',
          localField: 'country_id',
          foreignField: '_id',
          as: 'country'
        }
      },
      {
        $lookup: {
          from: 'staffs',
          localField: '_id',
          foreignField: 'company_id',
          as: 'staff'
        }
      },
      {
        $project: {
          _id: 1,
          company: 1,
          company_slug: 1,
          mobile: 1,
          email: 1,
          categoryName: { $arrayElemAt: ['$category.name', 0] },
          countryName: { $arrayElemAt: ['$country.name', 0] },
          staff_emails: { $reduce: {
            input: "$staff",
            initialValue: "",
            in: { $concat: ["$$value", { $ifNull: [", ", ""] }, "$$this.email"] }
          }},
          staff_names: { $reduce: {
            input: "$staff",
            initialValue: "",
            in: { $concat: ["$$value", { $ifNull: [", ", ""] }, "$$this.name"] }
          }},
          staff_mobiles: { $reduce: {
            input: "$staff",
            initialValue: "",
            in: { $concat: ["$$value", { $ifNull: [", ", ""] }, "$$this.mobile"] }
          }}
        }
      }
    ]);
    if (favoriteCompanies.length === 0) {
      return res.status(404).json({ error: 'No favorite companies found for the user' });
    }
    res.status(200).json(favoriteCompanies);
  } catch (error) {
    console.error('Error fetching favorite companies:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



  