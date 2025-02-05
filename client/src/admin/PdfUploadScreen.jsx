import React, { useState, useEffect } from 'react';
import { Upload, FileText, Check, AlertCircle, Trash2 } from 'lucide-react';
import { BACKEND_URL } from '../constans';

export default function PdfUpload() {
  const [file, setFile] = useState(null);
  const [mainHeading, setMainHeading] = useState('');
  const [subHeading, setSubHeading] = useState('');
  const [additionalText, setAdditionalText] = useState('');
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const handleFileChange = (selectedFile) => {
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setUploadError(null);
    } else {
      setFile(null);
      setUploadError('Please select a valid PDF file.');
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragging(false);
    const selectedFile = event.dataTransfer.files[0];
    handleFileChange(selectedFile);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleUpload = async () => {
    if (!file || !mainHeading || !subHeading) {
      setUploadError('All fields are required to upload.');
      return;
    }

    setUploading(true);
    setUploadError(null);

    const formData = new FormData();
    formData.append('pdf', file);
    formData.append('mainHeading', mainHeading);
    formData.append('subHeading', subHeading);
    formData.append('additionalText', additionalText);

    try {
      const response = await fetch(`${BACKEND_URL}api/report/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload file');
      }

      const uploadedFile = await response.json();
      setUploadedFiles((prev) => [uploadedFile, ...prev]);
      setUploadSuccess(true);
    } catch (err) {
      setUploadError(err.message);
    } finally {
      setUploading(false);
      setFile(null);
      setMainHeading('');
      setSubHeading('');
      setAdditionalText('');
      setTimeout(() => setUploadSuccess(false), 3000);
    }
  };

  const fetchUploadedFiles = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}api/report/files`);
      if (!response.ok) {
        throw new Error('Failed to fetch files');
      }
      const files = await response.json();
      setUploadedFiles(Array.isArray(files) ? files : []);
    } catch (err) {
      console.error('Failed to fetch uploaded files:', err);
      setUploadedFiles([]);
      setDeleteError('Failed to fetch uploaded files');
    }
  };

  const handleDelete = async (fileId) => {
    try {
      const response = await fetch(`${BACKEND_URL}api/report/delete/${fileId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete file');
      }

      setUploadedFiles((prev) => prev.filter((file) => file._id !== fileId));
      setDeleteSuccess(true);
      setDeleteError(null);
      setTimeout(() => setDeleteSuccess(false), 3000);
    } catch (err) {
      setDeleteError('Failed to delete file');
      setTimeout(() => setDeleteError(null), 3000);
    }
  };

  useEffect(() => {
    fetchUploadedFiles();
  }, []);

  return (
    <div className="pdf-upload-container mt-10">
      <div className="pdf-upload-background"></div>
      <div className="pdf-upload-content">
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">
              <FileText />
              Upload Palm Oil Trade PDF
            </h2>
          </div>
          <div className="card-content">
            <div
              className={`upload-area ${dragging ? 'dragging' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <label htmlFor="pdf-upload" className="upload-label">
                <div className="upload-icon-container">
                  <Upload className="upload-icon" />
                  <span className="upload-text">
                    {file ? file.name : 'Click to upload or drag and drop'}
                  </span>
                  <span className="upload-subtext">PDF (max. 10MB)</span>
                </div>
                <input
                  id="pdf-upload"
                  type="file"
                  accept=".pdf"
                  className="hidden-input"
                  onChange={(event) => handleFileChange(event.target.files[0])}
                />
              </label>
            </div>

            <div className="input-group">
              <label htmlFor="main-heading" className="input-label">Main Heading</label>
              <input
                id="main-heading"
                type="text"
                value={mainHeading}
                onChange={(e) => setMainHeading(e.target.value)}
                className="input-field"
                style={{ color: 'black'}}
              />
            </div>

            <div className="input-group">
              <label htmlFor="sub-heading" className="input-label">Sub Heading</label>
              <input
                id="sub-heading"
                type="text"
                value={subHeading}
                onChange={(e) => setSubHeading(e.target.value)}
                className="input-field" 
                style={{ color: 'black'}}
              />
            </div>

            <div className="input-group">
              <label htmlFor="additional-text" className="input-label">Additional Text</label>
              <textarea
                id="additional-text"
                value={additionalText}
                onChange={(e) => setAdditionalText(e.target.value)}
                className="input-field"
              ></textarea>
            </div>

            {uploadError && (
              <div className="alert error">
                <AlertCircle />
                <div className="alert-content">
                  <h3 className="alert-title">Error</h3>
                  <p className="alert-description">{uploadError}</p>
                </div>
              </div>
            )}

            {uploadSuccess && (
              <div className="alert success">
                <Check />
                <div className="alert-content">
                  <h3 className="alert-title">Success</h3>
                  <p className="alert-description">Your PDF has been uploaded successfully.</p>
                </div>
              </div>
            )}

            <button
              onClick={handleUpload}
              disabled={!file || uploading}
              className="upload-button"
            >
              {uploading ? 'Uploading...' : 'Upload PDF'}
            </button>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h2 className="card-title">
              <FileText />
              Your Files
            </h2>
          </div>
          <div className="card-content">
            {deleteError && (
              <div className="alert error">
                <AlertCircle />
                <div className="alert-content">
                  <h3 className="alert-title">Error</h3>
                  <p className="alert-description">{deleteError}</p>
                </div>
              </div>
            )}

            {deleteSuccess && (
              <div className="alert success">
                <Check />
                <div className="alert-content">
                  <h3 className="alert-title">Success</h3>
                  <p className="alert-description">File has been deleted successfully.</p>
                </div>
              </div>
            )}

            <div className="file-list-container">
              {uploadedFiles.length === 0 ? (
                <p className="no-files-message">No files uploaded yet.</p>
              ) : (
                <ul className="file-list">
                  {uploadedFiles.map((file) => (
                    <li key={file._id} className="file-item" style={{ fontSize: '1.1rem' }}>
                      <div className="file-info">
                        <FileText className="file-icon" />
                        <div className="file-details">
                          <h3 className="file-heading">
                            {file.mainHeading}
                            {file.subHeading && <span className="file-subheading"> - {file.subHeading}</span>}
                          </h3>
                          <div className="file-metadata">
                            <a href={file.url} target="_blank" rel="noopener noreferrer" className="file-name-link" style={{ fontSize: '0.9rem' }}>
                              {file.name} 
                            </a>
                          </div>
                          <div><span className="file-date" style={{ fontSize: '0.9rem' }}>
                              {new Date(file.uploadDate).toLocaleDateString()}
                            </span></div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDelete(file._id)}
                        className="delete-button"
                        aria-label={`Delete ${file.name}`}
                      >
                        <Trash2 />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}