// src/components/EmployeeCourseGraph.js

import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register chart components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const EmployeeCourseGraph = ({ employees, courses }) => {
  // Data for the chart
  const chartData = {
    labels: ['Employees', 'Courses'],
    datasets: [
      {
        label: '# of Items',
        data: [employees.length, courses.length],
        backgroundColor: ['rgba(75, 192, 192, 0.2)', 'rgba(153, 102, 255, 0.2)'],
        borderColor: ['rgba(75, 192, 192, 1)', 'rgba(153, 102, 255, 1)'],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Employees and Courses Overview',
      },
    },
  };

  return (
    <div style={{ width: '600px', margin: '40px auto' }}>
      <h2>Employees and Courses Statistics</h2>
      <Bar data={chartData} options={chartOptions} />
    </div>
  );
};

export default EmployeeCourseGraph;
