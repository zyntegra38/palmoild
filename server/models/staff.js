import mongoose from "mongoose";

const staffSchema = new mongoose.Schema({
  company_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
  },
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  mobile: {
    type: String,
  },
  designation: {
    type: String,
  }
});

const Staff = mongoose.model('Staff', staffSchema);

export default  Staff;