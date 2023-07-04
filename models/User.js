const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      min: 3,
      max: 20,
      unique: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true,
      min: 6
    },
    isAdmin : {
      type : Boolean,
      default : false
    },
    memories : {
      type : [{
        memory_title : String,
        memory_desc : String,
        memory_img : mongoose.Schema.Types.Buffer,
        memory_date : String,
        isLiked : {
          type : Boolean,
          default : false
        }
      }]
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("user", userSchema);