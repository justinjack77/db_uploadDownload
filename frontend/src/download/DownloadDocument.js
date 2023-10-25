import React, { useState } from 'react';
import axios from 'axios';

const DownloadDocument = () => {
  const [workerId, setWorkerId] = useState('');
  const [documentClass, setDocumentClass] = useState('');

//   const handleDownload = async () => {
//     try {
//       const response = await axios.get(`/download/${workerId}/${documentClass}`, {
//         responseType: 'blob',
//       });

//       const blob = new Blob([response.data], { type: response.headers['content-type'] });
//       const url = window.URL.createObjectURL(blob);
//       const a = document.createElement('a');
//       a.href = url;
//       a.download = `workerID:${workerId}_type:${documentClass}.${response.headers['x-document-type']}`;
//       document.body.appendChild(a);
//       a.click();
//       window.URL.revokeObjectURL(url);
//     } catch (error) {
//       console.error('Error downloading document:', error);
//     }
//   };

const handleDownload = async () => {
    try {
      const response = await axios.get(`/download/${workerId}/${documentClass}`, {
        responseType: 'blob',
      });
  
      const blob = new Blob([response.data], { type: response.headers['content-type'] });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${response.headers['x-document-name']}.${response.headers['x-document-type']}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading document:', error);
    }
  };
  

  return (
    <div>
      <input
        type="text"
        placeholder="Worker ID"
        value={workerId}
        onChange={(e) => setWorkerId(e.target.value)}
      />
      <input
        type="text"
        placeholder="Document Class"
        value={documentClass}
        onChange={(e) => setDocumentClass(e.target.value)}
      />
      <button onClick={handleDownload}>Download Document</button>
    </div>
  );
};

export default DownloadDocument;
