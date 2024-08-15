const mongoose = require('mongoose');
// USER MODEL SCHEMA
const userSchema= new mongoose.Schema({
  name:{
    type:String,
    required:true
  },
  email:{
    type:String,
    required:true,
    unique: true
  },
  password:{
    type:String,
    required:true
  },
})
const userModel = mongoose.model("users",userSchema);
//BLOG MODEL SCHEMA
const BlogSchema =new mongoose.Schema({
  img:{
   type:String,
   required:true
  },
  titel:{
    type:String,
    required:true
  },
  discription:{
    type:String,
    required:true
  },
  date:{
    type:String,
    default: new Date().toString().slice(0,24)
  },
  author_id:{
    type:String,
    required:true
  },
  author:{
    type:String,
    required:true
  }
})
const BlogModel = mongoose.model("blog_db",BlogSchema);
//COMMENT MODEL SCHEMA
const commentSchema = new mongoose.Schema({
  text:{
    type:String,
    required:true
  },
  blogId:{
    type:String,
    required:true
  },
  authorId:{
    type:String,
    required:true
  },
  authorName:{
    type:String,
    required:true
  }
});
const commentModel = mongoose.model("comment_db",commentSchema);
const collection = {
  userCollection : userModel,
  blogCollection : BlogModel,
  commentCollection:commentModel
}
module.exports = collection;