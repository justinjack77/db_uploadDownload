import React, { useEffect, useState } from 'react';
import axios from 'axios';
import api from '../api/api';

const FileList = () => {
    const [files, setFiles] = useState([]);
    const [data,setData] = useState([]);

    useEffect(() => {
        api.get('/')
        .then(res => {
            setData(res.data[0]);
            console.log(res);
        })
        .catch(err => console.log(err))
    },[])

    useEffect(() => {
        // Fetch data from the server when the component mounts
        api.get('/preview')
            .then(response => {
                setFiles(response.data);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []);

    const handleDownload = (id) => {
        api.get(`/download/${id}`, { responseType: 'blob' })
            .then(response => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'file_name.jpg'); // Set the desired file name and extension
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            })
            .catch(error => {
                console.error('Error downloading file:', error);
            });
    };
    

    return (
        <div className="container mt-4">
            <h2>File List</h2>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Image Name</th>
                        <th scope="col">Type</th>
                        <th scope="col">Date</th>
                        <th scope="col">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {files.map((file, index) => (
                        <tr key={file.id}>
                            <th scope="row">{file.id}</th>
                            <td>{file.image_name}</td>
                            <td>{file.type}</td>
                            <td>{new Date(file.date).toLocaleDateString()}</td>
                            <td>
                                <button className="btn btn-primary" onClick={() => handleDownload(file.id)}>Download</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <hr/>
            <br/>
            <image src = {`/worker/images/`+data.image_name} alt="aaaa"/>
        </div>
    );
};

export default FileList;
