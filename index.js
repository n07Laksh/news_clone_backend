const express = require("express");
const cors = require("cors");

const dbConnection = require("./dbConnect")

require("dotenv").config();

const app = express();
const port = process.env.PORT || 8000;

app.use(cors())
app.use(express.json())
app.use("/api/auth",require("./Routes/auth"));




app.get("/",(req,res)=>{
    res.send("hoge connect")
})

app.listen(port, ()=>{
    console.log(`server is running on http://localhost:${port}`)
})

dbConnection();