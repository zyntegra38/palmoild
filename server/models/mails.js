import mongoose from "mongoose";

const mailsSchema = new mongoose.Schema(
    {
        name: String,
        email: String,
        subject:String,
        status:String
    },
    {
        timestamps: true,
    }
);

const Mails = mongoose.model('Mails', mailsSchema);

export default Mails;