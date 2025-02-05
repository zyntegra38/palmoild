import mongoose from "mongoose";

const countrySchema = new mongoose.Schema({
  name: String,
});

const Country = mongoose.model('Country', countrySchema);

export default Country;
