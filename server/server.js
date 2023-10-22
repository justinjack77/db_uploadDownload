// const cors = require('cors');
// const express = require("express")
// const app = express()
import cors from 'cors';
import mysql from 'mysql';
import express from 'express';
import multer from 'multer';
import path from 'path';


const app = express();
app.use(express.json());
app.use(cors()); 

app.get("/api",(req,res)=>{
    res.json({
        "users": {
            "user1": {
                "username": "user1user",
                "password": "pass1"
            },
            "user2": {
                "username": "user2user",
                "password": "pass2"
            },
            "user3": {
                "username": "user2user",
                "password": "pass2"
            }
        }
    }
    )
})

app.listen(5000,()=> {
    console.log("Server is runing port 5000....")
})