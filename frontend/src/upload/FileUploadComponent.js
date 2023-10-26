import React, { useState } from 'react';
import axios from 'axios';

const FileUploadComponent = () => {
  const [file, setFile] = useState(null);
//   const [WorkerId, setWorkerId] = useState(); // Replace with your predetermined WorkerId
  const [DocumentClass, setDocumentClass] = useState('');
  const [WorkerDocumentId, setWorkerDocumentId] = useState(''); // Handle this based on your application logic
  const [uploadMessage, setUploadMessage] = useState('');
  const WorkerId = 1

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleDocumentClassChange = (event) => {
    setDocumentClass(event.target.value);
  };

  const handleWorkerDocumentIdChange = (event) => {
    setWorkerDocumentId(event.target.value);
  };

  const handleUpload = () => {
    if (!DocumentClass) {
      alert('Please select a document class.');
      return;
    }

    const formData = new FormData();
    formData.append('document', file);

    // If WorkerDocumentId is available, it's an update; otherwise, it's an upload
    const apiUrl = WorkerDocumentId
      ? `/upload/${WorkerId}/${DocumentClass}/${WorkerDocumentId}`
      : `/upload/${WorkerId}/${DocumentClass}`;

    axios.post(apiUrl, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
      .then(response => {
        console.log('File uploaded successfully:', response.data);
        setUploadMessage('File uploaded successfully!');
      })
      .catch(error => {
        console.error('Error uploading file:', error);
        setUploadMessage('Error uploading file. Please try again.');
      });
  };

  return (
    <div>
      <h1>File Upload</h1>
      <div>
        <label htmlFor="documentClass">Select Document Class:</label>
        <select id="documentClass" value={DocumentClass} onChange={handleDocumentClassChange}>
          <option value="">Select Class</option>
          <option value="Class1">Class 1</option>
          <option value="Class2">Class 2</option>
          <option value="Class3">Class 3</option>
          <option value="Class4">Class 4</option>
          <option value="Class5">Class 5</option>
        </select>
      </div>
      <div>
        <label htmlFor="workerDocumentId">Worker Document ID (Optional for Updates):</label>
        <input type="text" id="workerDocumentId" value={WorkerDocumentId} onChange={handleWorkerDocumentIdChange} />
      </div>
      <div>
        <label htmlFor="document">Select Document:</label>
        <input type="file" id="document" name="document" accept=".jpg, .jpeg, .png, .pdf, .doc, .docx" onChange={handleFileChange} />
      </div>
      <button onClick={handleUpload}>Upload/Update</button>
      <p>{uploadMessage}</p>
    </div>
  );
};

export default FileUploadComponent;
