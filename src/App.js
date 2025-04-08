import React, { useState } from 'react';
import FileUpload from './components/FileUpload';
import FileList from './components/FileList';
import './styles/styles.css';

const App = () => {
  const [files, setFiles] = useState([]);
  const [reviewResult, setReviewResult] = useState('');
  const [reviewMessage, setReviewMessage] = useState(''); // State to store the review status message

  // Function to handle file uploads
  const handleFileUpload = (newFiles) => {
    setFiles((prevFiles) => [...prevFiles, ...newFiles]); // Append new files to the existing list
  };

  // Function to handle code review
  const handleCodeReview = async (file) => {
    const reader = new FileReader();

    reader.onload = async (event) => {
      const fileContent = event.target.result;

      // Load environment variables
      const endpoint = process.env.REACT_APP_AZURE_OPENAI_ENDPOINT;
      const apiKey = process.env.REACT_APP_AZURE_OPENAI_API_KEY;
      const deploymentName = process.env.REACT_APP_AZURE_OPENAI_DEPLOYMENT;

      console.log("Endpoint:", endpoint);
      console.log("API Key:", apiKey);
      console.log("Deployment Name:", deploymentName)

      try {
        setReviewMessage('Reviewing the code...'); // Set a message indicating the review is in progress

        const response = await fetch(`${endpoint}/openai/deployments/${deploymentName}/chat/completions?api-version=2025-01-01-preview`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'api-key': apiKey,
          },
          body: JSON.stringify({
            messages: [
              {
                role: "system",
                content: "You are a helpful assistant that reviews code for errors and improvements.",
              },
              {
                role: "user",
                content: `Review the following code:\n\n${fileContent}`,
              },
            ],
            max_tokens: 1000,
          }),
        });

        if (!response.ok) {
          throw new Error(`Azure OpenAI API error: ${response.statusText}`);
        }

        const data = await response.json();
        setReviewResult(data.choices[0].message.content); // Display the review result in the UI
        setReviewMessage('Code review completed successfully!'); // Set a success message
      } catch (error) {
        console.error("Error during code review:", error);
        setReviewMessage('Failed to perform code review. Please check the console for details.'); // Set an error message
      }
    };

    reader.readAsText(file); // Read the file content as text
  };

  return (
    <div className="App">
      <h1>File Upload and Code Review</h1>
      <FileUpload onFileUpload={handleFileUpload} />
      <FileList files={files} onCodeReview={handleCodeReview} />

      {/* Display the review status message */}
      {reviewMessage && (
        <div className="review-message">
          <p>{reviewMessage}</p>
        </div>
      )}

      {/* Display the code review result */}
      {reviewResult && (
        <div className="review-result">
          <h2>Code Review Result:</h2>
          <pre>{reviewResult}</pre>
        </div>
      )}
    </div>
  );
};

export default App;