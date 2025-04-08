import React, { useState } from 'react';

const FileUpload = ({ onFileUpload }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleFileChange = (event) => {
    if (event.target.files) {
      const filesArray = Array.from(event.target.files); // Convert FileList to an array
      setSelectedFiles(filesArray);
    }
  };

  const handleUpload = () => {
    if (selectedFiles.length > 0) {
      onFileUpload(selectedFiles); // Pass files to the parent component
      setSelectedFiles([]); // Clear the selected files
    }
  };

  return (
    <div className="file-upload">
      <input type="file" multiple onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={selectedFiles.length === 0}>
        Upload Files
      </button>
    </div>
  );
};

export default FileUpload;