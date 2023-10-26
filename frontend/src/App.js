import logo from './logo.svg';
import './App.css';
import DownloadDocument from './download/DownloadDocument';
import FileUploadComponent from './upload/FileUploadComponent';

function App() {
  return (
    <div className="App">
      <div>
     {/* <DownloadDocument/> */}
      <FileUploadComponent />
     </div>
    </div>
  );
}

export default App;
