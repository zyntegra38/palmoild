import React, { useState, useEffect } from 'react';
import { FileText, ChevronDown, ChevronUp, Download } from 'lucide-react';
import { BACKEND_URL } from '../constans';

const MonthItem = ({ item }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleDownload = async (url, fileName) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  return (
    <div className="month-item">
      <button className="month-trigger" onClick={() => setIsExpanded(!isExpanded)}>
        <span className="month-name">{item.mainHeading}</span>
        {isExpanded ? (
          <ChevronUp className="icon h-6 w-6" style={{ color: '#FF4800' }} />
        ) : (
          <ChevronDown className="icon h-6 w-6" style={{ color: '#FF4800' }} />
        )}
      </button>
      {isExpanded && (
        <div className="month-content">
          <div className="flex items-center justify-between">
            <h3 className="pdf-title">{item.subHeading}</h3>
            <button 
              onClick={() => handleDownload(item.url, item.name)}
              className="download-btn flex items-center gap-2"
              style={{ color: '#FF4800' }}
            >
              <Download className="h-5 w-5" />
              <span>Download PDF</span>
            </button>
          </div>
          <p className="pdf-description">{item.additionalData}</p>
          <div className="pdf-viewer">
            <iframe src={item.url} title={item.mainHeading} />
          </div>
        </div>
      )}
    </div>
  );
};

const PDFViewer = () => {
  const [reports, setReports] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}api/report/files`);
        if (!response.ok) throw new Error('Failed to fetch reports');
        const data = await response.json();
        setReports(data.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate)));
      } catch (err) {
        setError('Failed to load reports');
        console.error(err);
      }
    };

    fetchReports();
  }, []);

  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="container">
      <div className="header">
        <h1>
          <FileText className="h-8 w-8" />
          Palm Oil Trade Reports
        </h1>
        <p>
          Access our comprehensive monthly reports on palm oil trade statistics, market trends, and industry insights. 
          Click on each month to view the full report and analysis.
        </p>
      </div>
      <div className="month-list">
        {reports.map((item) => (
          <MonthItem key={item._id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default PDFViewer;