const express = require('express');
const router = new express.Router()
require("./mongodb")
const multer = require("multer")
const collection = require("./models")
const fs = require('fs');
const usersColl = collection.userCollection;
const blogColl = collection.blogCollection;
const comentColl = collection.commentCollection;

//server alive cheking route
router.all("/",(req,resp)=>{
  resp.send({
    running:true,
    msg:"server alive",
    data:req.body
  })
  console.log(req.body)
})

//registar new user
router.post("/user/add",async (req,resp)=>{
  let user = new usersColl(req.body)
  try{
    let result = await user.save()
    result.password = "";
    console.log(result)
    resp.send({status:true,data:result})
  }catch(error){
    resp.send({status:false,msg:error})
  }
})

//login user api
router.post("/login",async (req,resp)=>{
  let user = await usersColl.findOne(req.body).select("-password");
  console.log(user);
  if(user===null){
    resp.send({msg:"not_ok",data:user})
  }else{
    resp.send({msg:"ok",data:user})
  }
})

// multer meddil ware
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './upload')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix + ".png")
  }
})
const upload = multer({ storage: storage })

router.post("/upload",upload.single("image"),async (req,resp)=>{
  try{
    const blog = new blogColl({
      img:req.file.filename,
      titel:req.body.titel,
      author_id:req.body.author_id,
      author:req.body.author,
      discription:req.body.discription
    })
    console.log(req.body)
    let result = await blog.save()
    resp.send({
      status:true,
      data:result
    })
  }catch(error){
    console.log(error);
    resp.send({
      status:false,
      msg:error
    })
  }
})

// getting blog api
router.get("/blog",async (req,resp)=>{
  let result = await blogColl.find();
  console.log(result)
  if(result.length <0){
    resp.send({status:false,msg:"blog not ableavle"})
  }else{
    resp.send({status:true,data:result})
  }
})

// read a blog api
router.get("/read-blog/:id",async (req,resp)=>{
  let id = req.params.id
  let blog =await blogColl.find({_id:id})
  resp.send({status:true,data:blog[0]})
})

//delete blog api
router.delete("/delete-blog",async (req,resp)=>{
  try{
    let blog = req.body;
    console.log(blog)
    let result = await blogColl.deleteOne({_id:blog.id})
    console.log(result)
    resp.send({status:true,data:result})
    await fs.unlinkSync(`./upload/${blog.img}`)
  }catch(error){
    console.log(error);
    resp.send({status:false,msg:error})
  }
});

// get blog for update
router.get("/get-blog/:id",async (req,resp)=>{
  let id = req.params.id;
  let result = await blogColl.findOne({_id:id})
  resp.send(result)
})

// update blog 
router.post("/update-blog",upload.any(), async (req,resp)=>{
  const blog = {
    titel:req.body.titel,
    discription:req.body.discription,
  };
  const id = req.body.id;
  if(req.body.previousImg){
    blog.img = req.files[0].filename
    await fs.unlinkSync(`./upload/${req.body.previousImg}`)
  };
    console.log(blog)
  let result = await blogColl.findOneAndUpdate({_id:id},blog)
  console.log(result)
  resp.send({status:true,data:result})
})

//CREAT COMMENT 
router.post("/create/comment", async (req,resp)=>{
  let body = req.body;
  try{
    const comment = new comentColl(body);
    const result = await comment.save();
    resp.send({status:true,data:result})
  }catch(error){
    resp.send({status:false,msg:error})
  }
});

// GET ALL COMMENTS API
router.get("/comments/:id",async (req,resp)=>{
  const blogId = req.params.id;
  console.log(blogId)
  try{
    const respons = await comentColl.find({blogId:blogId})
    console.log(respons)
    resp.send({status:true,data:respons})
  }catch(error){
    resp.send({status:false,msg:error})
  }
});

//DELETE COMMENTS API 
router.delete("/delete-comment/:id", async (req,resp)=>{
  const commentId = req.params.id;
  try{
    let result = await comentColl.deleteOne({_id:commentId});
    console.log(result)
    resp.send({status:true,data:result})
  }catch(error){
  resp.send({msg:"delete",status:false})
  };
});

//COMMENT UPDATE 
router.put("/comment-update", async (req,resp)=>{
  try{
    let result = await comentColl.findOneAndUpdate({_id:req.body.id},{text:req.body.text});
    resp.send({status:true,data:result})
  }catch(error){
    resp.send({status:false,msg:error})
  }
});

module.exports = router;