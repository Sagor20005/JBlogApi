const mongoose = require('mongoose');

let url = "mongodb+srv://ms6392883:root@chatingdb.qvpw3qv.mongodb.net/"

const mongodb = (function(){
  try{
    mongoose.connect(`${url}blog_db`);
    console.log("mongodb connected..")
  }catch(error){
    console.log("mongodb connect faild...")
  }
})();

module.exports = mongodb;