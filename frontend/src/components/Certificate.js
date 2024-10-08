import React from 'react';
import './style/Certificate.css'; // Create a CSS file for styling the certificate

const Certificate = ({ course }) => {
  return (
    <div className="certificate">
      <h1>Certificate of Completion</h1>
      <p>This certifies that</p>
      <h2>{course.employeeName}</h2>
      <p>has successfully completed the course</p>
      <h3>{course.title}</h3>
      <p>On: {new Date().toLocaleDateString()}</p>
    </div>
  );
};

export default Certificate;
