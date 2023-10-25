const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const multer = require('multer');
const cors = require('cors');

const app = express();
const port = 5001;

// Create a MySQL connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'file_db'
});

connection.connect();

// Create a MySQL connection pool
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'file_db'
  });
  
  // Wait for the connection to be established
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to database:', err);
    } else {
      console.log('Connected to database');
  
      // Set the pool to the global scope after successful connection
      global.pool = pool;
  
      // Release the connection to the pool after setting it to the global scope
      connection.release();
    }
  });

// API endpoint to handle document download
// API endpoint to handle document download
app.get('/download/:WorkerId/:DocumentClass', (req, res) => {
    const { WorkerId, DocumentClass } = req.params;
  
    // Query the database based on WorkerId and DocumentClass
    pool.query(
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
  
  
  // Start the Express server
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
