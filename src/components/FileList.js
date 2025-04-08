import React from 'react';

const FileList = ({ files, onCodeReview }) => {
  return (
    <ul>
      {files.map((file, index) => (
        <li key={index}>
          {file.name}{' '}
          <button onClick={() => onCodeReview(file)}>Review Code</button>
        </li>
      ))}
    </ul>
  );
};

export default FileList;