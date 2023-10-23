import React, { useEffect, useState } from "react";
import api from "../api/api";



const UploadFile = () => {
  const [file, setfile] = useState();
  const [data, setData] = useState([]);


  useEffect(() => {
    api
      .get("/")
      .then((res) => {
        setData(res.data[8]);
        console.log(res);
      })
      .catch((err) => console.log(err));
  }, []);

  const handleFile = (e) => {
    setfile(e.target.files[0]);
  };

  const handleUpload = () => {
    if (file) {
      const formData = new FormData();
      formData.append("image_name", file);

      // Replace 'YOUR_UPLOAD_API_ENDPOINT' with the actual endpoint where you handle file uploads on the server.
      api
        .post("/upload", formData)
        .then((response) => {
          // Handle the response from the server after successful upload.
          if (response.data.Status === "Success") {
            console.log("File uploaded successfully:", response.data);
        
          } else {
            console.log("File uploaded failed:", response.data);
          }
        })
        .catch((error) => {
          // Handle errors that occurred during the upload process.
          console.error("Error uploading file:", error);
        });
    } else {
      // Handle the case where no file is selected before clicking the Upload button.
      console.error("Please select a file before uploading.");
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFile} />
      <button onClick={handleUpload}>Upload</button>
      <hr />
      <br />
      {/* <img src={`/worker/images/` + data.image_name} alt="aaaa" /> */}

    </div>
  );
};

export default UploadFile;
