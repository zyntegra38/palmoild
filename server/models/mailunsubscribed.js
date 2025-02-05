import mongoose from "mongoose";

const unsubscribedSchema = new mongoose.Schema({
  email: String,
});

const Unsubscribed = mongoose.model('Unsubscribed', unsubscribedSchema);

export default Unsubscribed;