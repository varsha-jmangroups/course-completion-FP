// src/components/CountCard.js

import React from 'react';
import { Card } from 'react-bootstrap';
import '../styles/CountCard.css'; // Add styles if needed

const CountCard = ({ title, count, color }) => {
  return (
    <Card className="text-center" style={{ backgroundColor: color, color: '#fff', margin: '10px' }}>
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <Card.Text>{count}</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default CountCard;
