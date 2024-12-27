const express = require('express');
const path = require('path');

const PORT=process.env.PORT || 5000;

const dotenv = require('dotenv');
const connectDB=require('./config/db');

dotenv.config();

const app=express();

connectDB();

app.use(express.static(path.join(__dirname, 'public')));

app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'views','homepage.html'));
});

app.listen(PORT,()=>{ console.log(`Server started on port ${PORT}`); });