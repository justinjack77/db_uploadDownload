const express = require('express');
const bodyParser = require('body-parser');

const cors = require('cors');
const multer = require('multer');
const mysql = require('mysql');
const app = express();
const port = 5001;

// // Create a MySQL connection
// const connection = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: '',
//     database: 'file_db'
// });

// connection.connect();

// Create a MySQL connection pool
const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'file_db'
  });
  
  // Wait for the connection to be established
  db.getConnection((err, conn) => {
    if (err) {
      console.error('Error connecting to database:', err);
    } else {
      console.log('Connected to database');
  
      // Set the pool to the global scope after successful connection
      global.db = conn;
  
      // Release the connection to the pool after setting it to the global scope
      conn.release();
    }
  });


// API endpoint to handle document download
app.get('/download/:WorkerId/:DocumentClass', (req, res) => {
    const { WorkerId, DocumentClass } = req.params;
  
    // Query the database based on WorkerId and DocumentClass
    db.query(
      'SELECT Document, DocumentType, DocumentName FROM workerdocument WHERE WorkerId = ? AND DocumentClass = ?',
      [WorkerId, DocumentClass],
      (error, results) => {
        if (error) {
          console.error('Error querying database:', error);
          res.status(500).send('Internal Server Error');
        } else {
          if (results.length > 0) {
            const { Document, DocumentType, DocumentName } = results[0];
            res.setHeader('Content-Type', `application/${DocumentType}`);
            res.setHeader('x-document-type', DocumentType);
            res.setHeader('x-document-name', DocumentName); // Set DocumentName header
            res.setHeader('Content-Disposition', `attachment; filename="${DocumentName}.${DocumentType}"`);
            res.send(Document);
          } else {
            res.status(404).send('Document not found');
          }
        }
      }
    );
  });
  

//Upload Function
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post('/upload/:WorkerId/:DocumentClass/:WorkerDocumentId?', upload.single('document'), (req, res) => {
  const { WorkerId, DocumentClass, WorkerDocumentId } = req.params;
  const DocumentName = req.file.originalname;
  const Document = req.file.buffer;
  const CurrentDateTime = new Date();

  // Check if WorkerDocumentId exists in the database
  if (WorkerDocumentId) {
    // If WorkerDocumentId exists, update the existing record
    const updateQuery = `
      UPDATE workerdocument
      SET DocumentName = ?, DocumentClass = ?, Document = ?, UpdatedAt = ?
      WHERE WorkerId = ? AND WorkerDocumentId = ?
    `;
    const updateValues = [DocumentName, DocumentClass, Document, CurrentDateTime, WorkerId, WorkerDocumentId];

    db.query(updateQuery, updateValues, (updateError, updateResults, updateFields) => {
      if (updateError) {
        console.error('Error updating document:', updateError);
        res.status(500).send('Internal Server Error');
      } else {
        console.log('Document updated successfully!');
        res.json({ message: 'Document updated successfully' });
      }
    });
  } else {
    // If WorkerDocumentId does not exist, insert a new record
    const insertQuery = `
      INSERT INTO workerdocument (WorkerId, DocumentName, DocumentClass, Document, CreatedAt, UpdatedAt)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const insertValues = [WorkerId, DocumentName, DocumentClass, Document, CurrentDateTime, CurrentDateTime];

    db.query(insertQuery, insertValues, (insertError, insertResults, insertFields) => {
      if (insertError) {
        console.error('Error uploading document:', insertError);
        res.status(500).send('Internal Server Error');
      } else {
        console.log('Document uploaded successfully!');
        res.json({ message: 'Document uploaded successfully' });
      }
    });
  }
});




  
  // Start the Express server
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
