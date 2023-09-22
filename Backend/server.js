const express = require("express");
const errorHandler = require("./middleware/errorhandler");
const DBconnection = require('./dbConfig/dbConnection')
const dotenv = require("dotenv").config()



DBconnection()
const app = express()
const port = process.env.PORT || 5001



app.use(express.json());
app.use("/api/user", require('./router/userRouter'))
app.use(errorHandler);


app.listen(port, (req, res)=>{
    console.log(`server is running on port : ${port}`)

})