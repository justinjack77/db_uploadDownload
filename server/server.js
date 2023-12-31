// const cors = require('cors');
// const express = require("express")
// const app = express()
import cors from 'cors';
import mysql from 'mysql';
import express from 'express';
import multer from 'multer';
import path from 'path';
import fileUpload from 'express-fileupload';


const app = express();
app.use(express.json());
app.use(cors()); 
app.use(express.static('public'))



const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "file_db",
})

db.connect(err => {
    if (err) {
      console.error('Error connecting to MySQL database: ' + err.stack);
      return;
    }
    console.log('Connected to MySQL database as id ' + db.threadId);
  });
  
  // Middleware
  app.use(express.json());
  app.use(fileUpload());
// const storage = multer.diskStorage({
//     destination: (req, file,cb) => {
//         cb(null,'public/worker/images')
//     },
//     filename: (req, file, cb) => {
//         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//         cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
//     }
// })

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         let folder;
//         if (file.mimetype === 'application/pdf') {
//             folder = 'public/worker/passport/pdf';
//         } else if (file.mimetype === 'application/msword' || file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
//             folder = 'public/worker/passport/doc';
//         } else if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg') {
//             folder = 'public/worker/passport/images';
//         } else {
//             folder = 'public/worker/passport/other';
//         }
//         cb(null, folder);
//     },
//     filename: (req, file, cb) => {
//         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//         cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
//     }
// });

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let folder;
        let subfolder;
        switch (file.mimetype) {
            case 'application/pdf':
                subfolder = 'pdf';
                break;
            case 'application/msword':
            case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
                subfolder = 'doc';
                break;
            case 'image/png':
            case 'image/jpeg':
                subfolder = 'images';
                break;
            default:
                subfolder = 'other';
        }
        switch (req.body.documentType) {
            case 'passport':
                folder = 'public/worker/passport/';
                break;
            case 'permit':
                folder = 'public/worker/permit/';
                break;
            case 'typhoid':
                folder = 'public/worker/typhoid/';
                break;
            case 'medical':
                folder = 'public/worker/medical/';
                break;
            case 'supportingDocument':
                folder = 'public/worker/supporting/';
                break;
            default:
                folder = 'public/worker/other/';
        }
        cb(null, folder + subfolder);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});


const upload = multer({
    storage: storage
})

app.post("/upload", upload.single('image_name'), (req, res) => {
    try {
        console.log(req.file);

        // Use req.file.filename to get the generated filename
        const image_name = req.file.filename;
        
        // Use req.file.mimetype to get the file type
        const type = req.file.mimetype;

        // Use the current date/time for the date column
        const date = new Date();

        // Logic to determine folder and subfolder based on file type and document type
        let folder;
        let subfolder;

        // Determine folder and subfolder based on file type and document type
        // ... (Your logic to determine folder and subfolder goes here)

        // Assuming your file table has columns: id, image_name, type, date, folder, subfolder
        const sql = "INSERT INTO file (image_name, type, date, folder, subfolder) VALUES (?, ?, ?, ?, ?)";

        db.query(sql, [image_name, type, date, folder, subfolder], (err, result) => {
            if (err) {
                console.error('Error inserting data: ' + err.message);
                return res.status(500).json({ Message: "Error" });
            } else {
                console.log('Data inserted successfully.');
                return res.status(200).json({ Status: "Success" });
            }
        });
    } catch (error) {
        console.error('Error uploading file: ' + error.message);
        return res.status(500).json({ Message: "Error" });
    }
});


// app.post("/upload",upload.single('image_name'),(req,res)=>{
//     console.log(req.file);
//     const image_name = req.file.fieldname;
//     const sql = "UPDATE file SET image_name=? ";
//     db.query(sql,[image_name],(err,result) => {
//         if(err){
//             return res.json({Message: "Error"});
//         }else{
//             return res.json({Status: "Success"});
//         }
//     })

// })

/// upload new image
// app.post("/upload", upload.single('image_name'), (req, res) => {
//     try {
//         console.log(req.file);
//         const { originalname, mimetype } = req.file;
//         const image_name = req.file.filename; // Use req.file.filename to get the generated filename
//         const type = mimetype; // Use req.file.mimetype to get the file type
//         const date = new Date(); // Use the current date/time for the date column

//         // Assuming your file table has columns: id, image_name, type, date
//         const sql = "INSERT INTO file (image_name, type, date) VALUES (?, ?, ?)";

//         db.query(sql, [image_name, type, date], (err, result) => {
//             if (err) {
//                 console.error('Error inserting data: ' + err.message);
//                 return res.status(500).json({ Message: "Error" });
//             } else {
//                 console.log('Data inserted successfully.');
//                 return res.status(200).json({ Status: "Success" });
//             }
//         });
//     } catch (error) {
//         console.error('Error uploading file: ' + error.message);
//         return res.status(500).json({ Message: "Error" });
//     }
// });

///
//get image from database
app.get("/preview", (req, res) => {
    const sql = "SELECT id, image_name, type, date FROM file";

    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error retrieving data: ' + err.message);
            return res.status(500).json({ Message: "Error" });
        } else {
            // Construct image URLs based on server address and image filename
            const serverAddress = '/'; // Replace with your server address and port
            const filesWithUrls = results.map(file => ({
                ...file,
                imageUrl: `${serverAddress}/public/worker/images/${file.image_name}`
            }));

            console.log('Data retrieved successfully.');
            return res.status(200).json(filesWithUrls);
        }
    });
});

///download image
app.get("/download/:id", (req, res) => {
    const fileId = req.params.id;

    // Query the database to get the file path based on the fileId
    const sql = "SELECT image_name FROM file WHERE id = ?";
    db.query(sql, [fileId], (err, result) => {
        if (err) {
            console.error('Error fetching file data: ' + err.message);
            return res.status(500).json({ Message: "Error" });
        }

        if (result.length === 0) {
            return res.status(404).json({ Message: "File not found" });
        }

        // Construct the file path (assuming files are stored in a directory named 'uploads')
        const filePath = path.join(__dirname, 'uploads', result[0].image_name);

        // Ensure the file exists before attempting to download
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ Message: "File not found on the server" });
        }

        // Send the file for download
        res.download(filePath, result[0].image_name, (err) => {
            if (err) {
                console.error('Error downloading file: ' + err.message);
                return res.status(500).json({ Message: "Error" });
            }

            // Optionally, you can delete the file after it has been downloaded
            // fs.unlinkSync(filePath);
        });
    });
});

////

//display
app.get('/',(req,res) => {
    const sql = "SELECT * FROM file"
    db.query(sql,(err,result) => {
        if(err){
            return res.json("Error");
        }else{
            return res.json(result);
        }
    })
})


app.get("/users",(req,res)=>{
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







///////

// const express = require('express');
// const mysql = require('mysql');
// const fileUpload = require('express-fileupload');
// const app = express();

// // MySQL Connection
// const db = mysql.createConnection({
//   host: 'localhost',
//   user: 'username',
//   password: 'password',
//   database: 'your_database_name'
// });



// API Endpoint to Download Document
app.get('/download/:workerId/:DocumentClass', (req, res) => {
  const { workerId, documentType } = req.params;
  const query = `SELECT workerdocument FROM workerdocument WHERE WorkerId = ? AND DocumentClass = ?`;

  db.query(query, [workerId, documentType], (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    if (result.length === 0) {
      res.status(404).json({ error: 'Document not found.' });
      return;
    }

    const document = result[0].Document;
    res.contentType('application/octet-stream');
    res.send(document);
  });
});

// Start the server
const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
