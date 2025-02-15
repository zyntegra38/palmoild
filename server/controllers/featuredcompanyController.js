import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose'; // Import mongoose to convert string IDs to ObjectId
import FeaturedCompany from '../models/featuredCompany.js';
import User from '../models/userModel.js';
import Category from '../models/category.js';
import Country from '../models/country.js';
import path from 'path';
import Staff from '../models/staff.js';


//........Create a new FeaturedCompany...........
export const createCompany = asyncHandler(async (companyData, res) => {
  try {
      const {
          user_id,
          company,
          category_id,
          country_id,
          website,
          mobile,
          email,
          profile,
          title,
          site_id,
          address,
          description,
          status,
          rating,
          facebook_url,
          twitter_url,
          linkedin_url,
          insta_url,
          brochure_url,
          staff,
          logo
      } = companyData;

      const existingCompany = await FeaturedCompany.findOne({ company: company });
      if (existingCompany) {
        return res.status(400).json({ message: "FeaturedCompany already exists" });
      }

      let categoryIds = Array.isArray(category_id) ?
      category_id : category_id.split(',').map(id => id.trim());
      const categoryId = categoryIds.shift();
      const remainingCategoryIds = categoryIds.join(', ');

      const newCompany = await FeaturedCompany.create({
          user_id,
          company,
          category_id:categoryId,
          category_id_multi:remainingCategoryIds,
          country_id,
          logo,
          website,
          mobile,
          email,
          profile,
          title,
          site_id,
          address,
          description,
          status,
          rating,
          facebook_url,
          twitter_url,
          linkedin_url,
          insta_url,
          brochure_url,
          company_slug: convertToUrlFormat(company),
      });
      if(staff){
        await Staff.insertMany(staff.map(staffMember => ({
          company_id: newCompany._id,
            ...staffMember
        })));
      }      
      res.status(201).json(newCompany);
  } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

//........Update a company.............
export const updateCompany = asyncHandler(async (companyId, companyData, res) => {
  try {
      const {
          company,
          category_id,
          country_id,
          website,
          mobile,
          email,
          profile,
          title,
          site_id,
          address,
          description,
          status,
          rating,
          facebook_url,
          twitter_url,
          linkedin_url,
          insta_url,
          brochure_url,
          staff,
          logo
      } = companyData;

      let categoryIds = Array.isArray(category_id) ? category_id : category_id.split(',').map(id => id.trim());
      const categoryId = categoryIds.shift();
      const remainingCategoryIds = categoryIds.join(', ');

      const updateFields = {
          company,
          category_id: categoryId,
          category_id_multi: remainingCategoryIds,
          country_id,
          website,
          mobile,
          email,
          profile,
          title,
          site_id,
          address,
          description,
          status,
          rating,
          facebook_url,
          twitter_url,
          linkedin_url,
          insta_url,
          brochure_url,
          company_slug: convertToUrlFormat(company),
          logo
      };

      const updatedCompany = await FeaturedCompany.findByIdAndUpdate(
          companyId,
          updateFields,
          { new: true }
      );

      if (!updatedCompany) {
          res.status(404).json({ error: 'FeaturedCompany not found' });
          return;
      }

      if (staff) {
          await Staff.deleteMany({ company_id: companyId });
          await Staff.insertMany(staff.map(staffMember => ({
              company_id: companyId,
              ...staffMember
          })));
      }

      res.json(updatedCompany);
  } catch (error) {
      console.error('Error updating company:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

//........Get all Companies............
export const getCompanies = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const perPage = parseInt(req.query.perPage) || 50;
  const countPipeline = [
    {
      $count: "total"
    }
  ];
  const totalCountResult = await FeaturedCompany.aggregate(countPipeline);
  const totalCount = totalCountResult.length > 0 ? totalCountResult[0].total : 0;
  const pipeline = [
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
      $project: {
        _id: 1,
        company: 1,
        company_slug: 1,
        address:1,
        logo: 1,
        country_id: 1,
        website: 1,
        mobile: 1,
        address:1,
        rating:1,
        facebook_url: 1,
        twitter_url: 1,
        linkedin_url: 1,
        insta_url: 1,
        brochure_url: 1,
        profile: 1,
        title: 1,
        category_id: 1,
        email: 1,
        user_id: 1,
        categoryName: { $arrayElemAt: ['$category.name', 0] },
        countryName: { $arrayElemAt: ['$country.name', 0] },
      }
    },
    {
      $sort: { company: 1 } 
    }
  ];
  const skip = (page - 1) * perPage;
  pipeline.push({ $skip: skip }, { $limit: perPage });
  const companies = await FeaturedCompany.aggregate(pipeline);
  const totalPages = Math.ceil(totalCount / perPage); 
  const result = [];
  result.push({
    totalPages: totalPages,
    companies: companies
  });
  res.status(200).json(result);
});

//........Get all Companies Frontend............

export const getFeaturedCompanies = asyncHandler(async (req, res) => {
  try {
    const companies = await FeaturedCompany.aggregate([
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
        $project: {
          _id: 1,
          company: 1,
          logo: 1,
          company_slug: 1,
          rating: 1,
          categoryName: { $arrayElemAt: ['$category.name', 0] }, 
          countryName: { $arrayElemAt: ['$country.name', 0] } 
        }
      }
    ]);

    // If no companies found, return 404
    if (!companies || companies.length === 0) {
      return res.status(404).json({ message: 'No featured companies found' });
    }

    // Return the array of companies
    res.status(200).json(companies);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error', error });
  }
});


export const getNormalUserCompanies = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const perPage = parseInt(req.query.perPage) || 50;
  const skip = (page - 1) * perPage;

  try {
    const pipeline = [
      {
        $facet: {
          totalCount: [{ $count: "total" }],
          companies: [
            { $project: { _id: 1, company: 1, company_slug: 1 } },
            { $sort: { company: 1 } },
            { $skip: skip },
            { $limit: perPage }
          ]
        }
      }
    ];

    const result = await FeaturedCompany.aggregate(pipeline);
    const totalCount = result[0].totalCount[0] ? result[0].totalCount[0].total : 0;
    const totalPages = Math.ceil(totalCount / perPage);

    res.status(200).json({
      totalPages: totalPages,
      companies: result[0].companies
    });
  } catch (error) {
    console.error('Error fetching companies:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});



export const getCompanyList = asyncHandler(async (req, res) => {
  const pipeline = [
    {
      $project: {
        _id: 1,
        company: 1,
        company_slug: 1,
      }
    },
    {
      $sort: { company: 1 } 
    }
  ];
  const companies = await FeaturedCompany.aggregate(pipeline);
  res.json(companies);
});


//...........Converting FeaturedCompany name to comany url.......
function convertToUrlFormat(name) {
  if (!name) {
      return ''; 
  }
  name = ''.concat(name).toLowerCase(); 
  name = name.replace(/[^\w\s]/gi, ''); 
  name = name.replace(/\s+/g, '-'); 
  return name;
}

//...........Getting Single FeaturedCompany Data...........

export const getCompanyDetails = asyncHandler(async (req, res) => {
  const companyName = req.params.companyName;

  try {
    // Run aggregation without lean()
    const companyDetails = await FeaturedCompany.aggregate([
      { $match: { company_slug: companyName } },
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
        $project: {
          _id: 1,
          company: 1,
          company_slug: 1,
          logo: 1,
          country_id: 1,
          website: 1,
          mobile: 1,
          email: 1,
          address: 1,
          description: 1,
          category_id: 1,
          status: 1,
          rating:1,
          date_added: 1,
          facebook_url: 1,
          twitter_url: 1,
          linkedin_url: 1,
          insta_url: 1,
          brochure_url: 1,
          profile: 1,
          title: 1,
          categoryName: { $arrayElemAt: ['$category.name', 0] },
          countryName: { $arrayElemAt: ['$country.name', 0] }
        }
      }
    ]);

    // If no company details are found, return 404
    if (!companyDetails || companyDetails.length === 0) {
      return res.status(404).json({ error: 'FeaturedCompany not found' });
    }

    // Return the first result (as companyDetails should be an array)
    res.status(200).json(companyDetails[0]);

  } catch (error) {
    console.error('Error fetching company details:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



//...........Getting Single FeaturedCompany Data using ID...........
export const getSingleCompanies = async (req, res) => {
  try {
    const userID = req.params.companyId;
    const company = await FeaturedCompany.findOne({ _id: userID });
    if (!company) {
      return res.status(404).json({ error: 'FeaturedCompany not found' });
    }
    res.status(200).json(company);
  } catch (error) {
    console.error('Error fetching company details:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

//..................Delete a company..................
export const deleteCompany = asyncHandler(async (req, res) => {
  try {
    const company = await FeaturedCompany.findById(req.params.id);
    if (company) {
      await company.deleteOne();  
      res.json({ message: 'FeaturedCompany removed' });
    } else {
      res.status(404).json({ error: 'company not found' });
    }
  } catch (error) {
    console.error('Error deleting company:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//.........Search company from companies list.........
export const searchCompanies = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const perPage = parseInt(req.query.perPage) || 50;
  const searchTerm = req.query.term;
  const category_id = req.query.category_id;
  const country_id = req.query.country_id;
  const pipeline = [
    {
      $search: {
        index: 'company_search',
        compound: {
          should: [
            {
              autocomplete: {
                query: searchTerm,
                path: "company",
              },
            },
            {
              autocomplete: {
                query: searchTerm,
                path: "profile",
              },
            },            
            {
              autocomplete: {
                query: searchTerm,
                path: "country",
              },
            },            
            {
              autocomplete: {
                query: searchTerm,
                path: "category",
              },
            },
            {
              autocomplete: {
                query: searchTerm,
                path: "address",
              },
            },
          ],
          minimumShouldMatch: 1,
        },
      },
    },
    {
      $lookup: {
        from: 'categories',
        localField: 'category_id',
        foreignField: '_id',
        as: 'category',
      }
    },
    {
      $lookup: {
        from: 'countries',
        localField: 'country_id',
        foreignField: '_id',
        as: 'country',
      }
    },
    {
      $project: {
        _id: 1,
        company: 1,
        company_slug: 1,
        logo: 1,
        country_id: 1,
        website: 1,
        mobile: 1,
        rating:1,
        facebook_url:1,
        twitter_url:1,
        linkedin_url:1,
        insta_url:1,
        brochure_url:1,
        profile: 1,
        title: 1,
        category_id: 1,
        email:1,
        address:1,
        categoryName: { $arrayElemAt: ['$category.name', 0] },
        countryName: { $arrayElemAt: ['$country.name', 0] },
        exactMatch: {
          $cond: {
            if: { $or: [
              { $eq: [ { $indexOfCP: [ "$company", searchTerm ] }, 0 ] },
              { $eq: [ { $indexOfCP: [ "$profile", searchTerm ] }, 0 ] }
            ]},
            then: 1,
            else: 0
          }
        }
      },
    },
    {
      $sort: { exactMatch: -1, company: 1 } 
    }
  ];
        
    
  if (searchTerm !== '') { 
    if (category_id !== '' && category_id !== 'All' && country_id !== '' && country_id !== 'All') {
      const categoryIds = category_id.split(',').map(id => id.trim());
      const countryIds = country_id.split(',').map(id => id.trim());
      const totalCountPipeline = [
          {
              $match: {
                  category_id: { $in: categoryIds.map(id => new mongoose.Types.ObjectId(id)) },
                  country_id: { $in: countryIds.map(id => new mongoose.Types.ObjectId(id)) }
              }
          },
      {
              $count: "total"
          }
      ];
      const totalCountResult = await FeaturedCompany.aggregate(totalCountPipeline);
      const totalItems = totalCountResult.length > 0 ? totalCountResult[0].total : 0;
      const totalPages = Math.ceil(totalItems / perPage);
      const skip = (page - 1) * perPage;
      const result = await FeaturedCompany.aggregate(pipeline);
      const filteredResults = result.filter(company =>
        categoryIds.includes(String(company.category_id)) && countryIds.includes(String(company.country_id))
      );
      const paginatedResults = filteredResults.slice(skip, skip + perPage);
      const results = [{
          totalPages: totalPages,
          companies: paginatedResults
      }];
      res.status(200).json(results);
    } else if (country_id !== '' && country_id !== 'All') {
      const result = await FeaturedCompany.aggregate(pipeline);
      const filteredResults = result.filter(company => country_id.split(',').includes(String(company.country_id)));
      const totalItems = filteredResults.length;
      const totalPages = Math.ceil(totalItems / perPage);
      const skip = (page - 1) * perPage;
      const paginatedResults = filteredResults.slice(skip, skip + perPage);
      const results = [];
      results.push({
        totalPages: totalPages,
        companies: paginatedResults
      });
      res.status(200).json(results);
    
    } else if (category_id !== '' && category_id !== 'All') {
      const categoryIds = category_id.split(',').map(id => id.trim()); 
      const result = await FeaturedCompany.aggregate(pipeline);
      const filteredResults = result.filter(company => categoryIds.includes(String(company.category_id)));
      const totalItems = filteredResults.length;
      const totalPages = Math.ceil(totalItems / perPage);
      const skip = (page - 1) * perPage;
      const paginatedResults = filteredResults.slice(skip, skip + perPage);
      const results = [];
      results.push({
        totalPages: totalPages,
        companies: paginatedResults
      });
      res.status(200).json(results);  
    } else { 
      const page = parseInt(req.query.page) || 1;
      const perPage = parseInt(req.query.perPage) || 50;  
      const countPipeline = [
        { $count: "totalCount" }
      ];
      const totalCountResult = await FeaturedCompany.aggregate([...pipeline, ...countPipeline]);
      const totalCount = totalCountResult.length > 0 ? totalCountResult[0].totalCount : 0;
      const totalPages = Math.ceil(totalCount / perPage);
      const skip = (page - 1) * perPage;
      pipeline.push({ $skip: skip }, { $limit: perPage });
      const companies = await FeaturedCompany.aggregate(pipeline);
      const result = [];
      result.push({
        totalPages: totalPages,
        companies: companies
      });
      res.status(200).json(result);        
    }    
  } else if (category_id !== '' && category_id !== 'All') {
      if (country_id !== '' && country_id !== 'All' && category_id !== '' && category_id !== 'All') {
          const page = parseInt(req.query.page) || 1;
          const perPage = parseInt(req.query.perPage) || 50;
          const totalCount = await FeaturedCompany.countDocuments({ country_id: { $in: country_id.split(',').map(id => id.trim()) }, category_id: { $in: category_id.split(',').map(id => id.trim()) } });
          const totalPages = Math.ceil(totalCount / perPage);
          const skip = (page - 1) * perPage;
          const companies = await FeaturedCompany.find({ country_id: { $in: country_id.split(',').map(id => id.trim()) }, category_id: { $in: category_id.split(',').map(id => id.trim()) } })
              .populate('category_id', 'name')
              .populate('country_id', 'name')
              .sort({ company: 1 })
              .skip(skip)
              .limit(perPage);
          const result = companies.map(company => ({
              _id: company._id,
              company: company.company,
              email:company.email,
              company_slug: company.company_slug,
              logo: company.logo,
              countryName: company.country_id.name,
              website: company.website,
              mobile: company.mobile,
              twitter_url:company.twitter_url,
              facebook_url: company.facebook_url,
              rating: company.rating,
              linkedin_url: company.linkedin_url,
              insta_url: company.insta_url,
              brochure_url:company.brochure_url,
              profile: company.profile,
              title: company.title,
              address: company.address,
              categoryName: company.category_id.name,
          }));
          const results = [];
          results.push({
            totalPages: totalPages,
            companies: result
          });
          res.status(200).json(results); 
      } else { 
          const totalCount = await FeaturedCompany.countDocuments({ category_id: { $in: category_id.split(',').map(id => id.trim()) } });
          const totalPages = Math.ceil(totalCount / perPage);
          const skip = (page - 1) * perPage;
          const companies = await FeaturedCompany.find(
            { category_id: { $in: category_id.split(',').map(id => id.trim()) } })
              .populate('category_id', 'name')
              .populate('country_id', 'name')
              .sort({ company: 1 })
              .skip(skip)
              .limit(perPage);
          const result = companies.map(company => ({
              _id: company._id,
              company: company.company,
              email: company.email,
              company_slug: company.company_slug,
              logo: company.logo,
              countryName: company.country_id.name,
              website: company.website,
              mobile: company.mobile,
              rating: company.rating,
              twitter_url: company.twitter_url,
              facebook_url: company.facebook_url,
              linkedin_url: company.linkedin_url,
              insta_url: company.insta_url,
              brochure_url: company.brochure_url,
              profile: company.profile,
              title: company.title,
              address: company.address,
              categoryName: company.category_id.name
          }));
          const results = [];
          results.push({
            totalPages: totalPages,
            companies: result
          });
          res.status(200).json(results);          
      }    
  } else if (country_id !== '' && country_id !== 'All') {
      const page = parseInt(req.query.page) || 1;
      const perPage = parseInt(req.query.perPage) || 50;
      const totalCount = await FeaturedCompany.countDocuments({ country_id: { $in: country_id.split(',').map(id => id.trim()) } });
      const totalPages = Math.ceil(totalCount / perPage);
      const skip = (page - 1) * perPage;
      const companies = await FeaturedCompany.find({ country_id: { $in: country_id.split(',').map(id => id.trim()) } })
          .populate('category_id', 'name')
          .populate('country_id', 'name')
          .sort({ company: 1 })
          .skip(skip)
          .limit(perPage); 
      const result = companies.map(company => ({
          _id: company._id,
          company: company.company,
          email:company.email,
          company_slug: company.company_slug,
          logo:company.logo,
          countryName:company.country_id.name,
          website:company.website,
          mobile:company.mobile,
          rating: company.rating,
          twitter_url:company.twitter_url,
          facebook_url: company.facebook_url,
          linkedin_url: company.linkedin_url,
          insta_url: company.insta_url,
          brochure_url:company.brochure_url,
          profile:company.profile,
          title:company.title,
          address: company.address,
          categoryName: company.category_id.name,
      }));
      const results = [];
      results.push({
        totalPages: totalPages,
        companies: result
      });
      res.status(200).json(results); 
  } else if (country_id === 'All' && category_id === 'All') {
      const page = parseInt(req.query.page) || 1;
      const perPage = parseInt(req.query.perPage) || 50;
      const totalCount = await FeaturedCompany.countDocuments();
      const totalPages = Math.ceil(totalCount / perPage);
      const skip = (page - 1) * perPage;    
      const companies = await FeaturedCompany.find()
          .populate('category_id', 'name')
          .populate('country_id', 'name')
          .sort({ company: 1 })
          .skip(skip)
          .limit(perPage);
          
      const result = companies.map(company => ({
          _id: company._id,
          company: company.company,
          email:company.email,
          company_slug: company.company_slug,
          logo:company.logo,
          countryName:company.country_id.name,
          website:company.website,
          mobile:company.mobile,
          rating: company.rating,
          twitter_url:company.twitter_url,
          facebook_url: company.facebook_url,
          linkedin_url: company.linkedin_url,
          insta_url: company.insta_url,
          brochure_url:company.brochure_url,
          profile:company.profile,
          title:company.title,
          address: company.address,
          categoryName: company.category_id.name 
      }));
      const results = [];
      results.push({
        totalPages: totalPages,
        companies: result
      });    
  } else{ 
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 50;
    const countPipeline = [
      {
        $count: "total"
      }
    ];
    const totalCountResult = await FeaturedCompany.aggregate(countPipeline);
    const totalCount = totalCountResult.length > 0 ? totalCountResult[0].total : 0;
    const pipeline = [
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
        $project: {
          _id: 1,
          company: 1,
          company_slug: 1,
          address:1,
          logo: 1,
          country_id: 1,
          website: 1,
          mobile: 1,
          address:1,
          rating:1,
          facebook_url: 1,
          twitter_url: 1,
          linkedin_url: 1,
          insta_url: 1,
          brochure_url: 1,
          profile: 1,
          title: 1,
          category_id: 1,
          email: 1,
          user_id: 1,
          categoryName: { $arrayElemAt: ['$category.name', 0] },
          countryName: { $arrayElemAt: ['$country.name', 0] },
        }
      },
      {
        $sort: { company: 1 } 
      }
    ];
    const skip = (page - 1) * perPage;
    pipeline.push({ $skip: skip }, { $limit: perPage });
    const companies = await FeaturedCompany.aggregate(pipeline);
    const totalPages = Math.ceil(totalCount / perPage); 
    const result = [];
    result.push({
      totalPages: totalPages,
      companies: companies
    });
    res.status(200).json(result);
  }

});

export const getSingleCompanyDetails = async (req, res) => {
  try {
    const userID = req.params.userID;
    const company = await FeaturedCompany.findOne({ user_id: userID });
    if (!company) {
      return res.status(404).json({ error: 'FeaturedCompany not found' });
    }
    res.status(200).json(company);
  } catch (error) {
    console.error('Error fetching company details:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}




export const getRelatedCompanies = async (req, res) => {
  const categoryId = req.params.catID;
  const companyIdToExclude = req.params.companyId; 
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  
  try {
    const totalCompanies = await FeaturedCompany.countDocuments({ category_id: categoryId, _id: { $ne: companyIdToExclude } });
    const relatedCompanies = await FeaturedCompany.find({ category_id: categoryId, _id: { $ne: companyIdToExclude } })
      .skip((page - 1) * limit)
      .limit(limit);
    
    res.status(200).json({
      totalCompanies,
      totalPages: Math.ceil(totalCompanies / limit),
      companies: relatedCompanies,
    });
  } catch (error) {
    console.error('Error fetching related companies:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};













