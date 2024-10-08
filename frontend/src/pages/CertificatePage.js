//pages/certificatepage.js
import React from 'react';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import '../styles/Certificate.css';

function CertificatePage() {
  const { certificateId } = useParams();
  const [certificateData, setCertificateData] = useState(null);
  const [error, setError] = useState(null); // Add error state

  useEffect(() => {
    const fetchCertificateData = async () => {
      try {
        const response = await fetch(`http://localhost:3000/certificate/${certificateId}`);
        
        // Check if the response is OK
        if (!response.ok) {
          const errorText = await response.text(); // Capture any error text (likely HTML)
          throw new Error(`Error fetching certificate: ${errorText}`);
        }

        const data = await response.json(); // Parse JSON data
        setCertificateData(data);
      } catch (error) {
        console.error('Error fetching certificate data:', error);
        setError(error.message); // Set the error message
      }
    };

    fetchCertificateData();
  }, [certificateId]);

  if (error) {
    return <div>Error: {error}</div>; // Display error message
  }

  if (!certificateData) {
    return <div>Loading...</div>; // Show loading state
  }

  const { employeeName, courseTitle } = certificateData;

  return (
    <div className="certificate-page">
      <div className="certificate-container">
        <h1 className="certificate-title">Certificate of Completion</h1>
        <p className="certificate-text">This is to certify that</p>
        <h2 className="employee-name">{employeeName}</h2>
        <p className="certificate-text">has successfully completed the course</p>
        <h3 className="course-title">{courseTitle}</h3>
        <p className="certificate-text">Congratulations on your achievement!</p>
        <div className="signature-section">
          <p className="signature">Instructor's Signature</p>
        </div>
      </div>
    </div>
  );
}

export default CertificatePage;
