import Staff from '../models/staff.js';
import asyncHandler from 'express-async-handler';

export const getStaff = asyncHandler(async (req, res) => {
  try {
    const company_id = req.params.id;
    const existingCompany = await Staff.find({ company_id: company_id });
    res.status(200).json(existingCompany);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
