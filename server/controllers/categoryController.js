import Category from '../models/category.js';
import Company from '../models/company.js';

function convertToUrlFormat(name) {
  if (!name) {
      return ''; 
  }
  name = ''.concat(name).toLowerCase(); 
  name = name.replace(/[^\w\s]/gi, ''); 
  name = name.replace(/\s+/g, '-'); 
  return name;
}
// Create a new category
export const createCategory = async (req, res) => {
  try {
    const { site_id, name,status } = req.body;
    const slug=convertToUrlFormat(name);
    const newCategory = new Category({ site_id, name ,status,slug});
    const savedCategory = await newCategory.save();
    res.status(201).json(savedCategory);
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
export const getCategorieAdmin = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 }).lean();
    if (categories.length === 0) {
      return res.status(404).json({ error: 'No categories found' });
    }
    res.status(200).json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
// Get all categories
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({status: "1" }).sort({ name: 1 }).lean();
    if (categories.length === 0) {
      return res.status(404).json({ error: 'No categories found' });
    }
    res.status(200).json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Update a category
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { site_id, status, name } = req.body;
    const slug=convertToUrlFormat(name);
    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { site_id, name ,status,slug},
      { new: true }
    );
    res.status(200).json(updatedCategory);
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Delete a category
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    await Category.findByIdAndDelete(id);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting category:', error);
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
export const getCategoriesWithCompanies = async (req, res) => {
  try {
    const categories = [
      { slug: 'traders', name: 'Traders' },
      { slug: 'plantations', name: 'Plantations' },
      { slug: 'refiners', name: 'Refiners' },
      { slug: 'equipment-manufacturers', name: 'Equipment manufacturers' },
      { slug: 'oleochemicals', name: 'Oleochemicals' },
      { slug: 'crude-palm-oil', name: 'Crude Palm Oil' },
      { slug: 'red-palm-oil', name: 'Red Palm Oil' },
      { slug: 'shipping-logistics', name: 'Shipping Logistics' },
      { slug: 'plantation-suppliers', name: 'Plantation Suppliers' }
    ];

    const categoryPromises = categories.map(({ slug, name }) =>
      getCategoryCompanyList(slug).then(companies => ({
        category: name,
        slug,
        companies
      }))
    );

    const result = await Promise.all(categoryPromises);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching categories with companies:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

async function getCategoryCompanyList(categorySlug) {
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
      $match: {
        'category.slug': { $regex: new RegExp(categorySlug, 'i') }
      }
    },
    {
      $project: {
        _id: 1,
        company: 1,
        company_slug: 1,
      }
    },
    {
      $sample: { size: 5 }
    },
    {
      $sort: {
        company: 1
      }
    }
  ];

  const companies = await Company.aggregate(pipeline).exec();
  return companies;
}


export const getCategoryCompanies = async (req, res) => {
  try {
    const categorySlug = req.params.categoryName;
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 50;
    const skip = (page - 1) * perPage;

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
        $match: {
          'category.slug': { $regex: new RegExp(categorySlug, 'i') }
        }
      },
      {
        $project: {
          _id: 1,
          company: 1,
          company_slug: 1,
        }
      },
      {
        $sort: {
          company: 1
        }
      },
      {
        $facet: {
          companies: [
            { $skip: skip },
            { $limit: perPage }
          ],
          totalCount: [
            { $count: 'total' }
          ]
        }
      }
    ];

    const result = await Company.aggregate(pipeline);
    const totalCount = result[0].totalCount.length > 0 ? result[0].totalCount[0].total : 0;
    const totalPages = Math.ceil(totalCount / perPage);

    res.status(200).json({
      totalPages,
      companies: result[0].companies
    });
  } catch (error) {
    console.error('Error fetching companies in category:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

