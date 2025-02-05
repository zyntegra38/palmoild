import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
    },
    company: {
      type: String,
    },
    address: {
      type: String,
    },
    address2: String,
    country_id: {
      type: String,
    },
    mobile: {
      type: String,
    },
    password: {
      type: String,
    },
    role: {
      type: Number,
      default: 0,
    },
    provider:{
      type: String,
    },
    fbaccountId:{
      type: String,
    },
    status: {
      type: Number,
      default: 0,
    },
    resetPasswordToken: {
      type: String,
      required: false,
    },
    resetPasswordExpires: {
      type: Date,
      required: false,
    },
    transaction_id: {
      type: String,
      default: '',
    },
    expiryDate:{
      type: String,
      default: '',
    }
  },
  {
    timestamps: true,
  }
);

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Encrypt password using bcrypt
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model("User", userSchema);

export default User;
