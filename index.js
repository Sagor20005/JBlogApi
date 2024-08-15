const express = require("express");
const cors = require("cors")
const router = require('./routes')

let PORT = 2001555;
const app = express()
app.use(express.json())
app.use(express.static("upload"))
app.use(cors())
app.use(router)

app.listen(PORT,()=>{
  console.log("server running at port :",PORT)
})
