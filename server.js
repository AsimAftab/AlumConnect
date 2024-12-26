const express = require('express');

const PORT=process.env.PORT || 5000;

const dotenv = require('dotenv');
const connectDB=require('./config/db');

dotenv.config();

const app=express();

connectDB();


app.get('/',(req,res)=>{
    res.send('API Running');
});

app.listen(PORT,()=>{ console.log(`Server started on port ${PORT}`); });