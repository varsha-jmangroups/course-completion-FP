import React from 'react';
import { Radar } from 'react-chartjs-2';
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const EmployeePerformanceMetricsGraph = ({ employees = [], enrollments = [] }) => {
  const employeeNames = employees.map(employee => employee.name || 'Unknown');
  const completionPercentages = employeeNames.map(name => {
    const employeeEnrollments = enrollments.filter(enrollment => enrollment.user?.name === name);
    
    // Avoid division by zero by checking for employeeEnrollments length
    const totalCompletion = employeeEnrollments.reduce((acc, enrollment) => acc + enrollment.completionPercentage || 0, 0);
    return employeeEnrollments.length > 0 ? totalCompletion / employeeEnrollments.length : 0;
  });

  const data = {
    labels: employeeNames,
    datasets: [{
      label: 'Average Completion Percentage',
      data: completionPercentages,
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 2,
    }],
  };

  return (
    <div style={{ width: '600px', margin: '40px auto' }}>
      <h2>Employee Performance Metrics</h2>
      <Radar data={data} />
    </div>
  );
};

export default EmployeePerformanceMetricsGraph;
